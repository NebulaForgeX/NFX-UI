import type { LayoutFrameProps } from "../../types";

import { memo } from "react";

import useLayout from "../../hooks/useLayout";
import { LayoutModeEnum } from "../../types";
import MainWrapper from "../MainWrapper";
import SideHideLayout from "../SideHideLayout";
import SideShowLayout from "../SideShowLayout";

export const LayoutFrame = memo(
  ({
    children,
    headerLeft,
    headerRight,
    footerContent,
    sidebarItems,
    sidebarCurrentPathname,
    onSidebarNavigate,
    sidebarLogoutLabel,
    onSidebarLogout,
  }: LayoutFrameProps) => {
    const { layoutMode } = useLayout();
    return (
      <MainWrapper headerLeft={headerLeft} headerRight={headerRight} footerContent={footerContent}>
        {(headerHeight, footerHeight) => {
          if (layoutMode === LayoutModeEnum.HIDE) {
            return (
              <SideHideLayout
                headerHeight={headerHeight}
                footerHeight={footerHeight}
                sidebarItems={sidebarItems}
                sidebarCurrentPathname={sidebarCurrentPathname}
                onSidebarNavigate={onSidebarNavigate}
                sidebarLogoutLabel={sidebarLogoutLabel}
                onSidebarLogout={onSidebarLogout}
              >
                {children}
              </SideHideLayout>
            );
          } else {
            return (
              <SideShowLayout
                headerHeight={headerHeight}
                footerHeight={footerHeight}
                sidebarItems={sidebarItems}
                sidebarCurrentPathname={sidebarCurrentPathname}
                onSidebarNavigate={onSidebarNavigate}
                sidebarLogoutLabel={sidebarLogoutLabel}
                onSidebarLogout={onSidebarLogout}
              >
                {children}
              </SideShowLayout>
            );
          }
        }}
      </MainWrapper>
    );
  },
);

LayoutFrame.displayName = "LayoutFrame";
export default LayoutFrame;
