/**
 * 可为 null。T | null.
 * @example Nullable<string> => string | null
 */
type Nullable<T> = T | null;

/**
 * 可为 undefined。T | undefined.
 * @example Maybe<number> => number | undefined
 */
type Maybe<T> = T | undefined;

/**
 * 可为 null 或 undefined。T | null | undefined.
 * @example Nilable<boolean> => boolean | null | undefined
 */
type Nilable<T> = T | null | undefined;

/**
 * 存在性结果元组：[值, true] 表示有值，[null, false] 表示无。Existence result tuple: [value, true] or [null, false].
 * @example ExistenceResult<{ id: string }> => [{ id: string }, true] | [null, false]
 */
type ExistenceResult<T> = [T, true] | [null, false];

/**
 * 对象 T 所有值的联合类型。Union of all value types of T.
 * @example ValueOf<{ a: number; b: string }> => number | string
 */
type ValueOf<T> = T[keyof T];

/**
 * 对象 T 的键类型（即 keyof T）。Key type of T (keyof T).
 * @example KeyOf<{ a: 1; b: 2 }> => "a" | "b"
 */
type KeyOf<T> = keyof T;

/**
 * 定义品牌类型：用于 defineXxx 返回值，仅对应 createXxx/constructor 可接受；Tag 区分不同 define（如 "events" | "router"）。
 * Define brand type: for defineXxx return value, only the matching createXxx accepts; Tag discriminates (e.g. "events" | "router").
 * @example Defined<{ HOME: "/" }, "router"> 仅能传入 createRouter；Defined<{ FOO: "x" }, "events"> 仅能传入 EventEmitter
 */
type Defined<T, Tag extends string> = T & { readonly __defineBrand?: Tag };

/**
 * 判断结果是否为 OK。Check if result is OK.
 * @example isOK<{ id: string }> => [value, true] | [null, false]
 */
type isOK<T> = [T, true] | [null, false];

/**
 * 数组类型。Array type.
 * @example Array<string> => string[]
 */
type Array<T> = T[];

/**
 * 数组或单个元素类型。Array or single element type.
 * @example ArrayOrSingle<string> => string[] | string
 */
type ArrayOrSingle<T> = T[] | T;

export type { Nullable, Maybe, Nilable, ExistenceResult, ValueOf, Defined, KeyOf, isOK, Array, ArrayOrSingle };
