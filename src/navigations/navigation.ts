import type { Defined, KeyOf } from "@/types";

/**
 * 通用路由类型与 defineRouter / createRouter（与 EventEmitter 的 defineEvents 约定一致）
 * Generic route types and defineRouter / createRouter; only values from defineRouter are accepted by createRouter.
 *
 * @example
 * ```ts
 * import { defineRouter, createRouter } from "@/types/navigation";
 * const routeMap = defineRouter({ HOME: "/", LOGIN: "/login", USER: "/user/:id" });
 * const router = createRouter(routeMap);
 * router.ROUTES.HOME; // "/"
 * router.matchRoute(pathname, router.ROUTES.USER);
 * ```
 */

/** 由 defineRouter 返回的「已规范路由表」类型；createRouter 只接受此类型。 */
export type DefinedRouter<R extends Record<string, string>> = Defined<R, "router">;

/** 由路由表 R 推导的 key 类型 */
export type RouteKey<R extends Record<string, string>> = KeyOf<R>;

/** 由路由表 R 推导的 path 联合类型 */
export type RoutePath<R extends Record<string, string>> = R[RouteKey<R>];

/**
 * 规范创建路由表：仅允许 defineRouter 返回的值传入 createRouter（类型约束）。
 * Define route map: only the return value of defineRouter may be passed to createRouter.
 *
 * @param routes - 路由 key-value 对象（值可为含 :param 的 path）
 * @returns DefinedRouter<R>，仅此类型可传入 createRouter
 */
export function defineRouter<R extends Record<string, string>>(routes: R): DefinedRouter<R> {
  return routes as DefinedRouter<R>;
}

/**
 * 精确匹配：当前路径是否等于目标 path
 * Exact match: current path equals target path.
 */
export function isActiveRoute(currentPath: string, targetPath: string): boolean {
  return currentPath === targetPath;
}

/**
 * 模式匹配：pathname 是否匹配带 :param 的 route 模式
 * Pattern match: pathname matches route pattern (supports :param segments).
 */
export function matchRoute(pathname: string, route: string): boolean {
  if (pathname === route) return true;
  const routeParts = route.split("/").filter(Boolean);
  const pathParts = pathname.split("/").filter(Boolean);
  if (routeParts.length !== pathParts.length) return false;
  return routeParts.every((p, i) => p.startsWith(":") || p === pathParts[i]);
}

/**
 * 创建路由对象：仅接受 defineRouter(...) 的返回值，得到只读 ROUTES + matchRoute / isActiveRoute / getRouteByKey
 * Create router: accepts only the return value of defineRouter(...); returns ROUTES and typed helpers.
 *
 * @param routes - 须为 defineRouter(...) 的返回值（DefinedRouter）
 */
export function createRouter<R extends Record<string, string>>(routes: DefinedRouter<R>) {
  const ROUTES = routes as Readonly<R>;

  const matchRouteBound = (pathname: string, route: R[keyof R]): boolean => matchRoute(pathname, route);

  const isActiveRouteBound = (currentPath: string, targetPath: R[keyof R]): boolean => isActiveRoute(currentPath, targetPath);

  const getRouteByKey = (key: keyof R): R[keyof R] => ROUTES[key];

  return {
    ROUTES,
    matchRoute: matchRouteBound,
    isActiveRoute: isActiveRouteBound,
    getRouteByKey,
  };
}
