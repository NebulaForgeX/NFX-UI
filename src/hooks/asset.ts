/**
 * Asset upload hooks — 组件勿直接调 apis/asset
 */
import type { AxiosError } from "axios";
import type { Asset } from "nfx-ui/types";

import { useMutation } from "@tanstack/react-query";
import { useAssetRepository } from "nfx-ui/apis/repositories";
import { authEventEmitter, authEvents } from "nfx-ui/events/auth";
import { systemEventEmitter } from "nfx-ui/events/system";
import { AuthStore } from "nfx-ui/stores/auth";
import { getApiErrorMessage } from "nfx-ui/utils/apiError";
import { useUnifiedQuery } from "nfx-ui/utils/factory";

export type UseDeleteImageOptions = {
  ifShowError?: boolean;
};

export const useAssetFileURL = () => {
  const asset = useAssetRepository();
  return (kind: Asset.Kind, id: string) => asset.FileURL(kind, id);
};

export const usePrepareUpload = () => {
  const asset = useAssetRepository();
  return useMutation({
    mutationFn: ({ kind, params }: { kind: Asset.Kind; params: Asset.Request.PrepareUpload }) => asset.PrepareUpload(kind, params),
  });
};

export const useConfirmUpload = () => {
  const asset = useAssetRepository();
  return useMutation({
    mutationFn: ({ kind, params }: { kind: Asset.Kind; params: Asset.Request.ConfirmUpload }) => asset.ConfirmUpload(kind, params),
  });
};

export const useDeleteAsset = () => {
  const asset = useAssetRepository();
  return useMutation({
    mutationFn: ({ kind, id }: { kind: Asset.Kind; id: string }) => asset.Delete(kind, id),
    onError: (error: AxiosError) => {
      systemEventEmitter.showError(getApiErrorMessage(error, "[useDeleteAsset] error"));
    },
  });
};

export const useListAssets = (kind: Asset.Kind) => {
  const asset = useAssetRepository();
  return useUnifiedQuery(() => asset.List(kind), ["asset", "list", kind], undefined);
};

export const usePrepareImageUpload = () => {
  const asset = useAssetRepository();
  return useMutation<Asset.Response.PrepareUpload, AxiosError, Asset.Request.PrepareUpload>({
    mutationFn: (params) => asset.PrepareUpload("images", params),
  });
};

export const useConfirmImageUpload = () => {
  const asset = useAssetRepository();
  const accountId = AuthStore.getState().currentAccountId;
  return useMutation<void, AxiosError, Asset.Request.ConfirmUpload>({
    mutationFn: (params) => asset.ConfirmUpload("images", params),
    onSuccess: () => {
      authEventEmitter.emit(authEvents.UPDATE_ACCOUNT_SUCCESS, accountId);
    },
  });
};

export const useDeleteImage = (options?: UseDeleteImageOptions) => {
  const asset = useAssetRepository();
  const ifShowError = options?.ifShowError ?? true;
  return useMutation({
    mutationFn: (id: string) => asset.Delete("images", id),
    onError: (error: AxiosError) => {
      if (ifShowError) {
        systemEventEmitter.showError(getApiErrorMessage(error, "[useDeleteImage] error"));
      }
    },
  });
};
