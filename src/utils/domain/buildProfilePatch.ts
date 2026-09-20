import type { UserProfileEditFormData } from "nfx-ui/schemas";
import type { Profile } from "nfx-ui/types";

import { Language } from "nfx-ui/enums";
import { assignIfChanged, assignNullableString, normalizeOptionalString } from "nfx-ui/utils/primitive/patch";
import { safeNullable, safeStringable } from "nfx-ui/utils/safe";
import { toDateInputValue } from "nfx-ui/utils/time";

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
      patch.birthday = nextBirthday || null;
    }
  }

  return patch;
}
