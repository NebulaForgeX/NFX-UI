import type { ThemeEnum, ThemeSwitcherProps } from "../../types";

import { memo, useEffect, useRef, useState } from "react";

import { useTheme } from "../../hooks/useTheme";
import styles from "./styles.module.css";

const ThemeSwitcher = memo(({ status = "primary", getThemeDisplayName = (theme: ThemeEnum) => theme, handleChangeTheme }: ThemeSwitcherProps) => {
  const { themeName, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleThemeChange = (theme: ThemeEnum) => {
    setTheme(theme);
    handleChangeTheme?.(theme);
    setIsOpen(false);
  };

  return (
    <div className={styles.nbSelect} ref={wrapperRef}>
      <button className={`${styles.selectButton} ${styles[status]}`} onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen} aria-haspopup="listbox">
        <span className={styles.buttonText}>{getThemeDisplayName(themeName)}</span>
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

      <div className={`${styles.optionsPanel} ${styles[status]} ${isOpen ? styles.open : styles.closed}`}>
        <ul className={styles.optionsList} role="listbox">
          {availableThemes.map((theme: ThemeEnum) => (
            <li
              key={theme}
              className={`${styles.option} ${theme === themeName ? styles.selected : ""}`}
              onClick={() => handleThemeChange(theme)}
              role="option"
              aria-selected={theme === themeName}
            >
              <span>{getThemeDisplayName(theme)}</span>
              {theme === themeName && (
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
});

ThemeSwitcher.displayName = "ThemeSwitcher";

export default ThemeSwitcher;
