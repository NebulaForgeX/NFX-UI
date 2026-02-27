/// <reference types="vite/client" />

// CSS Modules 类型声明
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

// 图片类型声明
declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.jpeg" {
  const content: string;
  export default content;
}

declare module "*.webp" {
  const content: string;
  export default content;
}

declare module "*.gif" {
  const content: string;
  export default content;
}

// Third-party modules without @types
declare module "google-libphonenumber" {
  export interface PhoneNumber {
    getCountryCode(): number;
  }
  export class PhoneNumberUtil {
    static getInstance(): PhoneNumberUtil;
    parseAndKeepRawInput(number: string, region?: string): PhoneNumber;
    isValidNumber(number: PhoneNumber): boolean;
  }
}

declare module "async-retry" {
  export interface Options {
    retries?: number;
    factor?: number;
    minTimeout?: number;
    maxTimeout?: number;
    randomize?: boolean;
  }
  function retry<T>(
    fn: (bail: (err: Error) => void, attempt: number) => Promise<T>,
    opts?: Options
  ): Promise<T>;
  export default retry;
}
