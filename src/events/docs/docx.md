# Events 模块文档 / Events Module Documentation

本模块仅提供通用 EventEmitter；各域发射器由应用自行基于 EventEmitter 实现。  
This module provides only the generic EventEmitter; domain emitters are implemented by the app.

---

## 入口 / Entry

从 `@/events` 导出。  
Exported from `@/events`.

```ts
import type { EventCallback, EventNamesOf } from "@/events";

import { defineEvents, EventEmitter } from "@/events";
```

---

## 1. EventEmitter（通用事件发射器）

泛型类：接受事件名字面量联合类型 `E`，提供 `on` / `off` / `emit`。  
Generic class: accepts a string union of event names `E`, provides `on` / `off` / `emit`.

### 构造函数 / Constructor

**签名 / Signature**

```ts
constructor(events: Record<string, E>)
```

**输入 / Input**

| 参数     | 类型                | 说明                                                                                                        |
| -------- | ------------------- | ----------------------------------------------------------------------------------------------------------- |
| `events` | `Record<string, E>` | 事件名 key-value 对象，如 `{ FOO: "DOMAIN:FOO", BAR: "DOMAIN:BAR" }`。内部用 `Object.values(events)` 建表。 |

**说明**：直接传入 key-value 对象即可，无需再写 `Object.values(...)`。只支持该对象中的事件名。  
Pass the object directly; only these event names can be used for `on` / `off` / `emit`.

### on

**签名 / Signature**

```ts
on(event: E, callback: EventCallback): void
```

**输入 / Input**

| 参数       | 类型            | 说明                                  |
| ---------- | --------------- | ------------------------------------- |
| `event`    | `E`             | 事件名。                              |
| `callback` | `EventCallback` | 回调 `(...args: unknown[]) => void`。 |

**输出 / Output**：无。向该事件的监听集合中添加回调。

### off

**签名 / Signature**

```ts
off(event: E, callback: EventCallback): void
```

**输入 / Input**

| 参数       | 类型            | 说明                                         |
| ---------- | --------------- | -------------------------------------------- |
| `event`    | `E`             | 事件名。                                     |
| `callback` | `EventCallback` | 要移除的回调（需与 `on` 时传入的同一引用）。 |

**输出 / Output**：无。从该事件的监听集合中移除该回调。

### emit

**签名 / Signature**

```ts
emit(event: E, ...args: unknown[]): void
```

**输入 / Input**

| 参数      | 类型        | 说明                   |
| --------- | ----------- | ---------------------- |
| `event`   | `E`         | 事件名。               |
| `...args` | `unknown[]` | 传给每个监听器的参数。 |

**输出 / Output**：无。同步依次调用该事件的所有已注册回调。

**Example（自定义 EventEmitter）**

```ts
import type { EventNamesOf } from "@/events";

import { defineEvents, EventEmitter } from "@/events";

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
// => logs "hello"
emitter.off(events.FOO, callback);
```

**Example 2（自建带便捷方法的发射器，如 routerEvents + navigateTo...）**

在 `events` 里定义导航相关事件名，子类增加语义化方法，内部用 `emit` 触发：

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
routerEmitter.on(routerEvents.NAVIGATE, (p) => console.log("navigate", p));
routerEmitter.navigate({ to: "/dashboard", replace: true });
routerEmitter.on(routerEvents.NAVIGATE_TO_LOGIN, () => (window.location.href = "/login"));
routerEmitter.navigateToLogin();
```

---

## 2. EventCallback 类型

```ts
type EventCallback = (...args: unknown[]) => void;
```

用于 `EventEmitter#on` / `off` 的回调类型。  
Callback type for `EventEmitter#on` / `off`.

---

## 类型速查 / Type Reference

| 类型                   | 说明                                                                             |
| ---------------------- | -------------------------------------------------------------------------------- |
| `EventCallback`        | `(...args: unknown[]) => void`，用于 `on` / `off`。                              |
| `EventEmitter<E>`      | 泛型事件发射器，`E` 为事件名字面量联合类型。                                     |
| `DefinedEvents<T>`     | 由 defineEvents 返回的类型；EventEmitter 构造只接受此类型。                      |
| `EventNamesOf<T>`      | 从 events 对象推导事件名联合类型；支持 DefinedEvents 或 Record<string, string>。 |
| `defineEvents(events)` | 规范创建事件名对象并返回 DefinedEvents<T>；仅一级 key-value（value 为字符串）。  |

---

## 扩展 EventEmitter 的约定（应用内自建各域发射器时）

1. 用 `defineEvents({ ... })` 定义并导出事件名对象（仅一级 key-value，value 为字符串）。
2. 导出类型：`type MyEvent = EventNamesOf<typeof myEvents>`（或手写 `(typeof myEvents)[keyof typeof myEvents]`）。
3. 子类：`class MyEventEmitter extends EventEmitter<MyEvent> { constructor() { super(myEvents); } }`（直接传 key-value 对象）。
4. 若需单例，使用 `singleton(MyEventEmitter)` 再 `new` 导出。
