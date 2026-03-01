import type { LanguageSwitcherProps } from "../../types";

import { memo } from "react";
import { useTranslation } from "react-i18next";

import SlideDownSwitcher from "@/components/SlideDownSwitcher";

import { changeLanguage } from "../../languages/i18nResources";
import { LANGUAGE_VALUES, LanguageEnum } from "../../types";

const LanguageSwitcher = memo(({ status = "primary", getLanguageDisplayName, handleChangeLanguage }: LanguageSwitcherProps) => {
  const { i18n, t } = useTranslation("language");
  const currentLanguage = ((i18n.language ?? "") as LanguageEnum) || LanguageEnum.EN;
  const options = LANGUAGE_VALUES as readonly LanguageEnum[];

  const getDisplayName = getLanguageDisplayName ?? ((lang: LanguageEnum) => t(`languageSwitcher.${lang}`, { defaultValue: lang }));

  const handleChange = (lng: LanguageEnum) => {
    changeLanguage(lng);
    handleChangeLanguage?.(lng);
  };

  return <SlideDownSwitcher value={currentLanguage} options={options} getDisplayName={getDisplayName} onChange={handleChange} status={status} />;
});

LanguageSwitcher.displayName = "LanguageSwitcher";

export default LanguageSwitcher;
