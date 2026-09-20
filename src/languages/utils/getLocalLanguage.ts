/**
 * 获取本地语言：PreferenceStore 为唯一真相。
 */
import { PreferenceStore } from "nfx-ui/stores/preference";
import { DEFAULT_LANGUAGE, type LanguageEnum } from "nfx-ui/enums/language";

export function getLocalLanguage(): LanguageEnum {
  return PreferenceStore.getState().language ?? DEFAULT_LANGUAGE;
}
