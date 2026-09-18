import type { TFunction } from "i18next";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

/** 登录表单；校验文案来自 host `pages.Account.Login` → `form.validation.*` */
export function createLoginSchema(t: TFunction) {
  return z.object({
    email: z.string().min(1, t("form.validation.emailRequired")).email(t("form.validation.emailInvalid")),
    password: z.string().min(1, t("form.validation.passwordRequired")),
    rememberMe: z.boolean().optional(),
  });
}

export type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;

export const useInitLoginForm = () => {
  const { t } = useTranslation("pages.Account.Login");
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
