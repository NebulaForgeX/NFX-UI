import type { UserProfileEditFormData } from "@/schemas";
import type { Profile } from "@/types";

import { Language } from "@/enums";
import { safeNullable, safeStringable } from "@/utils/safe";
import { toDateInputValue } from "@/utils/time";

import { assignIfChanged, assignNullableString, normalizeOptionalString } from "../primitive/patch";

function toBirthdayISO(value: string): string {
  return `${value}T00:00:00.000Z`;
}

export function buildProfilePatch(original: Maybe<Profile.Response.ProfileBase>, form: Partial<UserProfileEditFormData>): Profile.Request.PatchProfile {
  const patch: Profile.Request.PatchProfile = {};

  assignIfChanged(patch, "profileLanguage", form.profileLanguage, Language(original?.profileLanguage));

  assignNullableString(patch, "displayName", form.displayName, safeNullable(original?.displayName));
  assignNullableString(patch, "firstName", form.firstName, safeNullable(original?.firstName));
  assignNullableString(patch, "lastName", form.lastName, safeNullable(original?.lastName));
  assignNullableString(patch, "country", form.country, safeNullable(original?.country));
  assignNullableString(patch, "city", form.city, safeNullable(original?.city));
  assignNullableString(patch, "gender", form.gender, safeNullable(original?.gender));
  assignNullableString(patch, "website", form.website, safeNullable(original?.website));
  assignNullableString(patch, "timezone", form.timezone, safeNullable(original?.timezone));
  assignNullableString(patch, "bio", form.bio, safeNullable(original?.bio));

  if (form.birthday !== undefined) {
    const nextBirthday = normalizeOptionalString(safeStringable(form.birthday));
    const previousBirthday = original?.birthday ? toDateInputValue(original.birthday) : null;
    if (nextBirthday !== previousBirthday) {
      patch.birthday = nextBirthday ? toBirthdayISO(nextBirthday) : null;
    }
  }

  return patch;
}
