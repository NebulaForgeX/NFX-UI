/**
 * 下拉选择：options 为 { value, label } 列表，受控 value/onChange。Dropdown select; options as { value, label }, controlled value/onChange.
 *
 * @example
 * ```tsx
 * * 受控选择
 * const [value, setValue] = useState("");
 * <Dropdown
 *   options={[{ value: "a", label: "选项 A" }, { value: "b", label: "选项 B" }]}
 *   value={value}
 *   onChange={setValue}
 *   placeholder="请选择"
 * />
 * ```
 */
import { memo, useEffect, useRef, useState } from "react";

import { ChevronDown } from "@/icons/lucide";

import styles from "./Dropdown.module.css";

export interface DropdownOption {
  /** 选项值。Option value. */
  value: string;
  /** 选项展示文案。Option label. */
  label: string;
}

export interface DropdownProps {
  /** 选项列表。Options list. */
  options: DropdownOption[];
  /** 当前选中值。Current value. */
  value: string;
  /** 选中回调。Change callback. */
  onChange: (value: string) => void;
  /** 占位符。Placeholder. */
  placeholder?: string;
  /** 是否禁用。Disabled. */
  disabled?: boolean;
  /** 是否错误态。Error state. */
  error?: boolean;
  /** 容器 className。Container className. */
  className?: string;
}

const Dropdown = memo<DropdownProps>(({ options, value, onChange, placeholder = "Select an option", disabled = false, error = false, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedOption = options.find((option) => option.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`${styles.dropdown} ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className={`${styles.dropdownButton} ${error ? styles.error : ""} ${disabled ? styles.disabled : ""}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={styles.buttonText}>{displayText}</span>
        <ChevronDown size={16} className={`${styles.chevronIcon} ${isOpen ? styles.open : ""}`} />
      </button>

      {isOpen && !disabled && (
        <div className={styles.dropdownMenu}>
          <ul className={styles.optionsList} role="listbox">
            {options.map((option) => (
              <li
                key={option.value}
                className={`${styles.option} ${option.value === value ? styles.selected : ""}`}
                onClick={() => handleOptionClick(option.value)}
                role="option"
                aria-selected={option.value === value}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

Dropdown.displayName = "Dropdown";

export default Dropdown;
