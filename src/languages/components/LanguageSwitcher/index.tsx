import type { LanguageSwitcherProps } from "../../types";

import { memo } from "react";
import { useTranslation } from "react-i18next";

import SlideDownSwitcher from "@/components/SlideDownSwitcher";

import { changeLanguage } from "../../languages/i18nResources";
import { LANGUAGE_VALUES, LanguageEnum } from "../../types";

const LanguageSwitcher = memo(({ status = "primary", getLanguageDisplayName = (lang: LanguageEnum) => lang, handleChangeLanguage }: LanguageSwitcherProps) => {
  const { i18n } = useTranslation();
  const currentLanguage = ((i18n.language ?? "") as LanguageEnum) || LanguageEnum.EN;
  const options = LANGUAGE_VALUES as readonly LanguageEnum[];

  const handleChange = (lng: LanguageEnum) => {
    changeLanguage(lng);
    handleChangeLanguage?.(lng);
  };

  return <SlideDownSwitcher value={currentLanguage} options={options} getDisplayName={getLanguageDisplayName} onChange={handleChange} status={status} />;
});

LanguageSwitcher.displayName = "LanguageSwitcher";

export default LanguageSwitcher;
