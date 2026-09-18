import type { Nilable } from "@/types";

import { safeEnum } from "@/utils/safe";

export enum LayoutModeEnum {
  SHOW = "show",
  HIDE = "hide",
}

export const DEFAULT_LAYOUT_MODE = LayoutModeEnum.SHOW;
export const LAYOUT_MODE_VALUES = Object.values(LayoutModeEnum);
export const LayoutMode = (value: Nilable<string>) => safeEnum(value, LAYOUT_MODE_VALUES, DEFAULT_LAYOUT_MODE);
