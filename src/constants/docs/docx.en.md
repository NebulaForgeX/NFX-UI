# Constants Module Documentation

Usage guide for shared constants and React Query key factories.

---

## Entry

All public APIs are re-exported from `@/constants` or `@/constants/index`.

```ts
import { CACHE_ITEM, CACHE_LIST, createItemKey, createKey, createListKey, createQueryKeys, defineEnum, enumPickMap } from "@/constants";
```

---

## 1. Caches

Fixed segments used in query keys to denote "list" vs "item".

| Name         | Type     | Value    | Description       |
| ------------ | -------- | -------- | ----------------- |
| `CACHE_LIST` | `string` | `"list"` | List key segment. |
| `CACHE_ITEM` | `string` | `"item"` | Item key segment. |

**Example**

```ts
import { CACHE_ITEM, CACHE_LIST } from "@/constants";

// Usually used internally by createListKey / createItemKey; also for custom keys
const customKey = ["catalog", CACHE_LIST, "category"];
// => ["catalog", "list", "category"]
```

---

## 2. createKey

Creates a query key from arbitrary segments (e.g. stats, custom dimensions).

**Signature**

```ts
function createKey(...segments: unknown[]): QueryKey;
```

**Input**

| Parameter     | Type        | Description                                  |
| ------------- | ----------- | -------------------------------------------- |
| `...segments` | `unknown[]` | Arbitrary segments (strings, numbers, etc.). |

**Output**

- `QueryKey`: Array of `segments` in order.

**Example**

```ts
import { createKey } from "@/constants";

const key = createKey("catalog", "stats", "category", "count");
// => ["catalog", "stats", "category", "count"]

useQuery({
  queryKey: createKey("auth", "me"),
  queryFn: fetchCurrentUser,
});
```

---

## 3. createListKey

Creates a list query key with chainable `.withPrefix()`.

**Signature**

```ts
function createListKey(domain: string, subDomain: string): ListKeyChainable;
```

**Input**

| Parameter   | Type     | Description                                  |
| ----------- | -------- | -------------------------------------------- |
| `domain`    | `string` | Domain name (e.g. `"catalog"`, `"auth"`).    |
| `subDomain` | `string` | Sub-domain (e.g. `"category"`, `"product"`). |

**Output**

- `ListKeyChainable`: A `QueryKey` (array) with `.withPrefix(...prefix)` returning a new `ListKeyChainable`.
- Default key shape: `[domain, CACHE_LIST, subDomain]` i.e. `[domain, "list", subDomain]`.

**Example**

```ts
import { createListKey } from "@/constants";

const listKey = createListKey("catalog", "category");
// listKey => ["catalog", "list", "category"]

useQuery({ queryKey: listKey, queryFn: fetchCategories });

// Chain prefixes (last withPrefix appears leftmost in the key)
const versioned = createListKey("catalog", "category").withPrefix("api").withPrefix("v1");
// versioned => ["v1", "api", "catalog", "list", "category"]
```

---

## 4. createItemKey

Creates an item query key factory (one or more ids) with chainable `.withPrefix()`.

**Signature**

```ts
function createItemKey(domain: string, subDomain: string): ItemKeyChainable;
```

**Input**

| Parameter   | Type     | Description  |
| ----------- | -------- | ------------ |
| `domain`    | `string` | Domain name. |
| `subDomain` | `string` | Sub-domain.  |

**Output**

- `ItemKeyChainable`: Callable `(...ids: string[]) => QueryKey` with `.withPrefix(...prefix)` returning a new `ItemKeyChainable`.
- Key shape when called: `[domain, CACHE_ITEM, subDomain, ...ids]` i.e. `[domain, "item", subDomain, ...ids]`.

**Example**

```ts
import { createItemKey } from "@/constants";

const itemKey = createItemKey("catalog", "category");
itemKey("abc");
// => ["catalog", "item", "category", "abc"]

itemKey("cat-1", "sub-2");
// => ["catalog", "item", "category", "cat-1", "sub-2"]

useQuery({ queryKey: itemKey(id), queryFn: () => fetchCategory(id) });

// With prefix
const versionedItem = createItemKey("catalog", "category").withPrefix("api")("abc");
// => ["api", "catalog", "item", "category", "abc"]
```

---

## 5. createQueryKeys

Returns a bundle of list key and item key factory for the same domain/subDomain, with chainable `.withPrefix()` on the bundle.

**Signature**

```ts
function createQueryKeys(domain: string, subDomain: string): QueryKeysBundle;
```

**Input**

| Parameter   | Type     | Description  |
| ----------- | -------- | ------------ |
| `domain`    | `string` | Domain name. |
| `subDomain` | `string` | Sub-domain.  |

**Output**

- `QueryKeysBundle`:
  - `list`: `ListKeyChainable` (same as `createListKey`)
  - `item`: `ItemKeyChainable` (same as `createItemKey`)
  - `withPrefix(...prefix)`: Returns a new `QueryKeysBundle` whose `list` and `item` both have the same prefix.

**Example**

```ts
import { createQueryKeys } from "@/constants";

const { list, item } = createQueryKeys("catalog", "category");
// list => ["catalog", "list", "category"]
// item("id-1") => ["catalog", "item", "category", "id-1"]

useQuery({ queryKey: list, queryFn: fetchCategories });
useQuery({ queryKey: item(id), queryFn: () => fetchCategory(id) });

// Bundle with prefix
const withApi = createQueryKeys("catalog", "category").withPrefix("api");
// withApi.list => ["api", "catalog", "list", "category"]
// withApi.item("id-1") => ["api", "catalog", "item", "category", "id-1"]
```

---

## 6. defineEnum

Defines a type-safe enum from a metadata map with `Values`, `pickMap`, and `get`.

**Signature**

```ts
function defineEnum<const M extends EnumMetaMap>(metaMap: M): DefinedEnum<M>;
```

**Input**

| Parameter | Type                                           | Description                           |
| --------- | ---------------------------------------------- | ------------------------------------- |
| `metaMap` | `Record<string, Record<PropertyKey, unknown>>` | Map of enum keys to metadata objects. |

**Output**

- `DefinedEnum<M>`:
  - `Values`: Array of enum keys, e.g. `["A", "B"]`.
  - `pickMap(prop)`: Picks one property from each entry: `{ [K]: metaMap[K][prop] }`.
  - `get(key)`: Returns metadata for key: `metaMap[key]`.

**Example**

```ts
import { defineEnum } from "@/constants";

const Status = defineEnum({
  Draft: { label: "Draft", value: 0 },
  Published: { label: "Published", value: 1 },
});

Status.Values;
// => ["Draft", "Published"]

Status.get("Draft");
// => { label: "Draft", value: 0 }

Status.pickMap("label");
// => { Draft: "Draft", Published: "Published" }

Status.pickMap("value");
// => { Draft: 0, Published: 1 }
```

---

## 7. enumPickMap

Picks a map of one property from each enum entry (same as `e.pickMap(prop)`).

**Signature**

```ts
function enumPickMap<M extends EnumMetaMap, P extends keyof M[keyof M]>(e: DefinedEnum<M>, prop: P): { [K in keyof M]: M[K][P] };
```

**Input**

| Parameter | Type             | Description                     |
| --------- | ---------------- | ------------------------------- |
| `e`       | `DefinedEnum<M>` | Return value of `defineEnum`.   |
| `prop`    | `P`              | Metadata property name to pick. |

**Output**

- `{ [K in keyof M]: M[K][P] }`: Object mapping each enum key `K` to `metaMap[K][prop]`.

**Example**

```ts
import { defineEnum, enumPickMap } from "@/constants";

const Status = defineEnum({
  Draft: { label: "Draft", value: 0 },
  Published: { label: "Published", value: 1 },
});

enumPickMap(Status, "label");
// => { Draft: "Draft", Published: "Published" }
```

---

## Type Reference

| Type                                              | Description                                                                                  |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `QueryKey`                                        | React Query key type (typically an array).                                                   |
| `ListKeyChainable`                                | List key: `QueryKey` + `.withPrefix(...) => ListKeyChainable`.                               |
| `ItemKeyChainable`                                | Item key factory: `(...ids: string[]) => QueryKey` + `.withPrefix(...) => ItemKeyChainable`. |
| `QueryKeysBundle`                                 | `{ list, item, withPrefix(...) }`; list/item as above.                                       |
| `EnumMetaMap` / `DefinedEnum<M>` / `EnumValue<E>` | See `enums.ts` and the `defineEnum` section above.                                           |

---

## Prefix Order

For chained `.withPrefix()` on `createListKey`, `createItemKey`, or `createQueryKeys().withPrefix`:

- **The last `.withPrefix(...)` call appears leftmost in the key array.**
- Example: `.withPrefix("api").withPrefix("v1")` then key starts with `["v1", "api", ...]`.
