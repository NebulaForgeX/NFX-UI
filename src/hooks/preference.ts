/**
 * Shared preference hooks — appearance resolve + host-configured server sync.
 */
import type { PreferencePatch, ResolvedPreference } from "nfx-ui/stores/preference";
import type { RadixAppearance } from "nfx-ui/themes/radix";

import { useEffect, useRef, useState } from "react";

import { AppearanceEnum } from "nfx-ui/enums/theme";
import {
  PreferenceStore,
  replacePreference,
  setPreference,
  usePreferenceStore,
} from "nfx-ui/stores/preference";
import { readSystemRadixAppearance, resolveRadixAppearance } from "nfx-ui/themes/radix";

/** 将 theme.appearance（含 system）解析为当前生效的 Radix light|dark，并在跟随系统时响应 OS 切换。 */
export function useResolvedAppearance(): RadixAppearance {
  const appearance = usePreferenceStore((s) => s.theme.appearance);
  const [systemAppearance, setSystemAppearance] = useState<RadixAppearance>(readSystemRadixAppearance);

  useEffect(() => {
    if (appearance !== AppearanceEnum.SYSTEM) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setSystemAppearance(mq.matches ? AppearanceEnum.DARK : AppearanceEnum.LIGHT);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [appearance]);

  return appearance === AppearanceEnum.SYSTEM ? systemAppearance : resolveRadixAppearance(appearance);
}

function patchHasServerField(patch: PreferencePatch): boolean {
  if (patch.language !== undefined) return true;
  if (patch.theme && Object.keys(patch.theme).length > 0) return true;
  if (patch.layoutMode !== undefined) return true;
  if (patch.dashboardBackground !== undefined) return true;
  return false;
}

type PreferenceSyncFn = (state: ResolvedPreference) => void | Promise<void>;
let preferenceSync: PreferenceSyncFn | undefined;

/** Hosts register persistence here — no CityPulso API. */
export function configurePreferenceSync(fn: PreferenceSyncFn | undefined): void {
  preferenceSync = fn;
}

/** 登录后用服务端偏好覆盖本地；无服务端数据时保留本地 persist。 */
export const useApplyPreferenceOnLoad = (args: {
  isAuthValid: boolean;
  applyKey?: string | null;
  serverPreference?: ResolvedPreference | null;
}) => {
  const { isAuthValid, applyKey, serverPreference } = args;
  const lastAppliedKey = useRef<string | null>(null);

  useEffect(() => {
    if (!isAuthValid || !serverPreference) return;
    const key = applyKey ?? "default";
    if (lastAppliedKey.current === key) return;
    lastAppliedKey.current = key;
    replacePreference(serverPreference);
  }, [isAuthValid, applyKey, serverPreference]);
};

export const useSyncPreference = () => {
  const syncPreference = (patch: PreferencePatch) => {
    setPreference(patch);
    if (!patchHasServerField(patch)) return;
    void Promise.resolve(preferenceSync?.(PreferenceStore.getState())).catch((error) => {
      console.error("Failed to sync preference:", error);
    });
  };

  return { syncPreference };
};
