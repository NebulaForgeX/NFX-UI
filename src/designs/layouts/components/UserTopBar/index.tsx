import type { ReactNode } from "react";

import { Avatar, Badge, Button, Flex, Text } from "@radix-ui/themes";

import styles from "./s.module.css";

export type UserTopBarAction = {
  key: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  badge?: boolean;
};

export type UserTopBarProps = {
  displayName: string;
  subtitle?: string;
  avatarSrc?: string;
  initial?: string;
  requestBadge?: string;
  actions?: UserTopBarAction[];
};

export default function UserTopBar({ displayName, subtitle, avatarSrc, initial = "?", requestBadge, actions = [] }: UserTopBarProps) {
  return (
    <Flex align="center" justify="between" gap="3" wrap="wrap" py="3" px="4" position="sticky" top="0" className={styles.bar}>
      <Flex align="center" gap="3" minWidth="0">
        <Avatar size="2" radius="full" src={avatarSrc} fallback={initial} />
        <Flex direction="column" minWidth="0">
          <Text size="2" weight="bold" truncate>
            {displayName}
          </Text>
          {subtitle ? (
            <Text size="1" color="gray" truncate>
              {subtitle}
            </Text>
          ) : null}
        </Flex>
        {requestBadge ? (
          <Badge color="orange" variant="soft">
            {requestBadge}
          </Badge>
        ) : null}
      </Flex>

      <Flex align="center" gap="2" wrap="wrap">
        {actions.map((action) => (
          <Button key={action.key} size="2" variant="soft" color={action.badge ? undefined : "gray"} onClick={action.onClick}>
            {action.icon}
            {action.label}
            {action.badge ? (
              <Badge size="1" color="red">
                ·
              </Badge>
            ) : null}
          </Button>
        ))}
      </Flex>
    </Flex>
  );
}
