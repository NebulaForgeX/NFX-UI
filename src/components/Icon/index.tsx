/**
 * 图标组件：基于 lucide-react，通过 name 渲染对应图标。Icon component; renders lucide icon by name.
 *
 * @example
 * ```tsx
 * * 使用已注册的图标名
 * <Icon name="ChevronDown" size={20} />
 * * 带 className
 * <Icon name="Search" className={styles.searchIcon} />
 * ```
 */
import type { LucideProps } from "lucide-react";

import { memo } from "react";

import * as LucideIcons from "@/icons/lucide";

export type IconName = keyof Omit<typeof LucideIcons, "LucideIcon">;

export interface IconProps extends LucideProps {
  /** 图标名（lucide 注册名）。Icon name (lucide registered name). */
  name: IconName;
}

const Icon = memo(({ name, ...props }: IconProps) => {
  const LucideIcon = LucideIcons[name] as React.ComponentType<LucideProps> | undefined;

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }

  return <LucideIcon {...props} />;
});

Icon.displayName = "Icon";

export default Icon;
