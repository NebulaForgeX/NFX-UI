/**
 * 语言相关组件的 Props 类型。
 * Props types for language-related components.
 */
import type { ReactNode } from "react";
import type { CreateI18nResourcesResult } from "./i18n";
import type { LanguageEnum } from "./language";

/** 语言 Provider 的 props。LanguageProvider props. */
export interface LanguageProviderProps {
  /** 子节点。Children. */
  children: ReactNode;
  /** 用户自建 JSON 后调用 createI18nResources 得到的结果。Result of createI18nResources(resources, nameSpacesMap). */
  bundles: CreateI18nResourcesResult;
  /** 回退语言。Fallback language. */
  fallbackLng?: LanguageEnum;
  /** 语言切换后加载额外文案（如错误码）；由调用方实现。Load extra bundles (e.g. errors) per language; caller implements. */
  onLoadExtraBundles?: (lng: string) => Promise<void>;
}

/** 语言切换器 props。LanguageSwitcher props. */
export interface LanguageSwitcherProps {
  /** 样式状态。Visual status. */
  status?: "primary" | "default";
  /** 根据 lang 返回显示名称；未传则使用 lang 原值。Display name for language; default is lang value. */
  getLanguageDisplayName?: (lang: LanguageEnum) => string;
  /** 处理语言改变。Handle language change. */
  handleChangeLanguage?: (language: LanguageEnum) => void;
}
