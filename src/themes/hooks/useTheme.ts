/**
 * 主题上下文与 useTheme：供子组件消费当前主题与 setTheme/setBase。
 * Theme context and useTheme: for consuming current theme and setTheme/setBase.
 */
import type { ThemeContextType } from "../types";

import { createContext, useContext } from "react";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export { ThemeContext, useTheme };
export type { ThemeContextType } from "../types";
