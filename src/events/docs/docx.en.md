# Events Module Documentation

This module provides only the generic EventEmitter; domain emitters are implemented by the app.

---

## Entry

Exported from `@/events`.

```ts
import type { EventCallback, EventNamesOf } from "@/events";

import { defineEvents, EventEmitter } from "@/events";
```

---

## 1. EventEmitter

Generic class: accepts a string union of event names `E`, provides `on` / `off` / `emit`.

### Constructor

**Signature:** `constructor(events: Record<string, E>)`

**Input:** `events` — key-value object of event names, e.g. `{ FOO: "DOMAIN:FOO", BAR: "DOMAIN:BAR" }`. Internally uses `Object.values(events)` to build the listener map. Pass the object directly (no `Object.values` at call site).

### on

**Signature:** `on(event: E, callback: EventCallback): void`

Adds the callback to the set of listeners for that event.

### off

**Signature:** `off(event: E, callback: EventCallback): void`

Removes the callback from the set of listeners for that event (same reference as passed to `on`).

### emit

**Signature:** `emit(event: E, ...args: unknown[]): void`

Synchronously invokes all registered callbacks for that event.

**Example (custom EventEmitter)**

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
emitter.off(events.FOO, callback);
```

**Example 2 (custom emitter with convenience methods, e.g. routerEvents + navigateTo...)**

Define navigation-related event names in `events`, add semantic methods in a subclass that call `emit` internally:

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

## 2. EventCallback type

`type EventCallback = (...args: unknown[]) => void` — callback type for `EventEmitter#on` / `off`.

---

## Type Reference

- `EventCallback`: `(...args: unknown[]) => void`
- `EventEmitter<E>`: generic event emitter; `E` is the string union of event names
- `DefinedEvents<T>`: type returned by defineEvents; EventEmitter constructor accepts only this type
- `EventNamesOf<T>`: derive event name union from an events object; supports DefinedEvents or Record<string, string>
- `defineEvents(events)`: create events object and return DefinedEvents<T>; one-level key-value (string values)

---

## Extending EventEmitter (when building domain emitters in the app)

1. Use `defineEvents({ ... })` to define and export the events object (one-level key-value, string values only).
2. Export type: `type MyEvent = EventNamesOf<typeof myEvents>` (or write `(typeof myEvents)[keyof typeof myEvents]` by hand).
3. Subclass: `class MyEventEmitter extends EventEmitter<MyEvent> { constructor() { super(myEvents); } }` (pass the key-value object directly).
4. For singleton: wrap with `singleton(MyEventEmitter)` and export `new SingletonClass()`.
