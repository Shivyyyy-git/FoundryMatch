import crypto from "node:crypto";
import { and, eq, gt, isNull } from "drizzle-orm";
import {
  refreshTokens,
  type InsertProfile,
  type InsertRefreshToken,
  type InsertUser,
  profiles,
  type RefreshToken,
  type User,
  users,
} from "../../shared/schema.js";
import { db } from "../db.js";
import {
  deriveProfileName,
  normalizeEmail,
  storage,
  type UserProfileContext,
} from "../storage.js";

const EMAIL_VERIFICATION_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours
const PASSWORD_RESET_TTL_MS = 1000 * 60 * 60; // 1 hour
function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function generateToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString("hex");
}

function buildDefaultProfile(userId: string, name: string): InsertProfile {
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

export type SessionMetadata = {
  userAgent?: string;
  ipAddress?: string;
};

export class AuthService {
  async findUserByEmail(email: string): Promise<User | undefined> {
    const normalized = normalizeEmail(email);
    const [user] = await db.select().from(users).where(eq(users.email, normalized));
    return user;
  }

  async findUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserContext(userId: string): Promise<UserProfileContext | null> {
    return storage.getUserContext(userId);
  }

  async createLocalUser(params: {
    email: string;
    passwordHash: string;
    name?: string | null;
    userType?: User["userType"];
  }): Promise<{
    context: UserProfileContext;
    verificationToken: string;
    verificationExpiresAt: Date;
  }> {
    const normalizedEmail = normalizeEmail(params.email);
    const emailExists = await this.findUserByEmail(normalizedEmail);
    if (emailExists) {
      throw new Error("EMAIL_ALREADY_REGISTERED");
    }

    const verificationToken = generateToken();
    const verificationExpiresAt = new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS);
    const userId = crypto.randomUUID();

    await db.transaction(async (tx) => {
      await tx.insert(users).values({
        id: userId,
        email: normalizedEmail,
        authProvider: "password",
        userType: params.userType ?? "student",
        passwordHash: params.passwordHash,
        emailVerified: false,
        emailVerificationToken: hashToken(verificationToken),
        emailVerificationTokenExpiresAt: verificationExpiresAt,
      } satisfies InsertUser);

      const profileName = deriveProfileName(params.name ?? null, normalizedEmail);
      await tx.insert(profiles).values(buildDefaultProfile(userId, profileName));
    });

    const context = await this.requireUserContext(userId);
    return {
      context,
      verificationToken,
      verificationExpiresAt,
    };
  }

  async handleGoogleLogin(params: {
    googleId: string;
    email: string;
    name?: string | null;
    userType?: User["userType"];
  }): Promise<UserProfileContext> {
    const normalizedEmail = normalizeEmail(params.email);
    const now = new Date();

    await db.transaction(async (tx) => {
      const [existingByGoogle] = await tx
        .select()
        .from(users)
        .where(eq(users.googleId, params.googleId));

      if (existingByGoogle) {
        await tx
          .update(users)
          .set({
            email: normalizedEmail,
            authProvider: "google_oauth",
            emailVerified: true,
            lastLoginAt: now,
          })
          .where(eq(users.id, existingByGoogle.id));
        await this.ensureProfile(tx, existingByGoogle.id, params.name, normalizedEmail);
        return;
      }

      const [existingByEmail] = await tx
        .select()
        .from(users)
        .where(eq(users.email, normalizedEmail));

      if (existingByEmail) {
        await tx
          .update(users)
          .set({
            googleId: params.googleId,
            authProvider: "google_oauth",
            emailVerified: true,
            lastLoginAt: now,
          })
          .where(eq(users.id, existingByEmail.id));
        await this.ensureProfile(tx, existingByEmail.id, params.name, normalizedEmail);
        return;
      }

      const userId = crypto.randomUUID();
      await tx.insert(users).values({
        id: userId,
        email: normalizedEmail,
        authProvider: "google_oauth",
        userType: params.userType ?? "student",
        emailVerified: true,
        googleId: params.googleId,
        lastLoginAt: now,
      } satisfies InsertUser);

      const profileName = deriveProfileName(params.name ?? null, normalizedEmail);
      await tx.insert(profiles).values(buildDefaultProfile(userId, profileName));
    });

    return this.requireUserContextByEmailOrGoogle({
      googleId: params.googleId,
      email: params.email,
    });
  }

  private async ensureProfile(
    tx: any,
    userId: string,
    name: string | null | undefined,
    email: string,
  ) {
    const [existingProfile] = await tx
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId));
    if (!existingProfile) {
      const profileName = deriveProfileName(name ?? null, email);
      await tx.insert(profiles).values(buildDefaultProfile(userId, profileName));
    }
  }

  private async requireUserContext(userId: string): Promise<UserProfileContext> {
    const context = await storage.getUserContext(userId);
    if (!context) {
      throw new Error("USER_NOT_FOUND");
    }
    return context;
  }

  private async requireUserContextByEmailOrGoogle(params: {
    email: string;
    googleId: string;
  }): Promise<UserProfileContext> {
    const normalizedEmail = normalizeEmail(params.email);
    const [byGoogle] = await db
      .select()
      .from(users)
      .where(eq(users.googleId, params.googleId));
    if (byGoogle) {
      return this.requireUserContext(byGoogle.id);
    }
    const byEmail = await this.findUserByEmail(normalizedEmail);
    if (!byEmail) {
      throw new Error("USER_NOT_FOUND");
    }
    return this.requireUserContext(byEmail.id);
  }

  async createEmailVerificationToken(userId: string) {
    const token = generateToken();
    const expiresAt = new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS);
    await db
      .update(users)
      .set({
        emailVerificationToken: hashToken(token),
        emailVerificationTokenExpiresAt: expiresAt,
      })
      .where(eq(users.id, userId));
    return { token, expiresAt };
  }

  async verifyEmailToken(token: string): Promise<UserProfileContext | null> {
    const hashed = hashToken(token);
    const now = new Date();
    const [user] = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.emailVerificationToken, hashed),
          gt(users.emailVerificationTokenExpiresAt, now),
        ),
      );

    if (!user) {
      return null;
    }

    await db
      .update(users)
      .set({
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationTokenExpiresAt: null,
      })
      .where(eq(users.id, user.id));

    return this.requireUserContext(user.id);
  }

  async createPasswordResetToken(userId: string) {
    const token = generateToken();
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_TTL_MS);

    await db
      .update(users)
      .set({
        resetPasswordToken: hashToken(token),
        resetPasswordTokenExpiresAt: expiresAt,
      })
      .where(eq(users.id, userId));

    return { token, expiresAt };
  }

  async verifyPasswordResetToken(token: string): Promise<User | null> {
    const hashed = hashToken(token);
    const now = new Date();
    const [user] = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.resetPasswordToken, hashed),
          gt(users.resetPasswordTokenExpiresAt, now),
        ),
      );
    return user ?? null;
  }

  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await db
      .update(users)
      .set({
        passwordHash,
        resetPasswordToken: null,
        resetPasswordTokenExpiresAt: null,
      })
      .where(eq(users.id, userId));
  }

  async markEmailVerified(userId: string): Promise<void> {
    await db
      .update(users)
      .set({
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationTokenExpiresAt: null,
      })
      .where(eq(users.id, userId));
  }

  async recordLogin(userId: string): Promise<void> {
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, userId));
  }

  async createRefreshToken(
    userId: string,
    token: string,
    expiresAt: Date,
    metadata: SessionMetadata,
    tokenId?: string,
  ): Promise<RefreshToken> {
    const hashed = hashToken(token);
    const [record] = await db
      .insert(refreshTokens)
      .values({
        id: tokenId ?? crypto.randomUUID(),
        userId,
        tokenHash: hashed,
        expiresAt,
        userAgent: metadata.userAgent,
        ipAddress: metadata.ipAddress,
      } satisfies InsertRefreshToken)
      .returning();
    return record;
  }

  async revokeRefreshToken(token: string): Promise<void> {
    const hashed = hashToken(token);
    await db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(eq(refreshTokens.tokenHash, hashed));
  }

  async revokeRefreshTokenById(id: string): Promise<void> {
    await db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(eq(refreshTokens.id, id));
  }

  async revokeAllRefreshTokensForUser(userId: string): Promise<void> {
    await db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(eq(refreshTokens.userId, userId));
  }

  async findValidRefreshToken(
    token: string,
  ): Promise<{ user: User; refreshToken: RefreshToken } | null> {
    const hashed = hashToken(token);
    const now = new Date();
    const [record] = await db
      .select()
      .from(refreshTokens)
      .where(
        and(
          eq(refreshTokens.tokenHash, hashed),
          isNull(refreshTokens.revokedAt),
          gt(refreshTokens.expiresAt, now),
        ),
      );

    if (!record) {
      return null;
    }

    const user = await this.findUserById(record.userId);
    if (!user) {
      return null;
    }

    return { user, refreshToken: record };
  }
}

export const authService = new AuthService();

export function createRandomToken() {
  return generateToken();
}

export function hashPersistentToken(token: string) {
  return hashToken(token);
}

