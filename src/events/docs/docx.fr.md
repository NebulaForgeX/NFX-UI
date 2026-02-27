# Documentation du module Events

Ce module fournit uniquement l’EventEmitter générique ; les émetteurs par domaine sont implémentés par l’application.

---

## Point d’entrée

Exporté depuis `@/events`.

```ts
import type { EventCallback, EventNamesOf } from "@/events";

import { defineEvents, EventEmitter } from "@/events";
```

---

## 1. EventEmitter

Classe générique : accepte une union de chaînes de noms d’événements `E`, fournit `on` / `off` / `emit`.

### Constructeur

**Signature**

```ts
constructor(events: Record<string, E>)
```

**Entrée**

| Paramètre | Type                | Description                                                                                                                                   |
| --------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `events`  | `Record<string, E>` | Objet key-value des noms d’événements, ex. `{ FOO: "DOMAIN:FOO", BAR: "DOMAIN:BAR" }`. En interne `Object.values(events)` construit la table. |

Passer l’objet directement (pas de `Object.values` au call site). Seuls ces noms peuvent être utilisés avec `on` / `off` / `emit`.

### on

**Signature**

```ts
on(event: E, callback: EventCallback): void
```

**Entrée**

| Paramètre  | Type            | Description                              |
| ---------- | --------------- | ---------------------------------------- |
| `event`    | `E`             | Nom de l’événement.                      |
| `callback` | `EventCallback` | Callback `(...args: unknown[]) => void`. |

Ajoute le callback à l’ensemble des écouteurs pour cet événement.

### off

**Signature**

```ts
off(event: E, callback: EventCallback): void
```

**Entrée**

| Paramètre  | Type            | Description                             |
| ---------- | --------------- | --------------------------------------- |
| `event`    | `E`             | Nom de l’événement.                     |
| `callback` | `EventCallback` | Même référence que celle passée à `on`. |

Retire le callback de l’ensemble des écouteurs pour cet événement.

### emit

**Signature**

```ts
emit(event: E, ...args: unknown[]): void
```

**Entrée**

| Paramètre | Type        | Description                         |
| --------- | ----------- | ----------------------------------- |
| `event`   | `E`         | Nom de l’événement.                 |
| `...args` | `unknown[]` | Arguments passés à chaque écouteur. |

Invoque de façon synchrone tous les callbacks enregistrés pour cet événement.

**Exemple (EventEmitter personnalisé)**

```ts
import type { EventNamesOf } from "@/events";

import { EventEmitter } from "@/events";

const events = defineEvents({ FOO: "MY:FOO", BAR: "MY:BAR" });
type MyEvent = EventNamesOf<typeof events>;

class MyEmitter extends EventEmitter<MyEvent> {
  constructor() {
    super(events);
  }
}

const emitter = new MyEmitter();
emitter.on(events.FOO, (msg: unknown) => console.log(msg));
emitter.emit(events.FOO, "hello");
// => affiche "hello"
emitter.off(events.FOO, callback);
```

**Exemple 2 (émetteur personnalisé avec méthodes de commodité, ex. routerEvents + navigateTo...)**

Définir les noms d’événements de navigation dans `events`, ajouter des méthodes sémantiques dans une sous-classe qui appellent `emit` en interne :

```ts
import type { EventNamesOf } from "@/events";

import { defineEvents, EventEmitter } from "@/events";

export const routerEvents = defineEvents({
  NAVIGATE: "ROUTER:NAVIGATE",
  NAVIGATE_REPLACE: "ROUTER:NAVIGATE_REPLACE",
  NAVIGATE_BACK: "ROUTER:NAVIGATE_BACK",
  NAVIGATE_TO_LOGIN: "ROUTER:NAVIGATE_TO_LOGIN",
  NAVIGATE_TO_DASHBOARD: "ROUTER:NAVIGATE_TO_DASHBOARD",
  NAVIGATE_TO_HOME: "ROUTER:NAVIGATE_TO_HOME",
});

export type RouterEvent = EventNamesOf<typeof routerEvents>;

interface NavigatePayload {
  to: string;
  replace?: boolean;
  state?: unknown;
}

class RouterEventEmitter extends EventEmitter<RouterEvent> {
  constructor() {
    super(routerEvents);
  }

  navigate(payload: NavigatePayload) {
    this.emit(routerEvents.NAVIGATE, payload);
  }

  navigateReplace(to: string, state?: unknown) {
    this.emit(routerEvents.NAVIGATE_REPLACE, { to, state });
  }

  navigateBack() {
    this.emit(routerEvents.NAVIGATE_BACK);
  }

  navigateToLogin() {
    this.emit(routerEvents.NAVIGATE_TO_LOGIN);
  }

  navigateToDashboard() {
    this.emit(routerEvents.NAVIGATE_TO_DASHBOARD);
  }

  navigateToHome() {
    this.emit(routerEvents.NAVIGATE_TO_HOME);
  }
}

const routerEmitter = new RouterEventEmitter();
routerEmitter.on(routerEvents.NAVIGATE, (payload) => console.log("navigate", payload));
routerEmitter.navigate({ to: "/dashboard", replace: true });

routerEmitter.on(routerEvents.NAVIGATE_TO_LOGIN, () => (window.location.href = "/login"));
routerEmitter.navigateToLogin();
```

---

## 2. Type EventCallback

```ts
type EventCallback = (...args: unknown[]) => void;
```

Type du callback pour `EventEmitter#on` / `off`.

---

## Référence des types

| Type                   | Description                                                                                   |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| `EventCallback`        | `(...args: unknown[]) => void` ; utilisé avec `on` / `off`.                                   |
| `EventEmitter<E>`      | Émetteur d’événements générique ; `E` est l’union de chaînes des noms d’événements.           |
| `DefinedEvents<T>`     | Type renvoyé par defineEvents ; le constructeur de EventEmitter n’accepte que ce type.        |
| `EventNamesOf<T>`      | Dérive l’union des noms d’événements ; supporte DefinedEvents ou Record<string, string>.      |
| `defineEvents(events)` | Crée l’objet d’événements et renvoie DefinedEvents<T> ; un niveau key-value (valeurs string). |

---

## Étendre EventEmitter (pour des émetteurs par domaine dans l’app)

1. Utiliser `defineEvents({ ... })` pour définir et exporter l’objet d’événements (un niveau key-value, valeurs string uniquement).
2. Exporter le type : `type MyEvent = EventNamesOf<typeof myEvents>` (ou écrire à la main `(typeof myEvents)[keyof typeof myEvents]`).
3. Sous-classe : `class MyEventEmitter extends EventEmitter<MyEvent> { constructor() { super(myEvents); } }` (passer l’objet key-value directement).
4. Pour un singleton, envelopper avec `singleton(MyEventEmitter)` et exporter `new SingletonClass()`.
