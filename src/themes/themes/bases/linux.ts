import type { BaseTheme, BaseVariables } from "../../types";

import { BaseEnum } from "../../types";

/** Linux 风格圆角（较小，如 4） */
export const linuxBaseVariables: BaseVariables = {
  radius: {
    button: 3,
    card: 4,
    input: 3,
    modal: 6,
    badge: 999,
    avatar: 8,
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    page: 16,
    card: 14,
    sectionGap: 20,
    gridGap: 14,
  },

  border: {
    thin: 1,
    base: 1,
    thick: 2,
    focusRing: 2,
  },

  size: {
    buttonSm: 28,
    buttonMd: 34,
    buttonLg: 40,
    inputSm: 28,
    inputMd: 34,
    inputLg: 40,
    navbarHeight: 52,
    sidebarWidth: 232,
  },

  typography: {
    fontFamilyBase: `"Noto Sans", "Ubuntu", "Inter", sans-serif`,
    fontFamilyHeading: `"Noto Sans", "Ubuntu", "Inter", sans-serif`,
    fontSizeXs: 12,
    fontSizeSm: 13,
    fontSizeMd: 14,
    fontSizeLg: 16,
    fontSizeXl: 20,
    fontWeightNormal: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    lineHeightBase: 1.45,
  },

  motion: {
    fast: 100,
    base: 160,
    slow: 220,
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


export const linuxBaseTheme: BaseTheme = {
  name: BaseEnum.LINUX,
  displayName: "Linux",
  variables: linuxBaseVariables,
};
