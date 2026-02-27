/**
 * 格式化日期为 YYYY/MM/DD（空或无效返回 ""）
 * Format date as YYYY/MM/DD; empty or invalid returns "".
 * @param dateString - 日期字符串
 * @returns 格式化后的日期字符串，无效则 ""
 */
export const formatDisplayDate = (dateString: string | undefined | null): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}/${month}/${day}`;
};

/**
 * 格式化为相对时间（如 2 days ago, 3 months ago）
 * Format as relative time (e.g. 2 days ago, 3 months ago).
 * @param dateString - 日期字符串
 * @returns 相对时间字符串，无效为 "Invalid date"，空为 "Unknown"
 */
export const formatRelativeTime = (dateString: string | undefined | null): string => {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid date";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffYears > 0) return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
  if (diffMonths > 0) return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  return "Just now";
};

/**
 * 格式化 ISO 日期为图表轴/提示用短格式（如：Jan 4, 02:30 PM）
 * Format ISO date for chart axis/tooltip (e.g. Jan 4, 02:30 PM).
 * @param iso - ISO 日期字符串
 * @returns 格式化字符串，解析失败则返回原串
 */
export function formatTickDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

/**
 * 格式化时间显示年月日时分 (YYYY/MM/DD HH:mm)
 * Format date-time as year/month/day hour:minute.
 * @param dateString - 时间字符串
 * @returns 格式化后的时间字符串，无效则返回原串
 */
export const formatDateTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    return `${year}/${month}/${day} ${hour}:${minute}`;
  } catch {
    return dateString;
  }
};

/**
 * 格式化时间显示月日时分 (MM/DD HH:mm)
 * Format date-time as month/day hour:minute.
 * @param dateString - 时间字符串
 * @returns 格式化后的时间字符串，无效则返回原串
 */
export const formatMonthDayTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    return `${month}/${day} ${hour}:${minute}`;
  } catch {
    return dateString;
  }
};

/**
 * 格式化日期仅年月日 (YYYY/MM/DD)，用于生日等
 * Format date as year/month/day only.
 * @param dateString - 日期字符串，如 "2000-01-15" 或 ISO
 * @returns 格式化后的日期字符串，无效则返回原串
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  } catch {
    return dateString;
  }
};

/**
 * 格式化时间显示时分 (HH:mm)
 * Format time as hour:minute.
 * @param dateString - 时间字符串
 * @returns 格式化后的时间字符串，无效则返回原串
 */
export const formatTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    return `${hour}:${minute}`;
  } catch {
    return dateString;
  }
};
