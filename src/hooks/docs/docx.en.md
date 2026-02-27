# Hooks Module Documentation

Unified query Hook factories (single-item, infinite list), cursor fetch, and type definitions.

---

## Entry

Exported from `@/hooks`.

```ts
import type { FetchNumberListParams, InfiniteQueryOptions, SuspenseInfiniteQueryOptions } from "@/hooks";
import type { ListDTOWithNextCursor, ListDTOWithTotalNumber } from "@/types/api";

import { makeCursorFetchFunction, makeStringCursorFetchFunction, makeUnifiedInfiniteQuery, makeUnifiedQuery } from "@/hooks";
```

---

## 1. makeUnifiedQuery

Creates a unified single-item query Hook factory (normal or suspense mode).

**Signature:** `makeUnifiedQuery(fetchRemote, mode?, postProcess?)` → Hook `(queryKey, filter?, options?)`.  
**Input:** fetchRemote `(F) => Promise<T>`, mode `"normal"` | `"suspense"`, optional postProcess.  
**Output:** Hook returning UseQueryResult or UseSuspenseQueryResult.

**Example:** `const useProfile = makeUnifiedQuery(fetchProfile, "normal"); const { data } = useProfile(profileKey, { id }, { enabled: !!id });`

---

## 2. makeUnifiedInfiniteQuery

Creates a unified infinite-query Hook factory (normal or suspense), number-cursor paging.

**Signature:** `makeUnifiedInfiniteQuery(fetchRemote, mode?, pageSize?, postProcess?)` → Hook. fetchRemote returns `{ items, total }`.  
**Input:** fetchRemote, mode, pageSize (default 20), optional postProcess.  
**Output:** Hook with flattened data, fetchNextPage, hasNextPage.

**Example:** `const useProductList = makeUnifiedInfiniteQuery(fetchProducts, "normal", 20); useProductList(["products"], { category: "x" }, { staleTime: 60000 });`

---

## 3. makeCursorFetchFunction

Converts offset/limit list API to number-cursor fetcher.

**Signature:** `makeCursorFetchFunction(fetchFunc, pageSize?, postProcess?)` → `(pageParam: number, filter?) => Promise<ListDTOWithTotalNumber<T>>`.  
**Example:** `const fetchPage = makeCursorFetchFunction(fetchProductsAPI, 20); await fetchPage(0, { category: "x" });`

---

## 4. makeStringCursorFetchFunction

Converts string-cursor list API to `(pageParam: string, filter?) => Promise<ListDTOWithNextCursor<T>>`.

**Example:** `const fetchByToken = makeStringCursorFetchFunction(fetchAPIByToken, 20); await fetchByToken("", { q: "x" });`

---

## Type Reference

- FetchNumberListParams&lt;F&gt;, FetchStringListParams&lt;F&gt;
- ListDTOWithTotalNumber&lt;T&gt;, ListDTOWithNextCursor&lt;T&gt;, OffsetLimitNumber, OffsetLimitString (from @/types/api)
- InfiniteQueryOptions&lt;T&gt;, SuspenseInfiniteQueryOptions&lt;T&gt;
- NormalUnifiedQueryOptions&lt;T&gt;, SuspenseUnifiedQueryOptions&lt;T&gt;
