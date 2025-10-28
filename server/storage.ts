import {
  users,
  studentProfiles,
  projects,
  startups,
  teams,
  teamMembers,
  messages,
  type User,
  type UpsertUser,
  type StudentProfile,
  type InsertStudentProfile,
  type Project,
  type InsertProject,
  type Startup,
  type InsertStartup,
  type Team,
  type InsertTeam,
  type TeamMember,
  type InsertTeamMember,
  type Message,
  type InsertMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or } from "drizzle-orm";

export interface IStorage {
  // User operations - required for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Student profile operations
  getStudentProfile(userId: string): Promise<StudentProfile | undefined>;
  createStudentProfile(profile: InsertStudentProfile): Promise<StudentProfile>;
  updateStudentProfile(userId: string, profile: Partial<InsertStudentProfile>): Promise<StudentProfile>;
  getStudentProfiles(): Promise<StudentProfile[]>;
  getStudentsWithProfiles(): Promise<any[]>;
  
  // Project operations
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: number): Promise<void>;
  
  // Startup operations
  getStartups(): Promise<Startup[]>;
  getStartup(id: number): Promise<Startup | undefined>;
  createStartup(startup: InsertStartup): Promise<Startup>;
  updateStartup(id: number, startup: Partial<InsertStartup>): Promise<Startup>;
  upvoteStartup(id: number): Promise<Startup>;
  deleteStartup(id: number): Promise<void>;
  
  // Team operations
  getTeams(): Promise<Team[]>;
  getTeam(id: number): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(id: number, team: Partial<InsertTeam>): Promise<Team>;
  deleteTeam(id: number): Promise<void>;
  
  // Team member operations
  getTeamMembers(teamId: number): Promise<TeamMember[]>;
  addTeamMember(member: InsertTeamMember): Promise<TeamMember>;
  removeTeamMember(id: number): Promise<void>;
  
  // Message operations
  getMessages(userId: string): Promise<Message[]>;
  getConversation(userId1: string, userId2: string): Promise<Message[]>;
  sendMessage(message: InsertMessage): Promise<Message>;
  markMessageRead(id: number): Promise<void>;
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

  // Student profile operations
  async getStudentProfile(userId: string): Promise<StudentProfile | undefined> {
    const [profile] = await db.select().from(studentProfiles).where(eq(studentProfiles.userId, userId));
    return profile;
  }

  async createStudentProfile(profileData: InsertStudentProfile): Promise<StudentProfile> {
    const [profile] = await db.insert(studentProfiles).values(profileData as any).returning();
    return profile;
  }

  async updateStudentProfile(userId: string, profileData: Partial<InsertStudentProfile>): Promise<StudentProfile> {
    const [profile] = await db
      .update(studentProfiles)
      .set({ ...profileData, updatedAt: new Date() })
      .where(eq(studentProfiles.userId, userId))
      .returning();
    return profile;
  }

  async getStudentProfiles(): Promise<StudentProfile[]> {
    return await db.select().from(studentProfiles).orderBy(desc(studentProfiles.createdAt));
  }

  async getStudentsWithProfiles(): Promise<any[]> {
    const profiles = await db
      .select({
        id: studentProfiles.id,
        userId: studentProfiles.userId,
        major: studentProfiles.major,
        year: studentProfiles.year,
        skills: studentProfiles.skills,
        interests: studentProfiles.interests,
        bio: studentProfiles.bio,
        lookingForTeam: studentProfiles.lookingForTeam,
        portfolioUrl: studentProfiles.portfolioUrl,
        githubUrl: studentProfiles.githubUrl,
        linkedinUrl: studentProfiles.linkedinUrl,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        profileImageUrl: users.profileImageUrl,
      })
      .from(studentProfiles)
      .leftJoin(users, eq(studentProfiles.userId, users.id))
      .orderBy(desc(studentProfiles.createdAt));
    
    return profiles.map(p => {
      const name = `${p.firstName || ''} ${p.lastName || ''}`.trim() || p.email || 'Unknown';
      const availability = p.lookingForTeam === true ? 'Available for projects' : 'Not available';
      
      return {
        id: p.id,
        userId: p.userId,
        name,
        email: p.email,
        major: p.major,
        year: p.year,
        skills: p.skills,
        interests: p.interests,
        bio: p.bio,
        lookingForTeam: p.lookingForTeam,
        portfolioUrl: p.portfolioUrl,
        githubUrl: p.githubUrl,
        linkedinUrl: p.linkedinUrl,
        avatarUrl: p.profileImageUrl,
        availability,
      };
    });
  }

  // Project operations
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(projectData: InsertProject): Promise<Project> {
    const [project] = await db.insert(projects).values(projectData as any).returning();
    return project;
  }

  async updateProject(id: number, projectData: Partial<InsertProject>): Promise<Project> {
    const [project] = await db
      .update(projects)
      .set({ ...projectData, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return project;
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Startup operations
  async getStartups(): Promise<Startup[]> {
    return await db.select().from(startups).orderBy(desc(startups.upvotes), desc(startups.createdAt));
  }

  async getStartup(id: number): Promise<Startup | undefined> {
    const [startup] = await db.select().from(startups).where(eq(startups.id, id));
    return startup;
  }

  async createStartup(startupData: InsertStartup): Promise<Startup> {
    const [startup] = await db.insert(startups).values(startupData as any).returning();
    return startup;
  }

  async updateStartup(id: number, startupData: Partial<InsertStartup>): Promise<Startup> {
    const [startup] = await db
      .update(startups)
      .set({ ...startupData, updatedAt: new Date() })
      .where(eq(startups.id, id))
      .returning();
    return startup;
  }

  async upvoteStartup(id: number): Promise<Startup> {
    const current = await this.getStartup(id);
    if (!current) throw new Error("Startup not found");
    const [startup] = await db
      .update(startups)
      .set({ upvotes: (current.upvotes || 0) + 1 })
      .where(eq(startups.id, id))
      .returning();
    return startup;
  }

  async deleteStartup(id: number): Promise<void> {
    await db.delete(startups).where(eq(startups.id, id));
  }

  // Team operations
  async getTeams(): Promise<Team[]> {
    return await db.select().from(teams).orderBy(desc(teams.createdAt));
  }

  async getTeam(id: number): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team;
  }

  async createTeam(teamData: InsertTeam): Promise<Team> {
    const [team] = await db.insert(teams).values(teamData as any).returning();
    return team;
  }

  async updateTeam(id: number, teamData: Partial<InsertTeam>): Promise<Team> {
    const [team] = await db
      .update(teams)
      .set({ ...teamData, updatedAt: new Date() })
      .where(eq(teams.id, id))
      .returning();
    return team;
  }

  async deleteTeam(id: number): Promise<void> {
    await db.delete(teams).where(eq(teams.id, id));
  }

  // Team member operations
  async getTeamMembers(teamId: number): Promise<TeamMember[]> {
    return await db.select().from(teamMembers).where(eq(teamMembers.teamId, teamId));
  }

  async addTeamMember(memberData: InsertTeamMember): Promise<TeamMember> {
    const [member] = await db.insert(teamMembers).values(memberData as any).returning();
    return member;
  }

  async removeTeamMember(id: number): Promise<void> {
    await db.delete(teamMembers).where(eq(teamMembers.id, id));
  }

  // Message operations
  async getMessages(userId: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(or(eq(messages.senderId, userId), eq(messages.receiverId, userId)))
      .orderBy(desc(messages.createdAt));
  }

  async getConversation(userId1: string, userId2: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(
        or(
          and(eq(messages.senderId, userId1), eq(messages.receiverId, userId2)),
          and(eq(messages.senderId, userId2), eq(messages.receiverId, userId1))
        )
      )
      .orderBy(messages.createdAt);
  }

  async sendMessage(messageData: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(messageData as any).returning();
    return message;
  }

  async markMessageRead(id: number): Promise<void> {
    await db.update(messages).set({ read: true }).where(eq(messages.id, id));
  }
}

export const storage = new DatabaseStorage();
