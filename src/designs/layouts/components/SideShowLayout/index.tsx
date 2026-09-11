import type { SideShowLayoutProps } from "../../types";

import { memo } from "react";

import Sidebar from "../Sidebar";

const SideShowLayout = memo(({ children, sidebarItems, sidebarCurrentPathname, onSidebarNavigate, sidebarLogoutLabel, onSidebarLogout }: SideShowLayoutProps) => {
  return (
    <Sidebar items={sidebarItems} currentPathname={sidebarCurrentPathname} onNavigate={onSidebarNavigate} logoutLabel={sidebarLogoutLabel} handleLogout={onSidebarLogout}>
      {children}
    </Sidebar>
  );
});

SideShowLayout.displayName = "SideShowLayout";
export default SideShowLayout;
