/**
 * 从字符串列表创建键值映射对象；可选 valueMapper 指定值
 * Create record from string list; optional valueMapper for values.
 * @param list - 字符串数组（作为键）
 * @param valueMapper - 可选，(item, index) => value，缺省时值为键本身
 * @returns Record<list[number], V>
 * @example createMap(["a","b","c"]) // { a: "a", b: "b", c: "c" }
 * @example createMap(["a","b","c"], (_, i) => i) // { a: 0, b: 1, c: 2 }
 */
export function createMap<T extends string, V = T>(list: ReadonlyArray<T>, valueMapper?: (item: T, index: number) => V): Record<T, V> {
  return list.reduce(
    (acc, item, index) => {
      acc[item] = valueMapper ? valueMapper(item, index) : (item as unknown as V);
      return acc;
    },
    {} as Record<T, V>,
  );
}
