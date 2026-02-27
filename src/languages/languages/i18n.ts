/**
 * i18n 初始化与实例：initI18n 由 LanguageProvider 调用，changeLanguage 供外部切换语言。
 * i18n init and instance: initI18n called by LanguageProvider, changeLanguage for switching language.
 */
import type { InitI18nOptions } from "../types";

import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import { LanguageEnum } from "../types";

/**
 * 初始化 i18n。用户用自建的 JSON 调用 createI18nResources，将结果传入此处。
 * Init i18n. User builds resources + nameSpacesMap from their JSON, calls createI18nResources, then passes result here.
 */
export function initI18n(options: InitI18nOptions): void {
  const { RESOURCES, NAME_SPACES } = options.bundles;
  const fallbackLng = options.fallbackLng ?? LanguageEnum.ZH;

  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      compatibilityJSON: "v4",
      resources: RESOURCES,
      lng: fallbackLng,
      fallbackLng,
      ns: NAME_SPACES,
      defaultNS: NAME_SPACES[0],
      interpolation: { escapeValue: false },
      keySeparator: ".",
      detection: { order: ["navigator", "htmlTag", "path", "subdomain"] },
    });

  const onLoad = options.onLoadExtraBundles;
  if (onLoad) {
    void onLoad(i18n.language || fallbackLng);
    i18n.on("languageChanged", (lng) => void onLoad(lng));
  }
}

export default i18n;
