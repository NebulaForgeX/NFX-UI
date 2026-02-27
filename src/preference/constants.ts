/**
 * 用户偏好相关常量：仪表盘背景等
 * Preference-related constants: dashboard background, etc.
 */

/** 仪表盘背景枚举。Dashboard background enum. */
export enum DashboardBackgroundEnum {
  NONE = "none",
  WAVES = "waves",
  SQUARES = "squares",
  LETTER_GLITCH = "letterGlitch",
  PIXEL_BLAST = "pixelBlast",
}

export const DEFAULT_DASHBOARD_BACKGROUND = DashboardBackgroundEnum.NONE;

/** 仪表盘背景可选值列表。Dashboard background values list. */
export const DASHBOARD_BACKGROUND_VALUES = Object.values(DashboardBackgroundEnum) as DashboardBackgroundEnum[];
