import type { SideHideLayoutProps } from "../../types";

import { memo } from "react";

import Sidebar from "../Sidebar";

const SideHideLayout = memo(({ children, sidebarItems, sidebarCurrentPathname, onSidebarNavigate, sidebarLogoutLabel, onSidebarLogout }: SideHideLayoutProps) => {
  return (
    <Sidebar items={sidebarItems} currentPathname={sidebarCurrentPathname} onNavigate={onSidebarNavigate} logoutLabel={sidebarLogoutLabel} handleLogout={onSidebarLogout}>
      {children}
    </Sidebar>
  );
});

SideHideLayout.displayName = "SideHideLayout";
export default SideHideLayout;
