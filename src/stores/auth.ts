import type { Tokens } from "nfx-ui/types";

import { DEFAULT_PROFILE_KIND, ProfileKind, ProfileKindEnum } from "nfx-ui/enums";
import { makeStore } from "nfx-ui/stores/makeStore";

/**
 * Auth session: memory is source of truth.
 * Persistence is ONE key in ONE storage: rememberMe → localStorage, else sessionStorage.
 * Step-1 login tokens (profile not selected) stay memory-only.
 */
export type AuthState = {
  isAuthValid: boolean;
  accessToken: Nullable<string>;
  refreshToken: Nullable<string>;
  currentAccountId: string;
  currentProfileId: string;
  currentProfileKind: ProfileKindEnum;
  rememberMe: boolean;
};

interface AuthActions {
  setIsAuthValid: (isAuthValid: boolean) => void;
  setTokens: (tokens: Tokens.Response.Tokens, options?: { rememberMe?: boolean }) => void;
  setCurrentAccountId: (accountId: string) => void;
  setCurrentProfileId: (profileId: string) => void;
  setCurrentProfileKind: (kind: ProfileKindEnum) => void;
  clearAuth: () => void;
}

const AUTH_STORAGE_KEY = "nfx-auth-storage";
const AUTH_BROADCAST_CHANNEL = "nfx-auth";

export const EMPTY_ACCOUNT_ID = "00000000-0000-0000-0000-000000000000";
export const EMPTY_PROFILE_ID = "00000000-0000-0000-0000-000000000000";

export function hasSelectedProfile(profileId: string): boolean {
  return profileId !== EMPTY_PROFILE_ID && profileId.trim() !== "";
}

const LOGGED_OUT_STATE: AuthState = {
  isAuthValid: false,
  accessToken: null,
  refreshToken: null,
  currentAccountId: EMPTY_ACCOUNT_ID,
  currentProfileId: EMPTY_PROFILE_ID,
  currentProfileKind: DEFAULT_PROFILE_KIND,
  rememberMe: false,
};

type AuthBroadcastMessage = { type: "auth"; snapshot: AuthState } | { type: "clear" };

function parseSnapshot(raw: Nullable<string>): Nullable<AuthState> {
  if (!raw) return null;
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!value || typeof value !== "object") return null;
  const target = value as Partial<AuthState>;

  const accessToken = typeof target.accessToken === "string" ? target.accessToken : null;
  const refreshToken = typeof target.refreshToken === "string" ? target.refreshToken : null;
  const currentAccountId = typeof target.currentAccountId === "string" ? target.currentAccountId : EMPTY_ACCOUNT_ID;
  const currentProfileId = typeof target.currentProfileId === "string" ? target.currentProfileId : EMPTY_PROFILE_ID;
  if (!accessToken || !refreshToken || !hasSelectedProfile(currentProfileId)) return null;

  return {
    isAuthValid: typeof target.isAuthValid === "boolean" ? target.isAuthValid : false,
    accessToken,
    refreshToken,
    currentAccountId,
    currentProfileId,
    currentProfileKind: ProfileKind(target.currentProfileKind),
    rememberMe: target.rememberMe === true,
  };
}

function clearPersistedAuth() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

export function readAuthState(): Nullable<AuthState> {
  if (typeof window === "undefined") return null;
  const localRaw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  const sessionRaw = window.sessionStorage.getItem(AUTH_STORAGE_KEY);

  if (localRaw != null && sessionRaw != null) {
    clearPersistedAuth();
    return null;
  }

  const snapshot = parseSnapshot(localRaw) ?? parseSnapshot(sessionRaw);
  if (!snapshot) {
    if (localRaw != null || sessionRaw != null) clearPersistedAuth();
    return null;
  }
  return { ...snapshot, rememberMe: localRaw != null };
}

function persist(snapshot: AuthState) {
  if (typeof window === "undefined") return;
  if (!snapshot.isAuthValid || !snapshot.accessToken || !snapshot.refreshToken || !hasSelectedProfile(snapshot.currentProfileId)) {
    clearPersistedAuth();
    return;
  }
  const payload = JSON.stringify(snapshot);
  if (snapshot.rememberMe) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, payload);
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
  } else {
    window.sessionStorage.setItem(AUTH_STORAGE_KEY, payload);
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

let authBroadcast: Nullable<BroadcastChannel> = null;
let suppressSync = false;

function getAuthBroadcast(): Nullable<BroadcastChannel> {
  if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") return null;
  if (!authBroadcast) authBroadcast = new BroadcastChannel(AUTH_BROADCAST_CHANNEL);
  return authBroadcast;
}

function broadcastAuth(message: AuthBroadcastMessage) {
  if (suppressSync) return;
  try {
    getAuthBroadcast()?.postMessage(message);
  } catch {
    // single-tab still works
  }
}

let rejectedRefreshToken: Nullable<string> = null;

export function clearRejectedRefreshToken() {
  rejectedRefreshToken = null;
}

export function markRejectedRefreshToken(token: string) {
  rejectedRefreshToken = token;
}

export function isRejectedRefreshToken(token: string): boolean {
  return rejectedRefreshToken != null && rejectedRefreshToken === token;
}

const initialState: AuthState = readAuthState() ?? LOGGED_OUT_STATE;

function snapshotFromMemory(overrides: Partial<AuthState> = {}): AuthState {
  const current = AuthStore.getState();
  return {
    isAuthValid: current.isAuthValid,
    accessToken: current.accessToken,
    refreshToken: current.refreshToken,
    currentAccountId: current.currentAccountId,
    currentProfileId: current.currentProfileId,
    currentProfileKind: current.currentProfileKind,
    rememberMe: current.rememberMe,
    ...overrides,
  };
}

function commitAuthState(snapshot: AuthState) {
  AuthStore.setState(snapshot);
  persist(snapshot);
  if (hasSelectedProfile(snapshot.currentProfileId)) {
    broadcastAuth({ type: "auth", snapshot });
  }
}

const { store: AuthStore, useStore: useAuthStore } = makeStore<AuthState, AuthActions>(initialState, (set) => ({
  setIsAuthValid: (isAuthValid) => {
    commitAuthState(snapshotFromMemory({ isAuthValid }));
  },

  setTokens: (tokens, options) => {
    clearRejectedRefreshToken();
    commitAuthState(
      snapshotFromMemory({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        ...(options?.rememberMe != null ? { rememberMe: options.rememberMe } : {}),
      }),
    );
  },

  setCurrentAccountId: (accountId) => {
    commitAuthState(snapshotFromMemory({ currentAccountId: accountId }));
  },

  setCurrentProfileId: (profileId) => {
    commitAuthState(snapshotFromMemory({ currentProfileId: profileId }));
  },

  setCurrentProfileKind: (kind) => {
    commitAuthState(snapshotFromMemory({ currentProfileKind: ProfileKind(kind) }));
  },

  clearAuth: () => {
    clearPersistedAuth();
    clearRejectedRefreshToken();
    broadcastAuth({ type: "clear" });
    set({ ...LOGGED_OUT_STATE });
  },
}));

const setIsAuthValid = AuthStore.getState().setIsAuthValid;
const setTokens = AuthStore.getState().setTokens;
const setCurrentAccountId = AuthStore.getState().setCurrentAccountId;
const setCurrentProfileId = AuthStore.getState().setCurrentProfileId;
const setCurrentProfileKind = AuthStore.getState().setCurrentProfileKind;
const clearAuth = AuthStore.getState().clearAuth;

function statesEqual(a: AuthState, b: AuthState): boolean {
  return (
    a.isAuthValid === b.isAuthValid &&
    a.accessToken === b.accessToken &&
    a.refreshToken === b.refreshToken &&
    a.currentAccountId === b.currentAccountId &&
    a.currentProfileId === b.currentProfileId &&
    a.currentProfileKind === b.currentProfileKind &&
    a.rememberMe === b.rememberMe
  );
}

function applyRemoteSnapshot(snapshot: AuthState): boolean {
  if (statesEqual(AuthStore.getState(), snapshot)) return false;
  suppressSync = true;
  try {
    AuthStore.setState(snapshot);
    persist(snapshot);
    clearRejectedRefreshToken();
  } finally {
    suppressSync = false;
  }
  return true;
}

function applyRemoteClear(): boolean {
  const current = AuthStore.getState();
  if (!current.isAuthValid && !current.accessToken && !current.refreshToken) return false;
  suppressSync = true;
  try {
    clearPersistedAuth();
    clearRejectedRefreshToken();
    AuthStore.setState({ ...LOGGED_OUT_STATE });
  } finally {
    suppressSync = false;
  }
  return true;
}

export function subscribeAuthStorageSync(onSynced?: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;

  const onStorage = (event: StorageEvent) => {
    if (event.storageArea !== window.localStorage) return;
    if (event.key != null && event.key !== AUTH_STORAGE_KEY) return;
    const snapshot = readAuthState();
    const changed = snapshot ? applyRemoteSnapshot(snapshot) : applyRemoteClear();
    if (changed) onSynced?.();
  };

  const channel = getAuthBroadcast();
  const onBroadcast = (event: MessageEvent<AuthBroadcastMessage>) => {
    const data = event.data;
    if (!data || typeof data !== "object") return;
    let changed = false;
    if (data.type === "clear") {
      changed = applyRemoteClear();
    } else if (data.type === "auth" && data.snapshot) {
      changed = applyRemoteSnapshot(data.snapshot);
    }
    if (changed) onSynced?.();
  };

  window.addEventListener("storage", onStorage);
  channel?.addEventListener("message", onBroadcast);

  return () => {
    window.removeEventListener("storage", onStorage);
    channel?.removeEventListener("message", onBroadcast);
  };
}

export { setIsAuthValid, setTokens, setCurrentAccountId, setCurrentProfileId, setCurrentProfileKind, clearAuth };
export { AuthStore, useAuthStore };
