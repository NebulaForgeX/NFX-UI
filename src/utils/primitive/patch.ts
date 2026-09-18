export function normalizeOptionalString(value: string): Nullable<string> {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export function originalOptionalString(value: Nilable<string>): Nullable<string> {
  if (value == null) return null;
  return normalizeOptionalString(String(value));
}

export function assignNullableString<T extends object>(patch: T, key: keyof T & string, next: Maybe<string>, previous: Nilable<string>): void {
  if (next === undefined) return;
  const normalized = normalizeOptionalString(next);
  if (normalized !== originalOptionalString(previous)) {
    (patch as Record<string, unknown>)[key] = normalized;
  }
}

export function assignIfChanged<T extends object>(patch: T, key: keyof T & string, next: unknown, previous: unknown, eq: (a: unknown, b: unknown) => boolean = Object.is): void {
  if (next === undefined) return;
  if (!eq(next, previous)) {
    (patch as Record<string, unknown>)[key] = next;
  }
}

export function isEmptyPatch(patch: object): boolean {
  return Object.keys(patch).length === 0;
}
