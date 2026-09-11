import type { LayoutFrameProps } from "../../types";

import { memo } from "react";

import Sidebar from "../Sidebar";

export const LayoutFrame = memo(
  ({
    children,
    sidebarItems,
    sidebarCurrentPathname,
    onSidebarNavigate,
    sidebarLogoutLabel,
    onSidebarLogout,
    headerLeft,
    headerRight,
  }: LayoutFrameProps) => {
    return (
      <Sidebar
        items={sidebarItems}
        currentPathname={sidebarCurrentPathname}
        onNavigate={onSidebarNavigate}
        logoutLabel={sidebarLogoutLabel}
        handleLogout={onSidebarLogout}
        header={headerLeft}
        topBar={headerRight}
      >
        {children}
      </Sidebar>
    );
  },
);

LayoutFrame.displayName = "LayoutFrame";
export default LayoutFrame;
