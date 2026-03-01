/**
 * 返回 { getLanguageDisplayName }，便于扩展；getLanguageDisplayName 可传给 SlideDownSwitcher 的 getDisplayName。
 * Returns { getLanguageDisplayName } for extensibility; pass to SlideDownSwitcher getDisplayName.
 */
import type { LanguageEnum } from "../types";

import { useCallback, useMemo } from "react";

import i18n from "../languages/i18n";

function getLanguageDisplayNameImpl(lang: LanguageEnum): string {
  return i18n.t("languageSwitcher." + lang, { ns: "language", defaultValue: lang });
}

export function useLanguageLabel(): { getLanguageDisplayName: (lang: LanguageEnum) => string } {
  const getLanguageDisplayName = useCallback(getLanguageDisplayNameImpl, []);
  return useMemo(() => ({ getLanguageDisplayName }), [getLanguageDisplayName]);
}

export { getLanguageDisplayNameImpl as getLanguageDisplayName };
