import type { ReactNode } from "react";

import { useEffect, useRef, useState } from "react";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Avatar, Button, Card, DropdownMenu, Flex, IconButton, Separator, Text } from "@radix-ui/themes";
import { setHeaderHeight } from "@/stores/layout";
import { useTranslation } from "react-i18next";

import Logo from "@/designs/components/Logo";
import PreferencesPopover from "@/designs/components/PreferencesPopover";

import styles from "./s.module.css";

export type HeaderNavItem = {
  key: string;
  label: string;
  onSelect: () => void;
  active?: boolean;
};

export type HeaderAccount = {
  displayName: string;
  initial: string;
  avatarSrc?: string;
  menuItems?: { key: string; label: string; onSelect: () => void; color?: "red" }[];
};

export type HeaderProps = {
  brandTitle?: ReactNode;
  brandSubtitle?: ReactNode;
  logoSrc?: string;
  srcDark?: string;
  navItems?: HeaderNavItem[];
  account?: HeaderAccount | null;
  onLogin?: () => void;
  onSignup?: () => void;
  onLogoClick?: () => void;
  extraActions?: ReactNode;
};

function Header({
  brandTitle,
  brandSubtitle,
  logoSrc,
  srcDark,
  navItems = [],
  account,
  onLogin,
  onSignup,
  onLogoClick,
  extraActions,
}: HeaderProps) {
  const headerRef = useRef<HTMLElement | null>(null);
  const { t } = useTranslation("language");
  const [elevated, setElevated] = useState(false);

  useEffect(() => {
    if (!headerRef.current) return;
    const element = headerRef.current;
    const emitHeight = () => {
      const rect = element.getBoundingClientRect();
      const computed = getComputedStyle(element);
      const marginBottom = parseFloat(computed.marginBottom) || 0;
      setHeaderHeight(rect.bottom + marginBottom);
    };
    emitHeight();
    const observer = new ResizeObserver(emitHeight);
    observer.observe(element);
    window.addEventListener("resize", emitHeight);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", emitHeight);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Flex asChild className={styles.header}>
      <header ref={headerRef}>
        <Card
          size="1"
          className={styles.bar}
          style={
            elevated
              ? {
                  boxShadow: "0 14px 40px color-mix(in oklab, var(--gray-12) 10%, transparent)",
                }
              : undefined
          }
        >
          <Flex align="center" justify="between" gap="3">
            <Logo variant="glassSquare" size="small" src={logoSrc} srcDark={srcDark} title={brandTitle} subtitle={brandSubtitle} onClick={onLogoClick} />

            {navItems.length > 0 ? (
              <Flex asChild align="center" gap="1" className={styles.nav}>
                <nav>
                  {navItems.map((item) => (
                    <Button key={item.key} size="3" variant="soft" className={item.active ? styles.navActive : undefined} onClick={item.onSelect}>
                      {item.label}
                    </Button>
                  ))}
                </nav>
              </Flex>
            ) : null}

            <Flex align="center" gap="2" flexShrink="0">
              {navItems.length > 0 ? (
                <DropdownMenu.Root modal={false}>
                  <DropdownMenu.Trigger>
                    <IconButton variant="soft" color="gray" size="2" className={styles.mobileNav} aria-label={t("header.openMenu")}>
                      <HamburgerMenuIcon />
                    </IconButton>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content align="end">
                    {navItems.map((item) => (
                      <DropdownMenu.Item key={item.key} onSelect={item.onSelect}>
                        {item.label}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              ) : null}

              <PreferencesPopover />
              {extraActions}

              {account ? (
                <DropdownMenu.Root modal={false}>
                  <DropdownMenu.Trigger>
                    <Button variant="soft" color="gray" highContrast>
                      <Avatar size="1" radius="full" src={account.avatarSrc} fallback={account.initial} />
                      <Text size="2" truncate style={{ maxWidth: 120 }}>
                        {account.displayName}
                      </Text>
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content align="end" sideOffset={8} size="2" className={styles.accountMenu}>
                    <DropdownMenu.Label>
                      <Text size="1" color="gray" truncate style={{ maxWidth: 200 }}>
                        {account.displayName}
                      </Text>
                    </DropdownMenu.Label>
                    {account.menuItems?.map((item) => (
                      <DropdownMenu.Item key={item.key} color={item.color} onSelect={item.onSelect}>
                        {item.label}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              ) : (
                <>
                  {onLogin || onSignup ? <Separator orientation="vertical" size="1" /> : null}
                  {onLogin ? (
                    <Button variant="soft" color="gray" onClick={onLogin}>
                      {t("header.login")}
                    </Button>
                  ) : null}
                  {onSignup ? <Button onClick={onSignup}>{t("header.signup")}</Button> : null}
                </>
              )}
            </Flex>
          </Flex>
        </Card>
      </header>
    </Flex>
  );
}

export default Header;
