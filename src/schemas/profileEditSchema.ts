import type { TFunction } from "i18next";
import type { Profile } from "nfx-ui/types";

import { zodResolver } from "@hookform/resolvers/zod";
import { Language, LanguageEnum } from "nfx-ui/enums";
import { toDateInputValue } from "nfx-ui/utils/time";
import { safeStringable } from "nfx-ui/utils/safe";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

export function buildUserProfileEditDefaults(profile: Profile.Response.ProfileBase): UserProfileEditFormData {
  return {
    profileLanguage: Language(profile.profileLanguage),
    displayName: safeStringable(profile.displayName),
    firstName: safeStringable(profile.firstName),
    lastName: safeStringable(profile.lastName),
    country: safeStringable(profile.country),
    city: safeStringable(profile.city),
    gender: safeStringable(profile.gender),
    birthday: toDateInputValue(profile.birthday),
    website: safeStringable(profile.website),
    timezone: safeStringable(profile.timezone),
    bio: safeStringable(profile.bio),
  };
}

export function createUserProfileEditSchema(t: TFunction) {
  const optionalString = (max: number) => z.string().trim().max(max, t("edit.validation.maxLength", { max }));

  return z.object({
    profileLanguage: z.enum(LanguageEnum),
    displayName: optionalString(150),
    firstName: optionalString(100),
    lastName: optionalString(100),
    country: optionalString(100),
    city: optionalString(100),
    gender: optionalString(100),
    birthday: z
      .string()
      .trim()
      .refine((value) => value === "" || /^\d{4}-\d{2}-\d{2}$/.test(value), t("edit.validation.birthdayInvalid")),
    website: optionalString(100).refine((value) => !value || /^https?:\/\/.+/i.test(value), t("edit.validation.websiteInvalid")),
    timezone: optionalString(100),
    bio: optionalString(5000),
  });
}

export type UserProfileEditFormData = z.infer<ReturnType<typeof createUserProfileEditSchema>>;

export function createUserProfileBackgroundsFieldSchema(t: TFunction, maxImages: number) {
  return z
    .array(
      z.object({
        imageId: z.string().min(1),
        sortOrder: z.number().int().nonnegative(),
      }),
    )
    .max(maxImages, t("backgroundUpload.limitReached", { max: maxImages }));
}

export function useInitUserProfileEditForm(profile: Profile.Response.ProfileBase) {
  const { t } = useTranslation("pages.User.Profile.Edit");
  const schema = createUserProfileEditSchema(t);
  const defaultValues = buildUserProfileEditDefaults(profile);

  return useForm<UserProfileEditFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues,
  });
}
