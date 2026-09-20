/**
 * Auth hooks — 组件勿直接调 apis/auth
 */
import type { AxiosError } from "axios";
import type { CurrentProfileResult, Login, Profile, Signup } from "nfx-ui/types";

import { useEffect } from "react";
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
import { getApiErrorMessage } from "nfx-ui/utils/apiError";
import { pickProfile } from "nfx-ui/utils/domain/account";
import { useUnifiedQuery } from "nfx-ui/utils/factory";
import { safeOr, safeStringable } from "nfx-ui/utils/safe";
import { useTranslation } from "react-i18next";

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

export const useSendVerificationCode = () => {
  const auth = useAuthRepository();
  const { t } = useTranslation("hooks", { keyPrefix: "account" });
  return useMutation({
    mutationFn: (params: Signup.Request.SendVerificationCode) => auth.SendVerificationCode(params),
    onSuccess: () => {
      systemEventEmitter.showSuccess(t("sendVerificationCodeSuccess", { defaultValue: "Code sent" }));
    },
    onError: (error: AxiosError) => {
      systemEventEmitter.showError(getApiErrorMessage(error, "[useSendVerificationCode] error"));
    },
  });
};

export const useSignupWithEmail = () => {
  const auth = useAuthRepository();
  return useMutation({
    mutationFn: async ({
      rememberMe,
      ...params
    }: {
      rememberMe: boolean;
    } & Omit<Signup.Request.SignupWithEmail, "deviceId">): Promise<Signup.Response.SignupWithEmail & { profileId?: string }> => {
      const deviceId = await ensureDeviceIdStorage();
      const result = await auth.SignupWithEmail({
        ...params,
        deviceId,
      });
      const first = result.profiles?.find((p) => p.kind === ProfileKindEnum.FORGER) ?? result.profiles?.[0];
      if (!first) return result;
      const selected = await auth.SelectProfile({
        profileId: first.profileId,
        kind: first.kind,
        deviceId,
      });
      return { ...result, accessToken: selected.accessToken, refreshToken: selected.refreshToken, profileId: selected.profileId };
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
        setCurrentProfileKind(ProfileKindEnum.FORGER);
        authEventEmitter.emit(authEvents.LOGIN_SUCCESS, result.accountId);
      } else {
        setCurrentProfileId(EMPTY_PROFILE_ID);
      }
    },
    onError: (error: AxiosError) => {
      systemEventEmitter.showError(getApiErrorMessage(error, "[useSignup] error"));
    },
  });
};

export const useLoginWithEmail = () => {
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
      systemEventEmitter.showError(getApiErrorMessage(error, "[useLogin] error"));
    },
  });
};

export const useLoginWithPhone = () => {
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
      systemEventEmitter.showError(getApiErrorMessage(error, "[useLoginWithPhone] error"));
    },
  });
};

export const useSelectProfile = () => {
  const auth = useAuthRepository();
  return useMutation({
    mutationFn: async ({ profileId, kind }: { profileId: string; kind: Login.ProfileKind }) =>
      auth.SelectProfile({
        profileId,
        kind,
        deviceId: await ensureDeviceIdStorage(),
      }),
    onSuccess: (result, variables) => {
      if (result?.accessToken) {
        setTokens({
          accessToken: result.accessToken,
          refreshToken: safeStringable(result.refreshToken),
        });
        setCurrentProfileKind(variables.kind);
        if (result.profileId) setCurrentProfileId(result.profileId);
        authEventEmitter.emit(authEvents.LOGIN_SUCCESS, result.accountId);
      }
    },
    onError: (error: AxiosError) => {
      systemEventEmitter.showError(getApiErrorMessage(error, "[useSelectProfile] error"));
    },
  });
};

export const usePatchProfile = (options?: { silent?: boolean }) => {
  const auth = useAuthRepository();
  const { kind } = useAuthQueryScope();
  const silent = safeOr(options?.silent, false);
  const { t } = useTranslation("pages.User.Profile.Edit");
  return useMutation({
    mutationFn: (body: Profile.Request.PatchProfile) => auth.PatchProfile(kind, body),
    onSuccess: () => {
      if (!silent) systemEventEmitter.showSuccess(t("saveSuccess", { defaultValue: "Saved" }));
      const aID = AuthStore.getState().currentAccountId;
      authEventEmitter.invalidateProfiles({ aID, kind });
    },
    onError: (error: AxiosError) => {
      if (!silent) systemEventEmitter.showError(getApiErrorMessage(error, "[usePatchProfile] error"));
    },
  });
};

export const useUpdateProfileSettings = () => {
  const auth = useAuthRepository();
  const { kind } = useAuthQueryScope();
  const { t } = useTranslation("hooks", { keyPrefix: "account" });
  return useMutation({
    mutationFn: (body: Profile.Request.PatchProfileSettings) => auth.PatchProfileSettings(kind, body),
    onSuccess: () => {
      const aID = AuthStore.getState().currentAccountId;
      authEventEmitter.emit(authEvents.UPDATE_ACCOUNT_SUCCESS, aID);
      systemEventEmitter.showSuccess(t("updateSettingsSuccess", { defaultValue: "Settings updated." }));
    },
    onError: (error: AxiosError) => {
      systemEventEmitter.showError(getApiErrorMessage(error, "[useUpdateProfileSettings] error"));
    },
  });
};

export const useUpdatePreference = () => {
  const auth = useAuthRepository();
  const { kind } = useAuthQueryScope();
  return useMutation({
    mutationFn: (preference: string) => auth.UpdatePreference(kind, preference),
    onError: (error: AxiosError) => {
      systemEventEmitter.showError(getApiErrorMessage(error, "[useUpdatePreference] error"));
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

export const useCreateForgerProfile = () => {
  const auth = useAuthRepository();
  return useMutation({
    mutationFn: (body: Login.Request.CreateForgerProfile) => auth.CreateForgerProfile(body),
    onSuccess: () => {
      const aID = AuthStore.getState().currentAccountId;
      authEventEmitter.invalidateProfiles({ aID, kind: ProfileKindEnum.FORGER });
    },
    onError: (error: AxiosError) => {
      systemEventEmitter.showError(getApiErrorMessage(error, "[useCreateForgerProfile] error"));
    },
  });
};

export const useCreateAuthorityProfile = () => {
  const auth = useAuthRepository();
  return useMutation({
    mutationFn: (body: Login.Request.CreateAuthorityProfile) => auth.CreateAuthorityProfile(body),
    onSuccess: () => {
      const aID = AuthStore.getState().currentAccountId;
      authEventEmitter.invalidateProfiles({ aID, kind: ProfileKindEnum.AUTHORITY });
    },
    onError: (error: AxiosError) => {
      systemEventEmitter.showError(getApiErrorMessage(error, "[useCreateAuthorityProfile] error"));
    },
  });
};

export const useDeleteProfile = () => {
  const auth = useAuthRepository();
  return useMutation({
    mutationFn: ({ kind, profileId }: { kind: ProfileKindEnum; profileId: string }) => auth.DeleteProfile(kind, profileId),
    onSuccess: (_void, variables) => {
      const aID = AuthStore.getState().currentAccountId;
      authEventEmitter.invalidateProfiles({ aID, kind: variables.kind });
    },
    onError: (error: AxiosError) => {
      systemEventEmitter.showError(getApiErrorMessage(error, "[useDeleteProfile] error"));
    },
  });
};

export const useConfirmProfileAvatar = () => {
  const auth = useAuthRepository();
  const { kind } = useAuthQueryScope();
  return useMutation({
    mutationFn: (body: Profile.Request.ConfirmProfileAvatar) => auth.ConfirmProfileAvatar(kind, body),
    onSuccess: () => {
      const aID = AuthStore.getState().currentAccountId;
      authEventEmitter.emit(authEvents.UPDATE_ACCOUNT_SUCCESS, aID);
    },
    onError: (error: AxiosError) => {
      systemEventEmitter.showError(getApiErrorMessage(error, "[useConfirmProfileAvatar] error"));
    },
  });
};

export const useClearProfileAvatar = () => {
  const auth = useAuthRepository();
  const { kind } = useAuthQueryScope();
  const { t } = useTranslation("hooks", { keyPrefix: "account" });
  return useMutation({
    mutationFn: () => auth.ClearProfileAvatar(kind),
    onSuccess: () => {
      const aID = AuthStore.getState().currentAccountId;
      authEventEmitter.emit(authEvents.UPDATE_ACCOUNT_SUCCESS, aID);
      systemEventEmitter.showSuccess(t("clearAvatarSuccess", { defaultValue: "Avatar removed." }));
    },
    onError: (error: AxiosError) => {
      systemEventEmitter.showError(getApiErrorMessage(error, "[useClearProfileAvatar] error"));
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

export const useCreateEmail = () => {
  const auth = useAuthRepository();
  const accountId = AuthStore.getState().currentAccountId;
  const { t } = useTranslation("hooks", { keyPrefix: "account" });
  return useMutation({
    mutationFn: (body: Login.Request.CreateEmail) => auth.CreateEmail(body),
    onSuccess: () => {
      authEventEmitter.invalidateEmails(accountId);
      systemEventEmitter.showSuccess(t("createEmailSuccess", { defaultValue: "Email added." }));
    },
    onError: (error: AxiosError) => {
      systemEventEmitter.showError(getApiErrorMessage(error, "[useCreateEmail] error"));
    },
  });
};

export const useSendEmailVerificationCode = () => {
  const auth = useAuthRepository();
  const { t } = useTranslation("hooks", { keyPrefix: "account" });
  return useMutation({
    mutationFn: ({ emailId, lang }: { emailId: string; lang?: LanguageEnum }) => auth.SendEmailVerificationCode(emailId, { lang }),
    onSuccess: () => {
      systemEventEmitter.showSuccess(t("sendVerificationCodeSuccess", { defaultValue: "Code sent" }));
    },
    onError: (error: AxiosError) => {
      systemEventEmitter.showError(getApiErrorMessage(error, "[useSendEmailVerificationCode] error"));
    },
  });
};

export const useVerifyEmail = () => {
  const auth = useAuthRepository();
  const accountId = AuthStore.getState().currentAccountId;
  const { t } = useTranslation("hooks", { keyPrefix: "account" });
  return useMutation({
    mutationFn: ({ emailId, verificationCode }: { emailId: string; verificationCode: string }) =>
      auth.VerifyEmail(emailId, { verificationCode }),
    onSuccess: () => {
      authEventEmitter.invalidateEmails(accountId);
      systemEventEmitter.showSuccess(t("verifyEmailSuccess", { defaultValue: "Email verified." }));
    },
    onError: (error: AxiosError) => {
      systemEventEmitter.showError(getApiErrorMessage(error, "[useVerifyEmail] error"));
    },
  });
};

export const useUpdateEmail = () => {
  const auth = useAuthRepository();
  const accountId = AuthStore.getState().currentAccountId;
  const { t } = useTranslation("hooks", { keyPrefix: "account" });
  return useMutation({
    mutationFn: ({ emailId, email }: { emailId: string; email: string }) => auth.UpdateEmail(emailId, { email }),
    onSuccess: () => {
      authEventEmitter.invalidateEmails(accountId);
      systemEventEmitter.showSuccess(t("updateEmailSuccess", { defaultValue: "Email updated." }));
    },
    onError: (error: AxiosError) => {
      systemEventEmitter.showError(getApiErrorMessage(error, "[useUpdateEmail] error"));
    },
  });
};

export const useSetPrimaryEmail = () => {
  const auth = useAuthRepository();
  const accountId = AuthStore.getState().currentAccountId;
  const { t } = useTranslation("hooks", { keyPrefix: "account" });
  return useMutation({
    mutationFn: (emailId: string) => auth.SetPrimaryEmail(emailId),
    onSuccess: () => {
      authEventEmitter.invalidateEmails(accountId);
      authEventEmitter.emit(authEvents.UPDATE_ACCOUNT_SUCCESS, accountId);
      systemEventEmitter.showSuccess(t("setPrimaryEmailSuccess", { defaultValue: "Primary email updated." }));
    },
    onError: (error: AxiosError) => {
      systemEventEmitter.showError(getApiErrorMessage(error, "[useSetPrimaryEmail] error"));
    },
  });
};

export const useDeleteEmail = () => {
  const auth = useAuthRepository();
  const accountId = AuthStore.getState().currentAccountId;
  const { t } = useTranslation("hooks", { keyPrefix: "account" });
  return useMutation({
    mutationFn: (emailId: string) => auth.DeleteEmail(emailId),
    onSuccess: () => {
      authEventEmitter.invalidateEmails(accountId);
      systemEventEmitter.showSuccess(t("deleteEmailSuccess", { defaultValue: "Email removed." }));
    },
    onError: (error: AxiosError) => {
      systemEventEmitter.showError(getApiErrorMessage(error, "[useDeleteEmail] error"));
    },
  });
};

export const useSendChangePasswordVerificationCode = () => {
  const auth = useAuthRepository();
  const { t } = useTranslation("hooks", { keyPrefix: "account" });
  return useMutation({
    mutationFn: (body: Login.Request.SendChangePasswordVerificationCode = {}) => auth.SendChangePasswordVerificationCode(body),
    onSuccess: () => {
      systemEventEmitter.showSuccess(t("sendVerificationCodeSuccess", { defaultValue: "Code sent" }));
    },
    onError: (error: AxiosError) => {
      systemEventEmitter.showError(getApiErrorMessage(error, "[useSendChangePasswordVerificationCode] error"));
    },
  });
};

export const useChangePassword = () => {
  const auth = useAuthRepository();
  const { t } = useTranslation("hooks", { keyPrefix: "account" });
  return useMutation({
    mutationFn: (body: Login.Request.ChangePassword) => auth.ChangePassword(body),
    onSuccess: () => {
      systemEventEmitter.showSuccess(t("changePasswordSuccess", { defaultValue: "Password updated." }));
    },
    onError: (error: AxiosError) => {
      systemEventEmitter.showError(getApiErrorMessage(error, "[useChangePassword] error"));
    },
  });
};

export const useConfirmProfileBackgrounds = () => {
  const auth = useAuthRepository();
  const { kind } = useAuthQueryScope();
  return useMutation({
    mutationFn: (body: Profile.Request.ConfirmProfileBackgrounds) => auth.ConfirmProfileBackgrounds(kind, body),
    onSuccess: () => {
      const aID = AuthStore.getState().currentAccountId;
      authEventEmitter.emit(authEvents.UPDATE_ACCOUNT_SUCCESS, aID);
    },
    onError: (error: AxiosError) => {
      systemEventEmitter.showError(getApiErrorMessage(error, "[useConfirmProfileBackgrounds] error"));
    },
  });
};

export const useCreatePhone = () => {
  const auth = useAuthRepository();
  const accountId = AuthStore.getState().currentAccountId;
  const { t } = useTranslation("hooks", { keyPrefix: "account" });
  return useMutation({
    mutationFn: (body: Login.Request.CreatePhone) => auth.CreatePhone(body),
    onSuccess: () => {
      authEventEmitter.invalidatePhones(accountId);
      systemEventEmitter.showSuccess(t("createPhoneSuccess", { defaultValue: "Phone added." }));
    },
    onError: (error: AxiosError) => {
      systemEventEmitter.showError(getApiErrorMessage(error, "[useCreatePhone] error"));
    },
  });
};

export const useSendPhoneVerificationCode = () => {
  const auth = useAuthRepository();
  const { t } = useTranslation("hooks", { keyPrefix: "account" });
  return useMutation({
    mutationFn: (phoneId: string) => auth.SendPhoneVerificationCode(phoneId),
    onSuccess: () => {
      systemEventEmitter.showSuccess(t("sendVerificationCodeSuccess", { defaultValue: "Code sent" }));
    },
    onError: (error: AxiosError) => {
      systemEventEmitter.showError(getApiErrorMessage(error, "[useSendPhoneVerificationCode] error"));
    },
  });
};

export const useVerifyPhone = () => {
  const auth = useAuthRepository();
  const accountId = AuthStore.getState().currentAccountId;
  const { t } = useTranslation("hooks", { keyPrefix: "account" });
  return useMutation({
    mutationFn: ({ phoneId, verificationCode }: { phoneId: string; verificationCode: string }) =>
      auth.VerifyPhone(phoneId, { verificationCode }),
    onSuccess: () => {
      authEventEmitter.invalidatePhones(accountId);
      systemEventEmitter.showSuccess(t("verifyPhoneSuccess", { defaultValue: "Phone verified." }));
    },
    onError: (error: AxiosError) => {
      systemEventEmitter.showError(getApiErrorMessage(error, "[useVerifyPhone] error"));
    },
  });
};

export const useUpdatePhone = () => {
  const auth = useAuthRepository();
  const accountId = AuthStore.getState().currentAccountId;
  const { t } = useTranslation("hooks", { keyPrefix: "account" });
  return useMutation({
    mutationFn: ({ phoneId, phone }: { phoneId: string; phone: string }) => auth.UpdatePhone(phoneId, { phone }),
    onSuccess: () => {
      authEventEmitter.invalidatePhones(accountId);
      systemEventEmitter.showSuccess(t("updatePhoneSuccess", { defaultValue: "Phone updated." }));
    },
    onError: (error: AxiosError) => {
      systemEventEmitter.showError(getApiErrorMessage(error, "[useUpdatePhone] error"));
    },
  });
};

export const useSetPrimaryPhone = () => {
  const auth = useAuthRepository();
  const accountId = AuthStore.getState().currentAccountId;
  const { t } = useTranslation("hooks", { keyPrefix: "account" });
  return useMutation({
    mutationFn: (phoneId: string) => auth.SetPrimaryPhone(phoneId),
    onSuccess: () => {
      authEventEmitter.invalidatePhones(accountId);
      authEventEmitter.emit(authEvents.UPDATE_ACCOUNT_SUCCESS, accountId);
      systemEventEmitter.showSuccess(t("setPrimaryPhoneSuccess", { defaultValue: "Primary phone updated." }));
    },
    onError: (error: AxiosError) => {
      systemEventEmitter.showError(getApiErrorMessage(error, "[useSetPrimaryPhone] error"));
    },
  });
};

export const useDeletePhone = () => {
  const auth = useAuthRepository();
  const accountId = AuthStore.getState().currentAccountId;
  const { t } = useTranslation("hooks", { keyPrefix: "account" });
  return useMutation({
    mutationFn: (phoneId: string) => auth.DeletePhone(phoneId),
    onSuccess: () => {
      authEventEmitter.invalidatePhones(accountId);
      systemEventEmitter.showSuccess(t("deletePhoneSuccess", { defaultValue: "Phone removed." }));
    },
    onError: (error: AxiosError) => {
      systemEventEmitter.showError(getApiErrorMessage(error, "[useDeletePhone] error"));
    },
  });
};

export const useSearchForgerProfiles = (query: string) => {
  const auth = useAuthRepository();
  const { aID, isAuthValid } = useAuthQueryScope();
  const trimmed = query.trim();
  return useUnifiedQuery(
    ({ query: q }) => auth.SearchForgerProfiles({ query: q, limit: 50, offset: 0 }),
    AUTH_PROFILE_SEARCH(aID, ProfileKindEnum.FORGER, trimmed),
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

export const useUpdateAuthorityProfileRoles = () => {
  const auth = useAuthRepository();
  const accountId = AuthStore.getState().currentAccountId;
  const { t } = useTranslation("hooks", { keyPrefix: "account" });
  return useMutation({
    mutationFn: ({ profileId, authorityRoles }: { profileId: string; authorityRoles: Profile.Request.UpdateAuthorityProfileRoles["authorityRoles"] }) =>
      auth.UpdateAuthorityProfileRoles(profileId, { authorityRoles }),
    onSuccess: () => {
      authEventEmitter.invalidateOwner(accountId);
      systemEventEmitter.showSuccess(t("updateRolesSuccess", { defaultValue: "Roles updated." }));
    },
    onError: (error: AxiosError) => {
      systemEventEmitter.showError(getApiErrorMessage(error, "[useUpdateAuthorityProfileRoles] error"));
    },
  });
};

export { hasSelectedProfile, AuthStore, useAuthStore };
export { LanguageEnum, AuthSignupPlatformEnum };
