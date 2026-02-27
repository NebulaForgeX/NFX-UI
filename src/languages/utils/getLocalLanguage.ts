/**
 * 获取本地语言：优先 localStorage，其次浏览器语言，最后默认语言。
 * Get local language: localStorage first, then navigator, then default.
 */
import { DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY, LANGUAGE_VALUES, LanguageEnum } from "../types";

export function getLocalLanguage(): LanguageEnum {
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored && (LANGUAGE_VALUES as string[]).includes(stored)) {
    return stored as LanguageEnum;
  }
  const nav = typeof navigator !== "undefined" ? navigator.language || navigator.languages?.[0] || "" : "";
  const lower = nav.toLowerCase();
  if (lower.startsWith("zh")) return LanguageEnum.ZH;
  if (lower.startsWith("en")) return LanguageEnum.EN;
  if (lower.startsWith("fr")) return LanguageEnum.FR;
  return DEFAULT_LANGUAGE;
}
