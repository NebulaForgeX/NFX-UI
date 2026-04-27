import type { Nilable, Nullable } from "@/types";

import { isPlainRecord, nfxSliceToBackend, parseNfxFields, type NfxBackendShape } from "./nfx_slice";
import { NFX_PREFERENCE_ROOT_KEY, type NfxPreferenceSlice, type Preference } from "./types";

/**
 * 解析后端 preference 字符串：`nfx` 由本包规范化（缺省或非对象则按 `{}` → 默认值）；
 * `parseExtra(rest)` 的 `rest` 为根对象去掉 `nfx` 后的键值（宿主扩展，线 snake / 内存 camel 在函数内自行处理）。
 */
export function parsePreferenceJson<TExtra extends Record<string, unknown> = Record<string, unknown>>(
  json: Nilable<string>,
  parseExtra?: (raw: Record<string, unknown>) => TExtra,
): Nullable<Preference<TExtra>> {
  if (!json || typeof json !== "string") return null;
  try {
    const data = JSON.parse(json) as unknown;
    if (!isPlainRecord(data)) return null;
    const nfxSource = data[NFX_PREFERENCE_ROOT_KEY];
    const nfxRaw = isPlainRecord(nfxSource) ? nfxSource : {};
    const nfx = parseNfxFields(nfxRaw as NfxBackendShape);
    const rest = { ...data };
    delete rest[NFX_PREFERENCE_ROOT_KEY];
    const extra = parseExtra ? parseExtra(rest) : ({} as TExtra);
    return { nfx, ...extra };
  } catch {
    return null;
  }
}

/**
 * 序列化：`serializeExtra` 把内存中的扩展部分写成根上要合并的顶层键；省略则对扩展做浅拷贝（键名原样写入 JSON）。
 */
export function preferenceToJson<TExtra extends Record<string, unknown> = Record<string, unknown>>(
  preference: Preference<TExtra>,
  serializeExtra?: (extra: TExtra) => Record<string, unknown>,
): string {
  const { nfx, ...extra } = preference as { nfx: NfxPreferenceSlice } & Record<string, unknown>;
  const extraBag = serializeExtra ? serializeExtra(extra as unknown as TExtra) : extra;
  return JSON.stringify({
    [NFX_PREFERENCE_ROOT_KEY]: nfxSliceToBackend(nfx),
    ...extraBag,
  });
}
