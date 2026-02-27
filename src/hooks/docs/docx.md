# Hooks 模块文档 / Hooks Module Documentation

统一 Query Hook 工厂（单条查询、无限列表）、游标分页与类型定义。  
Unified query Hook factories (single-item, infinite list), cursor fetch, and type definitions.

---

## 入口 / Entry

从 `@/hooks` 导出。  
Exported from `@/hooks`.

```ts
import type { FetchNumberListParams, InfiniteQueryOptions, SuspenseInfiniteQueryOptions } from "@/hooks";
import type { ListDTOWithNextCursor, ListDTOWithTotalNumber } from "@/types/api";

import { makeCursorFetchFunction, makeStringCursorFetchFunction, makeUnifiedInfiniteQuery, makeUnifiedQuery } from "@/hooks";
```

---

## 1. makeUnifiedQuery

创建统一的单条查询 Hook 工厂（normal 或 suspense 模式）。  
Creates a unified single-item query Hook factory (normal or suspense mode).

**签名 / Signature**

```ts
function makeUnifiedQuery<T, F extends object = Record<string, unknown>>(
  fetchRemote: (params: F) => Promise<T>,
  mode?: "normal" | "suspense",
  postProcess?: (data: T) => void,
): (queryKey: QueryKey, filter?: F, options?) => UseQueryResult<T> | UseSuspenseQueryResult<T>;
```

**输入 / Input**

| 参数          | 类型                        | 说明                                                      |
| ------------- | --------------------------- | --------------------------------------------------------- |
| `fetchRemote` | `(params: F) => Promise<T>` | 拉取函数。Fetch function.                                 |
| `mode`        | `"normal"` \| `"suspense"`  | 默认 `"normal"`。suspense 时返回 UseSuspenseQueryResult。 |
| `postProcess` | `(data: T) => void`         | 可选，数据返回后调用。Optional.                           |

**输出 / Output**

返回一个 Hook：`(queryKey, filter?, options?) => UseQueryResult<T, AxiosError>` 或 `UseSuspenseQueryResult<T, AxiosError>`。  
Returns a Hook; options 会合并 queryKey、queryFn、retry 等。

**Example**

```ts
const useProfile = makeUnifiedQuery(fetchProfile, "normal");
const { data } = useProfile(profileKey, { id }, { enabled: !!id });

const useProfileSuspense = makeUnifiedQuery(fetchProfile, "suspense");
const { data } = useProfileSuspense(profileKey, { id });
```

---

## 2. makeUnifiedInfiniteQuery

创建统一的无限列表查询 Hook 工厂（normal 或 suspense），内部使用数字游标分页。  
Creates a unified infinite-query Hook factory (normal or suspense), using number-cursor paging.

**签名 / Signature**

```ts
function makeUnifiedInfiniteQuery<T, F extends object = Record<string, unknown>>(
  fetchRemote: (params: FetchNumberListParams<F>) => Promise<ListDTOWithTotalNumber<T>>,
  mode?: "normal" | "suspense",
  pageSize?: number,
  postProcess?: (data: T[]) => void,
): (queryKey: QueryKey, filter?: F, options?) => UseInfiniteQueryResult<T[]> | UseSuspenseInfiniteQueryResult<T[]>;
```

**输入 / Input**

| 参数          | 类型                                                                       | 说明                                                  |
| ------------- | -------------------------------------------------------------------------- | ----------------------------------------------------- |
| `fetchRemote` | `(params: FetchNumberListParams<F>) => Promise<ListDTOWithTotalNumber<T>>` | 接收 offset、limit 与 filter，返回 { items, total }。 |
| `mode`        | `"normal"` \| `"suspense"`                                                 | 默认 `"normal"`。                                     |
| `pageSize`    | `number`                                                                   | 每页条数，默认 20。                                   |
| `postProcess` | `(data: T[]) => void`                                                      | 可选。Optional.                                       |

**输出 / Output**

返回一个 Hook，调用后得到扁平化的 `data: T[]`（内部把 pages 展平）、`fetchNextPage`、`hasNextPage` 等。  
Returns a Hook; data is flattened T[].

**Example**

```ts
const useProductList = makeUnifiedInfiniteQuery(fetchProducts, "normal", 20);
const { data, fetchNextPage, hasNextPage, isLoading } = useProductList(["products"], { category: "x" }, { staleTime: 60000 });
```

---

## 3. makeCursorFetchFunction

将「offset/limit 列表 API」转为数字游标分页函数，供 makeUnifiedInfiniteQuery 使用。  
Converts offset/limit list API to number-cursor fetcher for infinite query.

**签名 / Signature**

```ts
function makeCursorFetchFunction<T, F extends object = Record<string, unknown>>(
  fetchFunc: (params: FetchNumberListParams<F>) => Promise<ListDTOWithTotalNumber<T>>,
  pageSize?: number,
  postProcess?: (data: T[]) => void,
): (pageParam: number, filter?: F) => Promise<ListDTOWithTotalNumber<T>>;
```

**输入 / Input**

| 参数          | 类型                                    | 说明                                    |
| ------------- | --------------------------------------- | --------------------------------------- |
| `fetchFunc`   | `(params) => Promise<{ items, total }>` | 标准列表 API，params 含 offset、limit。 |
| `pageSize`    | `number`                                | 默认 20。                               |
| `postProcess` | `(data: T[]) => void`                   | 可选。Optional.                         |

**输出 / Output**

返回 `(pageParam: number, filter?) => Promise<{ data: T[], nextCursor?: number }>`。offset = pageParam \* pageSize；nextCursor 由 total 计算。  
Returns async (pageParam, filter?) => ListDTOWithTotalNumber<T>.

**Example**

```ts
const fetchPage = makeCursorFetchFunction(fetchProductsAPI, 20);
const page0 = await fetchPage(0, { category: "x" });
const page1 = await fetchPage(page0.nextCursor!, { category: "x" });
```

---

## 4. makeStringCursorFetchFunction

将「字符串游标列表 API」转为 (pageParam: string, filter?) => ListDTOWithNextCursor。  
Converts string-cursor list API to (pageParam: string, filter?) => ListDTOWithNextCursor.

**签名 / Signature**

```ts
function makeStringCursorFetchFunction<T, F extends object = Record<string, unknown>>(
  fetchFunc: (params: FetchStringListParams<F>) => Promise<ListDTOWithNextCursor<T>>,
  pageSize?: number,
  postProcess?: (data: T[]) => void,
): (pageParam: string, filter?: F) => Promise<ListDTOWithNextCursor<T>>;
```

**输入 / Input**

| 参数          | 类型                                                                   | 说明                              |
| ------------- | ---------------------------------------------------------------------- | --------------------------------- |
| `fetchFunc`   | `(params: FetchStringListParams<F>) => Promise<{ items, nextCursor }>` | params 含 offset: string、limit。 |
| `pageSize`    | `number`                                                               | 默认 20。                         |
| `postProcess` | `(data: T[]) => void`                                                  | 可选。Optional.                   |

**输出 / Output**

返回 `(pageParam: string, filter?) => Promise<{ data: T[], nextCursor: string }>`。  
Returns async (pageParam, filter?) => ListDTOWithNextCursor<T>.

**Example**

```ts
const fetchByToken = makeStringCursorFetchFunction(fetchAPIByToken, 20);
const page = await fetchByToken("", { q: "x" });
if (page.nextCursor) await fetchByToken(page.nextCursor, { q: "x" });
```

---

## 类型速查 / Type Reference

| 类型                                                              | 说明                                                                          |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `FetchNumberListParams<F>`                                        | F & OffsetLimitNumber（@/types/api）。                                        |
| `FetchStringListParams<F>`                                        | F & OffsetLimitString（@/types/api）。                                        |
| `ListDTOWithTotalNumber<T>`（@/types/api）                        | `{ items: T[], total: number }`。                                             |
| `ListDTOWithNextCursor<T>`（@/types/api）                         | `{ items: T[], nextCursor: string }`。                                        |
| `InfiniteQueryOptions<T>` / `SuspenseInfiniteQueryOptions<T>`     | 无限查询 options（不含 queryKey/queryFn/getNextPageParam/initialPageParam）。 |
| `NormalUnifiedQueryOptions<T>` / `SuspenseUnifiedQueryOptions<T>` | 单条查询 options。                                                            |
