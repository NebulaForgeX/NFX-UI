/**
 * 列表 query key 工厂（可链式 .withPrefix）
 * List query key factories (chainable .withPrefix).
 */
import type { QueryKey } from "@tanstack/react-query";

import { CACHE_LIST } from "./caches";

/**
 * 链式列表 key 类型：本身即 QueryKey（数组），且带 withPrefix 方法可继续链式加前缀。
 * Chainable list key type: is a QueryKey (array) and has withPrefix() for chaining.
 */
type ListKeyChainable = QueryKey & {
  withPrefix(...prefix: unknown[]): ListKeyChainable;
};

function buildListKeyChainable(prefix: unknown[], domain: string, subDomain: string): ListKeyChainable {
  const key: QueryKey = [...prefix, domain, CACHE_LIST, subDomain];
  return Object.assign([...key], {
    withPrefix(...more: unknown[]): ListKeyChainable {
      return buildListKeyChainable([...more, ...prefix], domain, subDomain);
    },
  }) as ListKeyChainable;
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
 * createListKey("catalog", "category").withPrefix("api").withPrefix("v1");
 * * => ["v1", "api", "catalog", "list", "category"]
 * ```
 */
function createListKey(domain: string, subDomain: string): ListKeyChainable {
  return buildListKeyChainable([], domain, subDomain);
}

export { createListKey };
export type { ListKeyChainable };
