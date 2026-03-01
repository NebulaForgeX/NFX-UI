/**
 * 语言模块 Hooks：返回 { getXxxDisplayName }，便于扩展；getXxxDisplayName 可传给 SlideDownSwitcher getDisplayName。
 * Language hooks: return { getXxxDisplayName } for extensibility; pass to SlideDownSwitcher getDisplayName.
 */
export { getLanguageDisplayName, useLanguageLabel } from "./useLanguageLabel";
export { getLayoutDisplayName, useLayoutLabel } from "./useLayoutLabel";
export { getPreferenceDisplayName, usePreferenceLabel } from "./usePreferenceLabel";
export { getThemeDisplayName, useThemeLabel } from "./useThemeLabel";
