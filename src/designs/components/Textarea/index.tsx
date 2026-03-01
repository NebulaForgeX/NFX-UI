/**
 * 多行文本框：支持 label、error、helperText、左右图标与 size/variant。Textarea with label, error, helperText, left/right icon.
 *
 * @example
 * ```tsx
 * * 基础用法
 * <Textarea label="备注" value={note} onChange={(e) => setNote(e.target.value)} rows={4} />
 * * 错误态
 * <Textarea error={errors.note} helperText="选填" />
 * ```
 */
import type { ReactNode, TextareaHTMLAttributes } from "react";

import { forwardRef } from "react";

import styles from "./styles.module.css";

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
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
  /** 尺寸。Size. */
  size?: "small" | "medium" | "large";
  /** 视觉变体。Variant. */
  variant?: "default" | "filled";
  /** 是否占满宽度。Full width. */
  fullWidth?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, leftIcon, rightIcon, size = "medium", variant = "default", fullWidth = false, className = "", disabled, ...props }, ref) => {
    const textareaClasses = [styles.textarea, styles[size], styles[variant], error && styles.error, disabled && styles.disabled, className]
      .filter(Boolean)
      .join(" ");

    const wrapperClasses = [styles.wrapper, fullWidth && styles.fullWidth].filter(Boolean).join(" ");

    return (
      <div className={wrapperClasses}>
        {label && (
          <label className={styles.label}>
            {label}
            {props.required && <span className={styles.required}>*</span>}
          </label>
        )}
        <div className={styles.inputContainer}>
          {leftIcon && <div className={styles.leftIcon}>{leftIcon}</div>}
          <textarea ref={ref} className={textareaClasses} disabled={disabled} {...props} />
          {rightIcon && <div className={styles.rightIcon}>{rightIcon}</div>}
        </div>
        {error && <span className={styles.errorText}>{error}</span>}
        {helperText && !error && <span className={styles.helperText}>{helperText}</span>}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
