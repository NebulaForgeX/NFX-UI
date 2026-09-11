/**
 * useTheme 返回值类型。
 */
import type { AccentColorEnum, BaseEnum } from "@/enums/theme";
import type { ResolvedThemePreference } from "@/themes/radix";

export interface ThemeContextType {
  theme: ResolvedThemePreference;
  themeName: AccentColorEnum;
  baseName: BaseEnum;
  setTheme: (patch: Partial<ResolvedThemePreference>) => void;
  setBase: (baseName: BaseEnum) => void;
  availableBases: BaseEnum[];
}
