import type { ThemeEnum, ThemeSwitcherProps } from "@/themes/types";

import { memo } from "react";

import { useTheme } from "@/themes/hooks/useTheme";

import SlideDownSwitcher from "../SlideDownSwitcher";

const ThemeSwitcher = memo(({ status = "primary", getThemeDisplayName, handleChangeTheme }: ThemeSwitcherProps) => {
  const { themeName, setTheme, availableThemes } = useTheme();

  const getDisplayName = getThemeDisplayName ?? ((theme: ThemeEnum) => theme);

  const handleChange = (theme: ThemeEnum) => {
    setTheme(theme);
    handleChangeTheme?.(theme);
  };

  return <SlideDownSwitcher value={themeName} options={availableThemes} getDisplayName={getDisplayName} onChange={handleChange} status={status} />;
});

ThemeSwitcher.displayName = "ThemeSwitcher";

export default ThemeSwitcher;
