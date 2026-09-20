import type { IdentityRepositories } from "nfx-ui/apis";
import type { ReactNode } from "react";

import { useEffect, useMemo } from "react";
import { ApiAssetRepository, ApiAuthRepository, IdentityRepositoriesContext, setIdentityRepositories, useAuthRepository } from "nfx-ui/apis";
import { scheduleAccessTokenRefresh } from "nfx-ui/apis/authRefresh";
import { useAuthQueryScope, useCurrentProfile } from "nfx-ui/hooks/auth";
import { configurePreferenceSync, useApplyPreferenceOnLoad } from "nfx-ui/hooks/preference";
import { AuthStore, hasSelectedProfile, subscribeAuthStorageSync } from "nfx-ui/stores/auth";
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
  useEffect(() => {
    const accessToken = AuthStore.getState().accessToken;
    if (accessToken) scheduleAccessTokenRefresh(accessToken);
    return subscribeAuthStorageSync(() => {
      const next = AuthStore.getState().accessToken;
      if (next) scheduleAccessTokenRefresh(next);
    });
  }, []);
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
