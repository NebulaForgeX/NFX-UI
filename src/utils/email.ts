/**
 * 校验邮箱格式是否有效（简单正则：含 @ 与点）
 * Check if email format is valid (simple regex: contains @ and dot).
 * @param email - 待校验的邮箱字符串
 * @returns 是否有效
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
