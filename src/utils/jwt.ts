/** 仅解析 JWT payload（不做签名校验；过期时间调度用，鉴权仍由后端负责） */
export function decodeJwtPayload(token: string): Nullable<Record<string, unknown>> {
  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    return JSON.parse(atob(padded)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function readJwtClaimSeconds(payload: Record<string, unknown>, key: string): Nullable<number> {
  const value = payload[key];
  return typeof value === "number" ? value * 1000 : null;
}

export function getJwtExpiresAtMs(token: string): Nullable<number> {
  const payload = decodeJwtPayload(token);
  return payload ? readJwtClaimSeconds(payload, "exp") : null;
}

export function getJwtIssuedAtMs(token: string): Nullable<number> {
  const payload = decodeJwtPayload(token);
  return payload ? readJwtClaimSeconds(payload, "iat") : null;
}
