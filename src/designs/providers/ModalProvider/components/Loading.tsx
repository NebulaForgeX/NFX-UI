import { Cross2Icon } from "@radix-ui/react-icons";
import { Box, Dialog, Flex, IconButton, Spinner, Text } from "@radix-ui/themes";

import { hideModal, useModalStore } from "@/stores/modal";

const Loading = () => {
  const isOpen = useModalStore((state) => state.loadingModal.isOpen);
  const message = useModalStore((state) => state.loadingModal.message);
  const canClose = useModalStore((state) => state.loadingModal.canClose);

  const handleClose = () => {
    if (canClose) hideModal("loading");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) handleClose();
  };

  const guardDismiss = (event: Event) => {
    if (!canClose) event.preventDefault();
  };

  if (!isOpen) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Content aria-describedby={undefined} maxWidth="18rem" onInteractOutside={guardDismiss} onPointerDownOutside={guardDismiss} onFocusOutside={guardDismiss}>
        <Dialog.Title style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>Loading</Dialog.Title>
        <Box position="relative">
          {canClose ? (
            <Box position="absolute" top="0" right="0">
              <IconButton onClick={handleClose} type="button" variant="soft" size="2" aria-label="Close">
                <Cross2Icon />
              </IconButton>
            </Box>
          ) : null}
          <Flex direction="column" align="center" gap="4" role="alert" aria-busy="true" aria-live="polite" pt={canClose ? "4" : "0"}>
            <Spinner size="3" />
            {message ? (
              <Text size="2" weight="medium" align="center">
                {message}
              </Text>
            ) : null}
          </Flex>
        </Box>
      </Dialog.Content>
    </Dialog.Root>
  );
};

Loading.displayName = "Loading";
export default Loading;
