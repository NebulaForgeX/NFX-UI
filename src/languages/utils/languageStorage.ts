/**
 * Language helpers backed by PreferenceStore (CityPulso: no separate language-storage key).
 */
import type { Nilable } from "nfx-ui/types/utils";

import { LANGUAGE_VALUES, LanguageEnum } from "nfx-ui/enums/language";
import { PreferenceStore, setPreference } from "nfx-ui/stores/preference";

export function getLanguageStorage(): Nilable<LanguageEnum> {
  const raw = PreferenceStore.getState().language;
  return (LANGUAGE_VALUES as readonly string[]).includes(raw) ? raw : undefined;
}

export function setLanguageStorage(value: LanguageEnum): void {
  setPreference({ language: value });
}

export function removeLanguageStorage(): void {
  setPreference({ language: LanguageEnum.ZH });
}
