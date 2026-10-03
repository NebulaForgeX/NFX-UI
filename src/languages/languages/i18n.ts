/**
 * Shared i18n init — host injects builtin bundles via `getBuiltinBundles`.
 * Product JSON stays in each console's language folder.
 */
import type { CreateI18nResourcesResult, ExtraBundleItem, InitI18nOptions } from "../types";

import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import { LanguageEnum, LANGUAGE_VALUES } from "nfx-ui/enums/language";
import { PreferenceStore, setPreference } from "nfx-ui/stores/preference";
import { safeEnum, safeStringable } from "nfx-ui/utils/safe";

export function toSupportedLanguage(lng: string, fallbackLng: LanguageEnum): LanguageEnum {
  const prefix = safeStringable(lng.split("-")[0]?.toLowerCase());
  return safeEnum<LanguageEnum>(prefix || undefined, LANGUAGE_VALUES, fallbackLng);
}

function applyDocumentLang(lng: string, fallbackLng: LanguageEnum) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = toSupportedLanguage(lng, fallbackLng);
}

let languagePersistAttached = false;

function applyExtraBundles(lng: string, fallbackLng: LanguageEnum, items: ExtraBundleItem[]) {
  const code = toSupportedLanguage(lng, fallbackLng);
  for (const { namespace, bundle } of items) {
    if (namespace && bundle && typeof bundle === "object") {
      i18n.addResourceBundle(code, namespace, bundle, true, true);
    }
  }
}

export function initI18n(options: InitI18nOptions): void {
  const fallbackLng = options.fallbackLng ?? LanguageEnum.ZH;

  if (i18n.isInitialized) {
    applyDocumentLang(i18n.language || fallbackLng, fallbackLng);
    return;
  }

  const { RESOURCES, NAME_SPACES }: CreateI18nResourcesResult = options.getBuiltinBundles();
  const initialLng = PreferenceStore.getState().language;

  const persistLanguage = (lng: string) => {
    const code = toSupportedLanguage(lng, fallbackLng);
    setPreference({ language: code });
    applyDocumentLang(code, fallbackLng);
  };

  if (!languagePersistAttached) {
    i18n.on("languageChanged", persistLanguage);
    languagePersistAttached = true;
  }

  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      compatibilityJSON: "v4",
      resources: RESOURCES,
      lng: initialLng,
      fallbackLng,
      supportedLngs: [...LANGUAGE_VALUES],
      load: "languageOnly",
      ns: NAME_SPACES,
      defaultNS: NAME_SPACES[0],
      interpolation: { escapeValue: false },
      keySeparator: ".",
      detection: {
        order: ["navigator", "htmlTag", "path", "subdomain"],
        caches: [],
      },
    });

  applyDocumentLang(i18n.language || initialLng || fallbackLng, fallbackLng);

  const onLoad = options.onLoadExtraBundles;
  if (onLoad) {
    const apply = async (lng: string) => {
      const result = await onLoad(toSupportedLanguage(lng, fallbackLng));
      if (result == null) return;
      const items = Array.isArray(result) ? result : [result];
      applyExtraBundles(lng, fallbackLng, items);
    };
    void apply(i18n.language || fallbackLng);
    i18n.on("languageChanged", (lng) => void apply(lng));
  }
}

export default i18n;
