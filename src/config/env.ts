import { safeOr, safeStringable } from "@/utils/safe";

function resolveApiUrl(): string {
  const raw = safeStringable(import.meta.env.VITE_API_URL).trim();
  if (raw === "") {
    if (import.meta.env.DEV) {
      throw new Error("[env] 请在 .env（secure 时 .secure.env）中设置 VITE_API_URL（主 API 根地址）。");
    }
    return "";
  }
  return raw.replace(/\/$/, "");
}

export const appEnv = {
  buildEnv: import.meta.env.VITE_BUILD_ENV,
  appId: import.meta.env.VITE_APP_ID,
  name: safeOr(import.meta.env.VITE_NAME, "NFX"),
  apiUrl: resolveApiUrl(),
  devApiProxyTarget: import.meta.env.VITE_DEV_API_PROXY_TARGET,
} as const;

export const APP_NAME = appEnv.name;
