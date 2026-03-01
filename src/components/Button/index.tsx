/**
 * 按钮组件：支持 variant、size、四向图标、iconOnly、loading、fullWidth。
 * Button with variant, size, top/right/bottom/left icon, iconOnly, loading, fullWidth.
 *
 * @example
 * ```tsx
 * <Button>保存</Button>
 * <Button leftIcon={<Save size={16} />} loading={isSubmitting}>提交</Button>
 * <Button leftIcon={<Trash2 size={16} />} iconOnly aria-label="删除" />
 * ```
 */
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cloneElement, forwardRef, isValidElement } from "react";

import styles from "./styles.module.css";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  /** 上方图标。Top icon. */
  topIcon?: ReactNode;
  /** 下方图标。Bottom icon. */
  bottomIcon?: ReactNode;
  /** 仅图标无文案。Icon only, no text. */
  iconOnly?: boolean;
  /** 图标尺寸覆盖。Override icon size. */
  iconSize?: number;
  loading?: boolean;
  children?: ReactNode;
}

function renderIcon(icon: ReactNode, iconSize?: number): ReactNode {
  if (!icon) return null;
  if (iconSize && isValidElement(icon) && typeof icon.type !== "string") {
    const existingProps = icon.props && typeof icon.props === "object" ? icon.props : {};
    return cloneElement(icon as React.ReactElement<{ size?: number }>, { ...existingProps, size: iconSize });
  }
  return icon;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "medium",
      fullWidth = false,
      leftIcon,
      rightIcon,
      topIcon,
      bottomIcon,
      iconOnly = false,
      iconSize,
      loading = false,
      disabled,
      children,
      className = "",
      ...props
    },
    ref,
  ) => {
    const hasIcons = leftIcon || rightIcon || topIcon || bottomIcon;
    const hasContent = !iconOnly && children;
    const useIconOnlyLayout = iconOnly && hasIcons && !hasContent;
    const useLayout = topIcon || bottomIcon || useIconOnlyLayout;

    const buttonClasses = [
      styles.button,
      styles[variant],
      styles[size],
      fullWidth && styles.fullWidth,
      loading && styles.loading,
      useIconOnlyLayout && styles.iconOnly,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    if (useIconOnlyLayout) {
      return (
        <button ref={ref} type="button" className={buttonClasses} disabled={disabled || loading} {...props}>
          <span className={styles.iconContainer}>
            {topIcon && <span className={styles.topIcon}>{renderIcon(topIcon, iconSize)}</span>}
            {leftIcon && <span className={styles.leftIcon}>{renderIcon(leftIcon, iconSize)}</span>}
            {rightIcon && <span className={styles.rightIcon}>{renderIcon(rightIcon, iconSize)}</span>}
            {bottomIcon && <span className={styles.bottomIcon}>{renderIcon(bottomIcon, iconSize)}</span>}
          </span>
        </button>
      );
    }

    if (useLayout) {
      return (
        <button ref={ref} type="button" className={buttonClasses} disabled={disabled || loading} {...props}>
          {loading && <span className={styles.spinner} />}
          {!loading && (
            <span className={styles.layout}>
              {topIcon && <span className={styles.topIcon}>{renderIcon(topIcon, iconSize)}</span>}
              <span className={styles.horizontal}>
                {leftIcon && <span className={styles.leftIcon}>{renderIcon(leftIcon, iconSize)}</span>}
                {hasContent && <span className={styles.content}>{children}</span>}
                {rightIcon && <span className={styles.rightIcon}>{renderIcon(rightIcon, iconSize)}</span>}
              </span>
              {bottomIcon && <span className={styles.bottomIcon}>{renderIcon(bottomIcon, iconSize)}</span>}
            </span>
          )}
        </button>
      );
    }

    return (
      <button ref={ref} type="button" className={buttonClasses} disabled={disabled || loading} {...props}>
        {loading && <span className={styles.spinner} />}
        {leftIcon && !loading && <span className={styles.leftIcon}>{renderIcon(leftIcon, iconSize)}</span>}
        {children && <span className={styles.content}>{children}</span>}
        {rightIcon && !loading && <span className={styles.rightIcon}>{renderIcon(rightIcon, iconSize)}</span>}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
