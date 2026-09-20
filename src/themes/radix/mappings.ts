import type { ThemeProps } from "@radix-ui/themes";

import type { Nilable } from "nfx-ui/types";

import {
  AccentColor,
  AccentColorEnum,
  Appearance,
  AppearanceEnum,
  BaseEnum,
  GrayColor,
  GrayColorEnum,
  PanelBackground,
  PanelBackgroundEnum,
  Radius,
  RadiusEnum,
  Scaling,
  ScalingEnum,
  ThemeFontFamily,
  ThemeFontFamilyEnum,
} from "nfx-ui/enums/theme";

export type RadixAccentColor = NonNullable<ThemeProps["accentColor"]>;
export type RadixGrayColor = NonNullable<ThemeProps["grayColor"]>;
export type RadixAppearance = Extract<NonNullable<ThemeProps["appearance"]>, "light" | "dark">;
export type RadixRadius = NonNullable<ThemeProps["radius"]>;
export type RadixScaling = NonNullable<ThemeProps["scaling"]>;
export type RadixPanelBackground = NonNullable<ThemeProps["panelBackground"]>;

export const RADIX_ACCENT_VALUES: readonly AccentColorEnum[] = Object.values(AccentColorEnum);
export const RADIX_GRAY_VALUES: readonly GrayColorEnum[] = Object.values(GrayColorEnum);
export const RADIX_APPEARANCE_VALUES: readonly RadixAppearance[] = [AppearanceEnum.LIGHT, AppearanceEnum.DARK];
export const THEME_APPEARANCE_VALUES: readonly AppearanceEnum[] = Object.values(AppearanceEnum);
export const RADIX_RADIUS_VALUES: readonly RadiusEnum[] = Object.values(RadiusEnum);
export const RADIX_SCALING_VALUES: readonly ScalingEnum[] = Object.values(ScalingEnum);
export const RADIX_PANEL_BACKGROUND_VALUES: readonly PanelBackgroundEnum[] = Object.values(PanelBackgroundEnum);

export const BASE_TO_RADIX_RADIUS: Record<BaseEnum, RadiusEnum> = {
  [BaseEnum.LINUX]: RadiusEnum.NONE,
  [BaseEnum.ANDROID]: RadiusEnum.SMALL,
  [BaseEnum.DEFAULT]: RadiusEnum.MEDIUM,
  [BaseEnum.WINDOWS]: RadiusEnum.LARGE,
  [BaseEnum.IOS]: RadiusEnum.FULL,
};

export const RADIX_RADIUS_TO_BASE: Record<RadiusEnum, BaseEnum> = {
  [RadiusEnum.NONE]: BaseEnum.LINUX,
  [RadiusEnum.SMALL]: BaseEnum.ANDROID,
  [RadiusEnum.MEDIUM]: BaseEnum.DEFAULT,
  [RadiusEnum.LARGE]: BaseEnum.WINDOWS,
  [RadiusEnum.FULL]: BaseEnum.IOS,
};

export const DEFAULT_RADIX_ACCENT = AccentColorEnum.TOMATO;
export const DEFAULT_RADIX_GRAY = GrayColorEnum.SLATE;
export const DEFAULT_RADIX_SCALING = ScalingEnum.S100;
export const DEFAULT_RADIX_PANEL_BACKGROUND = PanelBackgroundEnum.TRANSLUCENT;
export const DEFAULT_THEME_FONT_FAMILY = ThemeFontFamilyEnum.SYSTEM;
export const THEME_FONT_FAMILY_VALUES: readonly ThemeFontFamilyEnum[] = Object.values(ThemeFontFamilyEnum);
export const DEFAULT_THEME_APPEARANCE = AppearanceEnum.SYSTEM;

export function readSystemRadixAppearance(): RadixAppearance {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return AppearanceEnum.LIGHT;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? AppearanceEnum.DARK : AppearanceEnum.LIGHT;
}

export function resolveRadixAppearance(appearance: AppearanceEnum): RadixAppearance {
  return appearance === AppearanceEnum.SYSTEM ? readSystemRadixAppearance() : appearance;
}

export interface ResolvedThemePreference {
  accent: AccentColorEnum;
  gray: GrayColorEnum;
  appearance: AppearanceEnum;
  radius: RadiusEnum;
  scaling: ScalingEnum;
  panelBackground: PanelBackgroundEnum;
  fontFamily: ThemeFontFamilyEnum;
}

export function getDefaultThemePreference(): ResolvedThemePreference {
  return {
    accent: DEFAULT_RADIX_ACCENT,
    gray: DEFAULT_RADIX_GRAY,
    appearance: DEFAULT_THEME_APPEARANCE,
    radius: RadiusEnum.MEDIUM,
    scaling: DEFAULT_RADIX_SCALING,
    panelBackground: DEFAULT_RADIX_PANEL_BACKGROUND,
    fontFamily: DEFAULT_THEME_FONT_FAMILY,
  };
}

export function resolveThemePreference(
  partial: Nilable<Partial<ResolvedThemePreference>>,
  fallbackAppearance: AppearanceEnum = DEFAULT_THEME_APPEARANCE,
  fallbackRadius: RadiusEnum = RadiusEnum.MEDIUM,
): ResolvedThemePreference {
  const p = partial ?? {};
  return {
    accent: AccentColor(p.accent),
    gray: GrayColor(p.gray),
    appearance: Appearance(p.appearance ?? fallbackAppearance),
    radius: Radius(p.radius ?? fallbackRadius),
    scaling: Scaling(p.scaling),
    panelBackground: PanelBackground(p.panelBackground),
    fontFamily: ThemeFontFamily(p.fontFamily),
  };
}
