/**
 * 语言枚举与常量，不引用任何 JSON，供需要轻量引用的模块使用。
 */
import type { Nilable } from "@/types";

import { safeEnum } from "@/utils/safe";

export enum LanguageEnum {
  EN = "en",
  ZH = "zh",
  FR = "fr",
}

export const DEFAULT_LANGUAGE = LanguageEnum.ZH;
export const LANGUAGE_VALUES = Object.values(LanguageEnum);
export const Language = (value: Nilable<string>) => safeEnum(value, LANGUAGE_VALUES, DEFAULT_LANGUAGE);
