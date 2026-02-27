/**
 * 图标按钮：支持四向图标、iconOnly、iconSize 等。Icon button with top/right/bottom/left icon, iconOnly, iconSize.
 *
 * @example
 * ```tsx
 * * 仅图标
 * <IconButton leftIcon={<Trash2 size={16} />} iconOnly aria-label="删除" />
 * * 图标 + 文案
 * <IconButton leftIcon={<Plus size={16} />}>新增</IconButton>
 * ```
 */
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cloneElement, forwardRef, isValidElement } from "react";

import styles from "./styles.module.css";

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** 按钮变体。Button variant. */
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  /** 尺寸。Size. */
  size?: "small" | "medium" | "large";
  /** 上方图标。Top icon. */
  topIcon?: ReactNode;
  /** 右侧图标。Right icon. */
  rightIcon?: ReactNode;
  /** 下方图标。Bottom icon. */
  bottomIcon?: ReactNode;
  /** 左侧图标。Left icon. */
  leftIcon?: ReactNode;
  /** 仅图标无文案。Icon only, no text. */
  iconOnly?: boolean;
  /** 图标尺寸覆盖。Override icon size. */
  iconSize?: number;
  /** 子内容。Children. */
  children?: ReactNode;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { variant = "outline", size = "medium", topIcon, rightIcon, bottomIcon, leftIcon, iconOnly = false, iconSize, children, className = "", ...buttonProps },
    ref,
  ) => {
    const renderIcon = (icon: ReactNode) => {
      if (!icon) return null;
      if (iconSize && isValidElement(icon) && typeof icon.type !== "string") {
        const existingProps = icon.props && typeof icon.props === "object" ? icon.props : {};
        return cloneElement(icon as React.ReactElement<{ size?: number }>, { ...existingProps, size: iconSize });
      }
      return icon;
    };

    const hasIcons = topIcon || rightIcon || bottomIcon || leftIcon;
    const hasContent = !iconOnly && children;

    const classNames = [styles.button, styles[variant], styles[size], iconOnly && hasIcons && !hasContent && styles.iconOnly, className]
      .filter(Boolean)
      .join(" ");

    if (iconOnly && hasIcons && !hasContent) {
      return (
        <button ref={ref} type="button" className={classNames} {...buttonProps}>
          <span className={styles.iconContainer}>
            {topIcon && <span className={styles.topIcon}>{renderIcon(topIcon)}</span>}
            {leftIcon && <span className={styles.leftIcon}>{renderIcon(leftIcon)}</span>}
            {rightIcon && <span className={styles.rightIcon}>{renderIcon(rightIcon)}</span>}
            {bottomIcon && <span className={styles.bottomIcon}>{renderIcon(bottomIcon)}</span>}
          </span>
        </button>
      );
    }

    return (
      <button ref={ref} type="button" className={classNames} {...buttonProps}>
        <span className={styles.layout}>
          {topIcon && <span className={styles.topIcon}>{renderIcon(topIcon)}</span>}
          <span className={styles.horizontal}>
            {leftIcon && <span className={styles.leftIcon}>{renderIcon(leftIcon)}</span>}
            {hasContent && <span className={styles.content}>{children}</span>}
            {rightIcon && <span className={styles.rightIcon}>{renderIcon(rightIcon)}</span>}
          </span>
          {bottomIcon && <span className={styles.bottomIcon}>{renderIcon(bottomIcon)}</span>}
        </span>
      </button>
    );
  },
);

IconButton.displayName = "IconButton";

export default IconButton;
