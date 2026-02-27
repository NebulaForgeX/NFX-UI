/**
 * 显示价格 → 数据库价格（分）。用于提交到后端、保存草稿等
 * Display price to database price (cents). For submit/save.
 * @param displayPrice - 展示用价格（元）
 * @returns 数据库存储价格（分）
 */
export function toDatabasePrice(displayPrice: number): number {
  return Math.round(Number(displayPrice) * 100);
}

/**
 * 数据库价格（分）→ 显示价格字符串（两位小数）
 * Database price (cents) to display string (2 decimal places).
 * @param databasePrice - 数据库价格（分）
 * @returns 如 "12.34"
 */
export function toDisplayPrice(databasePrice: number): string {
  return (Number(databasePrice) / 100).toFixed(2);
}

/**
 * 数据库价格（分）→ 显示价格数字。用于表单、计算等
 * Database price (cents) to display number.
 * @param databasePrice - 数据库价格（分）
 * @returns 数字（元）
 */
export function toDisplayPriceNumber(databasePrice: number): number {
  return Number(toDisplayPrice(databasePrice));
}

/**
 * 数字缩写显示（如 1.2k+、3.5M+、1.1B+）
 * Format number to abbreviated string (e.g. 1.2k+, 3.5M+, 1.1B+).
 * @param num - 数字
 * @returns 缩写字符串
 */
export function formatNumberAbbreviated(num: number): string {
  if (num < 1_000) {
    return num.toString();
  }

  if (num < 1_000_000) {
    return `${(num / 1_000).toFixed(1).replace(/\.0$/, "")}k+`;
  }

  if (num < 1_000_000_000) {
    return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, "")}M+`;
  }

  return `${(num / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B+`;
}
