import { sql } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").notNull().unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  userType: varchar("user_type").default("Student"),
  organization: varchar("organization"),
  headline: text("headline"),
  major: varchar("major"),
  year: varchar("year"),
  bio: text("bio"),
  skills: text("skills").array(),
  availability: varchar("availability"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_users_major_year_availability").on(table.major, table.year, table.availability),
  index("idx_users_skills").using("gin", table.skills),
  index("idx_users_created_at").on(table.createdAt),
  index("idx_users_user_type").on(table.userType),
]);

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Profile update schema with validation - require non-empty, non-whitespace strings for academic fields
export const updateProfileSchema = z.object({
  bio: z.string().optional(),
  userType: z.string().optional(),
  organization: z.string().optional(),
  headline: z.string().optional(),
  major: z.string()
    .min(1, "Major cannot be empty")
    .refine((val) => val.trim().length > 0, { message: "Major cannot be whitespace" })
    .optional(),
  year: z.string()
    .min(1, "Year cannot be empty")
    .refine((val) => val.trim().length > 0, { message: "Year cannot be whitespace" })
    .optional(),
  availability: z.string()
    .min(1, "Availability cannot be empty")
    .refine((val) => val.trim().length > 0, { message: "Availability cannot be whitespace" })
    .optional(),
  skills: z.array(z.string()).optional(),
});
export type UpdateProfile = z.infer<typeof updateProfileSchema>;

// Projects/Gigs table
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  company: varchar("company").notNull(),
  projectLink: varchar("project_link"),
  description: text("description").notNull(),
  skills: text("skills").array().notNull(),
  timeCommitment: varchar("time_commitment"),
  teamSize: varchar("team_size"),
  deadline: varchar("deadline"),
  type: varchar("type").notNull(),
  userId: varchar("user_id").notNull().references(() => users.id),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_projects_approved").on(table.isApproved).where(sql`${table.isApproved} = true`),
  index("idx_projects_type_approved").on(table.type, table.isApproved),
  index("idx_projects_skills").using("gin", table.skills),
  index("idx_projects_created_at").on(table.createdAt),
  index("idx_projects_user_id").on(table.userId),
]);

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  userId: true,
  isApproved: true,
});
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

// Startups table
export const startups = pgTable("startups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  tagline: varchar("tagline").notNull(),
  description: text("description").notNull(),
  category: varchar("category").notNull(),
  teamSize: integer("team_size").notNull(),
  founded: varchar("founded"),
  imagePath: varchar("image_path"),
  externalUrl: varchar("external_url"),
  userId: varchar("user_id").notNull().references(() => users.id),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_startups_approved").on(table.isApproved).where(sql`${table.isApproved} = true`),
  index("idx_startups_category_approved").on(table.category, table.isApproved),
  index("idx_startups_created_at").on(table.createdAt),
  index("idx_startups_user_id").on(table.userId),
]);

export const insertStartupSchema = createInsertSchema(startups).omit({
  id: true,
  createdAt: true,
  userId: true,
  isApproved: true,
}).extend({
  name: z.string().min(1, "Startup name is required"),
  tagline: z.string().min(1, "Tagline is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  teamSize: z.number().min(1, "Team size must be at least 1"),
});
export type InsertStartup = z.infer<typeof insertStartupSchema>;
export type Startup = typeof startups.$inferSelect;

// Messages table
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  receiverId: varchar("receiver_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_messages_sender_receiver").on(table.senderId, table.receiverId, table.createdAt),
  index("idx_messages_receiver_sender").on(table.receiverId, table.senderId, table.createdAt),
  index("idx_messages_unread").on(table.isRead, table.receiverId).where(sql`${table.isRead} = false`),
]);

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
  isRead: true,
});
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
