import type { AssetRepository } from "./AssetRepository";
import type { AuthRepository } from "./AuthRepository";

import { createContext, useContext } from "react";

export interface IdentityRepositories {
  auth: AuthRepository;
  asset: AssetRepository;
}

export const IdentityRepositoriesContext = createContext<Nullable<IdentityRepositories>>(null);

export function useIdentityRepositories(): IdentityRepositories {
  const ctx = useContext(IdentityRepositoriesContext);
  if (!ctx) {
    throw new Error("useIdentityRepositories must be used inside NFX-UI DataProvider");
  }
  return ctx;
}

export function useAuthRepository() {
  return useIdentityRepositories().auth;
}

export function useAssetRepository() {
  return useIdentityRepositories().asset;
}
