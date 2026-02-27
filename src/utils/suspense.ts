import type { Nilable } from "@/types";

/**
 * 若值为 null/undefined 则抛出 Promise 使 React Suspense 挂起，否则返回该值。
 * If value is null/undefined, throw a promise to suspend (React Suspense); otherwise return value.
 * @param value - 待检查的值。Value to check.
 * @param delay - 重试前的延迟（毫秒）。Delay in ms before retry.
 * @returns 非空时的 value。Value when non-null.
 * @example const data = suspenseIfNull(resource); // 在 Suspense 边界内，data 非空时才渲染
 */
export function suspenseIfNull<T>(value: Nilable<T>, delay = 100): T {
  if (value == null) {
    throw new Promise<void>((resolve) => setTimeout(resolve, delay));
  }
  return value;
}
