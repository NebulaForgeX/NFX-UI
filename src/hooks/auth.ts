/**
 * Auth hooks — 组件勿直接调 apis/auth
 */
import type { AxiosError } from "axios";
import type { CurrentProfileResult, Login, Profile, Signup } from "nfx-ui/types";

import { useEffect } from "react";
import { flushSync } from "react-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuthRepository } from "nfx-ui/apis/repositories";
import { AUTH_EMAILS, AUTH_ME, AUTH_OWNER_AUTHORITIES, AUTH_OWNER_FORGERS, AUTH_PHONES, AUTH_PROFILE_SEARCH, AUTH_PROFILES, AUTH_PUBLIC_CARD } from "nfx-ui/constants";
import { AuthSignupPlatformEnum, LanguageEnum, ProfileKindEnum } from "nfx-ui/enums";
import { authEventEmitter, authEvents } from "nfx-ui/events/auth";
import { systemEventEmitter } from "nfx-ui/events/system";
import {
  AuthStore,
  clearAuth,
  EMPTY_PROFILE_ID,
  hasSelectedProfile,
  setCurrentAccountId,
  setCurrentProfileId,
  setCurrentProfileKind,
  setIsAuthValid,
  setTokens,
  useAuthStore,
} from "nfx-ui/stores/auth";
import { ensureDeviceIdStorage } from "nfx-ui/stores/system";
import { pickProfile } from "nfx-ui/utils/domain/account";
import { useUnifiedQuery } from "nfx-ui/utils/factory";
import { safeOr, safeStringable } from "nfx-ui/utils/safe";

import { emitHookError, emitHookSuccess, type HookToastMessages } from "./toast";

export function useAuthQueryScope() {
  const aID = useAuthStore((s) => s.currentAccountId);
  const pID = useAuthStore((s) => s.currentProfileId);
  const isAuthValid = useAuthStore((s) => s.isAuthValid);
  const kind = useAuthStore((s) => s.currentProfileKind);
  return { aID, pID, isAuthValid, kind, profileScope: kind };
}

function useLogoutOnAuthError(isError: boolean, aID: string) {
  useEffect(() => {
    if (!isError || !AuthStore.getState().isAuthValid) return;
    if (!hasSelectedProfile(AuthStore.getState().currentProfileId)) return;
    authEventEmitter.emit(authEvents.LOGOUT, aID);
    clearAuth();
  }, [isError, aID]);
}

export function useCurrentProfile(): CurrentProfileResult {
  const auth = useAuthRepository();
  const { aID, pID, isAuthValid, kind } = useAuthQueryScope();
  const result = useUnifiedQuery(
    ({ kind }: { kind: ProfileKindEnum }) => auth.GetCurrentFullAccountInformationWithProfile(kind),
    AUTH_ME(aID, pID),
    { kind },
    { enabled: isAuthValid && hasSelectedProfile(pID) },
  );
  useLogoutOnAuthError(result.isError, aID);
  return {
    kind,
    data: result.data,
    profile: pickProfile(kind, result.data),
    isLoading: result.isLoading,
    isError: result.isError,
    refetch: result.refetch,
  } as CurrentProfileResult;
}

export const useSendVerificationCode = (options?: HookToastMessages) => {
  const auth = useAuthRepository();
  return useMutation({
    mutationFn: (params: Signup.Request.SendVerificationCode) => auth.SendVerificationCode(params),
    onSuccess: () => {
      emitHookSuccess(options);
    },
    onError: (error: AxiosError) => {
      emitHookError(error, options, "[useSendVerificationCode] error");
    },
  });
};

export const useSignupWithEmail = (options?: HookToastMessages) => {
  const auth = useAuthRepository();
  return useMutation({
    mutationFn: async ({
      rememberMe,
      ...params
    }: {
      rememberMe: boolean;
    } & Omit<Signup.Request.SignupWithEmail, "deviceId">): Promise<Signup.Response.SignupWithEmail> => {
      const deviceId = await ensureDeviceIdStorage();
      return auth.SignupWithEmail({
        ...params,
        deviceId,
      });
    },
    onSuccess: (result, variables) => {
      if (!result?.accessToken) return;
      setTokens(
        {
          accessToken: result.accessToken,
          refreshToken: safeStringable(result.refreshToken),
        },
        { rememberMe: variables.rememberMe },
      );
      setIsAuthValid(true);
      if (result.accountId) setCurrentAccountId(result.accountId);
      if (result.profileId) {
        setCurrentProfileId(result.profileId);
        setCurrentProfileKind(ProfileKindEnum.COMMUNITY);
        authEventEmitter.emit(authEvents.LOGIN_SUCCESS, result.accountId);
      } else {
        setCurrentProfileId(EMPTY_PROFILE_ID);
      }
    },
    onError: (error: AxiosError) => {
      emitHookError(error, options, "[useSignup] error");
    },
  });
};

export const useLoginWithEmail = (options?: HookToastMessages) => {
  const auth = useAuthRepository();
  return useMutation({
    mutationFn: async ({ rememberMe, ...params }: { email: string; password: string; rememberMe: boolean }) =>
      auth.LoginWithEmail({
        ...params,
        deviceId: await ensureDeviceIdStorage(),
      }),
    onSuccess: (result, variables) => {
      if (!result?.accessToken) return;
      setCurrentProfileId(EMPTY_PROFILE_ID);
      setTokens(
        {
          accessToken: result.accessToken,
          refreshToken: safeStringable(result.refreshToken),
        },
        { rememberMe: variables.rememberMe },
      );
      setIsAuthValid(true);
      if (result.accountId) setCurrentAccountId(result.accountId);
    },
    onError: (error: AxiosError) => {
      emitHookError(error, options, "[useLogin] error");
    },
  });
};

export const useLoginWithPhone = (options?: HookToastMessages) => {
  const auth = useAuthRepository();
  return useMutation({
    mutationFn: async ({ rememberMe, ...params }: { phone: string; password: string; rememberMe: boolean }) =>
      auth.LoginWithPhone({
        ...params,
        deviceId: await ensureDeviceIdStorage(),
      }),
    onSuccess: (result, variables) => {
      if (!result?.accessToken) return;
      setCurrentProfileId(EMPTY_PROFILE_ID);
      setTokens(
        {
          accessToken: result.accessToken,
          refreshToken: safeStringable(result.refreshToken),
        },
        { rememberMe: variables.rememberMe },
      );
      setIsAuthValid(true);
      if (result.accountId) setCurrentAccountId(result.accountId);
    },
    onError: (error: AxiosError) => {
      emitHookError(error, options, "[useLoginWithPhone] error");
    },
  });
};

export type SelectProfileOptions = HookToastMessages & {
  /** 已翻译的加载文案。Host-translated loading copy. */
  switchingMsg?: string;
  /** 与 token、档案同一次提交里执行（例如跳到该档案的首页）。Runs in the same commit as the token and profile. */
  onCommit?: () => void;
};

/** 两步登录第二步：切换当前 profile，重新签发 token。kind 决定后端分派到社区/权限档。 */
export const useSelectProfile = (options?: SelectProfileOptions) => {
  const auth = useAuthRepository();
  return useMutation({
    mutationFn: async ({ profileId, kind }: { profileId: string; kind: Login.ProfileKind }) =>
      auth.SelectProfile({
        profileId,
        kind,
        deviceId: await ensureDeviceIdStorage(),
      }),
    onMutate: () => {
      if (options?.switchingMsg) systemEventEmitter.showLoading(options.switchingMsg);
    },
    onSuccess: (result, variables) => {
      try {
        if (!result?.accessToken) return;
        // 同一次提交写入新 token 和档案，旧角色的请求在重拉前先停用。
        flushSync(() => {
          setTokens({
            accessToken: result.accessToken,
            refreshToken: safeStringable(result.refreshToken),
          });
          setCurrentProfileKind(variables.kind);
          if (result.profileId) setCurrentProfileId(result.profileId);
          options?.onCommit?.();
        });
        authEventEmitter.emit(authEvents.LOGIN_SUCCESS, result.accountId);
      } finally {
        systemEventEmitter.hideLoading();
      }
    },
    onError: (error: AxiosError) => {
      systemEventEmitter.hideLoading();
      emitHookError(error, options, "[useSelectProfile] error");
    },
  });
};

export const usePatchProfile = (options?: { silent?: boolean } & HookToastMessages) => {
  const auth = useAuthRepository();
  const { kind } = useAuthQueryScope();
  const silent = safeOr(options?.silent, false);
  return useMutation({
    mutationFn: (body: Profile.Request.PatchProfile) => auth.PatchProfile(kind, body),
    onSuccess: () => {
      if (!silent) emitHookSuccess(options);
      const aID = AuthStore.getState().currentAccountId;
      authEventEmitter.invalidateProfiles({ aID, kind });
    },
    onError: (error: AxiosError) => {
      emitHookError(error, options, "[usePatchProfile] error", silent);
    },
  });
};

export const useUpdateProfileSettings = (options?: HookToastMessages) => {
  const auth = useAuthRepository();
  const { kind } = useAuthQueryScope();
  return useMutation({
    mutationFn: (body: Profile.Request.PatchProfileSettings) => auth.PatchProfileSettings(kind, body),
    onSuccess: () => {
      const aID = AuthStore.getState().currentAccountId;
      authEventEmitter.emit(authEvents.UPDATE_ACCOUNT_SUCCESS, aID);
      emitHookSuccess(options);
    },
    onError: (error: AxiosError) => {
      emitHookError(error, options, "[useUpdateProfileSettings] error");
    },
  });
};

export const useUpdatePreference = (options?: HookToastMessages) => {
  const auth = useAuthRepository();
  const { kind } = useAuthQueryScope();
  return useMutation({
    mutationFn: (preference: string) => auth.UpdatePreference(kind, preference),
    onError: (error: AxiosError) => {
      emitHookError(error, options, "[useUpdatePreference] error");
    },
  });
};

export const useListProfiles = <K extends ProfileKindEnum>(kind: K) => {
  const auth = useAuthRepository();
  const { aID, isAuthValid } = useAuthQueryScope();
  return useUnifiedQuery(
    () => auth.ListProfiles(kind, { limit: 50, offset: 0 }),
    AUTH_PROFILES(aID, kind),
    undefined,
    { enabled: isAuthValid && Boolean(aID) },
  );
};

export const useCreateForgerProfile = (options?: HookToastMessages) => {
  const auth = useAuthRepository();
  return useMutation({
    mutationFn: (body: Login.Request.CreateForgerProfile) => auth.CreateForgerProfile(body),
    onSuccess: () => {
      const aID = AuthStore.getState().currentAccountId;
      authEventEmitter.invalidateProfiles({ aID, kind: ProfileKindEnum.COMMUNITY });
    },
    onError: (error: AxiosError) => {
      emitHookError(error, options, "[useCreateForgerProfile] error");
    },
  });
};

export const useCreateAuthorityProfile = (options?: HookToastMessages) => {
  const auth = useAuthRepository();
  return useMutation({
    mutationFn: (body: Login.Request.CreateAuthorityProfile) => auth.CreateAuthorityProfile(body),
    onSuccess: () => {
      const aID = AuthStore.getState().currentAccountId;
      authEventEmitter.invalidateProfiles({ aID, kind: ProfileKindEnum.AUTHORITY });
    },
    onError: (error: AxiosError) => {
      emitHookError(error, options, "[useCreateAuthorityProfile] error");
    },
  });
};

export const useDeleteProfile = (options?: HookToastMessages) => {
  const auth = useAuthRepository();
  return useMutation({
    mutationFn: ({ kind, profileId }: { kind: ProfileKindEnum; profileId: string }) => auth.DeleteProfile(kind, profileId),
    onSuccess: (_void, variables) => {
      const aID = AuthStore.getState().currentAccountId;
      authEventEmitter.invalidateProfiles({ aID, kind: variables.kind });
    },
    onError: (error: AxiosError) => {
      emitHookError(error, options, "[useDeleteProfile] error");
    },
  });
};

export const useConfirmProfileAvatar = (options?: HookToastMessages) => {
  const auth = useAuthRepository();
  const { kind } = useAuthQueryScope();
  return useMutation({
    mutationFn: (body: Profile.Request.ConfirmProfileAvatar) => auth.ConfirmProfileAvatar(kind, body),
    onSuccess: () => {
      const aID = AuthStore.getState().currentAccountId;
      authEventEmitter.emit(authEvents.UPDATE_ACCOUNT_SUCCESS, aID);
    },
    onError: (error: AxiosError) => {
      emitHookError(error, options, "[useConfirmProfileAvatar] error");
    },
  });
};

export const useClearProfileAvatar = (options?: HookToastMessages) => {
  const auth = useAuthRepository();
  const { kind } = useAuthQueryScope();
  return useMutation({
    mutationFn: () => auth.ClearProfileAvatar(kind),
    onSuccess: () => {
      const aID = AuthStore.getState().currentAccountId;
      authEventEmitter.emit(authEvents.UPDATE_ACCOUNT_SUCCESS, aID);
      emitHookSuccess(options);
    },
    onError: (error: AxiosError) => {
      emitHookError(error, options, "[useClearProfileAvatar] error");
    },
  });
};

export const useListEmails = () => {
  const auth = useAuthRepository();
  const { aID, isAuthValid } = useAuthQueryScope();
  return useUnifiedQuery(() => auth.ListEmails({ limit: 50, offset: 0 }), AUTH_EMAILS(aID), undefined, {
    enabled: isAuthValid && Boolean(aID),
  });
};

export const useListPhones = () => {
  const auth = useAuthRepository();
  const { aID, isAuthValid } = useAuthQueryScope();
  return useUnifiedQuery(() => auth.ListPhones({ limit: 50, offset: 0 }), AUTH_PHONES(aID), undefined, {
    enabled: isAuthValid && Boolean(aID),
  });
};

export const useCreateEmail = (options?: HookToastMessages) => {
  const auth = useAuthRepository();
  const accountId = AuthStore.getState().currentAccountId;
  return useMutation({
    mutationFn: (body: Login.Request.CreateEmail) => auth.CreateEmail(body),
    onSuccess: () => {
      authEventEmitter.invalidateEmails(accountId);
      emitHookSuccess(options);
    },
    onError: (error: AxiosError) => {
      emitHookError(error, options, "[useCreateEmail] error");
    },
  });
};

export const useSendEmailVerificationCode = (options?: HookToastMessages) => {
  const auth = useAuthRepository();
  return useMutation({
    mutationFn: ({ emailId, lang }: { emailId: string; lang?: LanguageEnum }) => auth.SendEmailVerificationCode(emailId, { lang }),
    onSuccess: () => {
      emitHookSuccess(options);
    },
    onError: (error: AxiosError) => {
      emitHookError(error, options, "[useSendEmailVerificationCode] error");
    },
  });
};

export const useVerifyEmail = (options?: HookToastMessages) => {
  const auth = useAuthRepository();
  const accountId = AuthStore.getState().currentAccountId;
  return useMutation({
    mutationFn: ({ emailId, verificationCode }: { emailId: string; verificationCode: string }) =>
      auth.VerifyEmail(emailId, { verificationCode }),
    onSuccess: () => {
      authEventEmitter.invalidateEmails(accountId);
      emitHookSuccess(options);
    },
    onError: (error: AxiosError) => {
      emitHookError(error, options, "[useVerifyEmail] error");
    },
  });
};

export const useUpdateEmail = (options?: HookToastMessages) => {
  const auth = useAuthRepository();
  const accountId = AuthStore.getState().currentAccountId;
  return useMutation({
    mutationFn: ({ emailId, email }: { emailId: string; email: string }) => auth.UpdateEmail(emailId, { email }),
    onSuccess: () => {
      authEventEmitter.invalidateEmails(accountId);
      emitHookSuccess(options);
    },
    onError: (error: AxiosError) => {
      emitHookError(error, options, "[useUpdateEmail] error");
    },
  });
};

export const useSetPrimaryEmail = (options?: HookToastMessages) => {
  const auth = useAuthRepository();
  const accountId = AuthStore.getState().currentAccountId;
  return useMutation({
    mutationFn: (emailId: string) => auth.SetPrimaryEmail(emailId),
    onSuccess: () => {
      authEventEmitter.invalidateEmails(accountId);
      authEventEmitter.emit(authEvents.UPDATE_ACCOUNT_SUCCESS, accountId);
      emitHookSuccess(options);
    },
    onError: (error: AxiosError) => {
      emitHookError(error, options, "[useSetPrimaryEmail] error");
    },
  });
};

export const useDeleteEmail = (options?: HookToastMessages) => {
  const auth = useAuthRepository();
  const accountId = AuthStore.getState().currentAccountId;
  return useMutation({
    mutationFn: (emailId: string) => auth.DeleteEmail(emailId),
    onSuccess: () => {
      authEventEmitter.invalidateEmails(accountId);
      emitHookSuccess(options);
    },
    onError: (error: AxiosError) => {
      emitHookError(error, options, "[useDeleteEmail] error");
    },
  });
};

export const useSendChangePasswordVerificationCode = (options?: HookToastMessages) => {
  const auth = useAuthRepository();
  return useMutation({
    mutationFn: (body: Login.Request.SendChangePasswordVerificationCode = {}) => auth.SendChangePasswordVerificationCode(body),
    onSuccess: () => {
      emitHookSuccess(options);
    },
    onError: (error: AxiosError) => {
      emitHookError(error, options, "[useSendChangePasswordVerificationCode] error");
    },
  });
};

export const useChangePassword = (options?: HookToastMessages) => {
  const auth = useAuthRepository();
  return useMutation({
    mutationFn: (body: Login.Request.ChangePassword) => auth.ChangePassword(body),
    onSuccess: () => {
      emitHookSuccess(options);
    },
    onError: (error: AxiosError) => {
      emitHookError(error, options, "[useChangePassword] error");
    },
  });
};

export const useConfirmProfileBackgrounds = (options?: HookToastMessages) => {
  const auth = useAuthRepository();
  const { kind } = useAuthQueryScope();
  return useMutation({
    mutationFn: (body: Profile.Request.ConfirmProfileBackgrounds) => auth.ConfirmProfileBackgrounds(kind, body),
    onSuccess: () => {
      const aID = AuthStore.getState().currentAccountId;
      authEventEmitter.emit(authEvents.UPDATE_ACCOUNT_SUCCESS, aID);
    },
    onError: (error: AxiosError) => {
      emitHookError(error, options, "[useConfirmProfileBackgrounds] error");
    },
  });
};

export const useCreatePhone = (options?: HookToastMessages) => {
  const auth = useAuthRepository();
  const accountId = AuthStore.getState().currentAccountId;
  return useMutation({
    mutationFn: (body: Login.Request.CreatePhone) => auth.CreatePhone(body),
    onSuccess: () => {
      authEventEmitter.invalidatePhones(accountId);
      emitHookSuccess(options);
    },
    onError: (error: AxiosError) => {
      emitHookError(error, options, "[useCreatePhone] error");
    },
  });
};

export const useSendPhoneVerificationCode = (options?: HookToastMessages) => {
  const auth = useAuthRepository();
  return useMutation({
    mutationFn: (phoneId: string) => auth.SendPhoneVerificationCode(phoneId),
    onSuccess: () => {
      emitHookSuccess(options);
    },
    onError: (error: AxiosError) => {
      emitHookError(error, options, "[useSendPhoneVerificationCode] error");
    },
  });
};

export const useVerifyPhone = (options?: HookToastMessages) => {
  const auth = useAuthRepository();
  const accountId = AuthStore.getState().currentAccountId;
  return useMutation({
    mutationFn: ({ phoneId, verificationCode }: { phoneId: string; verificationCode: string }) =>
      auth.VerifyPhone(phoneId, { verificationCode }),
    onSuccess: () => {
      authEventEmitter.invalidatePhones(accountId);
      emitHookSuccess(options);
    },
    onError: (error: AxiosError) => {
      emitHookError(error, options, "[useVerifyPhone] error");
    },
  });
};

export const useUpdatePhone = (options?: HookToastMessages) => {
  const auth = useAuthRepository();
  const accountId = AuthStore.getState().currentAccountId;
  return useMutation({
    mutationFn: ({ phoneId, phone }: { phoneId: string; phone: string }) => auth.UpdatePhone(phoneId, { phone }),
    onSuccess: () => {
      authEventEmitter.invalidatePhones(accountId);
      emitHookSuccess(options);
    },
    onError: (error: AxiosError) => {
      emitHookError(error, options, "[useUpdatePhone] error");
    },
  });
};

export const useSetPrimaryPhone = (options?: HookToastMessages) => {
  const auth = useAuthRepository();
  const accountId = AuthStore.getState().currentAccountId;
  return useMutation({
    mutationFn: (phoneId: string) => auth.SetPrimaryPhone(phoneId),
    onSuccess: () => {
      authEventEmitter.invalidatePhones(accountId);
      authEventEmitter.emit(authEvents.UPDATE_ACCOUNT_SUCCESS, accountId);
      emitHookSuccess(options);
    },
    onError: (error: AxiosError) => {
      emitHookError(error, options, "[useSetPrimaryPhone] error");
    },
  });
};

export const useDeletePhone = (options?: HookToastMessages) => {
  const auth = useAuthRepository();
  const accountId = AuthStore.getState().currentAccountId;
  return useMutation({
    mutationFn: (phoneId: string) => auth.DeletePhone(phoneId),
    onSuccess: () => {
      authEventEmitter.invalidatePhones(accountId);
      emitHookSuccess(options);
    },
    onError: (error: AxiosError) => {
      emitHookError(error, options, "[useDeletePhone] error");
    },
  });
};

export const useSearchForgerProfiles = (query: string) => {
  const auth = useAuthRepository();
  const { aID, isAuthValid } = useAuthQueryScope();
  const trimmed = query.trim();
  return useUnifiedQuery(
    ({ query: q }) => auth.SearchForgerProfiles({ query: q, limit: 50, offset: 0 }),
    AUTH_PROFILE_SEARCH(aID, ProfileKindEnum.COMMUNITY, trimmed),
    { query: trimmed },
    { enabled: isAuthValid && Boolean(aID) && trimmed.length > 0 },
  );
};

export const useSearchAuthorityProfiles = (query: string) => {
  const auth = useAuthRepository();
  const { aID, isAuthValid } = useAuthQueryScope();
  const trimmed = query.trim();
  return useUnifiedQuery(
    ({ query: q }) => auth.SearchAuthorityProfiles({ query: q, limit: 50, offset: 0 }),
    AUTH_PROFILE_SEARCH(aID, ProfileKindEnum.AUTHORITY, trimmed),
    { query: trimmed },
    { enabled: isAuthValid && Boolean(aID) && trimmed.length > 0 },
  );
};

export const useGetPublicProfileCard = (profileId: string) => {
  const auth = useAuthRepository();
  const { isAuthValid } = useAuthQueryScope();
  return useUnifiedQuery(
    () => auth.GetPublicProfileCard(profileId),
    AUTH_PUBLIC_CARD(profileId),
    undefined,
    { enabled: isAuthValid && Boolean(profileId) },
  );
};

export const useListOwnerForgerProfiles = (query = "") => {
  const auth = useAuthRepository();
  const { aID, isAuthValid } = useAuthQueryScope();
  const trimmed = query.trim();
  return useUnifiedQuery(
    ({ query: q }) => auth.ListOwnerForgerProfiles({ limit: 50, offset: 0, query: q || undefined }),
    [...AUTH_OWNER_FORGERS(aID), trimmed],
    { query: trimmed },
    { enabled: isAuthValid && Boolean(aID) },
  );
};

export const useListOwnerAuthorityProfiles = (query = "") => {
  const auth = useAuthRepository();
  const { aID, isAuthValid } = useAuthQueryScope();
  const trimmed = query.trim();
  return useUnifiedQuery(
    ({ query: q }) => auth.ListOwnerAuthorityProfiles({ limit: 50, offset: 0, query: q || undefined }),
    [...AUTH_OWNER_AUTHORITIES(aID), trimmed],
    { query: trimmed },
    { enabled: isAuthValid && Boolean(aID) },
  );
};

export const useUpdateAuthorityProfileRoles = (options?: HookToastMessages) => {
  const auth = useAuthRepository();
  const accountId = AuthStore.getState().currentAccountId;
  return useMutation({
    mutationFn: ({ profileId, authorityRoles }: { profileId: string; authorityRoles: Profile.Request.UpdateAuthorityProfileRoles["authorityRoles"] }) =>
      auth.UpdateAuthorityProfileRoles(profileId, { authorityRoles }),
    onSuccess: () => {
      authEventEmitter.invalidateOwner(accountId);
      emitHookSuccess(options);
    },
    onError: (error: AxiosError) => {
      emitHookError(error, options, "[useUpdateAuthorityProfileRoles] error");
    },
  });
};

export { hasSelectedProfile, AuthStore, useAuthStore };
export { LanguageEnum, AuthSignupPlatformEnum };
