/**
 * 按钮组件：支持多种 variant、size、左右图标与 loading。Button with variant, size, left/right icon, loading.
 *
 * @example
 * ```tsx
 * * 基础用法
 * <Button onClick={handleSave}>保存</Button>
 * * 带图标与 loading
 * <Button leftIcon={<Save size={16} />} loading={isSubmitting}>提交</Button>
 * ```
 */
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { forwardRef } from "react";

import styles from "./styles.module.css";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
  /** 按钮变体。Button variant. */
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  /** 尺寸。Size. */
  size?: "small" | "medium" | "large";
  /** 是否占满宽度。Full width. */
  fullWidth?: boolean;
  /** 左侧图标。Left icon. */
  leftIcon?: ReactNode;
  /** 右侧图标。Right icon. */
  rightIcon?: ReactNode;
  /** 是否加载中。Loading state. */
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "medium", fullWidth = false, leftIcon, rightIcon, loading = false, disabled, children, className = "", ...props }, ref) => {
    const buttonClasses = [styles.button, styles[variant], styles[size], fullWidth && styles.fullWidth, loading && styles.loading, className]
      .filter(Boolean)
      .join(" ");

    return (
      <button ref={ref} className={buttonClasses} disabled={disabled || loading} {...props}>
        {loading && <span className={styles.spinner} />}
        {leftIcon && !loading && <span className={styles.leftIcon}>{leftIcon}</span>}
        {children && <span className={styles.content}>{children}</span>}
        {rightIcon && !loading && <span className={styles.rightIcon}>{rightIcon}</span>}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
