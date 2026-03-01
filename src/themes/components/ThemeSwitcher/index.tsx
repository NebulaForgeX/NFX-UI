import type { ThemeEnum, ThemeSwitcherProps } from "../../types";

import { memo } from "react";
import { useTranslation } from "react-i18next";

import SlideDownSwitcher from "@/components/SlideDownSwitcher";

import { useTheme } from "../../hooks/useTheme";

const ThemeSwitcher = memo(({ status = "primary", getThemeDisplayName, handleChangeTheme }: ThemeSwitcherProps) => {
  const { t } = useTranslation("theme");
  const { themeName, setTheme, availableThemes } = useTheme();

  const getDisplayName = getThemeDisplayName ?? ((theme: ThemeEnum) => t(`themeSwitcher.${theme}`, { defaultValue: theme }));

  const handleChange = (theme: ThemeEnum) => {
    setTheme(theme);
    handleChangeTheme?.(theme);
  };

  return <SlideDownSwitcher value={themeName} options={availableThemes} getDisplayName={getDisplayName} onChange={handleChange} status={status} />;
});

ThemeSwitcher.displayName = "ThemeSwitcher";

export default ThemeSwitcher;
