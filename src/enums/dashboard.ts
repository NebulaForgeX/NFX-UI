import type { Array, Nilable } from "@/types";

import { safeEnum } from "@/utils/safe";

/** 仪表盘背景。Dashboard background. */
export enum DashboardBackgroundEnum {
  NONE = "none",
  WAVES = "waves",
  SQUARES = "squares",
  LETTER_GLITCH = "letterGlitch",
  PIXEL_BLAST = "pixelBlast",
}

export const DEFAULT_DASHBOARD_BACKGROUND = DashboardBackgroundEnum.NONE;
export const DASHBOARD_BACKGROUND_VALUES: Array<DashboardBackgroundEnum> = Object.values(DashboardBackgroundEnum);
export const DashboardBackground = (value: Nilable<string>) =>
  safeEnum(value, DASHBOARD_BACKGROUND_VALUES, DEFAULT_DASHBOARD_BACKGROUND);
