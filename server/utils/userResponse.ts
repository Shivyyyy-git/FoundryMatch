import type { Profile } from "../../shared/schema.js";
import type { UserProfileContext } from "../storage.js";

const PROFILE_RESPONSE_FIELDS: Array<keyof Profile> = [
  "userId",
  "name",
  "headline",
  "bio",
  "skills",
  "profileImageKey",
  "linkedInUrl",
  "websiteUrl",
  "graduationYear",
  "major",
  "seekingOpportunities",
  "department",
  "researchAreas",
  "companyName",
  "industry",
  "employeeCount",
  "startupName",
  "foundingYear",
  "profileStatus",
  "approvedBy",
  "approvedAt",
  "createdAt",
  "updatedAt",
];

function serializeProfile(profile: Profile) {
  return PROFILE_RESPONSE_FIELDS.reduce<Record<string, unknown>>((acc, key) => {
    acc[key] = profile[key];
    return acc;
  }, {});
}

export function serializeUserContext(context: UserProfileContext) {
  return {
    id: context.user.id,
    email: context.user.email,
    userType: context.user.userType,
    isAdmin: context.user.isAdmin,
    emailVerified: context.user.emailVerified ?? false,
    profileStatus: context.profile.profileStatus,
    profileComplete: context.profileComplete,
    profile: serializeProfile(context.profile),
  };
}

