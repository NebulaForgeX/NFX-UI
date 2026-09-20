/**
 * Shared preference store — theme + language + layout (no map/billing/event).
 */
import { DEFAULT_LAYOUT_MODE, LayoutModeEnum } from "nfx-ui/enums/layout";
import { DEFAULT_LANGUAGE, Language, type LanguageEnum } from "nfx-ui/enums/language";
import { DashboardBackground, DEFAULT_DASHBOARD_BACKGROUND, DashboardBackgroundEnum } from "nfx-ui/enums/dashboard";
import { getDefaultThemePreference, resolveThemePreference, type ResolvedThemePreference } from "nfx-ui/themes/radix";
import { makePersistStore } from "nfx-ui/stores/makeStore";

export interface ResolvedPreference {
  language: LanguageEnum;
  theme: ResolvedThemePreference;
  layoutMode: LayoutModeEnum;
  dashboardBackground: DashboardBackgroundEnum;
}

export interface PreferencePatch {
  language?: LanguageEnum;
  theme?: Partial<ResolvedThemePreference>;
  layoutMode?: LayoutModeEnum;
  dashboardBackground?: DashboardBackgroundEnum;
}

export function getDefaultPreference(): ResolvedPreference {
  return {
    language: DEFAULT_LANGUAGE,
    theme: getDefaultThemePreference(),
    layoutMode: DEFAULT_LAYOUT_MODE,
    dashboardBackground: DEFAULT_DASHBOARD_BACKGROUND,
  };
}

function isPlainRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

export function parseServerPreference(raw: unknown): ResolvedPreference {
  const d = getDefaultPreference();
  if (!isPlainRecord(raw)) return d;
  const themeRaw = isPlainRecord(raw.theme) ? (raw.theme as Partial<ResolvedThemePreference>) : undefined;
  return {
    language: Language(typeof raw.language === "string" ? raw.language : undefined),
    theme: resolveThemePreference(themeRaw),
    layoutMode: raw.layoutMode === LayoutModeEnum.HIDE ? LayoutModeEnum.HIDE : DEFAULT_LAYOUT_MODE,
    dashboardBackground: DashboardBackground(typeof raw.dashboardBackground === "string" ? raw.dashboardBackground : undefined),
  };
}

export function toServerPreference(state: ResolvedPreference): ResolvedPreference {
  return {
    language: state.language,
    theme: { ...state.theme },
    layoutMode: state.layoutMode,
    dashboardBackground: state.dashboardBackground,
  };
}

interface PreferenceActions {
  setPreference: (patch: PreferencePatch) => void;
  replacePreference: (next: ResolvedPreference) => void;
}

const { store: PreferenceStore, useStore: usePreferenceStore } = makePersistStore<ResolvedPreference, PreferenceActions>({
  name: "nfx-preference",
  initialState: getDefaultPreference(),
  version: 2,
  migrate: (persisted) => parseServerPreference(persisted),
  partialize: (state) => ({
    language: state.language,
    theme: state.theme,
    layoutMode: state.layoutMode,
    dashboardBackground: state.dashboardBackground,
  }),
  actions: (set) => ({
    setPreference: (patch) =>
      set((s) => ({
        language: patch.language ?? s.language,
        theme: { ...s.theme, ...patch.theme },
        layoutMode: patch.layoutMode ?? s.layoutMode,
        dashboardBackground: patch.dashboardBackground ?? s.dashboardBackground,
      })),
    replacePreference: (next) => set(() => next),
  }),
});

const setPreference = PreferenceStore.getState().setPreference;
const replacePreference = PreferenceStore.getState().replacePreference;

export { setPreference, replacePreference };
export { PreferenceStore, usePreferenceStore };
