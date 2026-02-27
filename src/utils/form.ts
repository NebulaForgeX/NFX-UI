/**
 * 将任意值转为文本输入框可用的字符串（用于表单回显）
 * Convert any value to a string suitable for text input (e.g. form display).
 * @param value - 任意值
 * @returns 字符串；null/undefined → ""；数组 → 逗号拼接；对象 → JSON 字符串
 */
export function toTextInputValue(value: unknown): string {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return "";
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map((item) => String(item)).join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

/**
 * 将任意值转为数字输入框可用的字符串（用于表单回显）
 * Convert any value to a string suitable for number input (e.g. form display).
 * @param value - 任意值
 * @returns 字符串；null/undefined → ""；非有限数字 → ""；数组取首项
 */
export function toNumberInputValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "";
  if (typeof value === "string") return value;
  if (typeof value === "boolean") return value ? "1" : "0";
  if (Array.isArray(value) && value.length > 0) return String(value[0]);
  return "";
}
