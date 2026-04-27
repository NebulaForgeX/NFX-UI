import { LayoutModeEnum } from "@/designs/layouts/types";
import { LANGUAGE_VALUES, LanguageEnum } from "@/languages/types";
import { BASE_VALUES, BaseEnum, THEME_VALUES, ThemeEnum } from "@/themes/types";

import { DASHBOARD_BACKGROUND_VALUES, DashboardBackgroundEnum, DEFAULT_DASHBOARD_BACKGROUND } from "./constants";
import type { NfxPreferenceSlice } from "./types";

/** 后端 `nfx` 对象允许的 JSON 形状（字段均可选）。 */
export type NfxBackendShape = {
  theme?: ThemeEnum;
  base?: BaseEnum;
  language?: LanguageEnum;
  layoutMode?: LayoutModeEnum;
  dashboardBackground?: DashboardBackgroundEnum;
};

/** 判断值是否为「普通对象」（非 null、非数组）。 */
export function isPlainRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

/**
 * 将后端 `nfx` 对象的原始字段规范化为前端 `NfxPreferenceSlice`（非法或缺失字段用 NFX 默认值）。
 */
export function parseNfxFields(raw: NfxBackendShape): NfxPreferenceSlice {
  const layoutMode = raw.layoutMode === LayoutModeEnum.HIDE ? LayoutModeEnum.HIDE : LayoutModeEnum.SHOW;
  const base = typeof raw.base === "string" && BASE_VALUES.includes(raw.base) ? raw.base : BaseEnum.DEFAULT;
  const language =
    typeof raw.language === "string" && LANGUAGE_VALUES.includes(raw.language) ? raw.language : LanguageEnum.ZH;
  const dashboardBackground =
    typeof raw.dashboardBackground === "string" && DASHBOARD_BACKGROUND_VALUES.includes(raw.dashboardBackground)
      ? raw.dashboardBackground
      : DEFAULT_DASHBOARD_BACKGROUND;
  const theme = typeof raw.theme === "string" && THEME_VALUES.includes(raw.theme) ? raw.theme : ThemeEnum.DEFAULT;
  return {
    theme,
    base,
    language,
    layoutMode,
    dashboardBackground,
  };
}

/**
 * 将前端 `NfxPreferenceSlice` 转为写入 JSON 的 `nfx` 对象（与 `theme`/`base`/`language` 的省略规则一致）。
 */
export function nfxSliceToBackend(nfx: NfxPreferenceSlice): NfxBackendShape {
  return {
    theme: nfx.theme || undefined,
    base: nfx.base || undefined,
    language: nfx.language || undefined,
    layoutMode: nfx.layoutMode,
    dashboardBackground: nfx.dashboardBackground,
  };
}
