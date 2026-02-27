/*
 * API path tree: base paths + dynamic segments via path().
 * 与 NFX-Identity/console/src/apis/ip.ts 一致：path("/a", { b: "/b", c: path("/c", { d: (id) => `/${id}` }) })
 * path("/a", { b: "/b", c: path("/c", { d: "/d" }) }) => b="/a/b", c="/a/c", c.d="/a/c/d"
 */

const [BASE, CHILDREN] = [Symbol(), Symbol()];

// Recursive type: each key maps to string (leaf), function (dynamic path), or nested PathNode
type PathNode<T> = string & {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R
    ? R extends object
      ? (...args: A) => PathNode<R> // function returning path
      : (...args: A) => string // function returning string
    : T[K] extends object
      ? PathNode<T[K]>
      : string;
};

const path = <T extends Record<string, unknown>>(base: string, children: T): PathNode<T> =>
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
          ? (...args: unknown[]) => {
              const result = (v as (...args: unknown[]) => unknown)(...args);
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

// 与 Sjgz-Backend TRAEFIK_HTTP_PORT 一致（dev 默认 10021）
const HTTP_BASE_URL = import.meta.env.VITE_API_URL || "http://192.168.1.64:10021";
const WS_BASE_URL = import.meta.env.VITE_WS_URL || "ws://192.168.1.64:10021";
const IMAGE_BASE_URL =
  import.meta.env.VITE_IMAGE_URL || (import.meta.env.VITE_BUILD_ENV === "prod" ? "https://api.sjgztea.com:10012" : "http://192.168.1.64:10021");

export const URL_PATHS = {
  // 用户服务 - /user（与 auth 模块 router 一致）
  USER: path("/user", {
    register: "/register",
    signupSendCode: "/signup/send-code",
    signup: "/signup",
    loginEmail: "/login/email",
    loginPhone: "/login/phone",
    contactUs: "/contact-us",
    auth: path("/auth", {
      checkLogin: "/check-login",
      users: path("/users", {
        byId: (id: string) => `/${id}`,
        hard: (id: string) => `/${id}/hard`,
      }),
      email: path("/email", {
        sendCodeToCurrent: "/send-code-to-current",
        update: "/update",
      }),
      password: path("/password", { update: "/update" }),
      avatar: path("/avatar", { update: "/update" }),
      roles: path("/roles", {
        byId: (id: string) => `/${id}`,
        byName: (name: string) => `/name/${name}`,
        hard: (id: string) => `/${id}/hard`,
      }),
      codes: path("/codes", {
        byId: (id: string) => `/${id}`,
        byCode: (code: string) => `/code/${code}`,
        expire: (id: string) => `/${id}/expire`,
        validate: "/validate",
        hard: (id: string) => `/${id}/hard`,
      }),
    }),
  }),

  // 目录服务 - /catalog（与 catalog 模块 router 一致）
  CATALOG: path("/catalog", {
    categories: path("/categories", { byId: (id: string) => `/${id}` }),
    subcategories: path("/subcategories", { byId: (id: string) => `/${id}` }),
    products: path("/products", { byId: (id: string) => `/${id}` }),
    productTypes: path("/product-types", {
      byId: (id: string) => `/${id}`,
      byKey: (key: string) => `/key/${key}`,
    }),
    auth: path("/auth", {
      categories: path("/categories", {
        byId: (id: string) => `/${id}`,
        image: (id: string) => `/${id}/image`,
      }),
      subcategories: path("/subcategories", {
        byId: (id: string) => `/${id}`,
        image: (id: string) => `/${id}/image`,
      }),
      products: path("/products", { byId: (id: string) => `/${id}` }),
      productTypes: path("/product-types", {
        byId: (id: string) => `/${id}`,
        byKey: (key: string) => `/key/${key}`,
      }),
      stats: path("/stats", {
        categoriesCount: "/categories/count",
        subcategoriesCount: "/subcategories/count",
        productsCount: "/products/count",
        productTypesCount: "/product-types/count",
      }),
    }),
  }),

  // 图片服务 - /image（与 image 模块 router、NFX 一致）
  IMAGE: path("/image", {
    auth: path("/auth", {
      upload: "/upload",
      images: path("/images", {
        byId: (id: string) => `/${id}`,
        move: (id: string) => `/${id}/move`,
        altText: (id: string) => `/${id}/alt-text`,
        byUploader: (uploaderId: string) => `/uploader/${uploaderId}`,
      }),
    }),
    images: "/images",
    favicon: "/favicon.ico",
  }),

  // 分析服务 - /analytics（与 analytics 模块 router 一致；locales 与 NFX SYSTEM.i18nErrors 语义一致）
  ANALYTICS: path("/analytics", {
    catalog: path("/catalog", {
      current: "/current",
      typeTrend: "/type/trend",
      categoryTrend: "/category/trend",
      subcategoryTrend: "/subcategory/trend",
      productTrend: "/product/trend",
    }),
    types: path("/types", { trend: (id: string) => `/${id}/trend` }),
    categories: path("/categories", { trend: (id: string) => `/${id}/trend` }),
    subcategories: path("/subcategories", { trend: (id: string) => `/${id}/trend` }),
    views: path("/views", {
      productTrend: (id: string) => `/product/${id}/trend`,
      totalTrend: "/total/trend",
      typeTrend: (id: string) => `/type/${id}/trend`,
      categoryTrend: (id: string) => `/category/${id}/trend`,
    }),
    locales: path("/locales", {
      byLangNamespace: (lang: string, namespace: string) => `/${lang}/${namespace}`,
      errorsByLang: (lang: string) => `/${lang}/errors`,
    }),
  }),
} as const;

/** 构建从 analytics 请求 locale JSON 的 URL（lang/namespace） */
export function getAnalyticsLocaleJsonUrl(lang: string, namespace: string): string {
  return `${API_ENDPOINTS.PURE}${URL_PATHS.ANALYTICS.locales.byLangNamespace(lang, namespace)}`;
}

export const API_ENDPOINTS = {
  PURE: HTTP_BASE_URL,
  WS: WS_BASE_URL,
  IMAGE: IMAGE_BASE_URL,
} as const;

export type URL_PATHS_TYPE = typeof URL_PATHS;
export type API_ENDPOINTS_TYPE = typeof API_ENDPOINTS;
