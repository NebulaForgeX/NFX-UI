import i18n from "i18next";
import { useTranslation } from "react-i18next";

import { BaseEnum } from "@/enums/theme";
import { LanguageEnum } from "../types";

function getLanguageI18nKey(lang: LanguageEnum): string {
  const keyMap: Record<LanguageEnum, string> = {
    [LanguageEnum.EN]: "languageSwitcher.english",
    [LanguageEnum.ZH]: "languageSwitcher.chinese",
    [LanguageEnum.FR]: "languageSwitcher.french",
  };
  return keyMap[lang];
}

export function useLanguageLabel(): {
  getLanguageDisplayName: (lang: LanguageEnum) => string;
} {
  const { t } = useTranslation("language");
  const getLanguageDisplayName = (lang: LanguageEnum): string =>
    t(getLanguageI18nKey(lang), {
      defaultValue: lang,
    });

  return { getLanguageDisplayName };
}

export function getLanguageDisplayName(lang: LanguageEnum): string {
  const fallbackMap: Record<LanguageEnum, string> = {
    [LanguageEnum.EN]: "English",
    [LanguageEnum.ZH]: "中文",
    [LanguageEnum.FR]: "Français",
  };
  return fallbackMap[lang];
}

function getBaseDisplayNameImpl(base: BaseEnum): string {
  return i18n.t("baseSwitcher." + base, { ns: "theme", defaultValue: base });
}

export function useBaseLabel(): {
  getBaseDisplayName: (base: BaseEnum) => string;
} {
  return { getBaseDisplayName: getBaseDisplayNameImpl };
}

export { getBaseDisplayNameImpl as getBaseDisplayName };
