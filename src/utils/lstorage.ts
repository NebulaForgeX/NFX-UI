/**
 * localStorage 安全封装，避免隐私模式等场景抛错。
 * Safe localStorage wrapper; avoids throwing in private mode etc.
 */

import type { Maybe, Nilable } from "@/types/utils";

function safe<T>(fn: () => T): Maybe<T> {
  try {
    return fn();
  } catch {
    return undefined;
  }
}

export function removeItem(key: string): void {
  safe(() => {
    localStorage.removeItem(key);
  });
}

export function getItem(key: string): Nilable<string> {
  return safe(() => localStorage.getItem(key));
}

export function setItem(key: string, value: string): void {
  safe(() => {
    localStorage.setItem(key, value);
  });
}
