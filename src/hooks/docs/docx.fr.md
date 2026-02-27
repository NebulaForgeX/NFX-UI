# Documentation du module Hooks

Usines de Hooks de requête unifiés (requête single-item, liste infinie), fetch par curseur et types.

---

## Point d’entrée

Exporté depuis `@/hooks`.

```ts
import type { FetchNumberListParams, InfiniteQueryOptions, SuspenseInfiniteQueryOptions } from "@/hooks";
import type { ListDTOWithNextCursor, ListDTOWithTotalNumber } from "@/types/api";

import { makeCursorFetchFunction, makeStringCursorFetchFunction, makeUnifiedInfiniteQuery, makeUnifiedQuery } from "@/hooks";
```

---

## 1. makeUnifiedQuery

Crée une usine de Hook de requête single-item (mode normal ou suspense).

**Signature**

```ts
function makeUnifiedQuery<T, F extends object = Record<string, unknown>>(
  fetchRemote: (params: F) => Promise<T>,
  mode?: "normal" | "suspense",
  postProcess?: (data: T) => void,
): (queryKey: QueryKey, filter?: F, options?) => UseQueryResult<T> | UseSuspenseQueryResult<T>;
```

**Entrée :** `fetchRemote`, `mode` (défaut `"normal"`), `postProcess` optionnel.  
**Sortie :** Un Hook qui retourne `UseQueryResult` ou `UseSuspenseQueryResult`.

**Exemple**

```ts
const useProfile = makeUnifiedQuery(fetchProfile, "normal");
const { data } = useProfile(profileKey, { id }, { enabled: !!id });
```

---

## 2. makeUnifiedInfiniteQuery

Crée une usine de Hook de requête infinie (normal ou suspense), pagination par curseur numérique.

**Signature**

```ts
function makeUnifiedInfiniteQuery<T, F extends object = Record<string, unknown>>(
  fetchRemote: (params: FetchNumberListParams<F>) => Promise<ListDTOWithTotalNumber<T>>,
  mode?: "normal" | "suspense",
  pageSize?: number,
  postProcess?: (data: T[]) => void,
): (queryKey: QueryKey, filter?: F, options?) => UseInfiniteQueryResult<T[]> | UseSuspenseInfiniteQueryResult<T[]>;
```

**Entrée :** `fetchRemote` (retourne `{ items, total }`), `mode`, `pageSize` (défaut 20), `postProcess` optionnel.  
**Sortie :** Un Hook avec `data: T[]` aplati, `fetchNextPage`, `hasNextPage`, etc.

**Exemple**

```ts
const useProductList = makeUnifiedInfiniteQuery(fetchProducts, "normal", 20);
const { data, fetchNextPage, hasNextPage, isLoading } = useProductList(["products"], { category: "x" }, { staleTime: 60000 });
```

---

## 3. makeCursorFetchFunction

Convertit une API liste offset/limit en fetch par curseur numérique pour infinite query.

**Signature**

```ts
function makeCursorFetchFunction<T, F extends object = Record<string, unknown>>(
  fetchFunc: (params: FetchNumberListParams<F>) => Promise<ListDTOWithTotalNumber<T>>,
  pageSize?: number,
  postProcess?: (data: T[]) => void,
): (pageParam: number, filter?: F) => Promise<ListDTOWithTotalNumber<T>>;
```

**Entrée :** `fetchFunc` (params avec offset, limit), `pageSize` (défaut 20), `postProcess` optionnel.  
**Sortie :** Async `(pageParam, filter?) => { data, nextCursor? }`.

**Exemple**

```ts
const fetchPage = makeCursorFetchFunction(fetchProductsAPI, 20);
const page0 = await fetchPage(0, { category: "x" });
```

---

## 4. makeStringCursorFetchFunction

Convertit une API liste à curseur string en `(pageParam: string, filter?) => ListDTOWithNextCursor`.

**Signature**

```ts
function makeStringCursorFetchFunction<T, F extends object = Record<string, unknown>>(
  fetchFunc: (params: FetchStringListParams<F>) => Promise<ListDTOWithNextCursor<T>>,
  pageSize?: number,
  postProcess?: (data: T[]) => void,
): (pageParam: string, filter?: F) => Promise<ListDTOWithNextCursor<T>>;
```

**Entrée :** `fetchFunc` (params avec offset: string, limit), `pageSize`, `postProcess` optionnel.  
**Sortie :** Async `(pageParam, filter?) => { data, nextCursor }`.

**Exemple**

```ts
const fetchByToken = makeStringCursorFetchFunction(fetchAPIByToken, 20);
const page = await fetchByToken("", { q: "x" });
```

---

## Référence des types

| Type                                                              | Description                           |
| ----------------------------------------------------------------- | ------------------------------------- |
| `FetchNumberListParams<F>`                                        | F & OffsetLimitNumber (@/types/api).  |
| `FetchStringListParams<F>`                                        | F & OffsetLimitString (@/types/api).  |
| `ListDTOWithTotalNumber<T>` (@/types/api)                         | `{ items: T[], total: number }`.      |
| `ListDTOWithNextCursor<T>` (@/types/api)                          | `{ items: T[], nextCursor: string }`. |
| `InfiniteQueryOptions<T>` / `SuspenseInfiniteQueryOptions<T>`     | Options de requête infinie.           |
| `NormalUnifiedQueryOptions<T>` / `SuspenseUnifiedQueryOptions<T>` | Options de requête single-item.       |
