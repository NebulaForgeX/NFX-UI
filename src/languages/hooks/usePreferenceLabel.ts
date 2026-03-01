/**
 * 返回 { getPreferenceDisplayName }（Base 展示名），便于扩展；可传给 SlideDownSwitcher 的 getDisplayName。
 * Returns { getPreferenceDisplayName } for extensibility; pass to SlideDownSwitcher getDisplayName.
 */
import type { BaseEnum } from "@/themes/types";

import { useCallback, useMemo } from "react";

import i18n from "../languages/i18n";

function getPreferenceDisplayNameImpl(base: BaseEnum): string {
  return i18n.t("baseSwitcher." + base, { ns: "preference", defaultValue: base });
}

export function usePreferenceLabel(): { getPreferenceDisplayName: (base: BaseEnum) => string } {
  const getPreferenceDisplayName = useCallback(getPreferenceDisplayNameImpl, []);
  return useMemo(() => ({ getPreferenceDisplayName }), [getPreferenceDisplayName]);
}

export { getPreferenceDisplayNameImpl as getPreferenceDisplayName };
