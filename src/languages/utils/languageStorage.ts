/**
 * 语言相关 localStorage 读写与移除，统一走 utils/lstorage；读写类型为 LanguageEnum。
 * Language localStorage get/set/remove via utils/lstorage; typed as LanguageEnum.
 */
import type { Nilable } from "@/types/utils";
import { getItem, removeItem, setItem } from "@/utils/lstorage";

import { LANGUAGE_STORAGE_KEY, LANGUAGE_VALUES, LanguageEnum } from "../types";

export function getLanguageStorage(): Nilable<LanguageEnum> {
  const raw = getItem(LANGUAGE_STORAGE_KEY);
  if (raw == null) return raw;
  return (LANGUAGE_VALUES as readonly string[]).includes(raw) ? (raw as LanguageEnum) : undefined;
}

export function setLanguageStorage(value: LanguageEnum): void {
  setItem(LANGUAGE_STORAGE_KEY, value);
}

export function removeLanguageStorage(): void {
  removeItem(LANGUAGE_STORAGE_KEY);
}
