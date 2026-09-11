/**
 * Language helpers backed by PreferenceStore (CityPulso: no separate language-storage key).
 */
import type { Nilable } from "@/types/utils";

import { LANGUAGE_VALUES, LanguageEnum } from "@/enums/language";
import { PreferenceStore, setPreference } from "@/stores/preference";

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
