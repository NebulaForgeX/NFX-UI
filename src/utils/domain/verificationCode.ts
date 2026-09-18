const DEFAULT_SLOT_COUNT = 6;

export const VERIFICATION_CODE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

const VERIFICATION_CODE_CHAR_SET = new Set(VERIFICATION_CODE_ALPHABET);

export function normalizeVerificationCode(raw: string, slotCount = DEFAULT_SLOT_COUNT): string {
  const upper = raw.toUpperCase();
  let out = "";
  for (const ch of upper) {
    if (VERIFICATION_CODE_CHAR_SET.has(ch)) {
      out += ch;
      if (out.length >= slotCount) break;
    }
  }
  return out;
}

export function isVerificationCodeComplete(code: string, slotCount = DEFAULT_SLOT_COUNT): boolean {
  const normalized = normalizeVerificationCode(code, slotCount);
  return normalized.length === slotCount;
}
