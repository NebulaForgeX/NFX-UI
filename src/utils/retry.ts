import retry, { Options as RetryOptions } from "async-retry";

import { err, ok, Result } from "./result";

export type WithRetryOptions = RetryOptions & {
  /** 若返回 true 则不再重试，直接 bail。If true, do not retry and bail. */
  isNonRetryable?: (e: Error) => boolean;
};

/**
 * 带重试执行异步函数，成功返回 ok(value)，失败返回 err(error)。
 * Retry async function until success or max attempts; returns Result.
 * @param fn - 可接收 bail 与 attempt 的异步函数。Async function receiving bail and attempt.
 * @param opts - async-retry 选项及 isNonRetryable。async-retry options and isNonRetryable.
 * @returns Promise<Result<T>>
 * @example const [data, err] = await withRetryResult(() => fetchData(), { retries: 3 });
 */
export async function withRetryResult<T>(fn: (bail: (e: Error) => void, attempt: number) => Promise<T>, opts?: WithRetryOptions): Promise<Result<T>> {
  try {
    const value = await retry(async (bail, attempt) => {
      try {
        return await fn(bail, attempt);
      } catch (e) {
        if (opts?.isNonRetryable?.(e as Error)) bail(e as Error);
        throw e;
      }
    }, opts);
    return ok(value);
  } catch (e) {
    return err(e);
  }
}
