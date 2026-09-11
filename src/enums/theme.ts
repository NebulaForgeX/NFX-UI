import { safeEnum } from "@/utils/safe";

import type { Nilable } from "@/types";

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
export const Base = (value: Nilable<string>) => safeEnum(value, BASE_VALUES, DEFAULT_BASE);

/** 外观偏好：浅色 / 深色 / 跟随系统（解析后才映射到 Radix light|dark） */
export enum AppearanceEnum {
  LIGHT = "light",
  DARK = "dark",
  SYSTEM = "system",
}

export const DEFAULT_APPEARANCE = AppearanceEnum.SYSTEM;
export const APPEARANCE_VALUES = Object.values(AppearanceEnum);
export const Appearance = (value: Nilable<string>) => safeEnum(value, APPEARANCE_VALUES, DEFAULT_APPEARANCE);

/** Radix 强调色 */
export enum AccentColorEnum {
  GRAY = "gray",
  GOLD = "gold",
  BRONZE = "bronze",
  BROWN = "brown",
  YELLOW = "yellow",
  AMBER = "amber",
  ORANGE = "orange",
  TOMATO = "tomato",
  RED = "red",
  RUBY = "ruby",
  CRIMSON = "crimson",
  PINK = "pink",
  PLUM = "plum",
  PURPLE = "purple",
  VIOLET = "violet",
  IRIS = "iris",
  INDIGO = "indigo",
  BLUE = "blue",
  CYAN = "cyan",
  TEAL = "teal",
  JADE = "jade",
  GREEN = "green",
  GRASS = "grass",
  LIME = "lime",
  MINT = "mint",
  SKY = "sky",
}

export const DEFAULT_ACCENT_COLOR = AccentColorEnum.TOMATO;
export const ACCENT_COLOR_VALUES = Object.values(AccentColorEnum);
export const AccentColor = (value: Nilable<string>) => safeEnum(value, ACCENT_COLOR_VALUES, DEFAULT_ACCENT_COLOR);

/** Radix 中性灰 */
export enum GrayColorEnum {
  AUTO = "auto",
  GRAY = "gray",
  MAUVE = "mauve",
  SLATE = "slate",
  SAGE = "sage",
  OLIVE = "olive",
  SAND = "sand",
}

export const DEFAULT_GRAY_COLOR = GrayColorEnum.SLATE;
export const GRAY_COLOR_VALUES = Object.values(GrayColorEnum);
export const GrayColor = (value: Nilable<string>) => safeEnum(value, GRAY_COLOR_VALUES, DEFAULT_GRAY_COLOR);

/** Radix 圆角档位（按平台映射：none=Linux / small=Android / medium=Other / large=Windows / full=iOS） */
export enum RadiusEnum {
  NONE = "none",
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
  FULL = "full",
}

export const DEFAULT_RADIUS = RadiusEnum.MEDIUM;
export const RADIUS_VALUES = Object.values(RadiusEnum);
export const Radius = (value: Nilable<string>) => safeEnum(value, RADIUS_VALUES, DEFAULT_RADIUS);

/** Radix 缩放比例 */
export enum ScalingEnum {
  S90 = "90%",
  S95 = "95%",
  S100 = "100%",
  S105 = "105%",
  S110 = "110%",
}

export const DEFAULT_SCALING = ScalingEnum.S100;
export const SCALING_VALUES = Object.values(ScalingEnum);
export const Scaling = (value: Nilable<string>) => safeEnum(value, SCALING_VALUES, DEFAULT_SCALING);

/** Radix 面板背景 */
export enum PanelBackgroundEnum {
  SOLID = "solid",
  TRANSLUCENT = "translucent",
}

export const DEFAULT_PANEL_BACKGROUND = PanelBackgroundEnum.TRANSLUCENT;
export const PANEL_BACKGROUND_VALUES = Object.values(PanelBackgroundEnum);
export const PanelBackground = (value: Nilable<string>) => safeEnum(value, PANEL_BACKGROUND_VALUES, DEFAULT_PANEL_BACKGROUND);

/** UI 正文字体族（webfont 栈 / 系统默认；见 themes/fonts.ts + themes/index.css） */
export enum ThemeFontFamilyEnum {
  SYSTEM = "system",
  IBM_PLEX = "ibm-plex",
  NOTO = "noto",
  SOURCE_SANS = "source-sans",
}

export const DEFAULT_THEME_FONT_FAMILY = ThemeFontFamilyEnum.SYSTEM;
export const THEME_FONT_FAMILY_VALUES = Object.values(ThemeFontFamilyEnum);
export const ThemeFontFamily = (value: Nilable<string>) => safeEnum(value, THEME_FONT_FAMILY_VALUES, DEFAULT_THEME_FONT_FAMILY);
