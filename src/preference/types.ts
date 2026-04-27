import type { LayoutModeEnum } from "@/designs/layouts/types";
import type { LanguageEnum } from "@/languages/types";
import type { BaseEnum, ThemeEnum } from "@/themes/types";

import type { DashboardBackgroundEnum } from "./constants";

/**
 * 根对象上 NFX 内置块使用的键名（字面量 `"nfx"`）。
 * Literal key name for the NFX slice on the preference JSON root.
 */
export const NFX_PREFERENCE_ROOT_KEY = "nfx" as const;

/**
 * NFX 负责的内置字段（存于 JSON 的 `nfx` 对象内）。
 * Built-in fields owned by NFX (nested under the `nfx` object in JSON).
 */
export type NfxPreferenceSlice = {
  theme: ThemeEnum;
  base: BaseEnum;
  language: LanguageEnum;
  layoutMode: LayoutModeEnum;
  dashboardBackground: DashboardBackgroundEnum;
};

/**
 * 完整偏好：必有 `nfx`；`TExtra` 为与 `nfx` 平级的其它顶层键。
 * 默认 `TExtra` 为 `Record<string, unknown>`（**勿用** `Record<string, never>`：会与 `nfx` 索引冲突导致无法赋值）。
 */
export type Preference<TExtra extends Record<string, unknown> = Record<string, unknown>> = {
  nfx: NfxPreferenceSlice;
} & TExtra;
