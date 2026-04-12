import type { Theme, ThemeEnum } from "../types";
import useBaseVariables from "./useBaseVariables";
import useThemeVariables from "./useThemeVariables";

/**
 * 注入完整主题：颜色变量（useThemeVariables）+ 基础 token（useBaseVariables），并持久化颜色主题名。
 * Full theme injection: color variables + base tokens; persists color theme name.
 */
const useVariables = (currentTheme: Theme, themeName: ThemeEnum) => {
  useThemeVariables(currentTheme, themeName);
  useBaseVariables(currentTheme.base);
};

export default useVariables;
