import { eq } from "drizzle-orm";
import {
  profiles,
  type InsertProfile,
  type Profile,
  type UpdateProfileInput,
  type User,
  users,
} from "../shared/schema.js";
import { db } from "./db.js";

export type UserProfileContext = {
  user: User;
  profile: Profile;
  profileComplete: boolean;
};

const PROFILE_BASE_FIELDS: Array<keyof Profile> = ["headline", "bio"];

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizeOptionalString(value?: string | null): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeStringArray(values?: string[] | null): string[] | undefined {
  if (values === undefined) {
    return undefined;
  }
  if (values === null) {
    return [];
  }

  const deduped = Array.from(
    new Set(values.map((entry) => entry.trim()).filter((entry) => entry.length)),
  );

  return deduped;
}

export function deriveProfileName(
  preferredName: string | null | undefined,
  email: string,
) {
  if (preferredName && preferredName.trim().length > 0) {
    return preferredName.trim();
  }
  return email.split("@")[0];
}

function computeProfileCompletion(user: User, profile: Profile): boolean {
  const baseComplete = PROFILE_BASE_FIELDS.every((field) => {
    const value = profile[field];
    if (typeof value === "string") {
      return value.trim().length > 0;
    }
    return Boolean(value);
  });

  if (!baseComplete || profile.skills.length === 0) {
    return false;
  }

  const researchAreas = profile.researchAreas ?? [];

  switch (user.userType) {
    case "student":
      return Boolean(profile.graduationYear && profile.major?.trim().length);
    case "professor":
      return Boolean(
        profile.department?.trim().length && researchAreas.length > 0,
      );
    case "company":
      return Boolean(
        profile.companyName?.trim().length &&
          profile.industry &&
          (profile.employeeCount ?? 0) > 0,
      );
    case "entrepreneur":
      return Boolean(profile.startupName?.trim().length && profile.foundingYear);
    default:
      return false;
  }
}

class DatabaseStorage {
  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getProfileByUserId(userId: string): Promise<Profile | undefined> {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId));
    return profile;
  }

  async getUserContext(userId: string): Promise<UserProfileContext | null> {
    const user = await this.getUserById(userId);
    if (!user) {
      return null;
    }

    let profile = await this.getProfileByUserId(userId);
    if (!profile) {
      profile = await this.createDefaultProfile(userId, deriveProfileName(null, user.email));
    }

    return {
      user,
      profile,
      profileComplete: computeProfileCompletion(user, profile),
    };
  }

  async updateProfile(
    userId: string,
    data: UpdateProfileInput,
  ): Promise<UserProfileContext> {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const updatePayload: Partial<InsertProfile> = {
      updatedAt: new Date(),
      profileStatus: "pending_approval",
      approvedAt: null,
      approvedBy: null,
    };

    if (data.name !== undefined) {
      const trimmed = data.name.trim();
      if (!trimmed) {
        throw new Error("Name cannot be empty");
      }
      updatePayload.name = trimmed;
    }

    if ("headline" in data) {
      updatePayload.headline = normalizeOptionalString(data.headline) ?? null;
    }
    if ("bio" in data) {
      updatePayload.bio = normalizeOptionalString(data.bio) ?? null;
    }
    if ("linkedInUrl" in data) {
      updatePayload.linkedInUrl =
        normalizeOptionalString(data.linkedInUrl) ?? null;
    }
    if ("websiteUrl" in data) {
      updatePayload.websiteUrl =
        normalizeOptionalString(data.websiteUrl) ?? null;
    }
    if ("major" in data) {
      updatePayload.major = normalizeOptionalString(data.major) ?? null;
    }
    if ("department" in data) {
      updatePayload.department =
        normalizeOptionalString(data.department) ?? null;
    }
    if ("companyName" in data) {
      updatePayload.companyName =
        normalizeOptionalString(data.companyName) ?? null;
    }
    if ("startupName" in data) {
      updatePayload.startupName =
        normalizeOptionalString(data.startupName) ?? null;
    }
    if ("profileImageKey" in data) {
      updatePayload.profileImageKey =
        normalizeOptionalString(data.profileImageKey) ?? null;
    }

    if ("seekingOpportunities" in data && data.seekingOpportunities !== undefined) {
      updatePayload.seekingOpportunities = data.seekingOpportunities;
    }

    if ("graduationYear" in data) {
      updatePayload.graduationYear =
        data.graduationYear === undefined ? null : data.graduationYear ?? null;
    }

    if ("employeeCount" in data) {
      updatePayload.employeeCount =
        data.employeeCount === undefined ? null : data.employeeCount ?? null;
    }

    if ("foundingYear" in data) {
      updatePayload.foundingYear =
        data.foundingYear === undefined ? null : data.foundingYear ?? null;
    }

    if ("industry" in data && data.industry !== undefined) {
      updatePayload.industry = data.industry;
    }

    const normalizedSkills = normalizeStringArray(data.skills);
    if (normalizedSkills !== undefined) {
      updatePayload.skills = normalizedSkills;
    }

    const normalizedResearchAreas = normalizeStringArray(data.researchAreas);
    if (normalizedResearchAreas !== undefined) {
      updatePayload.researchAreas = normalizedResearchAreas;
    }

    const [updatedProfile] = await db
      .update(profiles)
      .set(updatePayload)
      .where(eq(profiles.userId, userId))
      .returning();

    if (!updatedProfile) {
      throw new Error("Profile not found");
    }

    return {
      user,
      profile: updatedProfile,
      profileComplete: computeProfileCompletion(user, updatedProfile),
    };
  }

  private buildDefaultProfile(userId: string, name: string): InsertProfile {
    return {
      userId,
      name,
      headline: null,
      bio: null,
      skills: [],
      profileImageKey: null,
      linkedInUrl: null,
      websiteUrl: null,
      graduationYear: null,
      major: null,
      seekingOpportunities: false,
      department: null,
      researchAreas: [],
      companyName: null,
      industry: null,
      employeeCount: null,
      startupName: null,
      foundingYear: null,
      profileStatus: "pending_approval",
      approvedBy: null,
      approvedAt: null,
    };
  }

  private async createDefaultProfile(
    userId: string,
    name: string,
  ): Promise<Profile> {
    const [created] = await db
      .insert(profiles)
      .values(this.buildDefaultProfile(userId, name))
      .returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
