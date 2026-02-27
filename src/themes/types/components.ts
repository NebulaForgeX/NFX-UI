/**
 * 主题相关组件的 Props 类型。
 * Props types for theme-related components.
 */
import type { ReactNode } from "react";
import type { BaseEnum, ThemeEnum } from "./theme";

/** 主题 Provider 的 props。ThemeProvider props. */
export interface ThemeProviderProps {
  /** 子节点。Children. */
  children: ReactNode;
  /** 默认颜色主题。Default color theme. */
  defaultTheme?: ThemeEnum;
  /** 默认基础主题（如圆角规范）。Default base theme (e.g. radius). */
  defaultBase?: BaseEnum;
}

/** 主题切换器 props。ThemeSwitcher props. */
export interface ThemeSwitcherProps {
  /** 样式状态。Visual status. */
  status?: "primary" | "default";
  /** 根据 theme 返回显示名称；未传则使用 theme 原值。Display name for theme; default is theme value. */
  getThemeDisplayName?: (theme: ThemeEnum) => string;
  /** 处理主题改变。Handle theme change. */
  handleChangeTheme?: (theme: ThemeEnum) => void;
}
