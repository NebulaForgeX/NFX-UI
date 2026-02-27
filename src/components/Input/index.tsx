/**
 * 输入框：支持 label、error、helperText、左右图标与 rightIconInteractive。Input with label, error, helperText, left/right icon.
 *
 * @example
 * ```tsx
 * * 带标签与错误态
 * <Input label="用户名" error={errors.name} value={name} onChange={(e) => setName(e.target.value)} />
 * * 右侧可点击图标（如清除）
 * <Input rightIcon={<X size={16} />} rightIconInteractive onRightIconClick={clear} />
 * ```
 */
import type { InputHTMLAttributes, ReactNode } from "react";

import { forwardRef } from "react";

import styles from "./styles.module.css";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** 标签文案。Label text. */
  label?: string;
  /** 错误信息。Error message. */
  error?: string;
  /** 辅助说明。Helper text. */
  helperText?: string;
  /** 左侧图标。Left icon. */
  leftIcon?: ReactNode;
  /** 右侧图标。Right icon. */
  rightIcon?: ReactNode;
  /** 为 true 时 rightIcon 可点击（如密码切换、清除按钮）。When true, right icon is clickable (e.g. password toggle, clear). */
  rightIconInteractive?: boolean;
  /** 尺寸。Size. */
  size?: "small" | "medium" | "large";
  /** 视觉变体。Variant. */
  variant?: "default" | "filled";
  /** 是否占满宽度。Full width. */
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      rightIconInteractive = false,
      size = "medium",
      variant = "default",
      fullWidth = false,
      className = "",
      disabled,
      ...props
    },
    ref,
  ) => {
    const inputClasses = [styles.input, styles[size], styles[variant], error && styles.error, disabled && styles.disabled, className].filter(Boolean).join(" ");

    const wrapperClasses = [styles.wrapper, fullWidth && styles.fullWidth].filter(Boolean).join(" ");

    const containerClasses = [
      styles.inputContainer,
      leftIcon && styles.withLeftIcon,
      rightIcon && styles.withRightIcon,
      size && styles[`container${size.charAt(0).toUpperCase() + size.slice(1)}`],
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={wrapperClasses}>
        {label && (
          <label className={styles.label}>
            {label}
            {props.required && <span className={styles.required}>*</span>}
          </label>
        )}
        <div className={containerClasses}>
          {leftIcon && <div className={styles.leftIcon}>{leftIcon}</div>}
          <input ref={ref} className={inputClasses} disabled={disabled} {...props} />
          {rightIcon && <div className={`${styles.rightIcon} ${rightIconInteractive ? styles.rightIconInteractive : ""}`}>{rightIcon}</div>}
        </div>
        {error && <p className={styles.errorMessage}>{error}</p>}
        {helperText && !error && <p className={styles.helperText}>{helperText}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
