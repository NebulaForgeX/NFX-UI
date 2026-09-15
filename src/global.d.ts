import type {
  Array as _Array,
  Defined as _Defined,
  Emptyable as _Emptyable,
  ExistenceResult as _ExistenceResult,
  KeyOf as _KeyOf,
  Maybe as _Maybe,
  Nilable as _Nilable,
  Nullable as _Nullable,
  Objectable as _Objectable,
  Stringable as _Stringable,
  ValueOf as _ValueOf,
  Zeroable as _Zeroable,
  isOK as _IsOK,
} from "./types/utils";

export {};

declare global {
  type Nullable<T> = _Nullable<T>;
  type Maybe<T> = _Maybe<T>;
  type Nilable<T> = _Nilable<T>;
  type Emptyable<T> = _Emptyable<T>;
  type Zeroable<T extends number> = _Zeroable<T>;
  type Stringable<T extends string> = _Stringable<T>;
  type Objectable<T extends Record<string, unknown>> = _Objectable<T>;
  type ExistenceResult<T> = _ExistenceResult<T>;
  type ValueOf<T> = _ValueOf<T>;
  type KeyOf<T> = _KeyOf<T>;
  type Defined<T, Tag extends string> = _Defined<T, Tag>;
  type isOK<T> = _IsOK<T>;
}
