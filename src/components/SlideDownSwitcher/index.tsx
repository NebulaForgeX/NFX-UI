/**
 * 下滑切换器：选项列表下拉选择，支持泛型 T（如 enum）。Dropdown switcher with options; generic T (e.g. enum).
 *
 * @example
 * ```tsx
 * * 与 enum 配合
 * type Status = "all" | "active" | "archived";
 * <SlideDownSwitcher<Status>
 *   value={filter}
 *   options={["all", "active", "archived"]}
 *   getDisplayName={(v) => ({ all: "全部", active: "启用", archived: "归档" }[v])}
 *   onChange={setFilter}
 * />
 * ```
 */
import type { MemoExoticComponent, ReactElement } from "react";

import { memo, useEffect, useRef, useState } from "react";

import styles from "./styles.module.css";

export interface SlideDownSwitcherProps<T extends string> {
  /** 当前选中的值（enum 或 string）。Currently selected value (enum or string). */
  value: T;
  /** 可选项列表（如 Object.values(SomeEnum)）。Options list (e.g. Object.values(SomeEnum)). */
  options: readonly T[];
  /** 选项展示文案。Display name for each option. */
  getDisplayName: (value: T) => string;
  /** 选中后回调。Callback when selection changes. */
  onChange: (value: T) => void;
  /** 样式状态。Visual status. */
  status?: "primary" | "default";
}

const SlideDownSwitcher: MemoExoticComponent<<T extends string>(props: SlideDownSwitcherProps<T>) => ReactElement | null> = memo(
  <T extends string>({ value, options, getDisplayName, onChange, status = "primary" }: SlideDownSwitcherProps<T>) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setIsOpen(false);
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option: T) => {
      onChange(option);
      setIsOpen(false);
    };

    return (
      <div className={styles.nbSelect} ref={wrapperRef}>
        <button
          type="button"
          className={`${styles.selectButton} ${styles[status]}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className={styles.buttonText}>{getDisplayName(value)}</span>
          <svg
            className={`${styles.chevronIcon} ${isOpen ? styles.open : ""}`}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className={`${styles.optionsPanel} ${styles[status]} ${isOpen ? styles.open : styles.closed}`} role="listbox">
          <ul className={styles.optionsList}>
            {options.map((option) => (
              <li
                key={option}
                className={`${styles.option} ${option === value ? styles.selected : ""}`}
                onClick={() => handleSelect(option)}
                role="option"
                aria-selected={option === value}
              >
                <span>{getDisplayName(option)}</span>
                {option === value && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  },
);

SlideDownSwitcher.displayName = "SlideDownSwitcher";
export default SlideDownSwitcher;
