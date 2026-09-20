import type { Profile } from "nfx-ui/types";

import { ProfileKindEnum } from "nfx-ui/enums";

export function pickProfile(
  kind: ProfileKindEnum,
  data: Nilable<Profile.Response.FullAccountInformationWithForgerProfile | Profile.Response.FullAccountInformationWithAuthorityProfile>,
): Nullable<Profile.Response.ProfileBase> {
  if (!data) return null;
  return kind === ProfileKindEnum.AUTHORITY
    ? (data as Profile.Response.FullAccountInformationWithAuthorityProfile).authorityProfile
    : (data as Profile.Response.FullAccountInformationWithForgerProfile).forgerProfile;
}

function isUuidLike(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

export function resolveAccountDisplayName(...candidates: Nilable<string>[]): string {
  for (const candidate of candidates) {
    const value = candidate?.trim();
    if (!value) continue;
    if (isUuidLike(value)) return `Account ${value.slice(0, 8)}`;
    return value;
  }
  return "User";
}

export function resolveAccountInitial(...candidates: Nilable<string>[]): string {
  for (const candidate of candidates) {
    const value = candidate?.trim();
    if (!value) continue;
    const match = value.match(/[A-Za-z0-9]/);
    if (match) return match[0].toUpperCase();
  }
  return "U";
}
