/**
 * Shared LanguageProvider — host passes product builtin bundles.
 */
import type { CreateI18nResourcesResult, ExtraBundleItem, onLoadExtraBundles } from "@/languages/types";
import type { ReactNode } from "react";

import { useEffect, useRef } from "react";

import { DEFAULT_LANGUAGE, LANGUAGE_VALUES, LanguageEnum } from "@/enums/language";
import i18n, { initI18n, toSupportedLanguage } from "@/languages/languages/i18n";
import { PreferenceStore } from "@/stores/preference";

export interface LanguageProviderProps {
  children: ReactNode;
  getBuiltinBundles: () => CreateI18nResourcesResult;
  fallbackLng?: LanguageEnum;
  onLoadExtraBundles?: onLoadExtraBundles;
}

function normalizeExtra(result: Awaited<ReturnType<onLoadExtraBundles>>): ExtraBundleItem[] {
  if (result == null) return [];
  return Array.isArray(result) ? result : [result];
}

const LanguageProvider = ({ children, getBuiltinBundles, fallbackLng, onLoadExtraBundles }: LanguageProviderProps) => {
  const hasInitialized = useRef(false);
  if (!hasInitialized.current) {
    initI18n({
      fallbackLng,
      getBuiltinBundles,
      onLoadExtraBundles: onLoadExtraBundles
        ? async (lng) => {
            const extra = normalizeExtra(await onLoadExtraBundles(lng));
            return extra.length > 0 ? extra : null;
          }
        : undefined,
    });
    hasInitialized.current = true;
  }

  useEffect(() => {
    const resolvedFallback = fallbackLng ?? DEFAULT_LANGUAGE;
    const apply = (lng: LanguageEnum) => {
      const current = toSupportedLanguage(i18n.language || resolvedFallback, resolvedFallback);
      if (current !== lng) {
        void i18n.changeLanguage(lng);
      }
    };

    apply(PreferenceStore.getState().language);
    return PreferenceStore.subscribe((state, prev) => {
      if (state.language !== prev.language) {
        apply(state.language);
      }
    });
  }, [fallbackLng]);

  return <>{children}</>;
};

LanguageProvider.displayName = "LanguageProvider";
export default LanguageProvider;

export { LANGUAGE_VALUES };
