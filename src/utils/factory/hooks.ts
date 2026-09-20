/**
 * Hooks 模块：分页 fetch 与统一 React Query hooks（稳定身份，可在业务 hook body 内直接调用）。
 */
import type {
  InfiniteData,
  QueryKey,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  UseQueryOptions,
  UseQueryResult,
  UseSuspenseInfiniteQueryOptions,
  UseSuspenseInfiniteQueryResult,
  UseSuspenseQueryOptions,
  UseSuspenseQueryResult,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ListDTOWithNextCursor, ListDTOWithTotalNumber, OffsetLimitNumber, OffsetLimitString } from "nfx-ui/types/api";

import { useMemo } from "react";
import { useInfiniteQuery, useQuery, useSuspenseInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query";

type InfiniteListFilter = Partial<OffsetLimitNumber>;

type FetchNumberListParams<F extends InfiniteListFilter = InfiniteListFilter> = F & OffsetLimitNumber;

type FetchStringListParams<F extends object = Record<string, unknown>> = F & OffsetLimitString;

type MutationCtx = {
  prev?: unknown;
};

type InfiniteQueryOptions<T> = Omit<UseInfiniteQueryOptions<ListDTOWithTotalNumber<T>, AxiosError, T[]>, "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"> & {
  postProcess?: (data: T[]) => void;
};

type StringInfiniteQueryOptions<T> = Omit<UseInfiniteQueryOptions<ListDTOWithNextCursor<T>, AxiosError, T[]>, "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"> & {
  postProcess?: (data: T[]) => void;
};

type SuspenseInfiniteQueryOptions<T> = Omit<
  UseSuspenseInfiniteQueryOptions<ListDTOWithTotalNumber<T>, AxiosError, T[]>,
  "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
> & {
  postProcess?: (data: T[]) => void;
};

type InfiniteQueryOptionsUnion<T> = InfiniteQueryOptions<T> | SuspenseInfiniteQueryOptions<T>;

type SuspenseUnifiedQueryOptions<T> = Omit<UseSuspenseQueryOptions<T, AxiosError, T>, "queryKey" | "queryFn"> & {
  postProcess?: (data: T) => void;
};

type NormalUnifiedQueryOptions<T> = Omit<UseQueryOptions<T, AxiosError, T>, "queryKey" | "queryFn"> & {
  postProcess?: (data: T) => void;
};

type UnifiedQueryParams<T> = {
  options?: SuspenseUnifiedQueryOptions<T>;
  postProcess?: (data: T) => void;
} & Record<string, unknown>;

type QueryOptions<T> = NormalUnifiedQueryOptions<T>;
type SuspenseQueryOptions<T> = SuspenseUnifiedQueryOptions<T>;

const DEFAULT_PAGE_SIZE = 20;

export type {
  FetchNumberListParams,
  FetchStringListParams,
  InfiniteListFilter,
  InfiniteQueryOptions,
  InfiniteQueryOptionsUnion,
  MutationCtx,
  NormalUnifiedQueryOptions,
  StringInfiniteQueryOptions,
  SuspenseInfiniteQueryOptions,
  SuspenseUnifiedQueryOptions,
  UnifiedQueryParams,
};

function resolvePageSize(filter?: InfiniteListFilter): number {
  return filter?.limit ?? DEFAULT_PAGE_SIZE;
}

function resolveBaseOffset(filter?: InfiniteListFilter): number {
  return filter?.offset ?? 0;
}

function makeCursorFetchFunction<T, F extends InfiniteListFilter = InfiniteListFilter>(
  fetchFunc: (params: F) => Promise<ListDTOWithTotalNumber<T>>,
  postProcess?: (data: T[]) => void,
) {
  return async (pageParam: number = 0, filter?: F): Promise<ListDTOWithTotalNumber<T>> => {
    const pageSize = resolvePageSize(filter);
    const baseOffset = resolveBaseOffset(filter);
    const payload = {
      ...filter,
      offset: baseOffset + pageParam * pageSize,
      limit: pageSize,
    } as F;
    const { items, total } = await fetchFunc(payload);
    if (items?.length) postProcess?.(items);
    return { items, total };
  };
}

function makeStringCursorFetchFunction<T, F extends Partial<Pick<OffsetLimitString, "limit">> & object = Partial<Pick<OffsetLimitString, "limit">>>(
  fetchFunc: (params: FetchStringListParams<F>) => Promise<ListDTOWithNextCursor<T>>,
  postProcess?: (data: T[]) => void,
) {
  return async (pageParam: string = "", filter?: F): Promise<ListDTOWithNextCursor<T>> => {
    const pageSize = filter?.limit ?? DEFAULT_PAGE_SIZE;
    const payload = {
      ...filter,
      offset: pageParam,
      limit: pageSize,
    } as FetchStringListParams<F>;
    const { items, nextCursor } = await fetchFunc(payload);
    if (items?.length) postProcess?.(items);
    return { items, nextCursor };
  };
}

export { makeCursorFetchFunction, makeStringCursorFetchFunction };

function buildInfiniteCommonOptions<T, F extends InfiniteListFilter = InfiniteListFilter>(
  queryKey: QueryKey,
  fetchFunction: (pageParam: number, filter?: F) => Promise<ListDTOWithTotalNumber<T>>,
  filter: F,
  options: Omit<InfiniteQueryOptionsUnion<T>, "postProcess"> | undefined,
) {
  const pageSize = resolvePageSize(filter);
  const baseOffset = resolveBaseOffset(filter);
  return {
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [...queryKey, filter],
    queryFn: ({ pageParam }: { pageParam: number }) => fetchFunction(pageParam, filter),
    initialPageParam: 0,
    getNextPageParam: (lastPage: ListDTOWithTotalNumber<T>, allPages: ListDTOWithTotalNumber<T>[]) =>
      baseOffset + allPages.length * pageSize < lastPage.total ? allPages.length : undefined,
    select: (d: InfiniteData<ListDTOWithTotalNumber<T>>) => d.pages.flatMap((p) => p.items),
    retry: (failureCount: number, error: AxiosError) => {
      const transient = (error?.status && error.status >= 500) || error?.code === "NETWORK_ERROR";
      const retryMax = typeof options?.retry === "number" ? options.retry : 3;
      return transient && failureCount < retryMax;
    },
    ...(options as Partial<ReturnType<typeof useInfiniteQuery>>),
  };
}

function buildQueryCommonOptions<T, F extends object = Record<string, unknown>>(
  fetchRemote: (params: F) => Promise<T>,
  queryKey: QueryKey,
  filter: F | undefined,
  options: QueryOptions<T> | SuspenseQueryOptions<T> | undefined,
) {
  const { postProcess, ...queryOptions } = options ?? {};
  return {
    queryKey: filter !== undefined ? [...queryKey, filter] : queryKey,
    queryFn: async () => {
      const data = await fetchRemote(filter || ({} as F));
      postProcess?.(data);
      return data;
    },
    select: (data: T) => data,
    retry: (failureCount: number, error: AxiosError) => {
      const status = error?.status ?? error?.response?.status;
      const transient = (typeof status === "number" && status >= 500) || error?.code === "NETWORK_ERROR";
      const retryMax = typeof queryOptions?.retry === "number" ? queryOptions.retry : 3;
      return transient && failureCount < retryMax;
    },
    ...(queryOptions as object),
  };
}

function useUnifiedQuery<T, F extends object = Record<string, unknown>>(
  fetchRemote: (params: F) => Promise<T>,
  queryKey: QueryKey,
  filter?: F,
  options?: QueryOptions<T>,
): UseQueryResult<T, AxiosError> {
  return useQuery(buildQueryCommonOptions(fetchRemote, queryKey, filter, options));
}

function useUnifiedSuspenseQuery<T, F extends object = Record<string, unknown>>(
  fetchRemote: (params: F) => Promise<T>,
  queryKey: QueryKey,
  filter?: F,
  options?: SuspenseQueryOptions<T>,
): UseSuspenseQueryResult<T, AxiosError> {
  return useSuspenseQuery(buildQueryCommonOptions(fetchRemote, queryKey, filter, options));
}

function useUnifiedInfiniteQuery<T, F extends InfiniteListFilter = InfiniteListFilter>(
  fetchRemote: (params: F) => Promise<ListDTOWithTotalNumber<T>>,
  queryKey: QueryKey,
  filter?: F,
  options?: InfiniteQueryOptions<T>,
): UseInfiniteQueryResult<T[], AxiosError> {
  const resolvedFilter = (filter ?? {}) as F;
  const { postProcess, ...queryOptions } = options ?? {};
  const fetchFunction = useMemo(() => makeCursorFetchFunction(fetchRemote, postProcess), [fetchRemote, postProcess]);
  return useInfiniteQuery(buildInfiniteCommonOptions(queryKey, fetchFunction, resolvedFilter, queryOptions));
}

function useUnifiedSuspenseInfiniteQuery<T, F extends InfiniteListFilter = InfiniteListFilter>(
  fetchRemote: (params: F) => Promise<ListDTOWithTotalNumber<T>>,
  queryKey: QueryKey,
  filter?: F,
  options?: SuspenseInfiniteQueryOptions<T>,
): UseSuspenseInfiniteQueryResult<T[], AxiosError> {
  const resolvedFilter = (filter ?? {}) as F;
  const { postProcess, ...queryOptions } = options ?? {};
  const fetchFunction = useMemo(() => makeCursorFetchFunction(fetchRemote, postProcess), [fetchRemote, postProcess]);
  return useSuspenseInfiniteQuery(buildInfiniteCommonOptions(queryKey, fetchFunction, resolvedFilter, queryOptions));
}

export { useUnifiedInfiniteQuery, useUnifiedQuery, useUnifiedSuspenseInfiniteQuery, useUnifiedSuspenseQuery };
