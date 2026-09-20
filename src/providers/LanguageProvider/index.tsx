/**
 * Shared LanguageProvider — host passes product builtin bundles.
 * Identity error/message namespaces load here (PulsoLink LanguageProvider pattern).
 */
import type { CreateI18nResourcesResult, ExtraBundleItem, onLoadExtraBundles } from "nfx-ui/languages/types";
import type { ReactNode } from "react";

import { useEffect, useRef } from "react";

import { getIdentityRepositories } from "nfx-ui/apis";
import { DEFAULT_LANGUAGE, LANGUAGE_VALUES, LanguageEnum } from "nfx-ui/enums/language";
import i18n, { initI18n, toSupportedLanguage } from "nfx-ui/languages/languages/i18n";
import { PreferenceStore } from "nfx-ui/stores/preference";
import { ERRORS_NS_IDENTITY, MESSAGES_NS_IDENTITY } from "nfx-ui/utils/apiError";

export interface LanguageProviderProps {
  children: ReactNode;
  getBuiltinBundles: () => CreateI18nResourcesResult;
  fallbackLng?: LanguageEnum;
  identityMockErrors?: Record<string, unknown>;
  identityMockMessages?: Record<string, unknown>;
  onLoadExtraBundles?: onLoadExtraBundles;
}

async function loadIdentityExtraBundles(lng: LanguageEnum, identityMockErrors?: Record<string, unknown>, identityMockMessages?: Record<string, unknown>): Promise<ExtraBundleItem[]> {
  if (!LANGUAGE_VALUES.includes(lng)) return [];

  if (identityMockErrors != null || identityMockMessages != null) {
    const items: ExtraBundleItem[] = [];
    if (identityMockErrors) items.push({ namespace: ERRORS_NS_IDENTITY, bundle: identityMockErrors });
    if (identityMockMessages) items.push({ namespace: MESSAGES_NS_IDENTITY, bundle: identityMockMessages });
    return items;
  }

  try {
    const lang = lng.toString();
    const repos = getIdentityRepositories();
    const [identityErrors, identityMessages] = await Promise.all([
      repos.asset.GetErrorTranslations(lang),
      repos.asset.GetMessageTranslations(lang),
    ]);
    const items: ExtraBundleItem[] = [];
    if (identityErrors) items.push({ namespace: ERRORS_NS_IDENTITY, bundle: identityErrors as Record<string, unknown> });
    if (identityMessages) items.push({ namespace: MESSAGES_NS_IDENTITY, bundle: identityMessages });
    return items;
  } catch (error) {
    console.error("Failed to load Identity translation bundles", error);
    return [];
  }
}

function normalizeExtra(result: Awaited<ReturnType<onLoadExtraBundles>>): ExtraBundleItem[] {
  if (result == null) return [];
  return Array.isArray(result) ? result : [result];
}

const LanguageProvider = ({ children, getBuiltinBundles, fallbackLng, identityMockErrors, identityMockMessages, onLoadExtraBundles }: LanguageProviderProps) => {
  const hasInitialized = useRef(false);
  if (!hasInitialized.current) {
    initI18n({
      fallbackLng,
      getBuiltinBundles,
      onLoadExtraBundles: async (lng) => {
        const identity = await loadIdentityExtraBundles(lng, identityMockErrors, identityMockMessages);
        const extra = onLoadExtraBundles ? normalizeExtra(await onLoadExtraBundles(lng)) : [];
        const merged = [...identity, ...extra];
        return merged.length > 0 ? merged : null;
      },
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
