import type { AxiosError } from "axios";

import { systemEventEmitter } from "nfx-ui/events/system";
import { getApiErrorMessage } from "nfx-ui/utils/apiError";

/**
 * Host resolves copy with its own `t`, then passes ready-to-show strings.
 * Package mutation hooks never call `useTranslation`.
 */
export type HookToastMessages = {
  successMsg?: string;
  failMsg?: string;
};

export function emitHookSuccess(toasts?: HookToastMessages, silent = false) {
  if (silent || !toasts?.successMsg) return;
  systemEventEmitter.showSuccess(toasts.successMsg);
}

export function emitHookError(error: AxiosError, toasts?: HookToastMessages, fallback = "Request failed", silent = false) {
  if (silent) return;
  systemEventEmitter.showError(getApiErrorMessage(error, toasts?.failMsg ?? fallback));
}
