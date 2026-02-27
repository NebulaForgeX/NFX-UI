/**
 * 从对象中剔除指定键，返回新对象（不修改原对象）
 * Omit specified keys from object and return a new object.
 * @param obj - 源对象
 * @param keys - 要剔除的键（数组或单个键，可再接多个键）
 * @returns 剔除后的新对象
 * @example omit({ a: 1, b: 2, c: 3 }, ['a', 'c']) // { b: 2 }
 * @example omit({ a: 1, b: 2, c: 3 }, 'a', 'b')  // { c: 3 }
 */
export function omit<Obj extends object, Key extends keyof Obj>(obj: Obj, keys: Key[] | Key, ...restKeys: Key[]): Omit<Obj, Key> {
  const result = {} as Omit<Obj, Key>;

  const removeKeys = Array.isArray(keys) ? keys : [keys, ...restKeys];
  const removeSet = new Set(removeKeys);

  for (const key of Object.keys(obj) as Key[]) {
    if (!removeSet.has(key)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (result as any)[key] = obj[key];
    }
  }

  return result;
}
