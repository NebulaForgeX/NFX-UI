/**
 * 结果类型：成功为 [T, null]，失败为 [null, Error]。
 * Result type: success [T, null], failure [null, Error].
 * @template T - 成功时的值类型。Value type on success.
 * @example const [data, err] = await withRetryResult(() => fetchData()); if (err) return; use(data);
 */
export type Result<T> = [T, null] | [null, Error];

/**
 * 构造成功结果。Create a successful result.
 * @param v - 结果值。Result value.
 * @returns [v, null]
 * @example ok(42) // [42, null]
 */
export const ok = <T>(v: T): Result<T> => [v, null];

/**
 * 构造失败结果（非 Error 会包装为 Error）。Create a failed result; non-Error wrapped in Error.
 * @param e - 错误或任意值。Error or any value.
 * @returns [null, Error]
 * @example err(new Error("fail")) // [null, Error]
 */
export const err = (e: unknown): Result<never> => [null, e instanceof Error ? e : new Error(String(e))];
