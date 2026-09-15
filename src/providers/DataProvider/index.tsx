import type { IdentityRepositories } from "@/apis";
import type { ReactNode } from "react";

import { useEffect } from "react";
import { ApiAssetRepository, ApiAuthRepository, IdentityRepositoriesContext, setIdentityRepositories } from "@/apis";
import { scheduleAccessTokenRefresh } from "@/apis/authRefresh";
import { AuthStore, subscribeAuthStorageSync } from "@/stores/auth";

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

export function DataProvider({ children, repositories }: DataProviderProps) {
  const value = repositories ?? defaultIdentityRepositories;
  setIdentityRepositories(value);
  return (
    <IdentityRepositoriesContext.Provider value={value}>
      <AuthSessionBootstrap />
      {children}
    </IdentityRepositoriesContext.Provider>
  );
}
