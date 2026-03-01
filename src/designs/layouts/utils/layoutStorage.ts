/**
 * 布局相关 localStorage 读写与移除，统一走 utils/lstorage。
 * Layout localStorage get/set/remove via utils/lstorage.
 */
import type { Nilable } from "@/types/utils";
import { getItem, removeItem, setItem } from "@/utils/lstorage";

import { LAYOUT_STORAGE_KEY } from "../types";

export function getLayoutStorage(): Nilable<string> {
  return getItem(LAYOUT_STORAGE_KEY);
}

export function setLayoutStorage(value: string): void {
  setItem(LAYOUT_STORAGE_KEY, value);
}

export function removeLayoutStorage(): void {
  removeItem(LAYOUT_STORAGE_KEY);
}
