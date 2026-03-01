/**
 * 布局模式枚举与常量。Layout mode enum and constants.
 */
enum LayoutModeEnum {
  SHOW = "show",
  HIDE = "hide",
}

const DEFAULT_LAYOUT_MODE = LayoutModeEnum.SHOW;
const LAYOUT_MODE_VALUES = Object.values(LayoutModeEnum);
const LAYOUT_STORAGE_KEY = "layout-storage";

export { LayoutModeEnum, DEFAULT_LAYOUT_MODE, LAYOUT_MODE_VALUES, LAYOUT_STORAGE_KEY };
