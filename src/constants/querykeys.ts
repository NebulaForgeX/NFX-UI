/**
 * 通用 React Query key 工厂（公用包层）
 * Universal React Query key factories for shared use.
 *
 * @example
 * ```ts
 * import { createListKey, createItemKey } from "@/constants";
 *
 * const CATALOG_CATEGORY_LIST = createListKey("catalog", "category");
 * const CATALOG_CATEGORY = createItemKey("catalog", "category");
 *
 * useQuery({ queryKey: CATALOG_CATEGORY_LIST, queryFn: ... });
 * useQuery({ queryKey: CATALOG_CATEGORY(id), queryFn: ... });
 * ```
 */
import type { QueryKey } from "@tanstack/react-query";
import type { ItemKeyChainable } from "./query.itemkeys";
import type { ListKeyChainable } from "./query.listkeys";

import { createItemKey } from "./query.itemkeys";
import { createListKey } from "./query.listkeys";

/** 含 list / item 且可链式 withPrefix 的 bundle 类型 */
type QueryKeysBundle = {
  list: ListKeyChainable;
  item: ItemKeyChainable;
  withPrefix(...prefix: unknown[]): QueryKeysBundle;
};

function createQueryKeysBundle(list: ListKeyChainable, item: ItemKeyChainable): QueryKeysBundle {
  return {
    list,
    item,
    withPrefix(...prefix: unknown[]) {
      return createQueryKeysBundle(list.withPrefix(...prefix), item.withPrefix(...prefix));
    },
  };
}

/**
 * 创建自定义 query key（任意片段，用于 stats 等）
 * Creates a custom query key from arbitrary segments (e.g. for stats).
 *
 * @param segments - 任意片段（字符串或其它）。Arbitrary segments (strings or other).
 * @returns 由片段组成的 query key。Query key composed of the segments.
 * @example
 * ```ts
 * const key = createKey("catalog", "stats", "category", "count");
 * * key => ["catalog", "stats", "category", "count"]
 * ```
 */
function createKey(...segments: unknown[]): QueryKey {
  return segments;
}

/**
 * 根据同一 domain + subDomain 生成 list key 与 item key 工厂
 * Returns both list key and item key factory for the given domain and subDomain.
 *
 * @param domain - 域名。Domain name (e.g. "catalog", "auth").
 * @param subDomain - 子域。Sub-domain (e.g. "category", "product").
 * @returns 含 list、item 及 withPrefix 的 bundle，可链式加前缀。Bundle with list, item, and chainable withPrefix.
 * @example
 * ```ts
 * const { list, item } = createQueryKeys("catalog", "category");
 * * list => ["catalog", "list", "category"]
 * * item("id-1") => ["catalog", "item", "category", "id-1"]
 * const withApi = createQueryKeys("catalog", "category").withPrefix("api");
 * * withApi.list => ["api", "catalog", "list", "category"]
 * * withApi.item("id-1") => ["api", "catalog", "item", "category", "id-1"]
 * ```
 */
function createQueryKeys(domain: string, subDomain: string): QueryKeysBundle {
  return createQueryKeysBundle(createListKey(domain, subDomain), createItemKey(domain, subDomain));
}

export { createKey, createQueryKeys };
export type { QueryKeysBundle };
