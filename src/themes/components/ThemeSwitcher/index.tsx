import type { ThemeEnum, ThemeSwitcherProps } from "../../types";

import { memo } from "react";

import SlideDownSwitcher from "@/components/SlideDownSwitcher";

import { useTheme } from "../../hooks/useTheme";

const ThemeSwitcher = memo(({ status = "primary", getThemeDisplayName = (theme: ThemeEnum) => theme, handleChangeTheme }: ThemeSwitcherProps) => {
  const { themeName, setTheme, availableThemes } = useTheme();

  const handleChange = (theme: ThemeEnum) => {
    setTheme(theme);
    handleChangeTheme?.(theme);
  };

  return <SlideDownSwitcher value={themeName} options={availableThemes} getDisplayName={getThemeDisplayName} onChange={handleChange} status={status} />;
});

ThemeSwitcher.displayName = "ThemeSwitcher";

export default ThemeSwitcher;
