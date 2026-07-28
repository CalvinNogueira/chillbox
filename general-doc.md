# ChillBox — Documentation générale

> Le but de ce document : qu'un dev qui découvre le projet comprenne **comment tout fonctionne et qui intervient à quel moment**, sans avoir à lire tout le code. Pour le détail route par route de l'API, voir [`docs/chillboxAPIDoc.md`](docs/chillboxAPIDoc.md).

---

## 1. Vue d'ensemble

ChillBox est une application de gestion de snippets de code : chaque utilisateur s'inscrit, se connecte, puis crée/modifie/supprime **ses** snippets et **ses** dossiers. Un utilisateur ne voit jamais les données d'un autre.

Le projet tourne entièrement dans Docker (`docker compose up`) avec 4 conteneurs :

| Conteneur | Rôle | Port |
| --- | --- | --- |
| `frontend` | Angular 21 (dev server) | 4200 |
| `backend` | Symfony 8 + API Platform 4 | 8000 |
| `database` | PostgreSQL 16 | 5432 |
| `adminer` | Interface web pour inspecter la BDD | 8080 |

Le trajet d'une donnée, de bout en bout :

```
Navigateur (Angular)
   │  requête HTTP + header "Authorization: Bearer <jwt>"
   ▼
Symfony — firewall "api" : vérifie la signature du JWT, charge le User
   ▼
API Platform : trouve l'opération (GET /api/snippets, POST…), vérifie la règle security
   ▼
Doctrine : construit la requête SQL (l'OwnerExtension y ajoute WHERE owner = user connecté)
   ▼
PostgreSQL → réponse JSON-LD → Angular met à jour ses signals → la vue se redessine
```

Les deux idées maîtresses du projet :

1. **Backend sans contrôleurs** : API Platform génère l'API REST directement depuis les entités Doctrine. On pilote tout par des attributs PHP sur les entités.
2. **L'utilisateur connecté est déduit du token, jamais envoyé par le front** : le front ne dit jamais "je suis l'utilisateur 3". C'est le serveur qui le déduit du JWT, à la fois pour écrire (`OwnerProcessor`) et pour lire (`OwnerExtension`).

---

## 2. Le backend : API Platform

### Pas de contrôleurs, des entités annotées

Il n'y a **aucun contrôleur** dans `backend/src/` (le dossier `Controller/` est vide). Une entité devient une API en la décorant :

```php
#[ApiResource(
    operations: [
        new GetCollection(security: "is_granted('ROLE_USER')"),
        new Post(security: "is_granted('ROLE_USER')", processor: OwnerProcessor::class),
        new Patch(security: "object.getOwner() == user"),
        // ...
    ]
)]
class Snippet { ... }
```

Avec ça, API Platform expose automatiquement `GET/POST /api/snippets`, `GET/PUT/PATCH/DELETE /api/snippets/{id}`, la validation, la sérialisation JSON, la doc Swagger (`/api`), etc. Chaque opération porte sa propre règle de sécurité (voir §4).

### Les groupes de sérialisation : quels champs entrent/sortent

Chaque propriété d'entité est étiquetée avec des groupes :

```php
#[Groups(['snippet:read', 'snippet:write'])]   // lisible ET modifiable par l'API
private ?string $title = null;

#[Groups(['snippet:read'])]                     // lisible, mais PAS modifiable
private ?User $owner = null;
```

- `snippet:read` = champs présents dans les réponses.
- `snippet:write` = champs acceptés dans le corps des requêtes.

C'est comme ça qu'on empêche un client de choisir son `owner` (lecture seule) ou de lire le `password` d'un user (groupe `user:write` uniquement : accepté en entrée à l'inscription, jamais renvoyé).

### Le format JSON-LD / Hydra

API Platform parle **JSON-LD** (JSON + métadonnées de liens), pas du JSON brut. Trois conséquences concrètes pour le front :

1. Les collections sont enveloppées : les items sont dans une clé `member` (le front la déballe, voir §5).
2. Les relations sont des **IRIs** (des URLs-identifiants), pas des objets : un snippet référence ses dossiers via `"folders": ["/api/folders/1"]`. C'est aussi ce qu'on envoie pour lier deux ressources.
3. Les content-types en écriture sont stricts : `application/ld+json` pour POST/PUT, `application/merge-patch+json` pour PATCH. Un mauvais content-type = erreur 415, c'est le piège classique du projet.

### Les filtres

Les entités déclarent des filtres query-string prêts à l'emploi :

```php
#[ApiFilter(SearchFilter::class, properties: ['title' => 'ipartial', ...])]
#[ApiFilter(OrderFilter::class, properties: ['id', 'title'])]
```

D'où des URLs comme `GET /api/snippets?title=hello&order[title]=asc` sans aucun code de recherche à écrire.

---

## 3. L'authentification JWT

### C'est quoi, un JWT, en deux phrases

Un JWT est une carte d'identité **signée** par le serveur : elle contient l'identité de l'utilisateur (son email) et une date d'expiration, le tout signé avec la clé privée du serveur (clés dans `backend/config/jwt/`). Le serveur n'a **rien à stocker** (pas de session) : à chaque requête il vérifie juste la signature — si elle est valide, le contenu est digne de confiance. Attention : signé ≠ chiffré, le contenu d'un JWT est lisible par tous, on n'y met jamais de secret.

### Les trois moments de la vie du token

**1. L'inscription** — `POST /api/users` (publique). Le password arrive en clair (HTTPS en prod), et le `UserPasswordProcessor` le hashe avant la persistance :

```php
$data->setPassword($this->hasher->hashPassword($data, $data->getPassword()));
```

**2. Le login** — `POST /api/login` avec `{ email, password }`. Ici, pas d'API Platform : c'est un **firewall Symfony** dédié (`security.yaml`) qui joue le guichet :

```yaml
login:
    pattern: ^/api/login
    json_login: { check_path: /api/login, username_path: email, ... }
```

Symfony vérifie le couple email/password contre la BDD, et le bundle **LexikJWT** fabrique et renvoie le token : `{ "token": "eyJ..." }`.

**3. Toutes les requêtes suivantes** — un second firewall couvre tout `^/api` :

```yaml
api:
    pattern: ^/api
    stateless: true
    jwt: ~
```

Ce `jwt: ~` suffit : sur chaque requête, Lexik lit le header `Authorization: Bearer ...`, vérifie la signature et l'expiration, puis charge le `User` correspondant depuis la BDD. À partir de là, tout le code serveur peut demander « qui est connecté ? » via le service `Security` — c'est ce qu'utilisent l'`OwnerProcessor`, l'`OwnerExtension` et les règles `security:` des opérations.

### La route `/api/me`

Le front a besoin de connaître l'utilisateur connecté (afficher son prénom, etc.) **sans connaître son id**. Par défaut, un `GET` API Platform va chercher la ressource via l'id de l'URL ; ici on remplace ce comportement par un **provider** qui renvoie simplement le user du token :

```php
new Get(uriTemplate: '/me', provider: CurrentUserProvider::class)
// dans le provider :
return $this->security->getUser();
```

---

## 4. Le cloisonnement par utilisateur (le cœur du projet)

Chaque snippet/dossier a un `owner`. Le cloisonnement repose sur **trois mécanismes complémentaires**, chacun couvrant un angle que les autres ne couvrent pas :

### En écriture : `OwnerProcessor` (State Processor)

Quand on crée un snippet, le front n'envoie **pas** le owner. Juste avant la persistance, le processor l'injecte depuis le token :

```php
if (($data instanceof Snippet || $data instanceof Folder) && null === $data->getOwner()) {
    $data->setOwner($this->security->getUser());
}
return $this->persistProcessor->process(...); // délègue le flush au processor Doctrine standard
```

Un *state processor* est un maillon qu'on insère dans la chaîne d'API Platform entre « désérialisation du JSON » et « écriture en BDD ». Le pattern est toujours le même : faire sa petite modification, puis **déléguer au processor standard** qui fait le vrai travail (le `flush` Doctrine). `UserPasswordProcessor` (hash du password) fonctionne exactement pareil.

### En lecture : `OwnerExtension` (Query Extension)

Une *query extension* modifie **automatiquement** toutes les requêtes SQL qu'API Platform génère pour certaines ressources. Ici, elle ajoute un `WHERE` sur chaque lecture de Snippet ou Folder :

```php
$queryBuilder
    ->andWhere(sprintf('%s.owner = :current_user', $rootAlias))
    ->setParameter('current_user', $this->security->getUser());
```

Résultat : `GET /api/snippets` ne renvoie que les snippets du user connecté, et `GET /api/snippets/42` renvoie un **404** si le snippet 42 appartient à quelqu'un d'autre (la requête SQL ne le trouve pas). Aucun `if` à écrire dans le reste du code : c'est invisible et systématique.

### Sur les opérations : les règles `security`

```php
new Patch(security: "object.getOwner() == user"),   // seul le propriétaire modifie
new Delete(security: "object.getOwner() == user"),
```

`object` = la ressource visée, `user` = l'utilisateur du token. Renvoie un **403** si la condition échoue.

### Pourquoi trois mécanismes et pas un seul ?

Chacun agit à un moment différent du cycle de vie : le processor à l'**écriture** (remplir le owner), l'extension à la **lecture** (filtrer les listes — une règle `security` ne peut pas filtrer une collection, elle ne fait qu'accepter/refuser), et les règles `security` en **modification/suppression** (vérifier le droit sur un objet précis). L'ensemble fait ceinture + bretelles : même si le front envoyait des ids d'autrui, le serveur ne laisse rien passer.

---

## 5. Le frontend Angular

### Architecture

Angular 21, composants **standalone** (pas de NgModule), organisés en trois couches :

```
pages/       une page = une route (login, dashboard, snippets, folders, snippets-post)
components/  briques réutilisables (snippet-box, boutons, formulaires, hero)
services/    tout ce qui parle à l'API (auth.ts, snippets.ts, folders.ts)
```

Règle du projet : **les composants ne font jamais de HTTP eux-mêmes**, ils passent par un service injecté (`inject(SnippetsService)`). Le service centralise les URLs, les headers et le typage des réponses.

### Zoneless + signals : comment la vue se met à jour

Angular 21 tourne en mode **zoneless** : Angular ne détecte plus « magiquement » les changements après un callback asynchrone. Si on modifie une simple propriété dans un `subscribe()`, **la vue ne se redessine pas**. La solution : les **signals**, des conteneurs de valeur qui notifient Angular à chaque changement.

Le pattern de récupération de données, utilisé sur toutes les pages :

```ts
snippets = signal<Snippet[]>([]);
loading  = signal(true);

ngOnInit(): void {
  this.snippetsService.getSnippets().subscribe({
    next: (snippets) => {
      this.snippets.set(snippets);   // .set() → Angular sait qu'il faut redessiner
      this.loading.set(false);
    },
    error: () => { /* ... */ },
  });
}
```

Dans le template, on lit avec `snippets()`. Pour dériver la nouvelle valeur de l'ancienne (ex. retirer un snippet supprimé de la liste sans recharger l'API) : `this.snippets.update((list) => list.filter(...))`.

> Règle d'or du projet : **tout état modifié dans un callback asynchrone doit être un signal**, sinon la vue reste figée.

### L'authentification côté front : qui fait quoi

Trois acteurs, chacun un seul rôle :

**`AuthService`** — parle à l'API et garde le token. Au login, il stocke le JWT dans le `localStorage` (il survit donc au rechargement de la page) :

```ts
.pipe(tap(({ token }) => localStorage.setItem('jwt', token)))
```

**`authGuard`** — exécuté par le router **avant** d'afficher une page protégée. Pas de token → redirection `/login` :

```ts
return auth.isLoggedIn() ? true : router.createUrlTree(['/login']);
```

Toutes les routes `dashboard/**` le déclarent via `canActivate: [authGuard]`.

**`authInterceptor`** — c'est **lui** qui explique pourquoi aucun service n'a besoin de poser le header JWT à la main. Enregistré une fois pour toutes dans `app.config.ts` :

```ts
provideHttpClient(withInterceptors([authInterceptor]))
```

…il s'exécute sur **chaque** requête HTTP sortante et y clone le header d'autorisation :

```ts
req = req.clone({ setHeaders: { Authorization: `Bearer ${auth.token}` } });
```

(Les requêtes Angular sont immuables, d'où le `clone`.) Ainsi `getSnippets()`, `getMe()`, etc. sont écrits comme si l'auth n'existait pas — l'interceptor s'en charge en coulisse.

Il gère aussi la **sortie** : si le serveur répond `401` (token expiré ou invalide), l'interceptor déconnecte et renvoie au login, quelle que soit la requête qui a échoué :

```ts
if (err.status === 401 && !req.url.endsWith('/api/login')) {
  auth.logout(); // supprime le token ET redirige vers /login
}
```

(L'exception `/api/login` évite de boucler quand c'est le login lui-même qui échoue — un mauvais mot de passe renvoie aussi un 401.)

Le cycle complet côté front : `authGuard` bloque l'accès sans token → login → token en localStorage → l'interceptor le colle sur chaque requête → au premier 401, logout automatique et retour au login.

### Les particularités des appels API (à cause de JSON-LD)

Dans les services, trois détails imposés par API Platform :

```ts
// 1. Les collections arrivent enveloppées : on déballe la clé Hydra "member"
.get<{ member: Snippet[] }>(...).pipe(map((response) => response.member))

// 2. POST/PUT exigent ce content-type
headers: { 'Content-Type': 'application/ld+json' }

// 3. PATCH exige celui-ci (et n'envoie QUE les champs modifiés)
headers: { 'Content-Type': 'application/merge-patch+json' }
```

Et côté typage, le payload d'envoi est dérivé du type de réponse pour n'avoir qu'une seule source de vérité :

```ts
export type SnippetPayload = Omit<Snippet, 'id'>; // pas d'id (généré) ni de owner (déduit du token)
```

---

## 6. La vie complète d'une requête : « je crée un snippet »

Pour tout relier, le déroulé exact d'un `POST` de snippet :

1. L'utilisateur remplit le formulaire (`snippet-form`) et valide ; la page appelle `snippetsService.addSnippet(payload)`.
2. **`authInterceptor`** intercepte la requête et ajoute `Authorization: Bearer <jwt>`.
3. Le navigateur envoie d'abord un **preflight CORS** (`OPTIONS`) — le bundle `nelmio_cors` du backend l'autorise (origine `localhost:4200`, headers `Content-Type` et `Authorization`).
4. Le firewall **`api`** de Symfony vérifie la signature et l'expiration du JWT, et charge le `User` en mémoire.
5. API Platform route vers l'opération `Post` de `Snippet`, vérifie `is_granted('ROLE_USER')`, puis **désérialise** le JSON en objet `Snippet` (seuls les champs du groupe `snippet:write` sont acceptés).
6. Le **`OwnerProcessor`** renseigne `owner` = user du token, puis délègue au processor Doctrine qui `flush` en BDD.
7. API Platform **sérialise** le snippet créé (champs `snippet:read`, relations en IRIs) et répond `201` en JSON-LD.
8. Côté front, le `subscribe` reçoit la réponse, met à jour le signal concerné (ou redirige), et Angular redessine la vue.

Une lecture (`GET /api/snippets`) suit le même chemin, avec l'**`OwnerExtension`** qui ajoute le `WHERE owner = :current_user` à l'étape SQL.

---

## 7. Les pièges connus du projet

- **415 Unsupported Media Type** en écriture → mauvais `Content-Type` (revoir §5 : `ld+json` pour POST/PUT, `merge-patch+json` pour PATCH).
- **La vue ne se met pas à jour** après un appel API → l'état modifié dans le `subscribe` n'est pas un signal (revoir §5, zoneless).
- **404 sur une ressource qui existe en BDD** → elle appartient à un autre user, c'est l'`OwnerExtension` qui la masque (comportement voulu).
- **Relations dans les payloads** : toujours des IRIs (`"/api/folders/1"`), jamais des ids nus ni des objets.
- **URLs de l'API en dur** (`http://localhost:8000`) dans les services : voulu tant qu'on est en local, à sortir dans `environment.ts` au premier déploiement.
- Le **token n'est jamais rafraîchi** : quand il expire, n'importe quelle requête déclenche le logout automatique via l'interceptor. C'est le comportement prévu à ce stade (pas de refresh token).
