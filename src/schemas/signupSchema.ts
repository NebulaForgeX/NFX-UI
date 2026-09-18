import type { TFunction } from "i18next";

import { zodResolver } from "@hookform/resolvers/zod";
import { normalizeVerificationCode, VERIFICATION_CODE_ALPHABET } from "@/utils/domain/verificationCode";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

const VERIFICATION_CODE_PATTERN = new RegExp(`^[${VERIFICATION_CODE_ALPHABET}]{6}$`);

/** 注册表单；校验文案来自 host `pages.Account.Signup` → `validation.*` */
export function createSignupSchema(t: TFunction) {
  return z
    .object({
      email: z.string().min(1, t("validation.emailRequired")).email(t("validation.emailInvalid")),
      verificationCode: z
        .string()
        .min(1, t("validation.codeRequired"))
        .transform((value) => normalizeVerificationCode(value))
        .pipe(z.string().regex(VERIFICATION_CODE_PATTERN, t("validation.codeInvalid"))),
      password: z.string().min(1, t("validation.passwordRequired")).min(8, t("validation.passwordMin")),
      confirmPassword: z.string().min(1, t("validation.confirmRequired")),
      rememberMe: z.boolean().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.passwordMismatch"),
      path: ["confirmPassword"],
    });
}

export type SignupFormData = z.infer<ReturnType<typeof createSignupSchema>>;

export const useInitSignupForm = () => {
  const { t } = useTranslation("pages.Account.Signup");
  const schema = createSignupSchema(t);

  return useForm<SignupFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
      verificationCode: "",
      password: "",
      confirmPassword: "",
      rememberMe: false,
    },
  });
};
