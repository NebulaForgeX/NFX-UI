import type { InfiniteData, QueryKey, UseInfiniteQueryResult, UseSuspenseInfiniteQueryResult } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ListDTOWithTotalNumber } from "@/types/api";
import type { FetchNumberListParams, InfiniteQueryOptions, InfiniteQueryOptionsUnion, QueryMode, SuspenseInfiniteQueryOptions } from "./type";

import { useMemo } from "react";
import { useInfiniteQuery, useSuspenseInfiniteQuery } from "@tanstack/react-query";

import { makeCursorFetchFunction } from "./makeCursorFetchFunction";
import { NORMAL, SUSPENSE } from "./type";

//! ================ Function overloads ================

/**
 * 创建统一的无限查询 Hook（Suspense 模式）
 *
 * 这是一个高阶函数工厂，用于创建支持无限滚动的数据查询 Hook。
 * 它自动处理分页、缓存、错误重试等常见场景，并支持 Suspense 模式。
 *
 * @template T - 数据项类型
 * @template F - 过滤器对象类型，必须是对象类型，默认为 Record<string, unknown>
 *
 * @param {Function} fetchRemote - 远程数据获取函数，接收分页参数和过滤器，返回 Promise
 * @param {string} mode - 查询模式，设置为 "suspense" 启用 React Suspense 支持
 * @param {number} [pageSize=20] - 每页数据条数，默认 20
 * @param {Function} [postProcess] - 可选的数据后处理函数，在数据返回后调用
 *
 * @returns {Function} 返回一个 Hook 函数，接收 queryKey、filter 和 options 参数
 *
 * @example
 * ```tsx
 * * 定义 API 获取函数
 * const fetchProducts = async (params: FetchListParams<ProductFilter>) => {
 *   const { items, total } = await api.getProducts(params);
 *   return { items, total };
 * };
 *
 * * 创建 Hook（Suspense 模式）
 * const useProductList = makeUnifiedInfiniteQuery(
 *   fetchProducts,
 *   "suspense",
 *   20,
 *   (data) => console.warn('数据已加载:', data.length)
 * );
 *
 * * 在组件中使用
 * function ProductList() {
 *   const { data, fetchNextPage, hasNextPage } = useProductList(
 *     ["products"],
 *     { category: "electronics" },
 *     { staleTime: 60000 }
 *   );
 *
 *   return (
 *     <div>
 *       {data.map(product => <ProductCard key={product.id} {...product} />)}
 *       {hasNextPage && <button onClick={() => fetchNextPage()}>加载更多</button>}
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * **为什么需要这个函数？**
 * - React Query 的无限查询 API 较为底层，需要手动配置 queryFn、initialPageParam、getNextPageParam 等
 * - 大多数列表查询都有相似的分页逻辑（offset/limit），重复编写这些配置容易出错
 * - 通过工厂函数统一封装，确保分页逻辑的一致性，减少样板代码
 *
 * **为什么区分 Suspense 和普通模式？**
 * - Suspense 模式：数据未就绪时会挂起组件渲染，适合配合 React Suspense 边界使用
 * - 普通模式：提供 isLoading 状态，需要手动处理加载状态，更灵活
 * - 两种模式的 Hook 返回类型不同，TypeScript 需要通过函数重载区分
 *
 * **内部实现原理：**
 * 1. **游标转换**：使用 makeCursorFetchFunction 将 offset/limit 转换为页码游标
 * 2. **查询键构造**：自动将 filter 合并到 queryKey 中，确保不同过滤条件有独立缓存
 * 3. **数据扁平化**：通过 select 将分页数据 pages 扁平化为单一数组，简化组件使用
 * 4. **智能重试**：仅对 5xx 服务器错误和网络错误重试，避免对 4xx 客户端错误无意义重试
 * 5. **选项合并**：使用 spread 运算符允许外部覆盖默认配置（如 staleTime、retry）
 */
function makeUnifiedInfiniteQuery<T, F extends object = Record<string, unknown>>(
  fetchRemote: (params: FetchNumberListParams<F>) => Promise<ListDTOWithTotalNumber<T>>,
  mode: "suspense",
  pageSize?: number,
  postProcess?: (data: T[]) => void,
): (queryKey: QueryKey, filter?: F, options?: SuspenseInfiniteQueryOptions<T>) => UseSuspenseInfiniteQueryResult<T[], AxiosError>;

/**
 * 创建统一的无限查询 Hook（普通模式）
 *
 * 这是一个高阶函数工厂，用于创建支持无限滚动的数据查询 Hook。
 * 它自动处理分页、缓存、错误重试等常见场景，普通模式不使用 Suspense。
 *
 * @template T - 数据项类型
 * @template F - 过滤器对象类型，必须是对象类型，默认为 Record<string, unknown>
 *
 * @param {Function} fetchRemote - 远程数据获取函数，接收分页参数和过滤器，返回 Promise
 * @param {string} [mode="normal"] - 查询模式，设置为 "normal" 或省略使用普通模式
 * @param {number} [pageSize=20] - 每页数据条数，默认 20
 * @param {Function} [postProcess] - 可选的数据后处理函数，在数据返回后调用
 *
 * @returns {Function} 返回一个 Hook 函数，接收 queryKey、filter 和 options 参数
 *
 * @example
 * ```tsx
 * * 定义 API 获取函数
 * const fetchProducts = async (params: FetchListParams<ProductFilter>) => {
 *   const { items, total } = await api.getProducts(params);
 *   return { items, total };
 * };
 *
 * * 创建 Hook（普通模式）
 * const useProductList = makeUnifiedInfiniteQuery(
 *   fetchProducts,
 *   "normal",  * 或省略此参数
 *   20
 * );
 *
 * * 在组件中使用
 * function ProductList() {
 *   const { data, fetchNextPage, hasNextPage, isLoading } = useProductList(
 *     ["products"],
 *     { category: "electronics" },
 *     { staleTime: 60000 }
 *   );
 *
 *   if (isLoading) return <Loading />;
 *
 *   return (
 *     <div>
 *       {data?.map(product => <ProductCard key={product.id} {...product} />)}
 *       {hasNextPage && <button onClick={() => fetchNextPage()}>加载更多</button>}
 *     </div>
 *   );
 * }
 * ```
 */
function makeUnifiedInfiniteQuery<T, F extends object = Record<string, unknown>>(
  fetchRemote: (params: FetchNumberListParams<F>) => Promise<ListDTOWithTotalNumber<T>>,
  mode?: "normal",
  pageSize?: number,
  postProcess?: (data: T[]) => void,
): (queryKey: QueryKey, filter?: F, options?: InfiniteQueryOptions<T>) => UseInfiniteQueryResult<T[], AxiosError>;

//! ================ Function implementation ================
function makeUnifiedInfiniteQuery<T, F extends object = Record<string, unknown>>(
  fetchRemote: (params: FetchNumberListParams<F>) => Promise<ListDTOWithTotalNumber<T>>,
  mode: QueryMode = NORMAL,
  pageSize: number = 20,
  postProcess?: (data: T[]) => void,
) {
  const fetchFunction = makeCursorFetchFunction(fetchRemote, pageSize, postProcess);
  if (mode === SUSPENSE) {
    return (queryKey: QueryKey, filter?: F, options?: SuspenseInfiniteQueryOptions<T>) =>
      useCreateSuspenseInfiniteQuery(queryKey, fetchFunction, filter, options, pageSize);
  }
  return (queryKey: QueryKey, filter?: F, options?: InfiniteQueryOptions<T>) =>
    useCreateNormalInfiniteQuery(queryKey, fetchFunction, filter, options, pageSize);
}

export { makeUnifiedInfiniteQuery };

//! ================ Private Function ================

function buildCommonOptions<T, F extends object = Record<string, unknown>>(
  queryKey: QueryKey,
  fetchFunction: (pageParam: number, filter?: F) => Promise<ListDTOWithTotalNumber<T>>,
  filter?: F,
  options?: InfiniteQueryOptionsUnion<T>,
  pageSize?: number,
) {
  return {
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: filter !== undefined ? [...queryKey, filter] : queryKey,
    queryFn: ({ pageParam }: { pageParam: number }) => fetchFunction(pageParam, filter || ({} as F)),
    initialPageParam: 0,
    getNextPageParam: (lastPage: ListDTOWithTotalNumber<T>, allPages: ListDTOWithTotalNumber<T>[]) =>
      pageSize != null && allPages.length * pageSize < lastPage.total ? allPages.length : undefined,
    select: (d: InfiniteData<ListDTOWithTotalNumber<T>>) => d.pages.flatMap((p) => p.items),
    retry: (failureCount: number, error: AxiosError) => {
      const transient = (error?.status && error.status >= 500) || error?.code === "NETWORK_ERROR";
      const retryMax = typeof options?.retry === "number" ? options.retry : 3;
      return transient && failureCount < retryMax;
    },
    ...(options as Partial<ReturnType<typeof useInfiniteQuery>>),
  };
}

function useCreateNormalInfiniteQuery<T, F extends object = Record<string, unknown>>(
  queryKey: QueryKey,
  fetchFunction: (pageParam: number, filter?: F) => Promise<ListDTOWithTotalNumber<T>>,
  filter?: F,
  options?: InfiniteQueryOptions<T>,
  pageSize?: number,
) {
  const common = useMemo(() => buildCommonOptions(queryKey, fetchFunction, filter, options, pageSize), [queryKey, fetchFunction, filter, options, pageSize]);
  return useInfiniteQuery(common);
}

function useCreateSuspenseInfiniteQuery<T, F extends object = Record<string, unknown>>(
  queryKey: QueryKey,
  fetchFunction: (pageParam: number, filter?: F) => Promise<ListDTOWithTotalNumber<T>>,
  filter?: F,
  options?: SuspenseInfiniteQueryOptions<T>,
  pageSize?: number,
) {
  const common = useMemo(() => buildCommonOptions(queryKey, fetchFunction, filter, options, pageSize), [queryKey, fetchFunction, filter, options, pageSize]);
  return useSuspenseInfiniteQuery(common);
}
