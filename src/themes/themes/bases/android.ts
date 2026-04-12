import type { BaseTheme, BaseVariables } from "../../types";

import { BaseEnum } from "../../types";

/** Android 风格圆角（如 6） */
export const androidBaseVariables: BaseVariables = {
  radius: {
    button: 6,
    card: 8,
    input: 6,
    modal: 10,
    badge: 999,
    avatar: 12,
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    page: 20,
    card: 16,
    sectionGap: 24,
    gridGap: 16,
  },

  border: {
    thin: 1,
    base: 1,
    thick: 2,
    focusRing: 2,
  },

  size: {
    buttonSm: 30,
    buttonMd: 36,
    buttonLg: 42,
    inputSm: 30,
    inputMd: 36,
    inputLg: 42,
    navbarHeight: 56,
    sidebarWidth: 240,
  },

  typography: {
    fontFamilyBase: `"Segoe UI", "Inter", sans-serif`,
    fontFamilyHeading: `"Segoe UI Semibold", "Inter", sans-serif`,
    fontSizeXs: 12,
    fontSizeSm: 13,
    fontSizeMd: 14,
    fontSizeLg: 16,
    fontSizeXl: 20,
    fontWeightNormal: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    lineHeightBase: 1.5,
  },

  motion: {
    fast: 120,
    base: 180,
    slow: 240,
    easingStandard: "cubic-bezier(0.2, 0, 0, 1)",
  },

  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    modal: 1100,
    toast: 1200,
    tooltip: 1300,
  },
};

export const androidBaseTheme: BaseTheme = {
  name: BaseEnum.ANDROID,
  displayName: "Android",
  variables: androidBaseVariables,
};
