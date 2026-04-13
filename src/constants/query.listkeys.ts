/**
 * 列表 query key 工厂（可链式 .withPrefix）
 * List query key factories (chainable .withPrefix).
 */
import type { QueryKey } from "@tanstack/react-query";

import { CACHE_LIST } from "./caches";

/**
 * 链式列表 key 类型：本身即 QueryKey（数组），且带 withPrefix、getPrefix。
 * Chainable list key type: is a QueryKey (array) and has withPrefix(), getPrefix.
 */
type ListKeyChainable = QueryKey & {
  withPrefix(...prefix: unknown[]): ListKeyChainable;
  /** 列表 key 的前缀（即完整 list key，用于 invalidation 等）。Prefix (full list key) for invalidation. */
  getPrefix: QueryKey;
};

function buildListKeyChainable(prefix: unknown[], domain: string, subDomain: string): ListKeyChainable {
  const key: QueryKey = [...prefix, domain, CACHE_LIST, subDomain];
  const arr = [...key];

  // 必须不可枚举：TanStack Query v5 的 partialMatchKey 会对 filter 的 queryKey 做 Object.keys；
  // 若 withPrefix/getPrefix 可枚举，invalidateQueries({ queryKey: listKey }) 永远无法匹配 [...listKey, filter]的缓存 key。
  Object.defineProperty(arr, "withPrefix", {
    value(...more: unknown[]): ListKeyChainable {
      return buildListKeyChainable([...more, ...prefix], domain, subDomain);
    },
    enumerable: false,
    writable: true,
    configurable: true,
  });

  Object.defineProperty(arr, "getPrefix", {
    get(): QueryKey {
      return [...key];
    },
    enumerable: false,
    configurable: true,
  });

  return arr as unknown as ListKeyChainable;
}

/**
 * 创建「列表」query key（可链式 .withPrefix）：[domain, CACHE_LIST, subDomain]
 * Creates a list query key (chainable .withPrefix): [domain, CACHE_LIST, subDomain].
 *
 * @param domain - 域名。Domain name (e.g. "catalog", "auth").
 * @param subDomain - 子域。Sub-domain (e.g. "category", "product").
 * @returns 列表 query key（数组），带 withPrefix 可链式加前缀。List query key (array) with withPrefix for chaining.
 * @example
 * ```ts
 * const key = createListKey("catalog", "category");
 * * key => ["catalog", "list", "category"]
 * key.getPrefix
 * * => ["catalog", "list", "category"]
 * createListKey("catalog", "category").withPrefix("api").withPrefix("v1").getPrefix;
 * * => ["v1", "api", "catalog", "list", "category"]
 * ```
 */
function createListKey(domain: string, subDomain: string): ListKeyChainable {
  return buildListKeyChainable([], domain, subDomain);
}

export { createListKey };
export type { ListKeyChainable };
