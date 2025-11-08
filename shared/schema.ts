import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

const userTypeEnum = pgEnum("user_type", [
  "student",
  "professor",
  "company",
  "entrepreneur",
]);

const authProviderEnum = pgEnum("auth_provider", [
  "google_oauth",
  "campus_sso",
  "email_link",
  "password",
]);

const profileStatusEnum = pgEnum("profile_status", [
  "pending_approval",
  "approved",
  "rejected",
]);

const projectCategoryEnum = pgEnum("project_category", [
  "software",
  "research",
  "product",
  "design",
  "marketing",
  "hardware",
  "data_science",
]);

const compensationTypeEnum = pgEnum("compensation_type", [
  "paid",
  "equity",
  "academic_credit",
  "volunteer",
]);

const projectStatusEnum = pgEnum("project_status", [
  "pending_approval",
  "approved",
  "rejected",
  "active",
  "closed",
]);

const startupCategoryEnum = pgEnum("startup_category", [
  "software",
  "consumer",
  "education",
  "healthcare",
  "social_impact",
  "fintech",
  "ai_ml",
]);

const showcaseStatusEnum = pgEnum("showcase_status", [
  "pending_approval",
  "approved",
  "rejected",
  "featured",
]);

const connectionStatusEnum = pgEnum("connection_status", [
  "pending",
  "accepted",
  "rejected",
]);

const adminActionTypeEnum = pgEnum("admin_action_type", [
  "approve",
  "reject",
  "feature",
  "suspend",
  "update",
]);

const adminTargetTypeEnum = pgEnum("admin_target_type", [
  "profile",
  "project",
  "startup_showcase",
  "connection",
  "message",
  "user",
]);

const industryEnum = pgEnum("company_industry", [
  "technology",
  "healthcare",
  "finance",
  "education",
  "consumer",
  "manufacturing",
  "research",
  "nonprofit",
]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    authProvider: authProviderEnum("auth_provider")
      .default("google_oauth")
      .notNull(),
    userType: userTypeEnum("user_type").notNull(),
    isAdmin: boolean("is_admin").default(false).notNull(),
    passwordHash: varchar("password_hash", { length: 255 }),
    emailVerified: boolean("email_verified").default(false).notNull(),
    emailVerificationToken: varchar("email_verification_token", {
      length: 255,
    }),
    emailVerificationTokenExpiresAt: timestamp(
      "email_verification_expires_at",
      { withTimezone: true },
    ),
    resetPasswordToken: varchar("reset_password_token", { length: 255 }),
    resetPasswordTokenExpiresAt: timestamp("reset_password_expires_at", {
      withTimezone: true,
    }),
    googleId: varchar("google_id", { length: 255 }),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    idxUsersUserType: index("idx_users_user_type").on(table.userType),
    idxUsersCreated: index("idx_users_created_at").on(table.createdAt),
    idxUsersGoogleId: index("idx_users_google_id")
      .on(table.googleId)
      .where(sql`${table.googleId} IS NOT NULL`),
    idxUsersEmailVerification: index("idx_users_email_verification").on(
      table.emailVerificationToken,
    ),
    idxUsersResetToken: index("idx_users_reset_token").on(
      table.resetPasswordToken,
    ),
  }),
);

export type User = typeof users.$inferSelect & {
  firstName?: string | null;
  lastName?: string | null;
  profileImageUrl?: string | null;
  bio?: string | null;
  headline?: string | null;
  major?: string | null;
  year?: number | string | null;
  availability?: string | null;
  skills?: string[];
  website?: string | null;
  collaborationInterests?: string | null;
  researchArea?: string | null;
  mentorshipInterests?: string | null;
  startupName?: string | null;
  startupStage?: string | null;
  teamSize?: number | null;
  collaborationNeeds?: string | null;
  organization?: string | null;
};
export type InsertUser = typeof users.$inferInsert;

export const profiles = pgTable(
  "profiles",
  {
    userId: uuid("user_id")
      .primaryKey()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 160 }).notNull(),
    headline: varchar("headline", { length: 200 }),
    bio: text("bio"),
    skills: text("skills")
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`),
    profileImageKey: varchar("profile_image_key", { length: 255 }),
    linkedInUrl: varchar("linkedin_url", { length: 255 }),
    websiteUrl: varchar("website_url", { length: 255 }),
    graduationYear: integer("graduation_year"),
    major: varchar("major", { length: 120 }),
    seekingOpportunities: boolean("seeking_opportunities").default(false),
    department: varchar("department", { length: 120 }),
    researchAreas: text("research_areas")
      .array()
      .default(sql`ARRAY[]::text[]`),
    companyName: varchar("company_name", { length: 160 }),
    industry: industryEnum("industry"),
    employeeCount: integer("employee_count"),
    startupName: varchar("startup_name", { length: 160 }),
    foundingYear: integer("founding_year"),
    profileStatus: profileStatusEnum("profile_status")
      .default("pending_approval")
      .notNull(),
    approvedBy: uuid("approved_by").references(() => users.id, {
      onDelete: "set null",
    }),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    idxProfilesStatus: index("idx_profiles_status").on(table.profileStatus),
    idxProfilesSeeking: index("idx_profiles_seeking_opportunities").on(
      table.seekingOpportunities,
    ),
    idxProfilesIndustry: index("idx_profiles_industry").on(table.industry),
    idxProfilesGradYear: index("idx_profiles_graduation_year").on(
      table.graduationYear,
    ),
    idxProfilesDepartment: index("idx_profiles_department").on(
      table.department,
    ),
    idxProfilesCompanyName: index("idx_profiles_company_name").on(
      table.companyName,
    ),
    idxProfilesStartupName: index("idx_profiles_startup_name").on(
      table.startupName,
    ),
    idxProfilesSkills: index("idx_profiles_skills").using("gin", table.skills),
  }),
);

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;

const profileSkillsSchema = z
  .array(z.string().trim().min(1, "Skill cannot be empty"))
  .max(25, "Too many skills supplied");

const profileResearchSchema = z
  .array(z.string().trim().min(1, "Research topic cannot be empty"))
  .max(25, "Too many research topics supplied");

const baseProfileSchema = createInsertSchema(profiles, {
  skills: profileSkillsSchema,
  researchAreas: profileResearchSchema,
  linkedInUrl: z
    .string()
    .trim()
    .url("LinkedIn URL must be valid")
    .max(2048, "LinkedIn URL is too long")
    .optional(),
  websiteUrl: z
    .string()
    .trim()
    .url("Website URL must be valid")
    .max(2048, "Website URL is too long")
    .optional(),
});

export const insertProfileSchema = baseProfileSchema;

export const updateProfileSchema = baseProfileSchema
  .omit({
    userId: true,
    profileStatus: true,
    approvedBy: true,
    approvedAt: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial()
  .extend({
    skills: profileSkillsSchema.optional(),
    researchAreas: profileResearchSchema.optional(),
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    creatorId: uuid("creator_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description").notNull(),
    category: projectCategoryEnum("category").notNull(),
    compensationType: compensationTypeEnum("compensation_type").notNull(),
    applicationDeadline: timestamp("application_deadline", {
      withTimezone: true,
    }),
    requiredSkills: text("required_skills")
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`),
    status: projectStatusEnum("status")
      .default("pending_approval")
      .notNull(),
    approvedBy: uuid("approved_by").references(() => users.id, {
      onDelete: "set null",
    }),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    idxProjectsStatus: index("idx_projects_status").on(table.status),
    idxProjectsCategory: index("idx_projects_category").on(table.category),
    idxProjectsCreator: index("idx_projects_creator").on(table.creatorId),
    idxProjectsStatusCategory: index("idx_projects_status_category").on(
      table.status,
      table.category,
    ),
    idxProjectsDeadline: index("idx_projects_deadline").on(
      table.applicationDeadline,
    ),
    idxProjectsCompensation: index("idx_projects_compensation").on(
      table.compensationType,
    ),
    idxProjectsRequiredSkills: index("idx_projects_required_skills").using(
      "gin",
      table.requiredSkills,
    ),
  }),
);

export type Project = typeof projects.$inferSelect & {
  company?: string | null;
  projectLink?: string | null;
  skills?: string[];
  timeCommitment?: string | null;
  teamSize?: string | null;
  deadline?: string | null;
  type?: string | null;
};
export type InsertProject = typeof projects.$inferInsert & {
  company?: string | null;
  projectLink?: string | null;
  skills?: string[];
  timeCommitment?: string | null;
  teamSize?: string | null;
  deadline?: string | null;
  type?: string | null;
};

export const startupShowcase = pgTable(
  "startup_showcase",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    companyName: varchar("company_name", { length: 200 }).notNull(),
    description: text("description").notNull(),
    foundingYear: integer("founding_year"),
    category: startupCategoryEnum("category").notNull(),
    logoKey: varchar("logo_key", { length: 255 }),
    websiteUrl: varchar("website_url", { length: 255 }),
    linkedInUrl: varchar("linkedin_url", { length: 255 }),
    status: showcaseStatusEnum("status")
      .default("pending_approval")
      .notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),
    featuredUntil: timestamp("featured_until", { withTimezone: true }),
    approvedBy: uuid("approved_by").references(() => users.id, {
      onDelete: "set null",
    }),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    idxShowcaseStatus: index("idx_showcase_status").on(table.status),
    idxShowcaseCategory: index("idx_showcase_category").on(table.category),
    idxShowcaseFeatured: index("idx_showcase_featured").on(table.isFeatured),
    idxShowcaseFeaturedUntil: index("idx_showcase_featured_until").on(
      table.featuredUntil,
    ),
    idxShowcaseUser: index("idx_showcase_user").on(table.userId),
    idxShowcaseStatusCategory: index("idx_showcase_status_category").on(
      table.status,
      table.category,
    ),
  }),
);

export type StartupShowcase = typeof startupShowcase.$inferSelect;
export type InsertStartupShowcase = typeof startupShowcase.$inferInsert;
export type Startup = StartupShowcase & {
  tagline?: string | null;
};
export type InsertStartup = InsertStartupShowcase & {
  tagline?: string | null;
};

export const connections = pgTable(
  "connections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    requesterId: uuid("requester_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    recipientId: uuid("recipient_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: connectionStatusEnum("status").default("pending").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    respondedAt: timestamp("responded_at", { withTimezone: true }),
  },
  (table) => ({
    udxConnectionsPair: uniqueIndex("udx_connections_pair").on(
      table.requesterId,
      table.recipientId,
    ),
    idxConnectionsStatus: index("idx_connections_status").on(table.status),
    idxConnectionsRecipientStatus: index(
      "idx_connections_recipient_status",
    ).on(table.recipientId, table.status),
  }),
);

export type Connection = typeof connections.$inferSelect;
export type InsertConnection = typeof connections.$inferInsert;

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    senderId: uuid("sender_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    recipientId: uuid("recipient_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    read: boolean("read").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    idxMessagesParticipants: index("idx_messages_participants").on(
      table.senderId,
      table.recipientId,
    ),
    idxMessagesRecipientRead: index("idx_messages_recipient_read").on(
      table.recipientId,
      table.read,
    ),
    idxMessagesCreated: index("idx_messages_created_at").on(table.createdAt),
  }),
);

export type Message = typeof messages.$inferSelect & {
  receiverId?: string;
  isRead?: boolean;
};
export type InsertMessage = typeof messages.$inferInsert & {
  receiverId?: string;
  isRead?: boolean;
};

export const adminActions = pgTable(
  "admin_actions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    adminId: uuid("admin_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    actionType: adminActionTypeEnum("action_type").notNull(),
    targetType: adminTargetTypeEnum("target_type").notNull(),
    targetId: uuid("target_id").notNull(),
    reason: text("reason"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    idxAdminActionsAdmin: index("idx_admin_actions_admin").on(table.adminId),
    idxAdminActionsTarget: index("idx_admin_actions_target").on(
      table.targetType,
      table.targetId,
    ),
    idxAdminActionsCreated: index("idx_admin_actions_created").on(
      table.createdAt,
    ),
  }),
);

export type AdminAction = typeof adminActions.$inferSelect;
export type InsertAdminAction = typeof adminActions.$inferInsert;

export const insertProjectSchema = createInsertSchema(projects);
export const insertStartupShowcaseSchema = createInsertSchema(startupShowcase);
export const insertStartupSchema = insertStartupShowcaseSchema;
export const insertConnectionSchema = createInsertSchema(connections);
export const insertMessageSchema = createInsertSchema(messages);
export const insertAdminActionSchema = createInsertSchema(adminActions);

export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid", { length: 255 }).primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire", { withTimezone: true }).notNull(),
  },
  (table) => ({
    idxSessionsExpire: index("idx_sessions_expire").on(table.expire),
  }),
);

export const refreshTokens = pgTable(
  "refresh_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: varchar("token_hash", { length: 255 }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    userAgent: varchar("user_agent", { length: 255 }),
    ipAddress: varchar("ip_address", { length: 64 }),
  },
  (table) => ({
    idxRefreshTokenHash: index("idx_refresh_tokens_hash").on(table.tokenHash),
    idxRefreshTokenUser: index("idx_refresh_tokens_user").on(table.userId),
    idxRefreshTokenExpires: index("idx_refresh_tokens_expires").on(
      table.expiresAt,
    ),
  }),
);

export type RefreshToken = typeof refreshTokens.$inferSelect;
export type InsertRefreshToken = typeof refreshTokens.$inferInsert;
