import {
  users,
  type User,
  type UpsertUser,
  projects,
  type Project,
  type InsertProject,
  startups,
  type Startup,
  type InsertStartup,
  messages,
  type Message,
  type InsertMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, ilike, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserProfile(id: string, data: Partial<User>): Promise<User>;
  getAllUsers(): Promise<User[]>;
  searchUsers(query?: string): Promise<User[]>;
  
  // Project operations
  createProject(project: InsertProject, userId: string): Promise<Project>;
  getProject(id: string): Promise<Project | undefined>;
  getAllProjects(approvedOnly?: boolean): Promise<Project[]>;
  getUserProjects(userId: string): Promise<Project[]>;
  updateProject(id: string, data: Partial<Project>): Promise<Project>;
  deleteProject(id: string): Promise<void>;
  approveProject(id: string): Promise<Project>;
  
  // Startup operations
  createStartup(startup: InsertStartup, userId: string): Promise<Startup>;
  getStartup(id: string): Promise<Startup | undefined>;
  getAllStartups(approvedOnly?: boolean): Promise<Startup[]>;
  getUserStartups(userId: string): Promise<Startup[]>;
  updateStartup(id: string, data: Partial<Startup>): Promise<Startup>;
  deleteStartup(id: string): Promise<void>;
  approveStartup(id: string): Promise<Startup>;
  
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getUserMessages(userId: string): Promise<Message[]>;
  getConversation(user1Id: string, user2Id: string): Promise<Message[]>;
  markMessageAsRead(id: string): Promise<Message>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserProfile(id: string, data: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.createdAt));
  }

  async searchUsers(query?: string): Promise<User[]> {
    if (!query) {
      return this.getAllUsers();
    }
    return db
      .select()
      .from(users)
      .where(
        or(
          ilike(users.firstName, `%${query}%`),
          ilike(users.lastName, `%${query}%`),
          ilike(users.major, `%${query}%`)
        )
      )
      .orderBy(desc(users.createdAt));
  }

  // Project operations
  async createProject(project: InsertProject, userId: string): Promise<Project> {
    const [newProject] = await db
      .insert(projects)
      .values({ ...project, userId })
      .returning();
    return newProject;
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async getAllProjects(approvedOnly = false): Promise<Project[]> {
    if (approvedOnly) {
      return db
        .select()
        .from(projects)
        .where(eq(projects.isApproved, true))
        .orderBy(desc(projects.createdAt));
    }
    return db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async getUserProjects(userId: string): Promise<Project[]> {
    return db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(desc(projects.createdAt));
  }

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    const [project] = await db
      .update(projects)
      .set(data)
      .where(eq(projects.id, id))
      .returning();
    return project;
  }

  async deleteProject(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  async approveProject(id: string): Promise<Project> {
    const [project] = await db
      .update(projects)
      .set({ isApproved: true })
      .where(eq(projects.id, id))
      .returning();
    return project;
  }

  // Startup operations
  async createStartup(startup: InsertStartup, userId: string): Promise<Startup> {
    const [newStartup] = await db
      .insert(startups)
      .values({ ...startup, userId })
      .returning();
    return newStartup;
  }

  async getStartup(id: string): Promise<Startup | undefined> {
    const [startup] = await db.select().from(startups).where(eq(startups.id, id));
    return startup;
  }

  async getAllStartups(approvedOnly = false): Promise<Startup[]> {
    if (approvedOnly) {
      return db
        .select()
        .from(startups)
        .where(eq(startups.isApproved, true))
        .orderBy(desc(startups.createdAt));
    }
    return db.select().from(startups).orderBy(desc(startups.createdAt));
  }

  async getUserStartups(userId: string): Promise<Startup[]> {
    return db
      .select()
      .from(startups)
      .where(eq(startups.userId, userId))
      .orderBy(desc(startups.createdAt));
  }

  async updateStartup(id: string, data: Partial<Startup>): Promise<Startup> {
    const [startup] = await db
      .update(startups)
      .set(data)
      .where(eq(startups.id, id))
      .returning();
    return startup;
  }

  async deleteStartup(id: string): Promise<void> {
    await db.delete(startups).where(eq(startups.id, id));
  }

  async approveStartup(id: string): Promise<Startup> {
    const [startup] = await db
      .update(startups)
      .set({ isApproved: true })
      .where(eq(startups.id, id))
      .returning();
    return startup;
  }

  // Message operations
  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values(message)
      .returning();
    return newMessage;
  }

  async getUserMessages(userId: string): Promise<Message[]> {
    return db
      .select()
      .from(messages)
      .where(or(eq(messages.senderId, userId), eq(messages.receiverId, userId)))
      .orderBy(desc(messages.createdAt));
  }

  async getConversation(user1Id: string, user2Id: string): Promise<Message[]> {
    return db
      .select()
      .from(messages)
      .where(
        or(
          and(eq(messages.senderId, user1Id), eq(messages.receiverId, user2Id)),
          and(eq(messages.senderId, user2Id), eq(messages.receiverId, user1Id))
        )
      )
      .orderBy(messages.createdAt);
  }

  async markMessageAsRead(id: string): Promise<Message> {
    const [message] = await db
      .update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, id))
      .returning();
    return message;
  }
}

export const storage = new DatabaseStorage();
