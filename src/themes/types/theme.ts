/**
 * 主题相关类型：颜色变量、基础变量、主题枚举与常量。
 * Theme types: color/base variables, theme enums and constants.
 */

/** 颜色变量（主题色、背景、边框、文字、图表等一切与颜色相关） */
export interface ColorVariables {
  primary: string;
  primaryLight: string;
  primaryFg: string;
  success: string;
  successLight: string;
  info: string;
  infoLight: string;
  warning: string;
  warningLight: string;
  danger: string;
  dangerLight: string;

  bg: string;
  bg2: string;
  bg3: string;
  bg4: string;

  border: string;
  border2: string;
  border3: string;
  border4: string;
  border5: string;

  fg: string;
  fgText: string;
  fgHeading: string;
  fgHighlight: string;
  separator: string;

  temperature: {
    arcFill: string[];
    arcEmpty: string;
    thumbBg: string;
    thumbBorder: string;
  };

  solar: {
    gradientLeft: string;
    gradientRight: string;
    shadowColor: string;
    secondSeriesFill: string;
  };

  traffic: {
    tooltipBg: string;
    tooltipBorderColor: string;
    tooltipTextColor: string;
    yAxisSplitLine: string;
    lineBg: string;
    itemColor: string;
    itemBorderColor: string;
    itemEmphasisBorderColor: string;
    shadowLineDarkBg: string;
    shadowLineShadow: string;
    gradFrom: string;
    gradTo: string;
  };

  electricity: {
    tooltipBg: string;
    tooltipLineColor: string;
    tooltipBorderColor: string;
    tooltipTextColor: string;
    axisLineColor: string;
    xAxisTextColor: string;
    yAxisSplitLine: string;
    itemBorderColor: string;
    lineGradFrom: string;
    lineGradTo: string;
    lineShadow: string;
    areaGradFrom: string;
    areaGradTo: string;
    shadowLineDarkBg: string;
  };

  echarts: {
    bg: string;
    textColor: string;
    axisLineColor: string;
    splitLineColor: string;
    itemHoverShadowColor: string;
    tooltipBackgroundColor: string;
  };

  chartjs: {
    axisLineColor: string;
    textColor: string;
  };
}

/** 非颜色变量（圆角等，可随平台不同：iOS 24 / Android|Windows 6 / Linux 4） */
export interface BaseVariables {
  buttonRadius: number;
  cardRadius: number;
  inputRadius: number;
}

/** 颜色主题：name/displayName 表示这套配色是谁 */
export interface ColorTheme {
  name: string;
  displayName: string;
  variables: ColorVariables;
}

/** 基础主题：name/displayName 表示这套基础规范是谁（如 iOS / Android / 默认） */
export interface BaseTheme {
  name: string;
  displayName: string;
  variables: BaseVariables;
}

/** 完整主题 = 颜色主题 + 基础主题 */
export interface Theme {
  colors: ColorTheme;
  base: BaseTheme;
}

/** 颜色主题枚举 */
export enum ThemeEnum {
  DEFAULT = "default",
  LIGHT = "light",
  CORPORATE = "corporate",
  FOREST = "forest",
  DARK = "dark",
  COSMIC = "cosmic",
  COFFEE = "coffee",
  WINE = "wine",
}

export const DEFAULT_THEME = ThemeEnum.DEFAULT;
export const THEME_VALUES = Object.values(ThemeEnum);

/** 基础主题枚举（平台/圆角等，如 iOS 24 / Android|Windows 6 / Linux 4） */
export enum BaseEnum {
  DEFAULT = "default",
  IOS = "ios",
  ANDROID = "android",
  WINDOWS = "windows",
  LINUX = "linux",
}

export const DEFAULT_BASE = BaseEnum.DEFAULT;
export const BASE_VALUES = Object.values(BaseEnum);

export const COLOR_STORAGE_KEY = "theme-color";
export const BASE_STORAGE_KEY = "theme-base";
