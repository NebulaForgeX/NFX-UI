import type { Array } from "../types/utils";

/*
 * API path tree: base paths + dynamic segments via path().
 * 与 NFX-Identity/console/src/apis/ip.ts 一致：path("/a", { b: "/b", c: path("/c", { d: (id) => `/${id}` }) })
 * path("/a", { b: "/b", c: path("/c", { d: "/d" }) }) => b="/a/b", c="/a/c", c.d="/a/c/d"
 */

const [BASE, CHILDREN] = [Symbol(), Symbol()];

// Recursive type: each key maps to string (leaf), function (dynamic path), or nested PathNode
export type PathNode<T> = string & {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R
    ? R extends object
      ? (...args: A) => PathNode<R> // function returning path
      : (...args: A) => string // function returning string
    : T[K] extends object
      ? PathNode<T[K]>
      : string;
};

export const path = <T extends Record<string, unknown>>(base: string, children: T): PathNode<T> =>
  Object.assign(
    Object.defineProperties(new String(base), {
      [BASE]: { value: base },
      [CHILDREN]: { value: children },
      toString: { value: () => base },
      valueOf: { value: () => base },
      [Symbol.toPrimitive]: { value: () => base },
    }),
    Object.fromEntries(
      Object.entries(children).map(([k, v]) => [
        k,
        typeof v === "function"
          ? (...args: Array<unknown>) => {
              const result = (v as (...args: Array<unknown>) => unknown)(...args);
              return BASE in Object(result)
                ? path(`${base}${(result as Record<symbol, string>)[BASE]}`, (result as Record<symbol, Record<string, unknown>>)[CHILDREN] ?? {})
                : `${base}${result}`;
            }
          : BASE in Object(v)
            ? path(`${base}${(v as Record<symbol, string>)[BASE]}`, (v as Record<symbol, Record<string, unknown>>)[CHILDREN] ?? {})
            : `${base}${v}`,
      ]),
    ),
  ) as PathNode<T>;
