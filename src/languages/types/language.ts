/**
 * 语言枚举与常量，不引用任何 JSON，供需要轻量引用的模块使用。
 * Language enum and constants; no JSON deps for lightweight usage.
 */
enum LanguageEnum {
  EN = "en",
  ZH = "zh",
  FR = "fr",
}

const DEFAULT_LANGUAGE = LanguageEnum.ZH;
const LANGUAGE_VALUES = Object.values(LanguageEnum);
const LANGUAGE_STORAGE_KEY = "language-storage";

export { LanguageEnum, DEFAULT_LANGUAGE, LANGUAGE_VALUES, LANGUAGE_STORAGE_KEY };
