/**
 * 通用事件发射器（按事件名注册/注销/触发）
 * Generic event emitter: subscribe, unsubscribe, and emit by event name.
 *
 * @example
 * ```ts
 * import { EventEmitter, defineEvents, type EventNamesOf } from "@/events";
 * const events = defineEvents({ FOO: "MY:FOO", BAR: "MY:BAR" });
 * type MyEvent = EventNamesOf<typeof events>;
 * class MyEmitter extends EventEmitter<MyEvent> { constructor() { super(events); } }
 * const em = new MyEmitter();
 * em.on(events.FOO, (x) => console.log(x));
 * em.emit(events.FOO, "hello");
 * ```
 */

import type { Defined } from "@/types";

/** 事件回调类型：用于 on / off。Callback for on / off. */
type EventCallback = (...args: unknown[]) => void;

/** 由 defineEvents 返回的「已规范事件名对象」类型；constructor 只接受此类型。 */
type DefinedEvents<T extends Record<string, string>> = Defined<T, "events">;

/** 从 events 对象推导出事件名联合类型。Event name union from an events key-value object. */
type EventNamesOf<T> = T extends Defined<infer O, "events"> ? O[keyof O] : T extends Record<string, string> ? T[keyof T] : never;

/**
 * 规范创建「一级 key-value」事件名对象：仅允许 key → 字符串 value，禁止嵌套（类型约束）。
 * 返回 DefinedEvents<T>，供 EventEmitter 构造使用。
 * Define events object: one-level key-value (string values), no nested objects (type-only). Returns DefinedEvents<T> for EventEmitter.
 *
 * @param events - 事件名 key-value 对象。Event name key-value object (e.g. { FOO: "DOMAIN:FOO" }).
 * @returns DefinedEvents<E>，仅此类型可传入 EventEmitter 构造。DefinedEvents<E>; only this type is accepted by EventEmitter constructor.
 * @example
 * ```ts
 * const routerEvents = defineEvents({ NAVIGATE: "ROUTER:NAVIGATE", NAVIGATE_BACK: "ROUTER:NAVIGATE_BACK" });
 * class RouterEmitter extends EventEmitter<EventNamesOf<typeof routerEvents>> { constructor() { super(routerEvents); } }
 * ```
 */
function defineEvents<E extends Record<string, string>>(events: E): DefinedEvents<E> {
  return events as DefinedEvents<E>;
}

function createListenersMap<E extends string>(eventNames: readonly E[]): Record<E, Set<EventCallback>> {
  const map = {} as Record<E, Set<EventCallback>>;
  for (const e of eventNames) {
    map[e] = new Set();
  }
  return map;
}

/**
 * 泛型 EventEmitter：构造函数仅接受 defineEvents 返回的 DefinedEvents 类型，提供 on / off / emit。
 * Generic EventEmitter: constructor accepts only DefinedEvents (returned by defineEvents), provides on / off / emit.
 *
 * @param events - 须为 defineEvents(...) 的返回值（DefinedEvents）。Must be the return value of defineEvents(...) (DefinedEvents).
 */
class EventEmitter<E extends string> {
  private listeners: Record<E, Set<EventCallback>>;

  constructor(events: DefinedEvents<Record<string, E>>) {
    this.listeners = createListenersMap(Object.values(events as Record<string, E>));
  }

  /**
   * 注册事件监听。Register a listener for an event.
   *
   * @param event - 事件名。Event name.
   * @param callback - 回调。Callback (...args) => void.
   */
  on(event: E, callback: EventCallback): void {
    this.listeners[event].add(callback);
  }

  /**
   * 移除事件监听。Remove a listener for an event.
   *
   * @param event - 事件名。Event name.
   * @param callback - 要移除的回调（需与 on 时同一引用）。Callback to remove (same reference as passed to on).
   */
  off(event: E, callback: EventCallback): void {
    this.listeners[event].delete(callback);
  }

  /**
   * 触发事件，同步调用该事件所有监听器。Emit an event; synchronously invoke all listeners.
   *
   * @param event - 事件名。Event name.
   * @param args - 传给监听器的参数。Arguments passed to listeners.
   */
  emit(event: E, ...args: unknown[]): void {
    this.listeners[event].forEach((cb) => cb(...args));
  }
}

export { EventEmitter, defineEvents };
export type { EventCallback, DefinedEvents, EventNamesOf };
