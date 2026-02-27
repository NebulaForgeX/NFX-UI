# Constants 模块文档 / Constants Module Documentation

公用常量与 React Query key 工厂的用法说明。  
Usage guide for shared constants and React Query key factories.

---

## 入口 / Entry

所有公开 API 从 `@/constants` 或 `@/constants/index` 统一导出。  
All public APIs are re-exported from `@/constants` or `@/constants/index`.

```ts
import { CACHE_ITEM, CACHE_LIST, createItemKey, createKey, createListKey, createQueryKeys, defineEnum, enumPickMap } from "@/constants";
```

---

## 1. Caches（缓存片段）

用于组成 query key 的固定片段，标识「列表」与「单条」。  
Fixed segments used in query keys to denote "list" vs "item".

| 名称 Name    | 类型 Type | 值 Value | 说明 Description                 |
| ------------ | --------- | -------- | -------------------------------- |
| `CACHE_LIST` | `string`  | `"list"` | 列表 key 片段。List key segment. |
| `CACHE_ITEM` | `string`  | `"item"` | 单条 key 片段。Item key segment. |

**Example**

```ts
import { CACHE_ITEM, CACHE_LIST } from "@/constants";

// 一般由 createListKey / createItemKey 内部使用，也可用于自定义 key
const customKey = ["catalog", CACHE_LIST, "category"];
// => ["catalog", "list", "category"]
```

---

## 2. createKey

创建由任意片段组成的 query key（用于 stats、自定义维度等）。  
Creates a query key from arbitrary segments (e.g. stats, custom dimensions).

**签名 / Signature**

```ts
function createKey(...segments: unknown[]): QueryKey;
```

**输入 / Input**

| 参数          | 类型        | 说明                                            |
| ------------- | ----------- | ----------------------------------------------- |
| `...segments` | `unknown[]` | 任意片段（字符串、数字等）。Arbitrary segments. |

**输出 / Output**

- `QueryKey`：由 `segments` 按顺序组成的数组。

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

创建「列表」query key，并支持链式 `.withPrefix()` 加前缀。  
Creates a list query key with chainable `.withPrefix()`.

**签名 / Signature**

```ts
function createListKey(domain: string, subDomain: string): ListKeyChainable;
```

**输入 / Input**

| 参数        | 类型     | 说明                                |
| ----------- | -------- | ----------------------------------- |
| `domain`    | `string` | 域名，如 `"catalog"`、`"auth"`.     |
| `subDomain` | `string` | 子域，如 `"category"`、`"product"`. |

**输出 / Output**

- `ListKeyChainable`：本身是 `QueryKey`（数组），且带有 `.withPrefix(...prefix)` 方法，返回新的 `ListKeyChainable`。
- 默认 key 形状：`[domain, CACHE_LIST, subDomain]`，即 `[domain, "list", subDomain]`。

**Example**

```ts
import { createListKey } from "@/constants";

const listKey = createListKey("catalog", "category");
// listKey => ["catalog", "list", "category"]

useQuery({ queryKey: listKey, queryFn: fetchCategories });

// 链式加前缀（最后调用的 withPrefix 会出现在 key 最前面）
const versioned = createListKey("catalog", "category").withPrefix("api").withPrefix("v1");
// versioned => ["v1", "api", "catalog", "list", "category"]
```

---

## 4. createItemKey

创建「单条」query key 工厂，支持一个或多个 id，并支持链式 `.withPrefix()`。  
Creates an item query key factory (one or more ids) with chainable `.withPrefix()`.

**签名 / Signature**

```ts
function createItemKey(domain: string, subDomain: string): ItemKeyChainable;
```

**输入 / Input**

| 参数        | 类型     | 说明   |
| ----------- | -------- | ------ |
| `domain`    | `string` | 域名。 |
| `subDomain` | `string` | 子域。 |

**输出 / Output**

- `ItemKeyChainable`：可调用 `(...ids: string[]) => QueryKey`，且带有 `.withPrefix(...prefix)`，返回新的 `ItemKeyChainable`。
- 调用后的 key 形状：`[domain, CACHE_ITEM, subDomain, ...ids]`，即 `[domain, "item", subDomain, ...ids]`。

**Example**

```ts
import { createItemKey } from "@/constants";

const itemKey = createItemKey("catalog", "category");
itemKey("abc");
// => ["catalog", "item", "category", "abc"]

itemKey("cat-1", "sub-2");
// => ["catalog", "item", "category", "cat-1", "sub-2"]

useQuery({ queryKey: itemKey(id), queryFn: () => fetchCategory(id) });

// 带前缀
const versionedItem = createItemKey("catalog", "category").withPrefix("api")("abc");
// => ["api", "catalog", "item", "category", "abc"]
```

---

## 5. createQueryKeys

根据同一 `domain` + `subDomain` 一次性生成 list key 与 item key 工厂，并支持对整包做 `.withPrefix()`。  
Returns a bundle of list key and item key factory for the same domain/subDomain, with chainable `.withPrefix()` on the bundle.

**签名 / Signature**

```ts
function createQueryKeys(domain: string, subDomain: string): QueryKeysBundle;
```

**输入 / Input**

| 参数        | 类型     | 说明   |
| ----------- | -------- | ------ |
| `domain`    | `string` | 域名。 |
| `subDomain` | `string` | 子域。 |

**输出 / Output**

- `QueryKeysBundle`：
  - `list`: `ListKeyChainable`（同 `createListKey`）
  - `item`: `ItemKeyChainable`（同 `createItemKey`）
  - `withPrefix(...prefix)`: 返回新的 `QueryKeysBundle`，其 `list` 与 `item` 均带相同前缀。

**Example**

```ts
import { createQueryKeys } from "@/constants";

const { list, item } = createQueryKeys("catalog", "category");
// list => ["catalog", "list", "category"]
// item("id-1") => ["catalog", "item", "category", "id-1"]

useQuery({ queryKey: list, queryFn: fetchCategories });
useQuery({ queryKey: item(id), queryFn: () => fetchCategory(id) });

// 整包加前缀
const withApi = createQueryKeys("catalog", "category").withPrefix("api");
// withApi.list => ["api", "catalog", "list", "category"]
// withApi.item("id-1") => ["api", "catalog", "item", "category", "id-1"]
```

---

## 6. defineEnum（枚举定义）

根据元数据对象定义类型安全的枚举，提供 `Values`、`pickMap`、`get`。  
Defines a type-safe enum from a metadata map with `Values`, `pickMap`, and `get`.

**签名 / Signature**

```ts
function defineEnum<const M extends EnumMetaMap>(metaMap: M): DefinedEnum<M>;
```

**输入 / Input**

| 参数      | 类型                                           | 说明                               |
| --------- | ---------------------------------------------- | ---------------------------------- |
| `metaMap` | `Record<string, Record<PropertyKey, unknown>>` | 键为枚举名、值为元数据对象的 map。 |

**输出 / Output**

- `DefinedEnum<M>`：
  - `Values`: 枚举键数组，如 `["A", "B"]`。
  - `pickMap(prop)`: 从每个枚举项中取出同一属性，得到 `{ [K]: metaMap[K][prop] }`。
  - `get(key)`: 取指定键的元数据 `metaMap[key]`。

**Example**

```ts
import { defineEnum } from "@/constants";

const Status = defineEnum({
  Draft: { label: "草稿", value: 0 },
  Published: { label: "已发布", value: 1 },
});

Status.Values;
// => ["Draft", "Published"]

Status.get("Draft");
// => { label: "草稿", value: 0 }

Status.pickMap("label");
// => { Draft: "草稿", Published: "已发布" }

Status.pickMap("value");
// => { Draft: 0, Published: 1 }
```

---

## 7. enumPickMap

从已定义的枚举上按属性抽取 map（等价于 `e.pickMap(prop)`）。  
Picks a map of one property from each enum entry (same as `e.pickMap(prop)`).

**签名 / Signature**

```ts
function enumPickMap<M extends EnumMetaMap, P extends keyof M[keyof M]>(e: DefinedEnum<M>, prop: P): { [K in keyof M]: M[K][P] };
```

**输入 / Input**

| 参数   | 类型             | 说明                    |
| ------ | ---------------- | ----------------------- |
| `e`    | `DefinedEnum<M>` | `defineEnum` 的返回值。 |
| `prop` | `P`              | 要抽取的元数据属性名。  |

**输出 / Output**

- `{ [K in keyof M]: M[K][P] }`：从每个枚举键 `K` 取出 `metaMap[K][prop]` 组成的对象。

**Example**

```ts
import { defineEnum, enumPickMap } from "@/constants";

const Status = defineEnum({
  Draft: { label: "草稿", value: 0 },
  Published: { label: "已发布", value: 1 },
});

enumPickMap(Status, "label");
// => { Draft: "草稿", Published: "已发布" }
```

---

## 类型速查 / Type Reference

| 类型                                              | 说明                                                                                       |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `QueryKey`                                        | `@tanstack/react-query` 的 query key 类型（通常为数组）。                                  |
| `ListKeyChainable`                                | 列表 key：`QueryKey` + `.withPrefix(...) => ListKeyChainable`。                            |
| `ItemKeyChainable`                                | 单条 key 工厂：`(...ids: string[]) => QueryKey` + `.withPrefix(...) => ItemKeyChainable`。 |
| `QueryKeysBundle`                                 | `{ list, item, withPrefix(...) }`，list/item 同上。                                        |
| `EnumMetaMap` / `DefinedEnum<M>` / `EnumValue<E>` | 见 `enums.ts` 与上文 `defineEnum` 示例。                                                   |

---

## 前缀顺序说明 / Prefix Order

对 `createListKey`、`createItemKey`、`createQueryKeys().withPrefix` 等链式调用：

- **最后调用的 `.withPrefix(...)` 会出现在 key 数组的最前面。**
- 例如：`.withPrefix("api").withPrefix("v1")` → key 以 `["v1", "api", ...]` 开头。
