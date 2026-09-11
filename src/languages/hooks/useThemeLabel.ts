/**
 * Accent / appearance labels for ThemeSettings.
 */
import type { AccentColorEnum } from "@/enums/theme";

import { useCallback, useMemo } from "react";

import i18n from "../languages/i18n";

function getThemeDisplayNameImpl(accent: AccentColorEnum): string {
  return i18n.t("accent." + accent, { ns: "theme", defaultValue: accent });
}

export function useThemeLabel(): { getThemeDisplayName: (accent: AccentColorEnum) => string } {
  const getThemeDisplayName = useCallback(getThemeDisplayNameImpl, []);
  return useMemo(() => ({ getThemeDisplayName }), [getThemeDisplayName]);
}

export { getThemeDisplayNameImpl as getThemeDisplayName };
