import type { QueryKey, UseQueryOptions, UseQueryResult, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { QueryMode } from "./type";

import { useMemo } from "react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { NORMAL } from "./type";

type QueryOptions<T> = Omit<UseQueryOptions<T, AxiosError, T>, "queryKey" | "queryFn">;
type SuspenseQueryOptions<T> = Omit<UseSuspenseQueryOptions<T, AxiosError, T>, "queryKey" | "queryFn">;

/**
 * 创建统一的单条查询 Hook 工厂（支持 normal / suspense 模式）。
 * Creates a unified single-item query Hook factory (normal or suspense mode).
 *
 * @param fetchRemote - 拉取函数，接收 filter 返回 Promise<T>。Fetch function (params: F) => Promise<T>.
 * @param mode - "suspense" 或 "normal"（默认）。Query mode.
 * @param postProcess - 可选，数据返回后调用。Optional post-process (data: T) => void.
 * @returns 返回一个 Hook：(queryKey, filter?, options?) => UseQueryResult 或 UseSuspenseQueryResult。Returns a Hook.
 * @example
 * ```ts
 * const useProfile = makeUnifiedQuery(fetchProfile, "normal");
 * const { data } = useProfile(profileKey, { id }, { enabled: !!id });
 * ```
 */
// ------------------ Overload Signatures ------------------
function makeUnifiedQuery<T, F extends object = Record<string, unknown>>(
  fetchRemote: (params: F) => Promise<T>,
  mode: "suspense",
  postProcess?: (data: T) => void,
): (queryKey: QueryKey, filter?: F, options?: Omit<UseSuspenseQueryOptions<T, AxiosError, T>, "queryKey" | "queryFn">) => UseSuspenseQueryResult<T, AxiosError>;

function makeUnifiedQuery<T, F extends object = Record<string, unknown>>(
  fetchRemote: (params: F) => Promise<T>,
  mode?: "normal",
  postProcess?: (data: T) => void,
): (queryKey: QueryKey, filter?: F, options?: Omit<UseQueryOptions<T, AxiosError, T>, "queryKey" | "queryFn">) => UseQueryResult<T, AxiosError>;

// ------------------ Implementation ------------------
function makeUnifiedQuery<T, F extends object = Record<string, unknown>>(
  fetchRemote: (params: F) => Promise<T>,
  mode: QueryMode = NORMAL,
  postProcess?: (data: T) => void,
) {
  const fetchFunction = async (filter: F): Promise<T> => {
    const data = await fetchRemote(filter);
    postProcess?.(data);
    return data;
  };

  const buildCommonOptions = (queryKey: QueryKey, filter?: F, options?: QueryOptions<T> | SuspenseQueryOptions<T>) => {
    return {
      queryKey: filter !== undefined ? [...queryKey, filter] : queryKey,
      queryFn: () => fetchFunction(filter || ({} as F)),
      select: (data: T) => data,
      retry: (failureCount: number, error: AxiosError) => {
        const status = error?.status ?? error?.response?.status;
        const transient = (typeof status === "number" && status >= 500) || error?.code === "NETWORK_ERROR";
        const retryMax = typeof options?.retry === "number" ? options.retry : 3;
        return transient && failureCount < retryMax;
      },
      ...(options as object),
    };
  };

  // Normal Query
  function useQueryNormal(queryKey: QueryKey, filter?: F, options?: QueryOptions<T>): UseQueryResult<T, AxiosError> {
    const common = useMemo(() => buildCommonOptions(queryKey, filter, options), [queryKey, filter, options]);
    return useQuery(common);
  }

  // Suspense Query
  function useQuerySuspense(queryKey: QueryKey, filter?: F, options?: SuspenseQueryOptions<T>): UseSuspenseQueryResult<T, AxiosError> {
    const common = useMemo(() => buildCommonOptions(queryKey, filter, options), [queryKey, filter, options]);
    return useSuspenseQuery(common);
  }

  if (mode === "suspense") {
    return (queryKey: QueryKey, filter?: F, options?: SuspenseQueryOptions<T>) => useQuerySuspense(queryKey, filter, options);
  }
  return (queryKey: QueryKey, filter?: F, options?: QueryOptions<T>) => useQueryNormal(queryKey, filter, options);
}

export { makeUnifiedQuery };
