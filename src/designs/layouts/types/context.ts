/**
 * 布局上下文类型。Layout context type.
 */
import type { LayoutModeEnum } from "./layout";

/** useLayout 返回值类型。Return type of useLayout. */
export interface LayoutContextType {
  /** 侧栏是否展开。Whether sidebar is open. */
  sidebarOpen: boolean;
  /** 当前布局模式（显示/隐藏）。Current layout mode (show/hide). */
  layoutMode: LayoutModeEnum;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  setLayoutMode: (mode: LayoutModeEnum) => void;
}
