/** 可实例化的构造函数类型。Instantiable constructor type. */
type Constructor<T extends object = object> = new (...args: unknown[]) => T;

/** 深度比较两个值是否相等（支持 primitives、数组、plain objects）。Deep equal for primitives, arrays, plain objects. */
function isEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;
  if (typeof a !== "object" || typeof b !== "object") return a === b;

  const arrA = Array.isArray(a);
  const arrB = Array.isArray(b);
  if (arrA !== arrB) return false;
  if (arrA && arrB) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => isEqual(v, (b as unknown[])[i]));
  }

  const keysA = Object.keys(a as object).sort();
  const keysB = Object.keys(b as object).sort();
  if (keysA.length !== keysB.length) return false;
  if (!keysA.every((k, i) => k === keysB[i])) return false;
  return keysA.every((k) => isEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]));
}

/**
 * 单例工厂：将传入的构造函数包装为单例模式；Proxy 拦截 construct，多次 new 返回同一实例。
 * Singleton factory: wrap constructor so that multiple new calls return the same instance.
 *
 * @template T - 实例类型（需为 object）。Instance type (must be object).
 * @param className - 被包装的构造函数（class）。Constructor (class) to wrap.
 * @returns 代理后的构造函数，调用时始终返回同一实例。Proxied constructor returning same instance.
 *
 * @example
 * ```ts
 * class MyService { ... }
 * const SingletonService = singleton(MyService);
 * const a = new SingletonService();
 * const b = new SingletonService();
 * console.log(a === b); // true
 * ```
 */
export const singleton = <T extends object>(className: Constructor<T>): Constructor<T> => {
  let instance: T | undefined;
  let parameters: unknown[] = [];
  return new Proxy(className, {
    construct(_target: Constructor<T>, args: unknown[]): T {
      if (!instance) {
        instance = new className(...args);
        parameters = args;
      }
      if (!isEqual(args, parameters)) {
        throw new Error("Cannot create multiple instances with different parameters");
      }
      return instance;
    },
  }) as Constructor<T>;
};
