/**
 * 布局上下文与 useLayout：供子组件消费侧栏状态与 setLayoutMode。
 * Layout context and useLayout: for consuming sidebar state and setLayoutMode.
 */
import type { LayoutContextType } from "../types";

import { createContext, useContext } from "react";

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

const useLayout = () => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};

export default useLayout;
export { LayoutContext };
