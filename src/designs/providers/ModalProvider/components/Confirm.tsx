import { useEffect, useState } from "react";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import LucideIcon from "@/designs/components/LucideIcon";
import ModalStore, { hideModal, useModalStore } from "@/stores/modal";

const Confirm = () => {
  const { t } = useTranslation("language");
  const isOpen = useModalStore((state) => state.confirmModal.isOpen);
  const title = useModalStore((state) => state.confirmModal.title);
  const message = useModalStore((state) => state.confirmModal.message);
  const confirmText = useModalStore((state) => state.confirmModal.confirmText);
  const cancelText = useModalStore((state) => state.confirmModal.cancelText);
  const confirmInputText = useModalStore((state) => state.confirmModal.confirmInputText);

  const [inputValue, setInputValue] = useState("");
  const requiresInput = Boolean(confirmInputText);
  const inputMatches = !requiresInput || inputValue === confirmInputText;
  const canConfirm = inputMatches;

  useEffect(() => {
    if (!isOpen) return;
    setInputValue("");
  }, [isOpen, confirmInputText, title, message]);

  const handleClose = () => hideModal("confirm");
  const handleOpenChange = (open: boolean) => {
    if (!open) handleClose();
  };

  const handleConfirm = () => {
    if (!canConfirm) return;
    ModalStore.getState().confirmModal.onConfirm?.();
    hideModal("confirm");
  };

  const handleCancel = () => {
    ModalStore.getState().confirmModal.onCancel?.();
    hideModal("confirm");
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Content maxWidth="480px">
        <Flex direction="column" align="center" gap="3">
          <Text color="amber">
            <LucideIcon icon={AlertCircle} size={32} />
          </Text>
          {title ? <Dialog.Title>{title}</Dialog.Title> : null}
          <Text as="p" align="center" color="gray" size="2">
            {message || "No message"}
          </Text>
          {requiresInput ? (
            <Flex direction="column" gap="1" width="100%">
              <Text as="label" size="2" weight="medium" htmlFor="confirm-input">
                {confirmInputText}
              </Text>
              <TextField.Root
                id="confirm-input"
                size="3"
                value={inputValue}
                placeholder={confirmInputText}
                autoComplete="off"
                spellCheck={false}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </Flex>
          ) : null}
          <Flex gap="3" width="100%" justify="end">
            <Button type="button" variant="outline" onClick={handleCancel}>
              <Cross2Icon />
              {cancelText ?? t("header.logout", { defaultValue: "Cancel" })}
            </Button>
            <Button type="button" onClick={handleConfirm} disabled={!canConfirm}>
              <CheckIcon />
              {confirmText ?? "OK"}
            </Button>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

Confirm.displayName = "Confirm";
export default Confirm;
