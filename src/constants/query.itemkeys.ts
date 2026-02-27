/**
 * 单条 query key 工厂（支持一个或多个 id，可链式 .withPrefix）
 * Item query key factories (one or more ids, chainable .withPrefix).
 */
import type { QueryKey } from "@tanstack/react-query";

import { CACHE_ITEM } from "./caches";

/**
 * 链式单条 key 类型：可调用 (...ids) => QueryKey，且带 withPrefix 方法可继续链式加前缀。
 * Chainable item key type: callable (...ids) => QueryKey, with withPrefix() for chaining.
 */
type ItemKeyChainable = ((...ids: string[]) => QueryKey) & {
  withPrefix(...prefix: unknown[]): ItemKeyChainable;
};

function buildItemKeyChainable(prefix: unknown[], domain: string, subDomain: string): ItemKeyChainable {
  const fn = (...ids: string[]): QueryKey => [...prefix, domain, CACHE_ITEM, subDomain, ...ids];
  return Object.assign(fn, {
    withPrefix(...more: unknown[]): ItemKeyChainable {
      return buildItemKeyChainable([...more, ...prefix], domain, subDomain);
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
 * createItemKey("catalog", "category").withPrefix("api").withPrefix("v1")("abc");
 * * => ["v1", "api", "catalog", "item", "category", "abc"]
 * ```
 */
function createItemKey(domain: string, subDomain: string): ItemKeyChainable {
  return buildItemKeyChainable([], domain, subDomain);
}

export { createItemKey };
export type { ItemKeyChainable };
