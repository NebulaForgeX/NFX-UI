/**
 * 用户偏好：`profile.preference` JSON 约定。
 *
 * **模型**
 * - 根上必有逻辑上的 `nfx`（若缺失或非法则按 `{}` 解析后再套 NFX 默认值）。
 * - 与 `nfx` 平级的其它键：**只**由宿主在 `parsePreferenceJson(json, parseExtra)` 的第二参数里处理；
 *   `parseExtra` 收到的是「已去掉 `nfx` 后的对象」。
 * - 内存类型：`Preference<TExtra> = { nfx: NfxPreferenceSlice } & TExtra`。
 *
 * **API**
 * - `parsePreferenceJson(json, parseExtra?)` — 解析；缺省/非法 `nfx` 会规范化后再合并扩展。
 * - `preferenceToJson(preference, serializeExtra?)` — 序列化；扩展键由 `serializeExtra` 或浅拷贝写出。
 *
 * @example 仅 nfx
 * `parsePreferenceJson('{}')` → `{ nfx: 默认值 }`（不再因缺 `nfx` 而得到 `null`）
 *
 * @example 扩展
 * ```ts
 * const p = parsePreferenceJson('{"nfx":{},"my_app":{"k":1}}', (raw) => ({
 *   myApp: { k: Number((raw.my_app as { k?: unknown })?.k) || 0 },
 * }));
 * ```
 */

export { DashboardBackgroundEnum, DEFAULT_DASHBOARD_BACKGROUND, DASHBOARD_BACKGROUND_VALUES } from "./constants";

export { parsePreferenceJson, preferenceToJson } from "./core";

export { NFX_PREFERENCE_ROOT_KEY, type NfxPreferenceSlice, type Preference } from "./types";
