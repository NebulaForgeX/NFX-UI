/**
 * 单条 query key 工厂（支持一个或多个 id，可链式 .withPrefix）
 * Item query key factories (one or more ids, chainable .withPrefix).
 */
import type { QueryKey } from "@tanstack/react-query";

import { CACHE_ITEM } from "./caches";

/**
 * 链式单条 key 类型：可调用 (...ids) => QueryKey，且带 withPrefix、getPrefix。
 * Chainable item key type: callable (...ids) => QueryKey, with withPrefix() and getPrefix.
 */
type ItemKeyChainable = ((...ids: string[]) => QueryKey) & {
  withPrefix(...prefix: unknown[]): ItemKeyChainable;
  /** 不含 id 的前缀，用于 invalidation 等。Prefix without ids, e.g. for invalidation. */
  getPrefix: QueryKey;
};

function buildItemKeyChainable(prefix: unknown[], domain: string, subDomain: string): ItemKeyChainable {
  const base: QueryKey = [...prefix, domain, CACHE_ITEM, subDomain];
  const fn = (...ids: string[]): QueryKey => [...base, ...ids];
  return Object.assign(fn, {
    withPrefix(...more: unknown[]): ItemKeyChainable {
      return buildItemKeyChainable([...more, ...prefix], domain, subDomain);
    },
    get getPrefix(): QueryKey {
      return [...base];
    },
  }) as ItemKeyChainable;
}

/**
 * 创建「单条」query key 工厂（可链式 .withPrefix）：支持传入一个或多个 id，返回 [domain, CACHE_ITEM, subDomain, ...ids]
 * Creates an item query key factory (chainable .withPrefix): accepts one or more ids, returns [domain, CACHE_ITEM, subDomain, ...ids].
 *
 * @param domain - 域名。Domain name (e.g. "catalog", "auth").
 * @param subDomain - 子域。Sub-domain (e.g. "category", "product").
 * @returns 可调用的 key 工厂，带 withPrefix 可链式加前缀。Callable key factory with withPrefix for chaining.
 * @example
 * ```ts
 * const getKey = createItemKey("catalog", "category");
 * getKey("abc");
 * * => ["catalog", "item", "category", "abc"]
 * getKey.getPrefix
 * * => ["catalog", "item", "category"]
 * createItemKey("catalog", "category").withPrefix("api").withPrefix("v1").getPrefix;
 * * => ["v1", "api", "catalog", "item", "category"]
 * ```
 */
function createItemKey(domain: string, subDomain: string): ItemKeyChainable {
  return buildItemKeyChainable([], domain, subDomain);
}

export { createItemKey };
export type { ItemKeyChainable };
