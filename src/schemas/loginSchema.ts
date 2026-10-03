import type { TFunction } from "i18next";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

/** 登录表单；校验文案由 host 页面传入的 `t` 提供（`form.validation.*`）。 */
export function createLoginSchema(t: TFunction) {
  return z.object({
    email: z.string().min(1, t("form.validation.emailRequired")).email(t("form.validation.emailInvalid")),
    password: z.string().min(1, t("form.validation.passwordRequired")),
    rememberMe: z.boolean().optional(),
  });
}

export type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;

export const useInitLoginForm = (t: TFunction) => {
  const schema = createLoginSchema(t);

  return useForm<LoginFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });
};

export function createLoginWithPhoneSchema(t: TFunction) {
  return z.object({
    phone: z.string().min(1, t("form.validation.phoneRequired")).min(6, t("form.validation.phoneInvalid")),
    password: z.string().min(1, t("form.validation.passwordRequired")),
    rememberMe: z.boolean().optional(),
  });
}

export type LoginWithPhoneFormData = z.infer<ReturnType<typeof createLoginWithPhoneSchema>>;

export const useInitLoginWithPhoneForm = (t: TFunction) => {
  const schema = createLoginWithPhoneSchema(t);

  return useForm<LoginWithPhoneFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      phone: "",
      password: "",
      rememberMe: false,
    },
  });
};
