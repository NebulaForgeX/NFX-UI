export type IdleTaskHandle = { cancel: () => void };

export type ScheduleBrowserIdleTaskOptions = {
  /** `requestIdleCallback` 超时兜底（ms）。默认 2000。 */
  timeout?: number;
  /**
   * 仅当 `deadline.timeRemaining()` ≥ 此阈值时才执行（ms）。
   * 默认 1：只要确实有一点空闲 slice 就跑。
   */
  minRemainingMs?: number;
  /**
   * 是否允许 `deadline.didTimeout` 时执行任务（兜底避免永远不执行）。
   * 默认 true。
   */
  allowTimeoutRun?: boolean;
  /**
   * 空闲不足时最多重试次数。默认 Infinity（持续等空闲）。
   * 设为 0 表示本次 idle 不够就直接放弃（不执行）。
   */
  maxRetries?: number;
  /**
   * 达到 `maxRetries` 后用 `setTimeout` 兜底执行的延迟（ms）。
   * 默认 null（不兜底，直接放弃）。
   */
  fallbackDelayMs?: number | null;
};

type IdleDeadlineLike = {
  readonly didTimeout: boolean;
  timeRemaining: () => number;
};

type RequestIdleCallback = (
  callback: (deadline: IdleDeadlineLike) => void,
  options?: { timeout?: number },
) => number;

type CancelIdleCallback = (handle: number) => void;

/**
 * 在浏览器帧间空闲时段执行任务（`requestIdleCallback`），避免动画与布局/主线程同步抢同一时刻。
 * 无 API 时退化为 `setTimeout(0)`。
 */
export function scheduleBrowserIdleTask(task: () => void, options?: ScheduleBrowserIdleTaskOptions): IdleTaskHandle {
  const timeout = options?.timeout ?? 2000;
  const minRemainingMs = options?.minRemainingMs ?? 1;
  const allowTimeoutRun = options?.allowTimeoutRun ?? true;
  const maxRetries = options?.maxRetries ?? Number.POSITIVE_INFINITY;
  const fallbackDelayMs = options?.fallbackDelayMs ?? null;

  const g = globalThis as unknown as {
    requestIdleCallback?: RequestIdleCallback;
    cancelIdleCallback?: CancelIdleCallback;
    setTimeout?: typeof setTimeout;
    clearTimeout?: typeof clearTimeout;
  };

  const ric = g.requestIdleCallback;
  const cic = g.cancelIdleCallback;
  const st = g.setTimeout ?? setTimeout;
  const ct = g.clearTimeout ?? clearTimeout;

  if (typeof ric === "function") {
    let cancelled = false;
    let id = 0;
    let retries = 0;
    let fallbackTimeoutId: ReturnType<typeof st> | null = null;

    const cancelAll = () => {
      cancelled = true;
      if (typeof cic === "function") {
        cic(id);
      }
      if (fallbackTimeoutId !== null) {
        ct(fallbackTimeoutId);
        fallbackTimeoutId = null;
      }
    };

    const runOrReschedule = (deadline: IdleDeadlineLike) => {
      if (cancelled) return;
      const canRun = deadline.timeRemaining() >= minRemainingMs || (allowTimeoutRun && deadline.didTimeout);
      if (canRun) {
        task();
        return;
      }

      if (retries >= maxRetries) {
        if (fallbackDelayMs !== null) {
          fallbackTimeoutId = st(() => {
            if (!cancelled) task();
          }, Math.max(0, fallbackDelayMs));
        }
        return;
      }

      retries += 1;
      id = ric(runOrReschedule, { timeout });
    };

    id = ric(runOrReschedule, { timeout });
    return { cancel: cancelAll };
  }

  const id = st(task, Math.max(0, fallbackDelayMs ?? 0));
  return { cancel: () => ct(id) };
}

