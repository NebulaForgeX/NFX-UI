/**
 * 包装为「仅执行一次」的异步函数（重复调用返回同一 Promise）。
 * Wrap async function so it runs only once; repeated calls return the same promise.
 * @param fn - 要执行的异步函数。Async function to run once.
 * @returns 包装后的函数，多次调用只执行一次。Wrapped function; only first call runs.
 * @example const loadOnce = onceAsync(() => fetch("/api/config")); loadOnce(); loadOnce(); // 只请求一次
 */
export function onceAsync<T, Args extends unknown[]>(fn: (...args: Args) => Promise<T>) {
  let promise: Promise<T> | null = null;

  return async (...args: Args) => {
    if (promise) return promise;
    promise = fn(...args).finally(() => (promise = null));
    return promise;
  };
}

/**
 * 按 key 仅执行一次的异步函数（同一 key 重复调用返回同一 Promise）。
 * Async function that runs only once per key; same key returns same promise.
 * @param fn - 要执行的异步函数。Async function to run.
 * @param keyExtractor - 从参数中提取 key 的函数。Function to extract key from args.
 * @returns 包装后的函数。Wrapped function.
 * @example const fetchUser = onceAsyncByKey((id: string) => api.getUser(id), (id) => id); fetchUser("1"); fetchUser("1"); // 同 id 只请求一次
 */
export function onceAsyncByKey<T, Args extends unknown[]>(fn: (...args: Args) => Promise<T>, keyExtractor: (...args: Args) => string) {
  const promises = new Map<string, Promise<T>>();

  return async (...args: Args) => {
    const key = keyExtractor(...args);
    const existingPromise = promises.get(key);
    if (existingPromise) return existingPromise;

    const promise = fn(...args).finally(() => promises.delete(key));
    promises.set(key, promise);
    return promise;
  };
}
