# Angular pour les (vrais) débutants — le guide complet pas à pas

Bienvenue ! Ce tutoriel part du principe que tu n'as **jamais** touché à Angular. On va tout construire ensemble, brique par brique, avec des exemples simples et beaucoup d'explications. À la fin, tu seras capable de créer une petite application complète (une liste de tâches) et surtout, tu **comprendras** ce que tu écris.

> 💡 **Conseil n°1 (le plus important)** : ne te contente pas de lire. Ouvre ton éditeur et tape chaque exemple toi-même. C'est en codant qu'on apprend, pas en lisant.

## Sommaire

1. C'est quoi Angular, au juste ?
2. Les prérequis (avec un mini-crash-course TypeScript)
3. Installer les outils
4. Créer ton premier projet
5. Visite guidée du projet
6. Les composants : le cœur d'Angular
7. Afficher des données : l'interpolation `{{ }}`
8. La liaison de propriétés `[ ]`
9. Réagir aux clics : les événements `( )` et les signaux
10. La liaison bidirectionnelle `[(ngModel)]`
11. Conditions et boucles : `@if` et `@for`
12. Les pipes : formater l'affichage
13. Les services : partager des données entre composants
14. Naviguer entre les pages : le routeur
15. Parler à un serveur : HttpClient
16. Mini-projet final : une liste de tâches complète
17. Les erreurs classiques du débutant (et comment les corriger)
18. Antisèche et suite du voyage

---

## 1. C'est quoi Angular, au juste ?

Angular est un **framework front-end** : un ensemble d'outils pour construire la partie visible d'un site web, celle qui s'exécute dans le navigateur de l'utilisateur. Il est créé et maintenu par Google, il est gratuit et open source, et il est utilisé par des milliers d'entreprises pour des applications comme des tableaux de bord, des messageries, des sites e-commerce, des outils internes, etc.

Le mot « framework » (cadre de travail) est important. Contrairement à une simple bibliothèque qui te donne quelques fonctions, Angular te fournit **tout** : une façon d'organiser ton code, un système de navigation entre les pages, des outils pour les formulaires, pour appeler des serveurs, pour tester... C'est une boîte à outils complète avec un mode d'emploi. C'est ce qui le distingue de React, par exemple, qui est une bibliothèque plus minimaliste autour de laquelle on assemble soi-même son écosystème.

### Le concept de SPA (Single Page Application)

Sur un site web « classique », chaque clic sur un lien demande une **nouvelle page complète** au serveur : l'écran devient blanc un instant, puis la nouvelle page s'affiche. Avec Angular, on construit des **SPA** : le navigateur charge une seule page HTML au tout début, puis c'est le JavaScript qui **remplace dynamiquement les morceaux de la page** quand tu navigues ou interagis. Résultat : pas de rechargement, une expérience fluide, comme une application de bureau ou mobile. Gmail est l'exemple parfait de ce ressenti.

### Angular ≠ AngularJS (piège classique !)

- **AngularJS** (2010) est l'ancêtre, aujourd'hui abandonné. On le reconnaît à des syntaxes comme `ng-repeat` ou `$scope`.
- **Angular** (2016 à aujourd'hui) est une réécriture complète, sans rapport direct.

Si tu tombes sur un tutoriel qui parle de `$scope` ou de `controller`, fuis : c'est de l'AngularJS.

### Quelle version d'Angular ?

Angular sort une nouvelle version majeure tous les 6 mois, mais rassure-toi : les fondamentaux bougent peu. Ce guide utilise la **syntaxe moderne** (versions 17 et suivantes) : composants « standalone », blocs `@if` / `@for`, signaux. Si tu croises un tutoriel avec des fichiers `app.module.ts` ou des `*ngIf`, c'est une syntaxe plus ancienne — elle fonctionne encore, mais ce n'est plus ce qu'on écrit aujourd'hui. J'y reviendrai au fil des chapitres.

---

## 2. Les prérequis

Pour suivre confortablement, il te faut des bases en :

1. **HTML** : savoir ce qu'est une balise, un attribut, une classe.
2. **CSS** : savoir cibler un élément et le styler.
3. **JavaScript** : variables, fonctions, tableaux, objets.

Pas besoin d'être expert. Voici un rappel express des notions JavaScript qu'on utilisera tout le temps :

```js
// Les fonctions fléchées (arrow functions)
const doubler = (x) => x * 2;

// Les méthodes de tableau : map, filter
const nombres = [1, 2, 3, 4];
const doubles = nombres.map(n => n * 2);        // [2, 4, 6, 8]
const pairs = nombres.filter(n => n % 2 === 0); // [2, 4]

// Les template literals (backticks) pour insérer des variables dans du texte
const prenom = 'Léa';
console.log(`Bonjour ${prenom} !`); // Bonjour Léa !
```

### Mini-crash-course TypeScript

Angular s'écrit en **TypeScript** (TS), pas en JavaScript pur. Pas de panique : TypeScript, c'est **JavaScript + des types**. Tout ce que tu sais en JS reste valable, on ajoute juste des annotations qui décrivent le type des données. Pourquoi ? Parce que ton éditeur peut alors détecter tes erreurs **avant même d'exécuter le code**, et t'autocompléter intelligemment.

```ts
// On annote le type après le nom, avec « : type »
let age: number = 25;
let prenom: string = 'Léa';
let estConnecte: boolean = true;
let fruits: string[] = ['pomme', 'poire']; // tableau de chaînes

// Une fonction : on type les paramètres et la valeur de retour
function total(prix: number, quantite: number): number {
  return prix * quantite;
}

total(10, 3);      // ✅ 30
// total(10, 'a'); // ❌ TypeScript refuse : 'a' n'est pas un number
```

La notion la plus utile pour la suite : **l'interface**. C'est une façon de décrire « la forme » d'un objet :

```ts
interface Produit {
  nom: string;
  prix: number;
  enStock: boolean;
}

const clavier: Produit = {
  nom: 'Clavier mécanique',
  prix: 89,
  enStock: true,
};
```

Si tu oublies une propriété ou te trompes de type, TypeScript te le signale immédiatement. C'est ton filet de sécurité.

> 💡 Dernier point : le navigateur ne comprend pas TypeScript. Quand tu lances ton application, Angular **compile** automatiquement ton TS en JavaScript classique. Tu n'as rien à faire, mais c'est bien de savoir que ça se passe en coulisses.

---

## 3. Installer les outils

### Node.js et npm

**Node.js** permet d'exécuter du JavaScript en dehors du navigateur : c'est ce dont les outils d'Angular ont besoin pour fonctionner sur ta machine. **npm** (Node Package Manager) est installé avec Node : c'est le gestionnaire de paquets qui télécharge les bibliothèques dont ton projet dépend.

1. Va sur [nodejs.org](https://nodejs.org) et installe la version **LTS** (Long Term Support = version stable recommandée).
2. Ouvre un terminal (PowerShell sous Windows, Terminal sous macOS/Linux) et vérifie :

```bash
node -v   # doit afficher une version, ex. v22.x.x
npm -v    # ex. 10.x.x
```

> ⚠️ Angular demande une version récente de Node (20 ou plus). Si `node -v` affiche une version très ancienne, réinstalle depuis nodejs.org.

### Le CLI Angular

Le **CLI** (Command Line Interface) est l'outil en ligne de commande officiel d'Angular. Il sait créer un projet, générer des fichiers, lancer un serveur de développement, construire la version finale... Tu vas l'utiliser en permanence.

```bash
npm install -g @angular/cli
```

Le `-g` signifie « global » : la commande `ng` sera disponible partout sur ta machine, pas seulement dans un dossier. Vérifie :

```bash
ng version
```

> ⚠️ **Sous Windows**, si tu obtiens une erreur du genre *« ng : impossible de charger le fichier... l'exécution de scripts est désactivée »*, ouvre PowerShell et exécute :
> ```
> Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
> ```
> Réponds « O » (oui), ferme et rouvre le terminal. C'est un blocage de sécurité de Windows, très fréquent chez les débutants.

### Un bon éditeur

Installe **Visual Studio Code** (gratuit) si ce n'est pas déjà fait, avec l'extension **Angular Language Service**. Elle t'apportera l'autocomplétion et la détection d'erreurs directement dans les templates HTML d'Angular. C'est un confort énorme.

---

## 4. Créer ton premier projet

Place-toi dans le dossier où tu ranges tes projets, puis :

```bash
ng new ma-premiere-app
```

Le CLI te pose quelques questions. Voici quoi répondre pour débuter :

- **Which stylesheet format would you like to use?** → choisis **CSS** (les autres options comme SCSS sont des variantes de CSS, on n'en a pas besoin pour l'instant).
- **Do you want to enable Server-Side Rendering (SSR)?** → **No**. Le SSR sert à générer les pages côté serveur pour le référencement ; c'est un sujet avancé, inutile pour apprendre.
- Pour toute autre question éventuelle (selon ta version du CLI), la réponse par défaut (touche Entrée) convient très bien.

Le CLI crée le dossier, génère les fichiers et installe les dépendances (ça peut prendre une ou deux minutes). Ensuite :

```bash
cd ma-premiere-app
ng serve
```

`ng serve` compile ton application et lance un **serveur de développement**. Ouvre ton navigateur sur **http://localhost:4200** : tu dois voir la page d'accueil générée par Angular. 🎉

Deux choses à savoir sur ce serveur :

- Il **recompile automatiquement** à chaque fois que tu sauvegardes un fichier, et la page du navigateur se rafraîchit toute seule. Laisse-le tourner dans un terminal pendant que tu codes.
- Pour l'arrêter : `Ctrl + C` dans le terminal.

> 💡 Fais le test : laisse `ng serve` tourner, ouvre le projet dans VS Code, modifie n'importe quel texte dans `src/app/app.html` (ou `app.component.html` selon ta version), sauvegarde... et regarde le navigateur se mettre à jour tout seul.

---

## 5. Visite guidée du projet

Le CLI a généré beaucoup de fichiers. Bonne nouvelle : tu passeras 95 % de ton temps dans **un seul dossier**, `src/app`. Voici la carte du territoire :

```
ma-premiere-app/
├── node_modules/        ← les bibliothèques installées (ne jamais toucher ni ouvrir)
├── src/                 ← TON code
│   ├── app/             ← ⭐ le cœur de l'application, c'est ici qu'on travaille
│   │   ├── app.ts           ← le composant racine (logique)
│   │   ├── app.html         ← le composant racine (affichage)
│   │   ├── app.css          ← le composant racine (style)
│   │   ├── app.config.ts    ← la configuration globale de l'app
│   │   └── app.routes.ts    ← les routes (navigation), on y reviendra
│   ├── index.html       ← LA page HTML unique (souviens-toi : SPA !)
│   ├── main.ts          ← le point de départ qui démarre Angular
│   └── styles.css       ← les styles globaux (appliqués partout)
├── angular.json         ← configuration du projet pour le CLI
├── package.json         ← la liste des dépendances et des scripts
└── tsconfig.json        ← configuration de TypeScript
```

> ⚠️ **Note importante sur les noms de fichiers** : selon ta version d'Angular, les fichiers générés s'appellent soit `app.ts` / `app.html` / `app.css` avec une classe `App` (versions récentes), soit `app.component.ts` / `app.component.html` / `app.component.css` avec une classe `AppComponent` (versions un peu plus anciennes). **C'est exactement la même chose**, seule la convention de nommage a changé. Dans ce guide j'utilise les noms courts ; adapte si besoin.

Trois fichiers méritent qu'on s'y arrête :

**`src/index.html`** — Ouvre-le. Son `<body>` contient essentiellement ceci :

```html
<body>
  <app-root></app-root>
</body>
```

`<app-root>` n'est pas une balise HTML standard : c'est le **composant racine** de ton application. Toute ton app va « pousser » à l'intérieur de cette balise. On voit ici la promesse de la SPA : une seule page HTML, et Angular fait le reste.

**`src/main.ts`** — C'est le point d'entrée : il dit à Angular « démarre l'application avec le composant `App` et la configuration `appConfig` ». Tu n'auras quasiment jamais à le modifier.

**`src/styles.css`** — Les styles écrits ici s'appliquent à **toute** l'application. Utile pour définir la police, les couleurs de base, un reset CSS...

---

## 6. Les composants : le cœur d'Angular

Voici LE concept central. Retiens cette phrase : **une application Angular est un assemblage de composants**.

Un **composant**, c'est un morceau d'interface autonome et réutilisable : un bouton, une carte produit, une barre de navigation, une page entière... Chaque composant regroupe trois choses : sa **logique** (TypeScript), son **affichage** (HTML) et son **style** (CSS).

Imagine la page d'un site e-commerce. Plutôt qu'un énorme fichier HTML, on la découpe en briques de Lego :

```
App (composant racine)
├── EnTete            (le bandeau du haut)
├── ListeProduits
│   ├── CarteProduit  (réutilisée pour chaque produit !)
│   ├── CarteProduit
│   └── CarteProduit
└── PiedDePage
```

Chaque brique est indépendante, testable, et réutilisable. `CarteProduit` est écrite **une fois** et affichée autant de fois que nécessaire.

### Anatomie d'un composant

Un composant, c'est une **classe TypeScript** décorée par `@Component`. Regardons un exemple complet et décortiquons-le :

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-bonjour',              // 1
  template: `<h1>Bonjour tout le monde !</h1>`, // 2
  styles: `h1 { color: rebeccapurple; }`,       // 3
})
export class Bonjour {                  // 4
  // la logique du composant vivra ici
}
```

1. **`selector`** : le nom de la « balise HTML personnalisée » qui représente ce composant. Ici, écrire `<app-bonjour />` quelque part affichera ce composant. Par convention, on préfixe par `app-`.
2. **`template`** : le HTML du composant. Ici il est écrit « inline » (directement dans le fichier). Pour un HTML plus long, on utilise plutôt `templateUrl: './bonjour.html'` pour le mettre dans un fichier séparé.
3. **`styles`** : le CSS du composant (ou `styleUrl: './bonjour.css'` pour un fichier séparé). Détail génial : ce CSS est **encapsulé**, il ne s'applique QU'À ce composant. Ton `h1 { color: ... }` ne colorera pas les `h1` des autres composants. Fini les conflits CSS !
4. **La classe** : c'est ici qu'on mettra les données et les fonctions du composant.

Le `@Component({...})` s'appelle un **décorateur** : c'est une étiquette posée sur la classe qui dit à Angular « ceci est un composant, et voici ses caractéristiques ». Sans lui, ta classe serait une classe TypeScript ordinaire.

### On nettoie et on crée notre premier composant

**Étape 1** — Fais place nette. Ouvre `src/app/app.html`, supprime tout son contenu et remplace-le par :

```html
<h1>Ma première app Angular 🚀</h1>
```

Ouvre aussi `src/app/app.ts` : si le tableau `imports: [...]` du décorateur contient `RouterOutlet`, retire-le (ainsi que sa ligne `import` en haut du fichier), puisqu'on ne l'utilise plus dans le template. On le remettra au chapitre sur le routeur. Ton fichier doit ressembler à :

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
```

Sauvegarde : le navigateur affiche ton titre.

**Étape 2** — Génère un composant avec le CLI :

```bash
ng generate component carte-profil
```

(ou la version courte : `ng g c carte-profil`)

Le CLI crée un dossier `src/app/carte-profil/` contenant :

- `carte-profil.ts` — la classe et le décorateur ;
- `carte-profil.html` — le template ;
- `carte-profil.css` — le style ;
- `carte-profil.spec.ts` — un fichier de **test automatisé**. Ignore-le pour l'instant, il ne gêne pas.

Ouvre `carte-profil.ts` :

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-carte-profil',
  imports: [],
  templateUrl: './carte-profil.html',
  styleUrl: './carte-profil.css',
})
export class CarteProfil {}
```

**Étape 3** — Utilise ce composant dans `App`. Il y a **deux choses à faire**, et l'oubli de la première est l'erreur n°1 du débutant :

D'abord, déclarer dans `app.ts` que `App` utilise `CarteProfil`, via le tableau `imports` :

```ts
import { Component } from '@angular/core';
import { CarteProfil } from './carte-profil/carte-profil';

@Component({
  selector: 'app-root',
  imports: [CarteProfil],   // ← on déclare ce qu'on utilise dans le template
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
```

Ensuite, placer la balise dans `app.html` :

```html
<h1>Ma première app Angular 🚀</h1>
<app-carte-profil />
```

Sauvegarde : le texte « carte-profil works! » (généré par défaut) apparaît. Ton composant est vivant ! Modifie `carte-profil.html` pour t'approprier son contenu.

> 💡 **Pourquoi ce tableau `imports` ?** Chaque composant est autonome (« standalone ») et doit déclarer explicitement tout ce qu'il utilise dans son template : d'autres composants, des pipes, des modules de formulaire... Ça rend les dépendances visibles d'un coup d'œil. Si tu oublies, Angular te dira que `app-carte-profil` « is not a known element » — on en reparle au chapitre 17.

---

## 7. Afficher des données : l'interpolation `{{ }}`

Jusqu'ici notre HTML est statique. Le but d'Angular, c'est d'afficher des **données** qui vivent dans la classe TypeScript. Le pont le plus simple entre la classe et le template s'appelle **l'interpolation** : les doubles accolades `{{ }}`.

Dans `carte-profil.ts`, ajoute des propriétés à la classe :

```ts
export class CarteProfil {
  prenom = 'Léa';
  metier = 'Développeuse web';
  age = 28;
}
```

Et dans `carte-profil.html` :

```html
<h2>{{ prenom }}</h2>
<p>{{ metier }} — {{ age }} ans</p>
<p>Dans 10 ans, {{ prenom }} aura {{ age + 10 }} ans.</p>
```

Angular remplace `{{ prenom }}` par la valeur de la propriété `prenom` de la classe. Comme tu le vois avec `{{ age + 10 }}`, on peut mettre une **expression** entre les accolades : un calcul, une concaténation, un appel de méthode (`{{ direBonjour() }}`), une ternaire (`{{ age >= 18 ? 'majeur' : 'mineur' }}`)...

En revanche, on ne peut pas y mettre d'**instructions** : pas de `if`, pas de boucle, pas d'affectation (`=`). Le template doit rester de l'affichage ; la logique complexe vit dans la classe.

---

## 8. La liaison de propriétés `[ ]`

L'interpolation insère du **texte**. Mais comment rendre dynamique un **attribut** HTML, comme le `src` d'une image ou le `disabled` d'un bouton ? Avec la **liaison de propriété** (*property binding*) : on entoure l'attribut de crochets `[ ]`.

```ts
export class CarteProfil {
  prenom = 'Léa';
  photoUrl = 'https://i.pravatar.cc/150?img=5';
  boutonDesactive = true;
}
```

```html
<img [src]="photoUrl" [alt]="'Photo de ' + prenom" />
<button [disabled]="boutonDesactive">Envoyer un message</button>
```

À retenir : **les crochets font que la valeur entre guillemets est interprétée comme du TypeScript**, pas comme du texte brut.

- `<img src="photoUrl">` → le navigateur cherche littéralement un fichier nommé « photoUrl ». ❌
- `<img [src]="photoUrl">` → Angular évalue la propriété `photoUrl` de la classe et injecte sa valeur. ✅

Un cas particulier très pratique, la **liaison de classe CSS** :

```html
<p [class.important]="estUrgent">Message</p>
```

La classe CSS `important` sera ajoutée à la balise `<p>` si `estUrgent` vaut `true`, et retirée sinon. On s'en servira dans le projet final pour barrer les tâches terminées.

---

## 9. Réagir aux clics : les événements `( )` et les signaux

On sait envoyer des données de la classe vers le template. Faisons le chemin inverse : quand l'utilisateur **agit** (clic, saisie clavier...), on veut exécuter du code. C'est la **liaison d'événement** : des parenthèses `( )` autour du nom de l'événement.

```html
<button (click)="direBonjour()">Clique-moi</button>
```

```ts
export class CarteProfil {
  direBonjour() {
    console.log('Bonjour !'); // visible dans la console du navigateur (F12)
  }
}
```

À chaque clic, Angular appelle la méthode `direBonjour()`. Il existe plein d'événements : `(input)` quand on tape dans un champ, `(change)`, `(mouseover)`, `(keyup.enter)` quand on presse Entrée, etc.

### Le vrai sujet : l'état qui change → les signaux

Un `console.log`, c'est bien, mais on veut surtout **modifier des données et voir l'affichage se mettre à jour**. Pour ça, la méthode moderne et recommandée d'Angular, ce sont les **signaux** (*signals*).

Un **signal**, c'est une **boîte qui contient une valeur**, avec un super-pouvoir : Angular sait exactement **qui lit cette boîte**, et quand la valeur change, il met à jour automatiquement tous les endroits de l'écran qui l'affichent. C'est ça, la « réactivité ».

Créons un composant compteur (`ng g c compteur`, puis ajoute-le aux `imports` de `App` et place `<app-compteur />` dans `app.html`) :

```ts
import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-compteur',
  templateUrl: './compteur.html',
  styleUrl: './compteur.css',
})
export class Compteur {
  // signal(0) crée la boîte avec la valeur initiale 0
  compteur = signal(0);

  // computed = un signal calculé à partir d'autres signaux,
  // recalculé automatiquement quand compteur change
  double = computed(() => this.compteur() * 2);

  incrementer() {
    // update : nouvelle valeur calculée à partir de l'ancienne
    this.compteur.update(valeur => valeur + 1);
  }

  remettreAZero() {
    // set : on remplace carrément la valeur
    this.compteur.set(0);
  }
}
```

```html
<p>Compteur : {{ compteur() }}</p>
<p>Le double : {{ double() }}</p>

<button (click)="incrementer()" [disabled]="compteur() >= 10">+1 (max 10)</button>
<button (click)="remettreAZero()">Remettre à zéro</button>
```

Les trois règles d'or des signaux :

1. **Lire** la valeur = appeler le signal comme une fonction : `compteur()`. Les parenthèses « ouvrent la boîte ». C'est vrai dans le template comme dans la classe. Oublier les `()` est une erreur ultra-classique (chapitre 17 !).
2. **Écrire** = `monSignal.set(nouvelleValeur)` ou `monSignal.update(ancienne => nouvelle)`.
3. **Dériver** = `computed(() => ...)` crée une valeur calculée qui se tient à jour toute seule.

Remarque comme tout se connecte : le bouton `+1` combine un événement `(click)` et une liaison de propriété `[disabled]` qui dépend du signal. Clique 10 fois : le bouton se désactive tout seul. Tu n'as écrit **aucun** code pour rafraîchir l'affichage — Angular observe le signal et s'en charge.

> 💡 **Dans les anciens tutoriels**, tu verras des propriétés simples modifiées directement (`this.compteur++`). Ça fonctionne encore dans beaucoup de cas, mais les signaux sont la voie officielle moderne : plus prévisibles et plus performants. Prends le réflexe signal dès le début.

---

## 10. La liaison bidirectionnelle `[(ngModel)]`

Cas hyper courant : un champ de saisie dont la valeur doit être **synchronisée dans les deux sens** avec une donnée de la classe. Je tape → la donnée change ; la donnée change → le champ s'actualise. C'est la **liaison bidirectionnelle** (*two-way binding*), avec la syntaxe `[(ngModel)]`.

Moyen mnémotechnique célèbre : la **« banane dans une boîte »** 🍌📦 — `[( )]` : des parenthèses (événement) dans des crochets (propriété). Logique, puisque c'est la combinaison des deux !

```ts
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-salutation',
  imports: [FormsModule],   // ⚠️ indispensable pour ngModel !
  template: `
    <input [(ngModel)]="prenom" placeholder="Ton prénom" />
    <p>Bonjour {{ prenom() }} !</p>
  `,
})
export class Salutation {
  prenom = signal('');
}
```

Tape dans le champ : le paragraphe se met à jour **à chaque frappe**. Magique, mais pas magique : `[(ngModel)]="prenom"` est en réalité un raccourci pour « lie la valeur du champ au signal, ET à chaque saisie, mets à jour le signal ».

> ⚠️ `ngModel` vient du module de formulaires d'Angular : il faut **importer `FormsModule`** dans le tableau `imports` du composant. L'oublier provoque l'erreur *« Can't bind to 'ngModel' since it isn't a known property of 'input' »* — probablement l'erreur la plus vue de toute l'histoire d'Angular. 😄

---

## 11. Conditions et boucles : `@if` et `@for`

Un template réaliste doit pouvoir dire « affiche ceci **si**... » et « affiche un élément **pour chaque**... ». Angular fournit une syntaxe dédiée directement dans le HTML : les blocs `@if` et `@for`.

### `@if` / `@else` — afficher sous condition

```ts
export class Accueil {
  estConnecte = signal(false);

  basculerConnexion() {
    this.estConnecte.update(v => !v);
  }
}
```

```html
@if (estConnecte()) {
  <p>Content de te revoir ! 👋</p>
  <button (click)="basculerConnexion()">Se déconnecter</button>
} @else {
  <p>Bienvenue, visiteur.</p>
  <button (click)="basculerConnexion()">Se connecter</button>
}
```

Important : `@if` n'affiche/masque pas avec du CSS, il **ajoute ou retire réellement les éléments du DOM**. Un `@else if (...)` est aussi disponible pour enchaîner les cas.

### `@for` — répéter pour chaque élément

```ts
export class ListeCourses {
  courses = signal(['Pain', 'Lait', 'Œufs', 'Café']);
}
```

```html
<ul>
  @for (article of courses(); track article) {
    <li>{{ article }}</li>
  } @empty {
    <li>La liste est vide, va faire les courses !</li>
  }
</ul>
```

Décryptage :

- `article of courses()` : à chaque tour de boucle, `article` prend la valeur d'un élément du tableau (comme un `for...of` JavaScript).
- **`track article`** : obligatoire. Tu donnes à Angular un moyen d'**identifier chaque élément de façon unique**. Quand la liste change, Angular s'en sert pour ne recréer que ce qui a vraiment changé au lieu de tout redessiner → grosses économies de performance. Pour des chaînes uniques, l'élément lui-même suffit ; pour des objets, on utilise leur identifiant : `track tache.id`. En dépannage, `track $index` (la position) fonctionne aussi.
- `@empty` (optionnel) : ce qui s'affiche si le tableau est vide. Élégant, non ?

> 💡 **Dans les anciens tutoriels**, tu verras `*ngIf` et `*ngFor` : c'est l'ancienne syntaxe pour exactement la même chose. Elle fonctionne toujours, mais `@if` / `@for` sont plus lisibles, plus rapides, et n'exigent aucun import. Sache juste les reconnaître.

---

## 12. Les pipes : formater l'affichage

Un **pipe** (« tuyau ») transforme une valeur **au moment de l'afficher**, sans modifier la donnée d'origine. La syntaxe utilise la barre verticale `|` :

```ts
import { Component } from '@angular/core';
import { UpperCasePipe, DatePipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-demo-pipes',
  imports: [UpperCasePipe, DatePipe, CurrencyPipe], // les pipes s'importent aussi !
  template: `
    <p>{{ 'angular' | uppercase }}</p>
    <p>{{ aujourdHui | date:'dd/MM/yyyy' }}</p>
    <p>{{ prix | currency:'EUR' }}</p>
  `,
})
export class DemoPipes {
  aujourdHui = new Date();
  prix = 19.9;
}
```

Résultat affiché :

```
ANGULAR
05/07/2026
€19.90
```

Ce qui suit les `:` sont des **paramètres** du pipe (le format de date, la devise...). Angular fournit une belle collection : `date`, `uppercase`, `lowercase`, `currency`, `number`, `percent`, `json` (très pratique pour déboguer un objet)... et tu pourras créer les tiens plus tard.

---

## 13. Les services : partager des données entre composants

### Le problème

Imagine un site e-commerce : un composant `Boutique` ajoute des articles au panier, et un composant `EnTete` (à l'autre bout de la page) affiche le nombre d'articles. Ces deux composants n'ont aucun lien direct. Où ranger la donnée « panier » pour qu'ils la partagent ?

Réponse d'Angular : dans un **service**. Un service est une classe qui contient des **données et de la logique partagées**, indépendantes de tout affichage. La philosophie : le composant s'occupe de **montrer**, le service s'occupe de **savoir et de faire**.

### Créer un service

```bash
ng generate service panier
```

(ou `ng g s panier` — le fichier généré s'appelle `panier.ts` ou `panier.service.ts` selon ta version, peu importe)

```ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PanierService {
  articles = signal<string[]>([]);

  ajouter(article: string) {
    this.articles.update(liste => [...liste, article]);
  }
}
```

Deux points à comprendre :

- **`@Injectable({ providedIn: 'root' })`** : ce décorateur dit à Angular « ce service existe en **un seul exemplaire** (*singleton*) pour toute l'application ». Tous les composants qui le demandent reçoivent **la même instance**, donc les mêmes données. C'est exactement ce qu'on veut pour partager un état.
- **`[...liste, article]`** : on ne fait pas `liste.push(article)`. On crée un **nouveau tableau** contenant l'ancien contenu (`...liste`, l'opérateur *spread*) plus le nouvel article. Pourquoi ? Parce que les signaux détectent un changement quand la **référence** change. Si tu modifies le tableau existant avec `push`, la boîte contient « le même » tableau et rien ne se met à jour à l'écran. Règle d'or : **avec les signaux, on remplace, on ne mutile pas.**

### Utiliser le service : l'injection de dépendances

Comment un composant obtient-il le service ? Surtout **pas** avec `new PanierService()` (tu créerais ta propre copie isolée !). On le **demande à Angular** avec la fonction `inject()` :

```ts
import { Component, inject } from '@angular/core';
import { PanierService } from '../panier';

@Component({
  selector: 'app-boutique',
  template: `
    <button (click)="panier.ajouter('Clavier')">Ajouter un clavier</button>
    <button (click)="panier.ajouter('Souris')">Ajouter une souris</button>
  `,
})
export class Boutique {
  panier = inject(PanierService);
}
```

```ts
import { Component, inject } from '@angular/core';
import { PanierService } from '../panier';

@Component({
  selector: 'app-en-tete',
  template: `<p>🛒 Panier : {{ panier.articles().length }} article(s)</p>`,
})
export class EnTete {
  panier = inject(PanierService);
}
```

Place `<app-en-tete />` et `<app-boutique />` dans `app.html` (sans oublier les `imports` de `App` !). Clique sur les boutons de la boutique : le compteur de l'en-tête se met à jour instantanément, alors que les deux composants ne se connaissent pas. Le service est leur point de rencontre, et le signal propage le changement. ✨

Ce mécanisme s'appelle **l'injection de dépendances** (*dependency injection*, DI) : au lieu de fabriquer toi-même les objets dont tu dépends, tu les déclares, et Angular te les fournit. Comme au restaurant : tu commandes un plat, tu ne vas pas le cuisiner en cuisine. C'est l'un des piliers d'Angular — tu l'utiliseras pour les services, le client HTTP, le routeur...

> 💡 **Dans les anciens tutoriels**, l'injection se fait via le constructeur : `constructor(private panier: PanierService) {}`. C'est équivalent ; `inject()` est simplement le style moderne.

### Au fait, et la communication parent → enfant ?

Le service est parfait pour des composants éloignés. Pour un parent qui passe une donnée directement à son enfant, Angular propose `input()` (le parent transmet une valeur : `<app-carte [nom]="'Léa'" />`) et `output()` (l'enfant émet un événement vers le parent). Tu croiseras aussi leurs ancêtres `@Input()` et `@Output()`. Garde ces mots-clés en tête pour ta prochaine étape d'apprentissage — dans ce guide, le service + signaux nous suffira largement.

---

## 14. Naviguer entre les pages : le routeur

Notre SPA n'a qu'une seule vraie page HTML... mais l'utilisateur, lui, veut « changer de page » : accueil, contact, profil... Le **routeur** d'Angular fait correspondre une **URL** à un **composant** : quand l'URL change, il remplace le composant affiché — sans jamais recharger la page.

**Étape 1** — Crée deux composants-pages :

```bash
ng g c accueil
ng g c contact
```

**Étape 2** — Déclare les routes dans `src/app/app.routes.ts` :

```ts
import { Routes } from '@angular/router';
import { Accueil } from './accueil/accueil';
import { Contact } from './contact/contact';

export const routes: Routes = [
  { path: '', component: Accueil },       // URL racine → page d'accueil
  { path: 'contact', component: Contact }, // /contact → page contact
  { path: '**', redirectTo: '' },          // toute URL inconnue → retour accueil
];
```

Chaque route dit : « quand l'URL correspond à ce `path`, affiche ce `component` ». Le `'**'` est un joker qui attrape toutes les URL non reconnues (l'équivalent d'une page 404).

Ce fichier est déjà branché : si tu ouvres `app.config.ts`, tu verras `provideRouter(routes)` dans les providers. C'est le CLI qui l'a fait pour toi à la création du projet.

**Étape 3** — Dis OÙ afficher les pages, avec `<router-outlet />` dans `app.html` :

```html
<nav>
  <a routerLink="/">Accueil</a> |
  <a routerLink="/contact">Contact</a>
</nav>

<router-outlet />
```

Et dans `app.ts`, importe ce dont le template a besoin :

```ts
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
```

Décryptage :

- **`<router-outlet />`** est l'emplacement réservé : « routeur, affiche ici le composant correspondant à l'URL actuelle ». Le menu `<nav>` au-dessus, lui, reste affiché en permanence — pratique pour un en-tête commun à toutes les pages.
- **`routerLink`** remplace le `href` classique. Un `href` demanderait une nouvelle page au serveur (rechargement complet 😱) ; `routerLink` laisse le routeur intercepter le clic, changer l'URL et échanger le composant. Fais le test : clique sur les liens et observe que la page ne clignote jamais. C'est ça, une SPA.

Pour plus tard, sache que les routes peuvent contenir des **paramètres** : `{ path: 'produit/:id', ... }` permet d'avoir `/produit/42`, `/produit/43`... avec un seul composant qui lit l'`id`. Indispensable dès que tu afficheras des fiches détail.

---

## 15. Parler à un serveur : HttpClient

Une vraie application ne stocke pas ses données dans le code : elle les demande à un **serveur** via une **API**, généralement au format JSON. Angular fournit pour ça le service `HttpClient`.

**Étape 1** — Active le client HTTP dans `src/app/app.config.ts` en ajoutant `provideHttpClient()` :

```ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),   // ← la ligne à ajouter
  ],
};
```

(Ton fichier peut contenir d'autres providers générés par le CLI — laisse-les, ajoute simplement celui-ci.)

**Étape 2** — Utilise-le dans un composant. On va appeler [JSONPlaceholder](https://jsonplaceholder.typicode.com), une fausse API publique parfaite pour s'entraîner :

```ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// On décrit la forme des données que l'API renvoie
interface Utilisateur {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-liste-utilisateurs',
  template: `
    <h2>Utilisateurs</h2>

    @if (chargement()) {
      <p>Chargement…</p>
    } @else {
      <ul>
        @for (u of utilisateurs(); track u.id) {
          <li>{{ u.name }} — {{ u.email }}</li>
        }
      </ul>
    }
  `,
})
export class ListeUtilisateurs implements OnInit {
  private http = inject(HttpClient);   // encore l'injection de dépendances !

  utilisateurs = signal<Utilisateur[]>([]);
  chargement = signal(true);

  ngOnInit() {
    this.http
      .get<Utilisateur[]>('https://jsonplaceholder.typicode.com/users')
      .subscribe(donnees => {
        this.utilisateurs.set(donnees);
        this.chargement.set(false);
      });
  }
}
```

Trois nouveautés à digérer calmement :

1. **`ngOnInit`** : Angular appelle automatiquement certaines méthodes à des moments précis de la vie d'un composant (on parle de *cycle de vie*). `ngOnInit` est appelée juste après la création du composant — c'est l'endroit conventionnel pour charger des données. Le `implements OnInit` demande à TypeScript de vérifier que la méthode existe bien.
2. **`.get<Utilisateur[]>(url)`** : on précise entre chevrons le type de la réponse attendue. TypeScript connaît alors la forme des données, et t'autocomplète `u.name`, `u.email`...
3. **`.subscribe(...)`** : une requête HTTP prend du temps (le réseau !). `get()` renvoie donc un **Observable** — pense-y comme à « une promesse de données futures ». `subscribe` signifie : « quand la réponse arrivera, exécute cette fonction ». Ici, on range les données dans le signal et on coupe l'indicateur de chargement. Les Observables (bibliothèque RxJS) sont un gros sujet à part entière ; à ton niveau, retiens simplement le duo `get` + `subscribe`.

Note aussi le pattern très courant du **signal `chargement`** : `true` au départ, l'utilisateur voit « Chargement… », puis la liste apparaît quand les données sont là. Toutes les applications du monde font ça.

---

## 16. Mini-projet final : une liste de tâches complète

L'heure de vérité : on assemble **tout ce qu'on a vu** dans une petite application de gestion de tâches. Ajout, coche, suppression, compteur de tâches restantes. Chaque ligne de code ci-dessous correspond à un chapitre du guide — je te les rappelle au passage.

Tu peux repartir d'un projet propre (`ng new todo-app`) ou continuer dans le projet actuel. Voici l'arborescence visée dans `src/app/` :

```
src/app/
├── tache.ts              ← l'interface (la forme d'une tâche)
├── taches.service.ts     ← le service (les données + la logique)
└── todo/
    ├── todo.ts           ← le composant (l'affichage + les interactions)
    ├── todo.html
    └── todo.css
```

Crée les fichiers à la main dans VS Code, ou via `ng g s taches` et `ng g c todo` puis remplace leur contenu (si le CLI nomme les fichiers un peu différemment selon ta version, adapte simplement les chemins d'import — VS Code te les proposera d'ailleurs automatiquement).

### 1️⃣ L'interface — `tache.ts` (chapitre 2)

```ts
export interface Tache {
  id: number;
  titre: string;
  terminee: boolean;
}
```

On décrit la forme d'une tâche : un identifiant unique, un titre, et un booléen « fait / pas fait ». Le `export` permet de l'importer ailleurs.

### 2️⃣ Le service — `taches.service.ts` (chapitres 9 et 13)

```ts
import { Injectable, signal } from '@angular/core';
import { Tache } from './tache';

@Injectable({ providedIn: 'root' })
export class TachesService {
  private prochainId = 1;

  // Le signal privé : seul le service a le droit de le modifier
  private readonly _taches = signal<Tache[]>([]);

  // La version publique en lecture seule, exposée aux composants
  readonly taches = this._taches.asReadonly();

  ajouter(titre: string) {
    this._taches.update(liste => [
      ...liste,
      { id: this.prochainId++, titre, terminee: false },
    ]);
  }

  basculer(id: number) {
    this._taches.update(liste =>
      liste.map(t => (t.id === id ? { ...t, terminee: !t.terminee } : t))
    );
  }

  supprimer(id: number) {
    this._taches.update(liste => liste.filter(t => t.id !== id));
  }
}
```

Toute la logique métier est ici, et **nulle part ailleurs**. Observe la discipline d'immutabilité (chapitre 13) : `ajouter` recrée un tableau avec le *spread*, `basculer` utilise `map` pour remplacer uniquement la tâche visée par une copie modifiée (`{ ...t, terminee: !t.terminee }`), `supprimer` utilise `filter` pour recréer la liste sans l'élément. Jamais de `push`, jamais de modification directe : les signaux adorent.

Petit raffinement au passage : le signal réel est `private`, et on expose `asReadonly()`. Les composants peuvent **lire** les tâches, mais seul le service peut les **modifier**, via ses méthodes. Ton futur toi te remerciera pour cette rigueur.

### 3️⃣ Le composant — `todo/todo.ts` (chapitres 6, 9, 10, 13)

```ts
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TachesService } from '../taches.service';

@Component({
  selector: 'app-todo',
  imports: [FormsModule],          // pour [(ngModel)]
  templateUrl: './todo.html',
  styleUrl: './todo.css',
})
export class Todo {
  private tachesService = inject(TachesService);  // injection de dépendances

  taches = this.tachesService.taches;             // on relaie le signal du service
  nouvelleTache = signal('');                     // le contenu du champ de saisie

  // computed : recalculé automatiquement dès que la liste change
  restantes = computed(() => this.taches().filter(t => !t.terminee).length);

  ajouter() {
    const titre = this.nouvelleTache().trim();
    if (titre === '') return;          // pas de tâche vide !
    this.tachesService.ajouter(titre);
    this.nouvelleTache.set('');        // on vide le champ
  }

  basculer(id: number) {
    this.tachesService.basculer(id);
  }

  supprimer(id: number) {
    this.tachesService.supprimer(id);
  }
}
```

Remarque la répartition des rôles : le composant ne « sait » rien faire lui-même, il **délègue** tout au service et se contente de piloter l'affichage. C'est l'architecture propre par excellence.

### 4️⃣ Le template — `todo/todo.html` (chapitres 7, 8, 9, 10, 11)

```html
<main class="todo">
  <h1>📝 Mes tâches</h1>

  <p class="compteur">
    @if (restantes() === 0) {
      Tout est fait, bravo ! 🎉
    } @else {
      Il te reste {{ restantes() }} tâche(s) à faire.
    }
  </p>

  <div class="formulaire">
    <input
      [(ngModel)]="nouvelleTache"
      placeholder="Qu'as-tu à faire ?"
      (keyup.enter)="ajouter()"
    />
    <button (click)="ajouter()" [disabled]="nouvelleTache().trim() === ''">
      Ajouter
    </button>
  </div>

  <ul>
    @for (tache of taches(); track tache.id) {
      <li>
        <input
          type="checkbox"
          [checked]="tache.terminee"
          (change)="basculer(tache.id)"
        />
        <span [class.terminee]="tache.terminee">{{ tache.titre }}</span>
        <button class="supprimer" (click)="supprimer(tache.id)">✕</button>
      </li>
    } @empty {
      <li class="vide">Aucune tâche pour le moment. Ajoute-en une !</li>
    }
  </ul>
</main>
```

Fais l'inventaire, tout y est : interpolation (`{{ tache.titre }}`), liaison de propriété (`[checked]`, `[disabled]`), liaison de classe (`[class.terminee]`), événements (`(click)`, `(change)`, `(keyup.enter)` pour valider avec Entrée), banane dans la boîte (`[(ngModel)]`), condition (`@if/@else`), boucle (`@for` avec `track tache.id` et `@empty`). Un vrai best-of du guide.

### 5️⃣ Le style — `todo/todo.css`

```css
.todo {
  max-width: 480px;
  margin: 40px auto;
  font-family: system-ui, sans-serif;
}

.compteur {
  color: #666;
}

.formulaire {
  display: flex;
  gap: 8px;
}

.formulaire input {
  flex: 1;
  padding: 8px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.terminee {
  text-decoration: line-through;
  color: #999;
}

.supprimer {
  margin-left: auto;
  border: none;
  background: none;
  cursor: pointer;
  color: #c00;
}

.vide {
  color: #999;
  font-style: italic;
}
```

Grâce à l'encapsulation (chapitre 6), ces styles ne toucheront que ce composant.

### 6️⃣ Branchement final — `app.ts` et `app.html`

```ts
import { Component } from '@angular/core';
import { Todo } from './todo/todo';

@Component({
  selector: 'app-root',
  imports: [Todo],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
```

```html
<app-todo />
```

Lance `ng serve`, ouvre http://localhost:4200 et... joue avec ton application. Ajoute des tâches (bouton ou touche Entrée), coche-les (elles se barrent), supprime-les, et regarde le compteur se tenir à jour tout seul. **Tu viens de construire une application Angular complète en comprenant chaque ligne.** 👏

### 🏆 Des défis pour consolider

Essaie d'ajouter, dans l'ordre de difficulté :

1. Un bouton « Tout supprimer » (une méthode de plus dans le service).
2. Un `computed` supplémentaire affichant le nombre de tâches terminées.
3. Trois boutons de filtre « Toutes / À faire / Terminées » (indice : un signal `filtre` + un `computed` qui renvoie la liste filtrée à afficher).
4. Une page « Statistiques » accessible via le routeur (chapitre 14).

Si tu y arrives, tu as vraiment compris. Si tu bloques, c'est normal : relis le chapitre concerné, c'est comme ça qu'on ancre les choses.

---

## 17. Les erreurs classiques du débutant (et comment les corriger)

Tu VAS rencontrer ces erreurs. Tout le monde les rencontre. Autant les reconnaître du premier coup d'œil.

### « 'app-xxx' is not a known element » (NG8001)

Tu utilises `<app-carte-profil />` dans un template, mais tu as oublié d'ajouter `CarteProfil` dans le tableau **`imports`** du composant qui l'utilise. Ajoute-le (et son `import { ... } from ...` en haut du fichier). C'est LE réflexe à acquérir : *je l'utilise dans le template → je le déclare dans `imports`*.

### « Can't bind to 'ngModel' since it isn't a known property of 'input' »

Tu utilises `[(ngModel)]` sans avoir importé **`FormsModule`** dans les `imports` du composant. Voir chapitre 10.

### Mon signal affiche n'importe quoi (ou rien)

Tu as écrit `{{ compteur }}` au lieu de `{{ compteur() }}`. Sans les parenthèses, tu affiches *la boîte* au lieu de *son contenu*. Angular émet d'ailleurs un avertissement pour te prévenir. Même chose dans le code TypeScript : `if (estConnecte)` est toujours vrai (une fonction existe !), il faut `if (estConnecte())`.

### La liste ne se met pas à jour quand j'ajoute un élément

Tu as probablement fait `this.maListe().push(element)` : tu modifies le tableau **à l'intérieur** de la boîte sans que la boîte le sache. Utilise `update` avec un nouveau tableau : `this.maListe.update(liste => [...liste, element])`. Relis la règle d'or du chapitre 13 : on remplace, on ne mutile pas.

### « @for loop must have a "track" expression »

Le `track` est obligatoire dans `@for`. Ajoute `track element.id` (objets avec identifiant), `track element` (valeurs uniques) ou `track $index` en dépannage.

### « ng : commande introuvable » / erreur de scripts PowerShell

Soit le CLI n'est pas installé (`npm install -g @angular/cli`), soit Windows bloque les scripts — la solution `Set-ExecutionPolicy` est au chapitre 3.

### « Port 4200 is already in use »

Un autre `ng serve` tourne déjà quelque part. Ferme-le, ou lance sur un autre port : `ng serve --port 4300`.

### Mes modifications n'apparaissent pas

Dans l'ordre : as-tu **sauvegardé** le fichier ? `ng serve` tourne-t-il toujours (regarde le terminal, il affiche les erreurs de compilation en rouge) ? Modifies-tu le **bon** fichier ? Ce trio résout 99 % des cas.

---

## 18. Antisèche et suite du voyage

### Les commandes CLI à connaître par cœur

```bash
ng new mon-app          # créer un projet
ng serve                # lancer le serveur de dev (http://localhost:4200)
ng generate component x # créer un composant (raccourci : ng g c x)
ng generate service x   # créer un service   (raccourci : ng g s x)
ng build                # construire la version optimisée pour la mise en ligne (dossier dist/)
ng version              # afficher les versions installées
```

### La syntaxe des templates en un clin d'œil

```
{{ expression }}       texte dynamique          (classe → affichage)
[propriete]="expr"     attribut dynamique       (classe → affichage)
(evenement)="methode()" réaction à une action   (affichage → classe)
[(ngModel)]="signal"   synchronisation 2 sens   (les deux ! 🍌📦)
@if / @else            condition
@for ... track ...     boucle
| pipe                 formatage à l'affichage
```

### Et ensuite ?

Tu as maintenant des fondations solides. Voici les sujets à explorer, dans un ordre raisonnable :

1. **`input()` et `output()`** : la communication directe parent ↔ enfant entre composants (évoquée au chapitre 13).
2. **Les routes paramétrées** (`/produit/:id`) et le service `Router` pour naviguer depuis le code.
3. **Les formulaires réactifs** (*Reactive Forms*) : la façon robuste de gérer les gros formulaires avec validation.
4. **`effect()`** : exécuter du code quand un signal change (parfait pour sauvegarder les tâches dans le `localStorage`, par exemple — excellent exercice sur le projet final !).
5. **RxJS et les Observables** : approfondir ce qu'on a effleuré avec `subscribe`.
6. **Le déploiement** : `ng build` puis hébergement du dossier `dist/` (Netlify, Vercel, Firebase Hosting...).

### Ressources recommandées

- **[angular.dev](https://angular.dev)** : la documentation officielle, moderne et excellente, avec un **tutoriel interactif dans le navigateur** (rubrique *Tutorials*) — rien à installer, parfait pour réviser.
- La rubrique **API Reference** du même site, ta future meilleure amie pour vérifier une syntaxe.
- Les communautés : le Discord officiel Angular et le subreddit r/Angular2 pour poser des questions.

---

Un dernier mot : Angular paraît gros au début, c'est normal — c'est un framework complet. Mais tu as vu que tout repose sur une poignée d'idées : des **composants** qui s'assemblent, des **signaux** qui rendent les données vivantes, des **liaisons** `{{ }}` `[ ]` `( )` qui connectent classe et template, et des **services** qui partagent. Le reste, ce sont des variations. Code, casse, corrige, recommence — c'est exactement comme ça que tous les développeurs Angular ont appris. Bon courage ! 🚀
