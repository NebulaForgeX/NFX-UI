/**
 * Shared utility types (source of truth in config layer).
 */
export type Nullable<T> = T | null;
export type Maybe<T> = T | undefined;
export type Nilable<T> = T | null | undefined;
export type Emptyable<T> = T | null | undefined | "";
export type Zeroable<T extends number> = T | 0;
export type Stringable<T extends string> = T | "";
export type Objectable<T extends Record<string, unknown>> = T | {};
export type Arrayable<T> = Array<T> | T[];
export type ExistenceResult<T> = [T, true] | [null, false];
export type ValueOf<T> = T[keyof T];
export type KeyOf<T> = keyof T;
export type Defined<T, Tag extends string> = T & {
  readonly __defineBrand?: Tag;
};
export type IsOK<T> = [T, true] | [null, false];
