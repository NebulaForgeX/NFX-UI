/**
 * 主题相关 localStorage 读写与移除，统一走 utils/lstorage；读写类型为 ThemeEnum / BaseEnum。
 * Theme localStorage get/set/remove via utils/lstorage; typed as ThemeEnum / BaseEnum.
 */
import type { Nilable } from "@/types/utils";
import { getItem, removeItem, setItem } from "@/utils/lstorage";

import { BASE_STORAGE_KEY, BASE_VALUES, BaseEnum, COLOR_STORAGE_KEY, THEME_VALUES, ThemeEnum } from "../types";

export function getThemeColorStorage(): Nilable<ThemeEnum> {
  const raw = getItem(COLOR_STORAGE_KEY);
  if (raw == null) return raw;
  return (THEME_VALUES as readonly string[]).includes(raw) ? (raw as ThemeEnum) : undefined;
}

export function setThemeColorStorage(value: ThemeEnum): void {
  setItem(COLOR_STORAGE_KEY, value);
}

export function getThemeBaseStorage(): Nilable<BaseEnum> {
  const raw = getItem(BASE_STORAGE_KEY);
  if (raw == null) return raw;
  return BASE_VALUES.includes(raw as BaseEnum) ? (raw as BaseEnum) : undefined;
}

export function setThemeBaseStorage(value: BaseEnum): void {
  setItem(BASE_STORAGE_KEY, value);
}

export function removeThemeStorage(): void {
  removeItem(COLOR_STORAGE_KEY);
  removeItem(BASE_STORAGE_KEY);
}
