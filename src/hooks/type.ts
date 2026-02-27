/**
 * Hooks 模块类型：分页 payload、列表参数、React Query options 等。
 * Types for hooks: page payloads, list params, React Query options.
 */
import type { UseInfiniteQueryOptions, UseQueryOptions, UseSuspenseInfiniteQueryOptions, UseSuspenseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ListDTOWithNextCursor, ListDTOWithTotalNumber, OffsetLimitNumber, OffsetLimitString } from "@/types/api";

//! ================ Query Mode Constants ================

/** 普通模式（useQuery），可配合 enabled 等。Normal mode (useQuery); supports enabled etc. */
const NORMAL = "normal" as const;

/** Suspense 模式（useSuspenseQuery），由 React 挂起。Suspense mode (useSuspenseQuery); suspended by React. */
const SUSPENSE = "suspense" as const;

/** 仅允许 "normal" | "suspense"，请使用 NORMAL / SUSPENSE 避免拼写错误。Only "normal" | "suspense"; use NORMAL / SUSPENSE to avoid typos. */
type QueryMode = typeof NORMAL | typeof SUSPENSE;

//! ================ Base Type ================
// 列表/分页形状与 offset/limit 参数均来自 @/types/api。

/** F & OffsetLimitNumber，数字分页列表请求参数。Params for number-offset list fetch. */
type FetchNumberListParams<F extends object = Record<string, unknown>> = F & OffsetLimitNumber;

/** F & OffsetLimitString，字符串游标列表请求参数。Params for string-cursor list fetch. */
type FetchStringListParams<F extends object = Record<string, unknown>> = F & OffsetLimitString;

/** 变更上下文（如 prev）。Mutation context (e.g. prev). */
type MutationCtx = {
  prev?: unknown;
};

//! ================ High Order Type ================

/** 无限查询 options（不含 queryKey/queryFn/getNextPageParam/initialPageParam）。Infinite query options (excludes queryKey, queryFn, getNextPageParam, initialPageParam). */
type InfiniteQueryOptions<T> = Omit<
  UseInfiniteQueryOptions<ListDTOWithTotalNumber<T>, AxiosError, T[]>,
  "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
>;

/** 字符串游标无限查询 options。String-cursor infinite query options. */
type StringInfiniteQueryOptions<T> = Omit<
  UseInfiniteQueryOptions<ListDTOWithNextCursor<T>, AxiosError, T[]>,
  "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
>;

/** Suspense 无限查询 options。Suspense infinite query options. */
type SuspenseInfiniteQueryOptions<T> = Omit<
  UseSuspenseInfiniteQueryOptions<ListDTOWithTotalNumber<T>, AxiosError, T[]>,
  "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
>;

/** InfiniteQueryOptions | SuspenseInfiniteQueryOptions。Union of normal and suspense infinite query options. */
type InfiniteQueryOptionsUnion<T> = InfiniteQueryOptions<T> | SuspenseInfiniteQueryOptions<T>;

/** 单条查询 Suspense options。Single-item suspense query options. */
type SuspenseUnifiedQueryOptions<T> = Omit<UseSuspenseQueryOptions<T, AxiosError, T>, "queryKey" | "queryFn">;

/** 普通单条查询 options（含 enabled）。Normal single-item query options (includes enabled). */
type NormalUnifiedQueryOptions<T> = Omit<UseQueryOptions<T, AxiosError, T>, "queryKey" | "queryFn">;

/** 单条查询参数（options、postProcess + 业务参数）。Single-item query params (options, postProcess, and business params). */
type UnifiedQueryParams<T> = {
  options?: SuspenseUnifiedQueryOptions<T>;
  postProcess?: (data: T) => void;
} & Record<string, unknown>;

export { NORMAL, SUSPENSE };
export type {
  FetchNumberListParams,
  FetchStringListParams,
  InfiniteQueryOptions,
  InfiniteQueryOptionsUnion,
  MutationCtx,
  NormalUnifiedQueryOptions,
  QueryMode,
  StringInfiniteQueryOptions,
  SuspenseInfiniteQueryOptions,
  SuspenseUnifiedQueryOptions,
  UnifiedQueryParams,
};
