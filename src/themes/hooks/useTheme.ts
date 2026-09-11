import { usePreferenceStore } from "@/stores/preference";
import { BASE_VALUES, type BaseEnum } from "@/enums/theme";
import { BASE_TO_RADIX_RADIUS, RADIX_RADIUS_TO_BASE, type ResolvedThemePreference } from "@/themes/radix";
import { setPreference } from "@/stores/preference";

export function readCssColor(varName: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;
  const el = document.querySelector(".radix-themes") ?? document.documentElement;
  const value = getComputedStyle(el).getPropertyValue(varName).trim();
  return value || fallback;
}

export function useTheme() {
  const theme = usePreferenceStore((s) => s.theme);
  const currentTheme = {
    colors: {
      variables: {
        primary: readCssColor("--accent-9", "#e54d2e"),
        info: readCssColor("--blue-9", "#0090ff"),
        success: readCssColor("--green-9", "#30a46c"),
        fgHeading: readCssColor("--gray-12", "#1c2024"),
        border5: readCssColor("--gray-8", "#b9bbc6"),
        fg: readCssColor("--gray-11", "#60646c"),
        bg3: readCssColor("--gray-3", "#f0f0f3"),
        border3: readCssColor("--gray-6", "#d8d9e0"),
      },
    },
  };
  return {
    theme,
    currentTheme,
    themeName: theme.accent,
    baseName: RADIX_RADIUS_TO_BASE[theme.radius],
    setTheme: (patch: Partial<ResolvedThemePreference>) => setPreference({ theme: patch }),
    setBase: (base: BaseEnum) => setPreference({ theme: { radius: BASE_TO_RADIX_RADIUS[base] } }),
    availableBases: BASE_VALUES,
  };
}
