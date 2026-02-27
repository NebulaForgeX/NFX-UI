/**
 * 主题上下文类型。Theme context type.
 */
import type { BaseEnum, Theme, ThemeEnum } from "./theme";

/** useTheme 返回值类型。Return type of useTheme. */
export interface ThemeContextType {
  /** 当前完整主题（颜色+基础）。Current full theme (colors + base). */
  currentTheme: Theme;
  /** 当前颜色主题名。Current color theme name. */
  themeName: ThemeEnum;
  /** 当前基础主题名。Current base theme name. */
  baseName: BaseEnum;
  setTheme: (themeName: ThemeEnum) => void;
  setBase: (baseName: BaseEnum) => void;
  /** 可选颜色主题列表。Available color themes. */
  availableThemes: ThemeEnum[];
  /** 可选基础主题列表。Available base themes. */
  availableBases: BaseEnum[];
}
