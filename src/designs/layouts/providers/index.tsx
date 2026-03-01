/**
 * 布局提供者：提供侧栏开关与显示/隐藏模式上下文。
 * Layout provider: provides sidebar state and show/hide layout mode context.
 */
import type { LayoutProviderProps } from "../types";

import { memo } from "react";

import useAction from "../hooks/useAction";
import { LayoutContext } from "../hooks/useLayout";
import useSet from "../hooks/useSet";
import { DEFAULT_LAYOUT_MODE } from "../types";

const LayoutProvider = memo(({ children, defaultLayoutMode = DEFAULT_LAYOUT_MODE }: LayoutProviderProps) => {
  const { sidebarOpen, setSidebarOpen, toggleSidebar, closeSidebar } = useAction();
  const { layoutMode, setLayoutMode } = useSet({ defaultLayoutMode, sidebarOpen });

  return (
    <LayoutContext.Provider
      value={{
        sidebarOpen,
        layoutMode,
        setSidebarOpen,
        toggleSidebar,
        closeSidebar,
        setLayoutMode,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
});

LayoutProvider.displayName = "LayoutProvider";
export default LayoutProvider;
