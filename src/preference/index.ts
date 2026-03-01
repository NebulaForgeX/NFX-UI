/**
 * 用户偏好模块：类型、解析/序列化、默认值（与后端 profile.preference JSON 约定）
 * User preference: types, parse/serialize, defaults (backend profile.preference JSON contract).
 */
import { LayoutModeEnum } from "@/designs/layouts/types";
import { LANGUAGE_VALUES, LanguageEnum } from "@/languages/types";
import { BASE_VALUES, BaseEnum, THEME_VALUES, ThemeEnum } from "@/themes/types";

import { DASHBOARD_BACKGROUND_VALUES, DashboardBackgroundEnum, DEFAULT_DASHBOARD_BACKGROUND } from "./constants";

export { DashboardBackgroundEnum, DEFAULT_DASHBOARD_BACKGROUND, DASHBOARD_BACKGROUND_VALUES } from "./constants";

/** 前端统一的偏好结构；后端存为 JSON：theme, base, language, layoutMode, other.dashboardBackground */
export type Preference = {
  theme: ThemeEnum;
  base: BaseEnum;
  language: LanguageEnum;
  layoutMode: LayoutModeEnum;
  other?: {
    dashboardBackground: DashboardBackgroundEnum;
  };
};

/** 后端 JSON 形状（profile.preference 字符串解析后）。Internal backend shape. */
type PreferenceBackendShape = {
  theme?: ThemeEnum;
  base?: BaseEnum;
  language?: LanguageEnum;
  layoutMode: LayoutModeEnum;
  other?: Record<string, unknown>;
};

/**
 * 从后端 preference JSON 解析为前端 Preference，解析失败或空返回 null
 * Parse backend preference JSON to Preference; returns null on empty or parse error.
 * @param json - 后端存的 JSON 字符串
 * @returns Preference 或 null
 */
export function parsePreferenceJson(json: string | null | undefined): Preference | null {
  if (!json || typeof json !== "string") return null;
  try {
    const raw = JSON.parse(json) as PreferenceBackendShape;
    const layoutMode = raw.layoutMode === LayoutModeEnum.HIDE ? LayoutModeEnum.HIDE : LayoutModeEnum.SHOW;
    const db =
      typeof raw.other?.dashboardBackground === "string" && DASHBOARD_BACKGROUND_VALUES.includes(raw.other.dashboardBackground as DashboardBackgroundEnum)
        ? (raw.other.dashboardBackground as DashboardBackgroundEnum)
        : DEFAULT_DASHBOARD_BACKGROUND;
    const base = typeof raw.base === "string" && BASE_VALUES.includes(raw.base as BaseEnum) ? (raw.base as BaseEnum) : BaseEnum.DEFAULT;
    const language =
      typeof raw.language === "string" && (LANGUAGE_VALUES as string[]).includes(raw.language) ? (raw.language as LanguageEnum) : ("zh" as LanguageEnum);
    return {
      theme: typeof raw.theme === "string" && THEME_VALUES.includes(raw.theme as ThemeEnum) ? (raw.theme as ThemeEnum) : ThemeEnum.DEFAULT,
      base,
      language,
      layoutMode,
      other: { dashboardBackground: db },
    };
  } catch {
    return null;
  }
}

/**
 * 将前端 Preference 序列化为后端存的完整 JSON 字符串（每次更新都传完整 JSON）
 * Serialize Preference to backend JSON string (full payload on each update).
 * @param preference - 前端偏好对象
 * @returns JSON 字符串
 */
export function preferenceToJson(preference: Preference): string {
  const backend: PreferenceBackendShape = {
    theme: preference.theme || undefined,
    base: preference.base || undefined,
    language: preference.language || undefined,
    layoutMode: preference.layoutMode,
    other: preference.other ? { dashboardBackground: preference.other.dashboardBackground } : undefined,
  };
  return JSON.stringify(backend);
}

/**
 * 默认偏好（解析不到或同步时兜底）：默认中文、default 主题、default base
 * Default preference (fallback when parse fails or for initial sync).
 * @returns 默认 Preference
 */
export function getDefaultPreference(): Preference {
  return {
    theme: ThemeEnum.DEFAULT,
    base: BaseEnum.DEFAULT,
    language: LanguageEnum.ZH,
    layoutMode: LayoutModeEnum.SHOW,
    other: { dashboardBackground: DEFAULT_DASHBOARD_BACKGROUND },
  };
}
