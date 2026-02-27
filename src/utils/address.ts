/**
 * 规范化地址字符串：去除首尾空白并将连续空白合并为单个空格
 * Normalize address string: trim and collapse consecutive spaces to one.
 * @param address - 原始地址字符串
 * @returns 规范化后的地址
 */
export function normalizeAddress(address: string): string {
  return address.trim().replace(/\s+/g, " ");
}
