import type { ReactNode } from "react";

import { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, IconButton, Text } from "@radix-ui/themes";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, LogOut, Menu as MenuIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Menu, Sidebar as ProSidebar } from "react-pro-sidebar";

import LucideIcon from "@/designs/components/LucideIcon";
import type { LucideIconComponent } from "@/designs/components/LucideIcon";
import type { SidebarMenuItem } from "../../types";

import { MenuItem, SidebarMenuState, SubMenu } from "./menu";
import styles from "./s.module.css";

const SIDEBAR_WIDTH = "234px";
const SIDEBAR_COLLAPSED_WIDTH = "84px";

function MenuLabel({ children, active = false }: { children: ReactNode; active?: boolean }) {
  return (
    <Text as="span" size="2" weight={active ? "bold" : "medium"}>
      {children}
    </Text>
  );
}

function SectionTitle({ label, icon }: { label: string; icon: LucideIconComponent }) {
  return (
    <Flex align="center" justify="between" gap="2" className={styles.sectionTitle}>
      <Text as="span" size="2" weight="bold">
        {label}
      </Text>
      <LucideIcon icon={icon} size={16} className={styles.sectionTitleIcon} />
    </Flex>
  );
}

function createMenuItemStyles(collapsed: boolean) {
  return {
    button: ({ active, level = 0 }: { active: boolean; level?: number }) => ({
      height: level > 0 ? "34px" : "40px",
      margin: level > 0 ? (collapsed ? "3px 7px" : "3px 0 3px 32px") : "6px 0",
      borderRadius: "var(--radius-chip)",
      paddingLeft: level > 0 ? "11px" : "10px",
      paddingRight: "10px",
      fontSize: level > 0 ? "14px" : "15px",
      fontWeight: 400,
      color: active ? "var(--accent-11)" : "var(--gray-11)",
      backgroundColor: active ? "var(--accent-a3)" : "transparent",
      transition: "background-color 150ms ease, color 150ms ease",
      "&:hover": { backgroundColor: active ? "var(--accent-a3)" : "var(--gray-a3)", color: active ? "var(--accent-11)" : "var(--gray-12)" },
      "&:focus-visible": {
        outline: "2px solid var(--accent-8)",
        outlineOffset: "2px",
      },
    }),
    icon: ({ level = 0 }: { level?: number }) => ({
      width: "20px",
      minWidth: "20px",
      height: "20px",
      marginRight: "10px",
      color: "inherit",
      ...(level > 0 ? { display: "none" } : {}),
    }),
    subMenuContent: {
      backgroundColor: collapsed ? "var(--color-panel-solid)" : "transparent",
      padding: collapsed ? "5px 0" : "0",
      ...(collapsed
        ? {
            zIndex: 1000,
            minWidth: "156px",
            width: "max-content",
            maxWidth: "260px",
            maxHeight: "calc(100dvh - 32px)",
            overflowY: "auto" as const,
            borderRadius: "var(--radius-4)",
            border: "1px solid var(--gray-a5)",
            boxShadow: "var(--shadow-5)",
          }
        : {}),
    },
  };
}

function isActivePath(current: string, path: string): boolean {
  return current === path || current.startsWith(`${path}/`);
}

export type SidebarChromeProps = {
  items?: SidebarMenuItem[];
  currentPathname?: string;
  onNavigate?: (path: string) => void;
  handleLogout?: () => void;
  logoutLabel?: string;
  header?: ReactNode;
  topBar?: ReactNode;
  footerExtra?: ReactNode;
  children?: ReactNode;
};

function Sidebar({
  items = [],
  currentPathname = "",
  onNavigate,
  handleLogout,
  logoutLabel,
  header,
  topBar,
  footerExtra,
  children,
}: SidebarChromeProps) {
  const { t } = useTranslation("language");
  const [desktopCollapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [broken, setBroken] = useState(false);
  const collapsed = !broken && desktopCollapsed;
  const drawerRef = useRef<HTMLHtmlElement>(null);
  const [openKeys, setOpenKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!broken || !toggled) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = () =>
      Array.from(drawerRef.current?.querySelectorAll<HTMLElement>("button:not([disabled]), a[href], [tabindex='0']") ?? []).filter(
        (node) => node.getClientRects().length && getComputedStyle(node).visibility !== "hidden",
      );
    focusable()[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (event.key === "Escape") {
        event.preventDefault();
        setToggled(false);
      }
      if (event.key !== "Tab") return;
      const nodes = focusable();
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [broken, toggled]);

  const closeMobile = () => broken && setToggled(false);

  const renderItem = (item: SidebarMenuItem) => {
    const active = isActivePath(currentPathname, item.path);
    if (item.children?.length) {
      const childActive = item.children.some((c) => isActivePath(currentPathname, c.path));
      const open = openKeys[item.path] ?? childActive;
      return (
        <SubMenu
          key={item.path}
          label={item.label}
          icon={item.icon}
          open={open}
          onOpenChange={(next) => setOpenKeys((s) => ({ ...s, [item.path]: next }))}
          active={childActive}
        >
          {item.children.map((child) => {
            const childIsActive = isActivePath(currentPathname, child.path);
            return (
              <MenuItem
                key={child.path}
                icon={child.icon}
                active={childIsActive}
                onClick={() => {
                  onNavigate?.(child.path);
                  closeMobile();
                }}
              >
                <MenuLabel active={childIsActive}>{child.label}</MenuLabel>
              </MenuItem>
            );
          })}
        </SubMenu>
      );
    }
    return (
      <MenuItem
        key={item.path}
        icon={item.icon}
        active={active}
        onClick={() => {
          onNavigate?.(item.path);
          closeMobile();
        }}
      >
        <MenuLabel active={active}>{item.label}</MenuLabel>
      </MenuItem>
    );
  };

  return (
    <Flex minHeight="100dvh" width="100%" className={styles.shell}>
      <SidebarMenuState collapsed={collapsed}>
        <ProSidebar
          ref={drawerRef}
          inert={broken && !toggled ? true : undefined}
          aria-hidden={broken && !toggled ? true : undefined}
          collapsed={collapsed}
          toggled={toggled}
          onBackdropClick={() => setToggled(false)}
          onBreakPoint={setBroken}
          breakPoint="md"
          width={SIDEBAR_WIDTH}
          collapsedWidth={SIDEBAR_COLLAPSED_WIDTH}
          rootStyles={{
            border: 0,
            height: "100dvh",
            flexShrink: 0,
            position: "sticky",
            top: 0,
            margin: 0,
            zIndex: 200,
            overflow: "visible",
            "&.ps-broken.ps-toggled": { left: 0 },
            "&.ps-broken": { height: "100dvh", position: "fixed", margin: 0, top: 0, bottom: 0 },
            "& .ps-sidebar-container": {
              background: "transparent",
              height: "100%",
              overflow: "visible",
            },
          }}
        >
          <Flex direction="column" height="100%" minHeight="0" className={styles.sidebar}>
            <div className={styles.header}>
              {header}
              <IconButton
                variant="soft"
                size="1"
                className={styles.toggle}
                aria-label={collapsed ? t("sidebar.expand") : t("sidebar.collapse")}
                aria-expanded={!collapsed}
                onClick={() => (broken ? setToggled(false) : setCollapsed((value) => !value))}
              >
                <LucideIcon icon={collapsed ? ChevronRight : ChevronLeft} size={14} />
              </IconButton>
            </div>

            <Box flexGrow="1" minHeight="0" py="2" className={`${styles.menuArea} ${collapsed ? styles.menuAreaCollapsed : ""}`}>
              <Menu renderExpandIcon={({ open }) => <LucideIcon icon={open ? ChevronUp : ChevronDown} size={14} />} menuItemStyles={createMenuItemStyles(collapsed)} closeOnClick>
                {items.map(renderItem)}
              </Menu>
            </Box>

            <div className={`${styles.footer} ${collapsed ? styles.footerCollapsed : ""}`}>
              {footerExtra}
              {handleLogout ? (
                <Button
                  variant="ghost"
                  className={`${styles.logout} ${collapsed ? styles.logoutCollapsed : ""}`}
                  onClick={handleLogout}
                  aria-label={logoutLabel ?? t("sidebar.logout")}
                  title={collapsed ? (logoutLabel ?? t("sidebar.logout")) : undefined}
                >
                  <LucideIcon icon={LogOut} size={18} />
                  {!collapsed && (logoutLabel ?? t("sidebar.logout"))}
                </Button>
              ) : null}
            </div>
          </Flex>
        </ProSidebar>
      </SidebarMenuState>

      <Flex direction="column" flexGrow="1" minWidth="0" inert={broken && toggled ? true : undefined} className={styles.content}>
        {broken ? (
          <IconButton variant="surface" color="gray" size="3" className={styles.mobileToggle} onClick={() => setToggled(true)} aria-label={t("sidebar.openMenu")}>
            <LucideIcon icon={MenuIcon} size={18} />
          </IconButton>
        ) : null}
        {topBar}
        <Box flexGrow="1" minWidth="0" minHeight="0" className={styles.contentInner}>
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}

export default Sidebar;
export { SectionTitle, MenuLabel, createMenuItemStyles, SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH };
