import type { IdentityRepositories } from "nfx-ui/apis";
import type { ReactNode } from "react";

import { useEffect, useMemo } from "react";
import { ApiAssetRepository, ApiAuthRepository, IdentityRepositoriesContext, setIdentityRepositories, useAuthRepository } from "nfx-ui/apis";
import { clearScheduledTokenRefresh, scheduleAccessTokenRefresh } from "nfx-ui/apis/authRefresh";
import { authEventEmitter, authEvents } from "nfx-ui/events/auth";
import { useAuthQueryScope, useCurrentProfile } from "nfx-ui/hooks/auth";
import { configurePreferenceSync, useApplyPreferenceOnLoad } from "nfx-ui/hooks/preference";
import { AuthStore, hasSelectedProfile, subscribeAuthStorageSync, useAuthStore } from "nfx-ui/stores/auth";
import { parseServerPreference, toServerPreference } from "nfx-ui/stores/preference";

const defaultIdentityRepositories: IdentityRepositories = {
  auth: new ApiAuthRepository(),
  asset: new ApiAssetRepository(),
};

setIdentityRepositories(defaultIdentityRepositories);

export interface DataProviderProps {
  children: ReactNode;
  repositories?: IdentityRepositories;
}

function AuthSessionBootstrap() {
  const { refetch } = useCurrentProfile();
  const isAuthValid = useAuthStore((s) => s.isAuthValid);
  const accessToken = useAuthStore((s) => s.accessToken);
  const profileId = useAuthStore((s) => s.currentProfileId);

  useEffect(() => {
    if (!isAuthValid || !accessToken) {
      clearScheduledTokenRefresh();
      return;
    }
    scheduleAccessTokenRefresh(accessToken);
    return () => clearScheduledTokenRefresh();
  }, [isAuthValid, accessToken]);

  useEffect(() => {
    return subscribeAuthStorageSync(() => {
      const { accessToken: nextAccessToken, isAuthValid: nextValid } = AuthStore.getState();
      if (!nextValid || !nextAccessToken) {
        clearScheduledTokenRefresh();
        return;
      }
      scheduleAccessTokenRefresh(nextAccessToken);
    });
  }, []);

  useEffect(() => {
    if (!isAuthValid || !hasSelectedProfile(profileId)) return;
    void refetch();
  }, [isAuthValid, profileId, refetch]);

  useEffect(() => {
    const onLoginSuccess = async () => {
      await refetch();
    };
    authEventEmitter.on(authEvents.LOGIN_SUCCESS, onLoginSuccess);
    return () => {
      authEventEmitter.off(authEvents.LOGIN_SUCCESS, onLoginSuccess);
    };
  }, [refetch]);

  return null;
}

function AuthPreferenceSync() {
  const auth = useAuthRepository();
  const { kind, isAuthValid, pID } = useAuthQueryScope();
  const { profile } = useCurrentProfile();

  useEffect(() => {
    if (!isAuthValid || !hasSelectedProfile(pID)) {
      configurePreferenceSync(undefined);
      return;
    }
    configurePreferenceSync((state) => {
      void auth.UpdatePreference(kind, JSON.stringify(toServerPreference(state)));
    });
    return () => configurePreferenceSync(undefined);
  }, [auth, kind, isAuthValid, pID]);

  const serverPreference = useMemo(() => (profile?.preference ? parseServerPreference(profile.preference) : null), [profile?.preference]);

  useApplyPreferenceOnLoad({
    isAuthValid: isAuthValid && hasSelectedProfile(pID),
    applyKey: pID,
    serverPreference,
  });

  return null;
}

export function DataProvider({ children, repositories }: DataProviderProps) {
  const value = repositories ?? defaultIdentityRepositories;
  setIdentityRepositories(value);
  return (
    <IdentityRepositoriesContext.Provider value={value}>
      <AuthSessionBootstrap />
      <AuthPreferenceSync />
      {children}
    </IdentityRepositoriesContext.Provider>
  );
}
