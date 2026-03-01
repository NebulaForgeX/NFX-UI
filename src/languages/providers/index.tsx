/**
 * 语言提供者：首次渲染时同步初始化 i18n（保证内层 ModalProvider 等子组件 useTranslation 时已就绪），再用 useEffect 应用本地语言。
 * Language provider: inits i18n synchronously on first render so inner children (e.g. ModalProvider) have i18n ready; then useEffect applies getLocalLanguage.
 */
import type { LanguageProviderProps } from "../types";

import { memo, useEffect, useRef } from "react";

import i18n, { initI18n } from "../languages/i18n";
import { getLocalLanguage, setLanguageStorage } from "../utils";

const LanguageProvider = memo(({ children, bundles, fallbackLng, onLoadExtraBundles }: LanguageProviderProps) => {
  const hasInitialized = useRef(false);
  if (!hasInitialized.current) {
    initI18n({ bundles, fallbackLng, onLoadExtraBundles });
    hasInitialized.current = true;
  }

  useEffect(() => {
    const lng = getLocalLanguage();
    setLanguageStorage(lng);
    void i18n.changeLanguage(lng);
  }, []);

  return <>{children}</>;
});

LanguageProvider.displayName = "LanguageProvider";
export default LanguageProvider;
