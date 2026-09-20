import type { QueryKey } from "@tanstack/react-query";

import { ProfileKindEnum } from "nfx-ui/enums";

const DOMAIN_AUTH = "auth";

export const ACCOUNT_SCOPE = (aID: string): QueryKey => [aID];
export const PROFILE_SCOPE = (aID: string, pID: string): QueryKey => [aID, pID];
export const AUTH_ACCOUNT_SCOPE = (aID: string): QueryKey => [aID, DOMAIN_AUTH];
export const AUTH_PROFILE_SCOPE = (aID: string, pID: string): QueryKey => [aID, pID, DOMAIN_AUTH];

export const AUTH_ME = (aID: string, pID: string): QueryKey => [aID, pID, DOMAIN_AUTH, "item", "me"];
export const AUTH_PROFILES = (aID: string, kind: ProfileKindEnum): QueryKey => [aID, DOMAIN_AUTH, kind, "list", "profiles"];
export const AUTH_EMAILS = (aID: string): QueryKey => [aID, DOMAIN_AUTH, "list", "emails"];
export const AUTH_PHONES = (aID: string): QueryKey => [aID, DOMAIN_AUTH, "list", "phones"];
export const AUTH_OWNER_FORGERS = (aID: string): QueryKey => [aID, DOMAIN_AUTH, "list", "owner-forgers"];
export const AUTH_OWNER_AUTHORITIES = (aID: string): QueryKey => [aID, DOMAIN_AUTH, "list", "owner-authorities"];
export const AUTH_PUBLIC_CARD = (profileId: string): QueryKey => [DOMAIN_AUTH, "item", "public-card", profileId];
export const AUTH_PROFILE_SEARCH = (aID: string, kind: ProfileKindEnum, query: string): QueryKey => [aID, DOMAIN_AUTH, kind, "list", "profile-search", query];
