# ChillBox — Documentation de l'API

> Document vivant : on l'incrémente à chaque ajout ou amélioration de l'API.
> Pour le cours théorique sur API Platform (groupes, opérations, security, filtres), voir [`api-platform.md`](./api-platform.md). Ici on documente **l'état réel** de notre API.

Dernière mise à jour : 2026-07-02

---

## 1. Vue d'ensemble

- **Stack** : Symfony 8 + API Platform 4 (`api-platform/symfony`, `api-platform/doctrine-orm`).
- **Principe** : pas de contrôleurs. Chaque entité annotée `#[ApiResource]` expose automatiquement ses routes REST sous `/api/...`. On pilote le comportement via des attributs PHP sur l'entité, et via des classes d'extension quand il faut toucher aux requêtes SQL.
- **Où vit quoi** :

| Dossier | Rôle |
| --- | --- |
| `backend/src/Entity/` | Les entités Doctrine = la définition de l'API (routes, champs exposés, sécurité, filtres) |
| `backend/src/Doctrine/` | Les extensions de requête : du SQL ajouté automatiquement par API Platform (voir §4) |
| `backend/src/State/` | Les state processors : logique serveur juste avant la persistance (voir §4) |
| `backend/src/Repository/` | Repositories Doctrine classiques (pas utilisés par l'API pour l'instant) |
| `backend/config/packages/api_platform.yaml` | Config globale d'API Platform |
| `backend/config/packages/security.yaml` | Firewalls et contrôle d'accès (auth pas encore branchée, voir §6) |

---

## 2. Cycle de vie d'une requête

Comprendre ce pipeline permet de savoir **où** brancher chaque comportement :

```
Requête HTTP
   │
   ▼
1. Routing          API Platform matche l'URL sur une opération (Get, Post, …)
   ▼
2. Security         L'expression `security:` de l'opération est évaluée → 403 si false
   ▼
3. State Provider   Charge les données via Doctrine.
   │                C'EST ICI que nos extensions (src/Doctrine/) modifient le
   │                QueryBuilder avant exécution du SQL.
   ▼
4. Désérialisation  (POST/PUT/PATCH) Le JSON entrant remplit l'objet,
   │                limité aux champs du groupe `*:write`
   ▼
5. Validation       Contraintes #[Assert\...] → 422 si invalide (pas encore en place)
   ▼
6. State Processor  Persiste en base (flush Doctrine).
   │                C'est ici que `OwnerProcessor` remplit `owner` au POST (§4)
   ▼
7. Sérialisation    L'objet est transformé en JSON, limité aux champs
   │                du groupe `*:read`
   ▼
Réponse HTTP
```

---

## 3. Ressources exposées

### 3.1 Snippet — `/api/snippets` ✅ configurée

Fichier : `backend/src/Entity/Snippet.php`

#### Opérations

| Verbe | URL | Sécurité | Notes |
| --- | --- | --- | --- |
| GET | `/api/snippets` | `ROLE_USER` | Ne renvoie **que les snippets du user connecté** (§4) |
| GET | `/api/snippets/{id}` | `ROLE_USER` | 404 si le snippet appartient à un autre user (§4) |
| POST | `/api/snippets` | `ROLE_USER` | `owner` = user connecté, rempli par `OwnerProcessor` (§4) |
| PUT | `/api/snippets/{id}` | propriétaire uniquement | Remplacement complet |
| PATCH | `/api/snippets/{id}` | propriétaire uniquement | Modification partielle |
| DELETE | `/api/snippets/{id}` | propriétaire uniquement | |

Pour PUT/PATCH/DELETE, la sécurité est doublée : l'extension Doctrine (§4) renvoie déjà 404 si le snippet est à quelqu'un d'autre, et l'expression `object.getOwner() == user` protège en plus.

#### Champs

| Champ | Lecture (`snippet:read`) | Écriture (`snippet:write`) | Remarque |
| --- | --- | --- | --- |
| `id` | ✅ | ❌ | Généré par la base |
| `title` | ✅ | ✅ | |
| `code` | ✅ | ✅ | |
| `description` | ✅ | ✅ | Nullable |
| `owner` | ✅ (en IRI) | ❌ | Volontairement non-écrivable : un client ne doit pas pouvoir s'attribuer un snippet. Sort sous forme d'IRI (`/api/users/1`) car aucune propriété de `User` n'a le groupe `snippet:read` |
| `folders` | ✅ (en IRI) | ✅ (en IRI) | On envoie des IRIs : `"folders": ["/api/folders/2"]` |

#### Filtres et tri (sur la collection)

| Paramètre d'URL | Effet |
| --- | --- |
| `?title=react` | Recherche insensible à la casse, "contient" (idem `description`, `code`) |
| `?owner=/api/users/1` | Filtre exact par propriétaire (redondant depuis le filtrage auto du §4) |
| `?folders=/api/folders/2` | Snippets d'un dossier donné |
| `?order[title]=desc` | Tri par `id` ou `title`, `asc`/`desc` |

### 3.2 Folder — `/api/folders` ✅ configurée

Fichier : `backend/src/Entity/Folder.php`. Configurée sur le même modèle que Snippet.

#### Opérations

Identiques à Snippet : GetCollection/Get/Post réservées à `ROLE_USER`, Put/Patch/Delete réservées au propriétaire, et le filtrage par owner (§4) s'applique — un user ne voit et ne manipule que **ses** folders (404 pour ceux des autres).

#### Champs

| Champ | Lecture (`folder:read`) | Écriture (`folder:write`) | Remarque |
| --- | --- | --- | --- |
| `id` | ✅ | ❌ | Généré par la base |
| `title` | ✅ | ✅ | |
| `description` | ✅ | ✅ | Nullable |
| `owner` | ✅ (en IRI) | ❌ | Non-écrivable, comme sur Snippet. Rempli au POST par `OwnerProcessor` (§4) |
| `snippets` | ✅ (en IRI) | ✅ (en IRI) | Folder est le côté propriétaire du ManyToMany : `"snippets": ["/api/snippets/1"]` fonctionne à l'écriture |

#### Filtres et tri (sur la collection)

Recherche `ipartial` sur `title`/`description`, `exact` sur `owner`, tri par `id` ou `title` (`?order[title]=desc`).

### 3.3 User — `/api/users` ✅ configurée (volontairement minimale)

Fichier : `backend/src/Entity/User.php`. Deux opérations seulement :

| Verbe | URL | Sécurité | Notes |
| --- | --- | --- | --- |
| POST | `/api/users` | **publique** (`PUBLIC_ACCESS`) | L'inscription. Le password arrive en clair dans le body et est hashé par `UserPasswordProcessor` (§4) |
| GET | `/api/users/{id}` | `object == user` | Son propre profil uniquement — celui d'un autre → 403 |

Pas de GetCollection (personne ne liste les users → 405), pas de Put/Patch/Delete pour l'instant (à ajouter si on fait une page « mon compte »).

#### Champs

| Champ | Lecture (`user:read`) | Écriture (`user:write`) | Remarque |
| --- | --- | --- | --- |
| `id` | ✅ | ❌ | |
| `email` | ✅ | ✅ | `Assert\NotBlank` + `Assert\Email` + `UniqueEntity` (doublon → 422) |
| `password` | ❌ **jamais** | ✅ | Write-only : entre en clair, hashé avant persistance, ne ressort jamais |
| `roles` | ❌ | ❌ | Aucun groupe = invisible. `getRoles()` ajoute `ROLE_USER` de toute façon |
| `snippets` / `folders` | ❌ | ❌ | Invisibles — on passe par `/api/snippets` et `/api/folders` (déjà filtrés par owner) |

Validation : password `Assert\Length(min: 8)`. La validation (étape 5 du pipeline §2) s'exécute **avant** le processor (étape 6), donc c'est bien le mot de passe en clair qui est mesuré, pas le hash.

---

## 4. `src/Doctrine/` et `src/State/` — nos branchements dans le pipeline

### C'est quoi une extension ?

Quand API Platform charge des données (étape 3 du pipeline §2), il construit un `QueryBuilder` Doctrine. Avant d'exécuter le SQL, il passe ce QueryBuilder à **toutes les classes qui implémentent les interfaces d'extension**.

**Le mécanisme, en une phrase** : dès qu'une classe implémente `QueryCollectionExtensionInterface`, elle devient une extension — à la compilation du container, Symfony détecte l'interface (autoconfiguration) et l'ajoute à la liste que le provider d'API Platform déroule avant chaque requête de collection. Aucun enregistrement manuel : le `implements` **est** l'inscription.

Trois points pour se le représenter :

- **Le chef d'orchestre est le provider** (`CollectionProvider` / `ItemProvider` d'API Platform) : c'est lui qui tient la liste des extensions et les appelle une par une sur le QueryBuilder, puis exécute le SQL une fois la liste épuisée.
- **Notre `OwnerExtension` n'est pas seule dans la liste** : la pagination, les `ApiFilter` et le tri d'API Platform sont eux-mêmes des extensions branchées par le même mécanisme. Chacune empile sa clause (`WHERE`, `LIMIT`, `ORDER BY`…) sur le même QueryBuilder.
- **Le provider distribue à l'aveugle, chaque extension trie elle-même** : elles sont appelées pour *toutes* les entités, et c'est le `if` en tête de chaque extension qui décide « pas pour moi, je ne touche à rien ».

Pour le vérifier : `docker compose exec backend php bin/console debug:container 'App\Doctrine\OwnerExtension'` montre les tags posés par l'autoconfiguration et les providers qui l'utilisent.

Deux interfaces, une par type d'opération :

| Interface | Méthode appelée | Déclenchée par |
| --- | --- | --- |
| `QueryCollectionExtensionInterface` | `applyToCollection()` | `GET /api/snippets` (collection) |
| `QueryItemExtensionInterface` | `applyToItem()` | `GET/PUT/PATCH/DELETE /api/snippets/{id}` (item) — oui, aussi les écritures : API Platform charge d'abord l'item via le même chemin |

### `OwnerExtension.php`

**Rôle** : garantir qu'un user ne voit et ne manipule **que ses propres ressources** (snippets ET folders), au niveau SQL.

**Fonctionnement** : les deux méthodes délèguent à `filterByOwner()`, qui :

1. Ignore toute ressource qui n'est ni `Snippet` ni `Folder` (l'extension est appelée pour *toutes* les entités, le `if` en tête filtre) ;
2. Ajoute `AND o.owner = :current_user` au QueryBuilder, avec le user connecté en paramètre. La même clause marche pour les deux entités car toutes deux ont un champ `owner`.

**Conséquences concrètes** (valables pour `/api/snippets` et `/api/folders`) :

- `GET` collection → uniquement les ressources du user connecté ;
- `GET /{id}` d'une ressource d'autrui → **404** (pas 403 : on ne révèle même pas que l'id existe) ;
- Idem pour PUT/PATCH/DELETE sur la ressource d'autrui → 404 ;
- Le `user` vient du token JWT (§6). Sans token valide, le firewall renvoie 401 avant même d'arriver ici.

**Pour ajouter une entité au filtrage** : ajouter sa classe dans le `in_array()` de `filterByOwner()` — à condition qu'elle ait un champ `owner`.

### `State/OwnerProcessor.php` — le state processor

Le problème symétrique de l'extension, mais en **écriture** : au POST, `owner` n'est pas écrivable par le client (groupes) et personne ne le remplit → `null` → l'INSERT planterait (`JoinColumn(nullable: false)`).

**Fonctionnement** : un state processor est l'étape 6 du pipeline (§2), ce qui persiste en base. Le nôtre **décore** le processor Doctrine d'API Platform : il fait `setOwner($security->getUser())` si `owner` est vide, puis délègue la sauvegarde au processor d'origine (injecté via `#[Autowire]`).

**Branchement** : contrairement aux extensions (automatiques via l'interface), un processor se déclare **explicitement sur l'opération** : `new Post(..., processor: OwnerProcessor::class)` sur Snippet et Folder. Uniquement sur `Post` — en PUT/PATCH l'entité a déjà son owner, et `Delete` utilise un autre processor (celui de suppression).

**Vérifié** : un POST avec `"owner": "/api/users/2"` dans le payload est ignoré (pas dans le groupe write) et le snippet est quand même attribué au user connecté.

### `State/UserPasswordProcessor.php`

Même pattern exactement, pour l'inscription : le client envoie son password **en clair** dans le body (HTTPS obligatoire en prod), le processor le remplace par son hash bcrypt (`UserPasswordHasherInterface`), puis délègue la persistance. Branché sur le `Post` de `User`. On ne stocke jamais le clair, et le groupe `user:write`-seul sur `password` garantit qu'il ne ressort jamais en lecture.

---

## 5. Conventions

- **Groupes de sérialisation** : `<entité>:read` / `<entité>:write` (ex. `snippet:read`). Un champ sans groupe est invisible dans l'API.
- **Relations** : exposées en IRI (`/api/users/1`) par défaut. Pour embarquer des champs d'une relation dans la réponse, ajouter le groupe `read` du parent sur les propriétés voulues de l'entité liée — champ par champ, jamais l'entité entière.
- **Champs serveur** (id, owner, futurs createdAt…) : groupe `read` seulement. C'est le serveur qui décide, jamais le client.
- **Sécurité** : `is_granted('ROLE_USER')` pour "connecté", `object.getOwner() == user` pour "propriétaire". Le filtrage SQL par owner (extension) est la vraie barrière ; l'expression `security` est la ceinture de sécurité en plus.

---

## 6. Authentification — JWT (Lexik) ✅

Stack : `lexik/jwt-authentication-bundle`, tokens signés RS256, durée de vie 1h.

### Se connecter et consommer l'API

```bash
# 1. Login → récupère un token
curl -X POST http://localhost:8000/api/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@chillbox.dev","password":"password"}'
# → {"token": "eyJ..."}

# 2. Toute requête suivante : le token dans le header Authorization
curl http://localhost:8000/api/snippets -H "Authorization: Bearer eyJ..."
```

Sans token / token invalide ou expiré → **401** avant même d'atteindre les entités.

### Comment c'est branché

- **Clés** : `config/jwt/private.pem` (signe les tokens) et `public.pem` (vérifie). Gitignorées — générées par `make install` (`lexik:jwt:generate-keypair --skip-if-exists`). La clé privée est protégée par `JWT_PASSPHRASE` (`.env`).
- **Firewalls** (`security.yaml`, l'ordre compte — premier pattern qui matche gagne) :
  - `login` (`^/api/login`) : le guichet. `json_login` lit `{email, password}`, vérifie le hash via le provider, et les handlers Lexik renvoient `{"token": ...}` au lieu de créer une session.
  - `api` (`^/api`) : le contrôleur. `jwt: ~` lit le header `Authorization: Bearer`, vérifie signature + expiration avec la clé publique, recharge le `User` depuis le `username` du payload. **C'est lui qui remplit le `user`** des expressions `security` et de l'`OwnerExtension`.
  - Les deux sont `stateless: true` : aucune session, aucun cookie, chaque requête présente son badge.
- **Route** : `api_login` dans `config/routes.yaml` — aucun contrôleur derrière, le firewall intercepte tout.

### Rappels JWT

Le payload du token est du base64 **lisible par tous** (pas chiffré) — jamais de secret dedans. Ce qui est garanti, c'est l'**authenticité** : impossible de fabriquer ou modifier un token sans la clé privée. Pas de révocation possible avant l'`exp` → durée de vie courte.

---

## 7. Reste à faire

| Tâche | Pourquoi | Quand |
| --- | --- | --- |
| Validation sur Snippet et Folder (`#[Assert\NotBlank]` sur `title`, `code`…) | Un POST invalide doit donner un 422 propre, pas une 500 SQL. Déjà fait sur User (§3.3), reste les deux autres | Quand on veut |
| Put/Patch/Delete sur User | Pour une future page « mon compte » (avec re-hash du password si modifié) | Si besoin |

---

## 8. Données de test (fixtures)

Pour remplir la base avec des données réalistes (dev uniquement) :

```bash
docker compose exec backend php bin/console doctrine:fixtures:load --no-interaction
```

⚠️ La commande **vide la base** avant de recharger.

- **Outils** : `doctrine/doctrine-fixtures-bundle` (le chargement) + `zenstruck/foundry` (les factories, dans `backend/src/Factory/`). Une factory = des valeurs par défaut réalistes pour une entité, surchargables à l'appel : `SnippetFactory::createOne(['title' => 'Mon titre'])`.
- **Scénario chargé** (`src/DataFixtures/AppFixtures.php`) : deux comptes connus, `demo@chillbox.dev` et `other@chillbox.dev` (mot de passe : `password`), chacun avec 2 dossiers de 3 snippets + 4 snippets hors dossier. Deux users distincts = de quoi tester le login **et** le cloisonnement par owner (§4).
- Le hash du mot de passe est fait dans `UserFactory` (hook `afterInstantiate`), jamais stocké en clair.

---

## Historique

| Date | Changement |
| --- | --- |
| 2026-07-02 | Création du document. API Snippet : opérations + groupes + filtres + extension de filtrage par owner (collection et item) |
| 2026-07-02 | API Folder configurée (groupes `folder:*`, sécurité, filtres, `owner` en lecture seule). Extension renommée `OwnerExtension` et étendue à Folder |
| 2026-07-02 | Fixtures et factories (Foundry) : comptes `demo`/`other@chillbox.dev`, dossiers et snippets de test (§8) |
| 2026-07-02 | Login JWT (Lexik) : firewalls `login` + `api`, clés RS256, génération des clés dans `make install`. Testé de bout en bout : 401 sans token, cloisonnement par owner effectif (§6) |
| 2026-07-02 | `OwnerProcessor` : `owner` rempli automatiquement au POST de Snippet et Folder. Le CRUD complet fonctionne (§4) |
| 2026-07-02 | API User : inscription publique avec hash du password (`UserPasswordProcessor`), profil en `object == user`, password write-only, validation email/password (§3.3) |
