/**
 * 与约定一致：HTTP 错误经 fiberx.Error/ErrorFromErrx → httpx.BuildErrorResp，
 * 响应体固定为 { status, err_code, message, details?, trace_id? }（axios 转 camelCase）。
 * 前端只认「有 response.data」= 后端错误体；UI 展示与 NFX 一致：先 errors 命名空间（后端拉取），再 message，再 fallback。
 */

import type { AxiosError } from "axios";
import type { ApiErrorBody } from "@/types/api";

import i18n from "@/languages/languages/i18n";

/**
 * 仅当为后端错误（有 response.data）时解析为 ApiErrorBody，否则返回 null
 * Parse to ApiErrorBody only when response.data exists; otherwise null.
 * @param error - 通常为 Axios 错误或 unknown
 * @returns ApiErrorBody 或 null
 */
export function getApiError(error: unknown): ApiErrorBody | null {
  const d = (error as AxiosError<ApiErrorBody>)?.response?.data;
  if (!d || typeof d !== "object") return null;
  return {
    status: d.status,
    errCode: d.errCode,
    message: d.message,
    details: d.details,
    traceId: d.traceId,
  };
}

/**
 * UI 展示用错误文案：优先 i18n errors 命名空间（errCode），其次 api.message，最后 fallback
 * Get display message: i18n errors namespace (by errCode) → api.message → fallback.
 * @param error - 通常为 Axios 错误
 * @param fallback - 无法解析时的默认文案
 * @returns 展示用字符串
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  const api = getApiError(error);
  if (api?.errCode) {
    const out = i18n.t(`errors:${api.errCode}`);
    if (out && out !== `errors:${api.errCode}`) return out;
  }
  if (api?.message) return api.message;
  return fallback;
}
