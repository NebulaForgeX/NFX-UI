import type { EventNamesOf } from "@/events/EventEmitter";

import { defineEvents, EventEmitter } from "@/events/EventEmitter";
import { singleton } from "@/utils/singleton";

/**
 * Host-agnostic UI feedback. Package emits; WEB ModalProvider listens.
 */
export const systemEvents = defineEvents({
  SHOW_ERROR: "SYSTEM:SHOW_ERROR",
  SHOW_SUCCESS: "SYSTEM:SHOW_SUCCESS",
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

type SystemPayloadMap = {
  "SYSTEM:SHOW_ERROR": SystemShowErrorPayload;
  "SYSTEM:SHOW_SUCCESS": SystemShowSuccessPayload;
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
}

export const systemEventEmitter = new (singleton(SystemEventEmitter))();
