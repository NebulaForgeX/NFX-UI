/**
 * 主题提供者：提供颜色主题与基础主题（圆角等）上下文。
 * Theme provider: provides color theme and base theme (e.g. radius) context.
 */
import type { Theme, ThemeProviderProps } from "../../types";

import { memo, useMemo, useState } from "react";

import { ThemeContext } from "../../hooks/useTheme";
import useThemeVariables from "../../hooks/useThemeVariables";
import { bases } from "../../themes/bases";
import { themes } from "../../themes/colors";
import { BASE_STORAGE_KEY, BASE_VALUES, BaseEnum, COLOR_STORAGE_KEY, THEME_VALUES, ThemeEnum } from "../../types";

const ThemeProvider = memo(({ children, defaultTheme = ThemeEnum.DEFAULT, defaultBase = BaseEnum.DEFAULT }: ThemeProviderProps) => {
  const [themeName, setThemeName] = useState<ThemeEnum>(() => {
    const saved = localStorage.getItem(COLOR_STORAGE_KEY) as ThemeEnum | null;
    return saved && saved in themes ? saved : defaultTheme;
  });
  const [baseName, setBaseName] = useState<BaseEnum>(() => {
    const saved = localStorage.getItem(BASE_STORAGE_KEY) as BaseEnum | null;
    return saved && BASE_VALUES.includes(saved) ? saved : defaultBase;
  });

  const currentTheme = useMemo<Theme>(
    () => ({
      colors: themes[themeName].colors,
      base: bases[baseName],
    }),
    [themeName, baseName],
  );

  useThemeVariables(currentTheme, themeName);

  const setTheme = (newTheme: ThemeEnum) => {
    setThemeName(newTheme);
  };
  const setBase = (newBase: BaseEnum) => {
    setBaseName(newBase);
    localStorage.setItem(BASE_STORAGE_KEY, newBase);
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        themeName,
        baseName,
        setTheme,
        setBase,
        availableThemes: THEME_VALUES,
        availableBases: BASE_VALUES,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
});

ThemeProvider.displayName = "ThemeProvider";
export default ThemeProvider;
