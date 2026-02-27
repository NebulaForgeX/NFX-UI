import type { Result } from "./result";
import type { WithRetryOptions } from "./retry";

import { withRetryResult } from "./retry";

/**
 * 轮询直到 isOK(data) 为 true（内部用 withRetryResult 重试）。
 * Poll until fetcher returns data that satisfies isOK; uses withRetryResult.
 * @param fetcher - 拉取数据的函数。Function that fetches data.
 * @param isOK - 判断数据是否满足条件。Predicate to check if data is OK.
 * @param opts - 重试选项。Retry options.
 * @returns Promise<Result<T>>
 * @example const [job] = await pollUntil(() => getJob(id), (j) => j.status === "done", { retries: 10 });
 */
export async function pollUntil<T>(fetcher: () => Promise<T>, isOK: (data: T) => boolean, opts?: WithRetryOptions): Promise<Result<T>> {
  return withRetryResult<T>(async (_bail, _attempt) => {
    const data = await fetcher();
    if (!isOK(data)) {
      throw new Error("Condition not satisfied");
    }
    return data;
  }, opts);
}
