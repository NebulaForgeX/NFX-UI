/**
 * 通用路由类型与 defineRouter / createRouter（与 EventEmitter 的 defineEvents 约定一致）。
 * Generic route types and defineRouter / createRouter; only values from defineRouter are accepted by createRouter.
 */

export type DefinedRouter<R extends Record<string, string>> = Defined<R, "router">;

export type RouteKey<R extends Record<string, string>> = KeyOf<R>;

export type RoutePath<R extends Record<string, string>> = R[RouteKey<R>];

export type PathParams<Path extends string> = string extends Path
  ? Record<string, string | number>
  : Path extends `${string}:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof PathParams<`/${Rest}`>]: string | number }
    : Path extends `${string}:${infer Param}`
      ? { [K in Param]: string | number }
      : Record<never, never>;

type HasPathParams<Path extends string> = keyof PathParams<Path> extends never ? false : true;

export type QueryParams = Record<string, string | number | boolean | null | undefined>;

function toQueryString(query: QueryParams): string {
  const parts: string[] = [];
  for (const key of Object.keys(query)) {
    const value = query[key];
    if (value === null || value === undefined) continue;
    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  }
  return parts.join("&");
}

export function buildPath<Path extends string>(
  route: Path,
  ...args: HasPathParams<Path> extends true ? [params: PathParams<Path>, query?: QueryParams] : [params?: undefined, query?: QueryParams]
): string {
  const params = args[0] as Maybe<Record<string, string | number>>;
  const query = args[1] as Maybe<QueryParams>;

  let path = String(route);
  if (params) {
    for (const key of Object.keys(params)) {
      path = path.replace(`:${key}`, encodeURIComponent(String(params[key])));
    }
  }

  const qs = query ? toQueryString(query) : "";
  return qs ? `${path}?${qs}` : path;
}

export function defineRouter<const R extends Record<string, string>>(routes: R): DefinedRouter<R> {
  return routes as DefinedRouter<R>;
}

export function isActiveRoute(currentPath: string, targetPath: string): boolean {
  return currentPath === targetPath;
}

export function matchRoute(pathname: string, route: string): boolean {
  if (pathname === route) return true;
  const routeParts = route.split("/").filter(Boolean);
  const pathParts = pathname.split("/").filter(Boolean);
  if (routeParts.length !== pathParts.length) return false;
  return routeParts.every((p, i) => p.startsWith(":") || p === pathParts[i]);
}

export function createRouter<R extends Record<string, string>>(routes: DefinedRouter<R>) {
  const ROUTES = routes as Readonly<R>;

  const matchRouteBound = (pathname: string, route: string): boolean => matchRoute(pathname, route);

  const isActiveRouteBound = (currentPath: string, targetPath: string): boolean => isActiveRoute(currentPath, targetPath);

  return {
    ROUTES,
    matchRoute: matchRouteBound,
    isActiveRoute: isActiveRouteBound,
    buildPath,
  };
}
