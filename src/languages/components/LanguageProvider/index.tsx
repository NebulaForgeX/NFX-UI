/**
 * 语言提供者：挂载时用用户传入的 bundles 初始化 i18n，并应用 getLocalLanguage。
 * Language provider: inits i18n with user-provided bundles on mount and applies getLocalLanguage.
 */
import type { LanguageProviderProps } from "../../types";

import { memo, useEffect } from "react";

import i18n, { initI18n } from "../../languages/i18n";
import { LANGUAGE_STORAGE_KEY } from "../../types";
import { getLocalLanguage } from "../../utils";

const LanguageProvider = memo(({ children, bundles, fallbackLng, onLoadExtraBundles }: LanguageProviderProps) => {
  useEffect(() => {
    initI18n({ bundles, fallbackLng, onLoadExtraBundles });
    const lng = getLocalLanguage();
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
    void i18n.changeLanguage(lng);
  }, [bundles, fallbackLng, onLoadExtraBundles]);

  return <>{children}</>;
});

LanguageProvider.displayName = "LanguageProvider";
export default LanguageProvider;
