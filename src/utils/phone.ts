import { PhoneNumberUtil } from "google-libphonenumber";

const phoneUtil = PhoneNumberUtil.getInstance();

/**
 * 从电话号码解析国家/地区码（基于 google-libphonenumber）
 * Get country code from phone number (google-libphonenumber).
 * @param phoneNumber - 电话号码字符串
 * @returns 国家码数字
 */
export const getCountryCode = (phoneNumber: string) => {
  const phoneNumberObject = phoneUtil.parseAndKeepRawInput(phoneNumber);
  return phoneNumberObject.getCountryCode();
};

/**
 * 校验电话号码是否有效（基于 google-libphonenumber）
 * Check if phone number is valid (google-libphonenumber).
 * @param phoneNumber - 电话号码字符串
 * @returns 是否有效
 */
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  if (!phoneNumber || !phoneNumber.replace(/\D/g, "").length) return false;
  try {
    const phoneNumberObject = phoneUtil.parseAndKeepRawInput(phoneNumber);
    return phoneUtil.isValidNumber(phoneNumberObject);
  } catch {
    return false;
  }
};
