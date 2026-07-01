# Comprendre API Platform (groupes, opérations, security, ApiFilter)

Tu as déjà tes 3 entités (`Snippet`, `Folder`, `User`) avec juste `#[ApiResource]`. Voici l'explication de chaque brique, en se basant sur ton code, avec à quoi ressemblerait ton `Snippet` une fois tout branché.

---

## Le point de départ : `#[ApiResource]`

Cette seule ligne au-dessus de ta classe suffit à créer une API REST complète pour `Snippet` :

| Verbe HTTP | URL | Effet |
|---|---|---|
| GET | `/api/snippets` | liste tous les snippets |
| GET | `/api/snippets/1` | récupère le snippet #1 |
| POST | `/api/snippets` | crée un snippet |
| PUT/PATCH | `/api/snippets/1` | modifie le snippet #1 |
| DELETE | `/api/snippets/1` | supprime le snippet #1 |

Tu n'as écrit **aucun contrôleur**. C'est là toute l'idée d'API Platform : tu décris *quoi*, il génère le *comment*.

Les 4 concepts qui suivent servent à **reprendre le contrôle** sur ce comportement par défaut.

---

## 1. Les groupes de sérialisation

**Le problème :** par défaut, l'API renvoie *tous* les champs. Sur ton `User`, ça veut dire que `/api/users` cracherait le `password` hashé et les `roles`. Mauvais.

**La sérialisation**, c'est la traduction `objet PHP → JSON` (et l'inverse, la *dé*sérialisation, `JSON → objet` quand on reçoit un POST).

Un **groupe** est juste une étiquette que tu colles sur les propriétés que tu veux inclure. Tu déclares ensuite quels groupes utiliser en lecture (`normalization`) et en écriture (`denormalization`).

```php
use Symfony\Component\Serializer\Attribute\Groups;

#[ApiResource(
    normalizationContext:   ['groups' => ['snippet:read']],   // ce qui SORT (GET)
    denormalizationContext: ['groups' => ['snippet:write']],  // ce qui ENTRE (POST/PUT)
)]
class Snippet
{
    #[Groups(['snippet:read'])]           // visible, mais non modifiable par le client
    private ?int $id = null;

    #[Groups(['snippet:read', 'snippet:write'])]  // visible ET modifiable
    private ?string $title = null;

    #[Groups(['snippet:read', 'snippet:write'])]
    private ?string $code = null;
```

- `id` → seulement `snippet:read` : le client le voit mais ne peut pas l'imposer.
- `title` / `code` → les deux : lisibles et modifiables.
- Une propriété **sans aucun groupe** = invisible dans l'API. C'est comme ça que tu caches `password` sur `User`.

**Astuce clé — les relations :** si tu mets `#[Groups(['snippet:read'])]` sur `$owner`, tu peux exposer les champs du `User` en ajoutant le groupe `snippet:read` sur les propriétés voulues *dans* `User`. Ça évite d'exposer tout le `User` — tu choisis champ par champ ce qui remonte dans un snippet.

---

## 2. Les opérations

`#[ApiResource]` active les 5 routes du tableau plus haut. Les **opérations** te laissent choisir lesquelles activer et les configurer une par une.

Deux familles :
- **Opérations de collection** : agissent sur *plusieurs* items → `GetCollection` (liste), `Post` (créer).
- **Opérations d'item** : agissent sur *un* item identifié par son id → `Get`, `Put`, `Patch`, `Delete`.

```php
use ApiPlatform\Metadata\{ApiResource, GetCollection, Get, Post, Put, Delete};

#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(),
        new Put(),
        new Delete(),
    ]
)]
```

Si tu ne veux **pas** que les snippets soient supprimables via l'API, tu retires simplement `new Delete()`. La route n'existe plus (404). C'est plus sûr et plus clair que de la bloquer autrement.

Chaque opération peut avoir ses propres groupes, sa propre sécurité, etc. Par exemple des groupes différents en lecture liste vs lecture détail.

---

## 3. `security: "is_granted('ROLE_XXX')"`

C'est le **contrôle d'accès** : *qui* a le droit de déclencher une opération. `is_granted(...)` est une expression évaluée par le composant Security de Symfony ; elle doit retourner `true` pour laisser passer, sinon → **403 Forbidden**.

Tu peux la poser globalement ou par opération (le plus fréquent) :

```php
#[ApiResource(
    operations: [
        new GetCollection(),                                    // public
        new Get(),                                              // public
        new Post(security: "is_granted('ROLE_USER')"),         // faut être connecté
        new Put(security: "is_granted('ROLE_USER') and object.getOwner() == user"),
        new Delete(security: "is_granted('ROLE_ADMIN')"),      // que les admins
    ]
)]
```

Deux variables magiques disponibles dans l'expression :
- `user` → l'utilisateur connecté (ton entité `User`).
- `object` → l'entité concernée (dispo sur `Get`/`Put`/`Delete`, là où il y a un item précis).

La ligne du `Put` est **le pattern le plus utile pour toi** : `object.getOwner() == user` veut dire *« on ne peut modifier un snippet que si on en est le propriétaire »*. C'est exactement à quoi sert ta relation `owner` sur `Snippet`.

> Rappel : dans ton `User`, `getRoles()` ajoute toujours `ROLE_USER`. Donc tout user connecté passe `is_granted('ROLE_USER')`. Pour `ROLE_ADMIN`, il faut l'ajouter explicitement via `setRoles(['ROLE_ADMIN'])`.

---

## 4. `ApiFilter`

Par défaut `GET /api/snippets` renvoie **tout**. Les filtres ajoutent la possibilité de **chercher / trier / paginer** via des paramètres d'URL.

```php
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\{SearchFilter, OrderFilter};

#[ApiResource(/* ... */)]
#[ApiFilter(SearchFilter::class, properties: [
    'title' => 'partial',   // recherche "contient"
    'owner' => 'exact',     // filtre par id du propriétaire
])]
#[ApiFilter(OrderFilter::class, properties: ['title'])]
class Snippet
```

Ça débloque des URL comme :
- `/api/snippets?title=react` → titres contenant "react".
- `/api/snippets?owner=/api/users/1` → snippets d'un user donné.
- `/api/snippets?order[title]=desc` → triés par titre décroissant.

Les stratégies pour `SearchFilter` : `exact`, `partial` (LIKE %val%), `start`, `end`. Autres filtres utiles : `DateFilter`, `BooleanFilter`, `RangeFilter`, `ExistsFilter`.

---

## Ce que ça donne assemblé sur ton `Snippet`

```php
#[ApiResource(
    normalizationContext:   ['groups' => ['snippet:read']],
    denormalizationContext: ['groups' => ['snippet:write']],
    operations: [
        new GetCollection(),
        new Get(),
        new Post(security: "is_granted('ROLE_USER')"),
        new Put(security:  "is_granted('ROLE_USER') and object.getOwner() == user"),
        new Delete(security: "is_granted('ROLE_USER') and object.getOwner() == user"),
    ]
)]
#[ApiFilter(SearchFilter::class, properties: ['title' => 'partial'])]
class Snippet { ... }
```

Traduction en français : *« API pour les snippets. On expose les champs du groupe `read`, on accepte en écriture ceux du groupe `write`. Tout le monde peut lire, seul un user connecté peut créer, et on ne peut modifier/supprimer que ses propres snippets. On peut chercher par titre. »*

---

## Le modèle mental à retenir

| Concept | Question à laquelle il répond |
|---|---|
| Groupes | *Quels champs* entrent et sortent ? |
| Opérations | *Quelles routes* existent ? |
| `security` | *Qui* a le droit ? |
| `ApiFilter` | *Comment chercher/trier* dans la liste ? |

Pour passer à la pratique, il te faudra un système de login (probablement JWT) pour que `user` soit rempli dans les expressions `security`.
