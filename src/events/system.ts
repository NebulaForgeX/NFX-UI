import type { EventNamesOf } from "nfx-ui/events/EventEmitter";

import { defineEvents, EventEmitter } from "nfx-ui/events/EventEmitter";
import { singleton } from "nfx-ui/utils/singleton";

/**
 * Host-agnostic UI feedback. Package emits; WEB ModalProvider listens.
 */
export const systemEvents = defineEvents({
  SHOW_ERROR: "SYSTEM:SHOW_ERROR",
  SHOW_SUCCESS: "SYSTEM:SHOW_SUCCESS",
  SHOW_LOADING: "SYSTEM:SHOW_LOADING",
  HIDE_LOADING: "SYSTEM:HIDE_LOADING",
});

type SystemEvent = EventNamesOf<typeof systemEvents>;

export type SystemShowErrorPayload = {
  message: string;
  title?: string;
};

export type SystemShowSuccessPayload =
  | string
  | {
      message: string;
      title?: string;
      onClick?: () => void;
    };

export type SystemShowLoadingPayload = {
  message?: string;
};

type SystemPayloadMap = {
  "SYSTEM:SHOW_ERROR": SystemShowErrorPayload;
  "SYSTEM:SHOW_SUCCESS": SystemShowSuccessPayload;
  "SYSTEM:SHOW_LOADING": SystemShowLoadingPayload;
  "SYSTEM:HIDE_LOADING": void;
};

class SystemEventEmitter extends EventEmitter<SystemEvent, SystemPayloadMap> {
  constructor() {
    super(systemEvents);
  }

  showError(message: string, title?: string) {
    this.emit(systemEvents.SHOW_ERROR, { message, title });
  }

  showSuccess(props: SystemShowSuccessPayload) {
    this.emit(systemEvents.SHOW_SUCCESS, props);
  }

  showLoading(message?: string) {
    this.emit(systemEvents.SHOW_LOADING, { message });
  }

  hideLoading() {
    this.emit(systemEvents.HIDE_LOADING);
  }
}

export const systemEventEmitter = new (singleton(SystemEventEmitter))();
