/**
 * i18n 相关类型：文案包、资源结构、初始化选项等。
 * i18n-related types: bundle, resources, init options.
 */
import type { LanguageEnum } from "./language";

/** 单语言下的命名空间 → 文案对象。One language: namespace -> key-value bundle. */
export type NamespaceBundle = Record<string, unknown>;

/** 所有语言的资源：语言码 → 命名空间 → 文案。Resources: lng -> ns -> bundle. */
export type Resources = Record<string, Record<string, NamespaceBundle>>;

/** 命名空间映射：命名空间 key → 命名空间字符串（用于 ns 列表）。Name space key -> string. */
export type NameSpacesMap = Record<string, string>;

/** createI18nResources 返回值，含 RESOURCES / NAME_SPACES_MAP / NAME_SPACES。Return type of createI18nResources. */
export interface CreateI18nResourcesResult {
  RESOURCES: Resources;
  NAME_SPACES_MAP: NameSpacesMap;
  NAME_SPACES: string[];
}

/** initI18n 的选项。Options for initI18n. */
export interface InitI18nOptions {
  /** 由 createI18nResources(resources, nameSpacesMap) 得到；用户自建 JSON 后组装传入。From createI18nResources; user builds from their JSON. */
  bundles: CreateI18nResourcesResult;
  /** 回退语言。Fallback language. */
  fallbackLng?: LanguageEnum;
  /** 语言切换后由调用方加载额外文案（如错误码等）；不传则不执行。Optional: load extra bundles (e.g. errors) per language; caller provides. */
  onLoadExtraBundles?: (lng: string) => Promise<void>;
}
