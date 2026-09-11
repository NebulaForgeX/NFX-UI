/**
 * Shared Radix Theme provider — reads unified preference store.
 * Host may pass document side-effects (e.g. favicon) via `onAppearanceChange`.
 */
import type { RadixAppearance } from "@/themes/radix";
import type { ReactNode } from "react";

import { useEffect } from "react";
import { Theme } from "@radix-ui/themes";

import { useResolvedAppearance } from "@/hooks/preference";
import { usePreferenceStore } from "@/stores/preference";

import "@/themes/index.css";

export interface ThemeProviderProps {
  children: ReactNode;
  onAppearanceChange?: (appearance: RadixAppearance) => void;
}

const ThemeProvider = ({ children, onAppearanceChange }: ThemeProviderProps) => {
  const theme = usePreferenceStore((s) => s.theme);
  const resolvedAppearance = useResolvedAppearance();

  useEffect(() => {
    document.documentElement.dataset.appearance = resolvedAppearance;
    onAppearanceChange?.(resolvedAppearance);
  }, [onAppearanceChange, resolvedAppearance]);

  return (
    <Theme
      appearance={resolvedAppearance}
      accentColor={theme.accent}
      grayColor={theme.gray}
      radius={theme.radius}
      scaling={theme.scaling}
      panelBackground={theme.panelBackground}
      hasBackground
      className="radix-app-theme"
      data-font-family={theme.fontFamily}
    >
      {children}
    </Theme>
  );
};

ThemeProvider.displayName = "ThemeProvider";
export default ThemeProvider;
