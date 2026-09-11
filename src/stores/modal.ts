import type { ReactNode } from "react";

import { makeStore } from "@/stores/makeStore";

type ModalType = "success" | "error" | "info";

export interface BaseModalProps {
  isOpen: boolean;
  message?: string;
  title?: string;
  confirmText?: string;
  onClick?: () => void;
  variant?: ModalType;
}

export interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmInputText?: string;
  variant?: "default" | "hold";
  holdDurationMs?: number;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface LoadingModalProps {
  isOpen: boolean;
  message?: string;
  canClose?: boolean;
}

interface ModalState {
  modalType: ModalType | undefined;
  baseModal: BaseModalProps;
  confirmModal: ConfirmModalProps;
  loadingModal: LoadingModalProps;
}

interface ModalActions {
  showModal: (modalType: ModalType, props: BaseModalProps) => void;
  hideModal: (modalType?: string) => void;
  showConfirm: (props: Omit<ConfirmModalProps, "isOpen">) => void;
  showLoading: (props?: Omit<LoadingModalProps, "isOpen">) => void;
}

const defaultBaseModalProps: BaseModalProps = {
  isOpen: false,
  message: "No message",
  title: "No title",
  confirmText: "Confirm",
  onClick: undefined,
};

const defaultConfirm: ConfirmModalProps = {
  isOpen: false,
};

const defaultLoading: LoadingModalProps = {
  isOpen: false,
};

function omitIsOpen<T extends { isOpen?: boolean }>(props: T): Omit<T, "isOpen"> {
  const rest = { ...props };
  delete rest.isOpen;
  return rest as Omit<T, "isOpen">;
}

const { store: ModalStore, useStore: useModalStore } = makeStore<ModalState, ModalActions>(
  {
    modalType: undefined,
    baseModal: defaultBaseModalProps,
    confirmModal: defaultConfirm,
    loadingModal: defaultLoading,
  },
  (set) => ({
    showModal: (modalType, props) => {
      const restProps = omitIsOpen(props);
      set({
        modalType,
        baseModal: {
          isOpen: true,
          variant: modalType,
          ...restProps,
        },
      });
    },
    hideModal: (modalType) => {
      if (modalType === "confirm") {
        set({ confirmModal: defaultConfirm });
        return;
      }
      if (modalType === "loading") {
        set({ loadingModal: defaultLoading });
        return;
      }
      set({
        modalType: undefined,
        baseModal: defaultBaseModalProps,
      });
    },
    showConfirm: (props) => set({ confirmModal: { ...defaultConfirm, ...props, isOpen: true } }),
    showLoading: (props) => set({ loadingModal: { ...defaultLoading, ...props, isOpen: true } }),
  }),
);

const showModal = ModalStore.getState().showModal;
const hideModal = ModalStore.getState().hideModal;
const showConfirm = ModalStore.getState().showConfirm;
const showLoading = ModalStore.getState().showLoading;

export { showModal, hideModal, showConfirm, showLoading };
export { ModalStore, useModalStore };
export default ModalStore;

export const showInfo = (message: string, title?: string) => {
  showModal("info", { isOpen: true, message, title });
};

export type ShowSuccessProps = {
  message: string;
  title?: string;
  onClick?: () => void;
};

export const showSuccess = (props: ShowSuccessProps | string) => {
  if (typeof props === "string") {
    showModal("success", { isOpen: true, message: props });
    return;
  }
  showModal("success", {
    isOpen: true,
    message: props.message,
    title: props.title,
    onClick: props.onClick,
  });
};

export const showError = (message: string, title?: string) => {
  showModal("error", { isOpen: true, message, title });
};

export type ModalProviderProps = { children: ReactNode };
