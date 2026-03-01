/**
 * NFX-UI 内置多语言资源：theme / language / layout / preference 四个命名空间，en / zh / fr 三种语言。
 * Built-in i18n resources: namespaces theme, language, layout, preference; languages en, zh, fr.
 *
 * 使用方可在 createI18nResources 时合并此资源，使 ThemeSwitcher / LanguageSwitcher / LayoutSwitcher 使用默认翻译。
 * Consumers can merge these resources in createI18nResources so switchers use default labels.
 */
import type { CreateI18nResourcesResult, NameSpacesMap, Resources } from "../types";

import enLayout from "./en/layout.json";
import enLanguage from "./en/language.json";
import enPreference from "./en/preference.json";
import enTheme from "./en/theme.json";
import frLayout from "./fr/layout.json";
import frLanguage from "./fr/language.json";
import frPreference from "./fr/preference.json";
import frTheme from "./fr/theme.json";
import zhLayout from "./zh/layout.json";
import zhLanguage from "./zh/language.json";
import zhPreference from "./zh/preference.json";
import zhTheme from "./zh/theme.json";

export const NFX_NAMESPACES = ["theme", "language", "layout", "preference"] as const;
export const NFX_NAMESPACES_MAP: NameSpacesMap = {
  theme: "theme",
  language: "language",
  layout: "layout",
  preference: "preference",
};

const DEFAULT_NFX_RESOURCES: Resources = {
  en: {
    theme: enTheme as Record<string, unknown>,
    language: enLanguage as Record<string, unknown>,
    layout: enLayout as Record<string, unknown>,
    preference: enPreference as Record<string, unknown>,
  },
  zh: {
    theme: zhTheme as Record<string, unknown>,
    language: zhLanguage as Record<string, unknown>,
    layout: zhLayout as Record<string, unknown>,
    preference: zhPreference as Record<string, unknown>,
  },
  fr: {
    theme: frTheme as Record<string, unknown>,
    language: frLanguage as Record<string, unknown>,
    layout: frLayout as Record<string, unknown>,
    preference: frPreference as Record<string, unknown>,
  },
};

/**
 * 返回 NFX-UI 默认文案包，可与使用方自建 resources 合并后传入 createI18nResources。
 * Returns default NFX bundles; merge with your resources and pass to createI18nResources.
 */
export function getDefaultNfxBundles(): CreateI18nResourcesResult {
  return {
    RESOURCES: DEFAULT_NFX_RESOURCES,
    NAME_SPACES_MAP: NFX_NAMESPACES_MAP,
    NAME_SPACES: [...NFX_NAMESPACES],
  };
}
