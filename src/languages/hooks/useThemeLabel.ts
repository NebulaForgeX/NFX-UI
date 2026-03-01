/**
 * 返回 { getThemeDisplayName }，便于扩展；getThemeDisplayName 可传给 SlideDownSwitcher 的 getDisplayName。
 * Returns { getThemeDisplayName } for extensibility; pass to SlideDownSwitcher getDisplayName.
 */
import type { ThemeEnum } from "@/themes/types";

import { useCallback, useMemo } from "react";

import i18n from "../languages/i18n";

function getThemeDisplayNameImpl(theme: ThemeEnum): string {
  return i18n.t("themeSwitcher." + theme, { ns: "theme", defaultValue: theme });
}

export function useThemeLabel(): { getThemeDisplayName: (theme: ThemeEnum) => string } {
  const getThemeDisplayName = useCallback(getThemeDisplayNameImpl, []);
  return useMemo(() => ({ getThemeDisplayName }), [getThemeDisplayName]);
}

export { getThemeDisplayNameImpl as getThemeDisplayName };
