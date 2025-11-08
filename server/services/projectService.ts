import { and, eq, inArray, or, sql } from "drizzle-orm";
import {
  adminActions,
  type InsertAdminAction,
  type InsertProject,
  projects,
  type Project,
  profiles,
  type UpdateProfileInput,
  users,
} from "../../shared/schema.js";
import { db } from "../db.js";

export type ProjectWithCreator = Project & {
  creator: {
    id: string;
    email: string;
    name: string;
    profileImageKey: string | null;
  };
};

export type CreateProjectInput = {
  title: string;
  description: string;
  category: Project["category"];
  compensationType: Project["compensationType"];
  applicationDeadline?: Date | null;
  requiredSkills: string[];
};

export type UpdateProjectInput = Partial<CreateProjectInput>;

export type ProjectFilters = {
  category?: Project["category"];
  compensationType?: Project["compensationType"];
  skills?: string[];
  search?: string;
  limit?: number;
  offset?: number;
};

export class ProjectService {
  /**
   * Create a new project (status: 'pending_approval')
   */
  async createProject(
    creatorId: string,
    input: CreateProjectInput,
  ): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values({
        creatorId,
        title: input.title.trim(),
        description: input.description.trim(),
        category: input.category,
        compensationType: input.compensationType,
        applicationDeadline: input.applicationDeadline ?? null,
        requiredSkills: this.normalizeSkills(input.requiredSkills),
        status: "pending_approval",
      } satisfies InsertProject)
      .returning();

    return project;
  }

  /**
   * Get a single project by ID (only approved projects for public)
   */
  async getProjectById(
    projectId: string,
    includePending = false,
  ): Promise<ProjectWithCreator | null> {
    const conditions = includePending
      ? eq(projects.id, projectId)
      : and(eq(projects.id, projectId), eq(projects.status, "approved"));

    const [result] = await db
      .select({
        project: projects,
        creator: {
          id: users.id,
          email: users.email,
          name: profiles.name,
          profileImageKey: profiles.profileImageKey,
        },
      })
      .from(projects)
      .innerJoin(users, eq(projects.creatorId, users.id))
      .innerJoin(profiles, eq(users.id, profiles.userId))
      .where(conditions)
      .limit(1);

    if (!result) {
      return null;
    }

    return {
      ...result.project,
      creator: result.creator,
    };
  }

  /**
   * List approved projects with optional filters
   */
  async listProjects(filters: ProjectFilters = {}): Promise<ProjectWithCreator[]> {
    const conditions = [eq(projects.status, "approved")];

    if (filters.category) {
      conditions.push(eq(projects.category, filters.category));
    }

    if (filters.compensationType) {
      conditions.push(eq(projects.compensationType, filters.compensationType));
    }

    if (filters.skills && filters.skills.length > 0) {
      // Use PostgreSQL array overlap operator
      conditions.push(
        sql`${projects.requiredSkills} && ${filters.skills}::text[]`,
      );
    }

    if (filters.search) {
      const searchTerm = `%${filters.search.trim()}%`;
      conditions.push(
        or(
          sql`${projects.title} ILIKE ${searchTerm}`,
          sql`${projects.description} ILIKE ${searchTerm}`,
        )!,
      );
    }

    const query = db
      .select({
        project: projects,
        creator: {
          id: users.id,
          email: users.email,
          name: profiles.name,
          profileImageKey: profiles.profileImageKey,
        },
      })
      .from(projects)
      .innerJoin(users, eq(projects.creatorId, users.id))
      .innerJoin(profiles, eq(users.id, profiles.userId))
      .where(and(...conditions))
      .orderBy(sql`${projects.createdAt} DESC`);

    if (filters.limit) {
      query.limit(filters.limit);
    }

    if (filters.offset) {
      query.offset(filters.offset);
    }

    const results = await query;

    return results.map((result) => ({
      ...result.project,
      creator: result.creator,
    }));
  }

  /**
   * Get all projects created by a user (all statuses)
   */
  async getUserProjects(userId: string): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.creatorId, userId))
      .orderBy(sql`${projects.createdAt} DESC`);
  }

  /**
   * Get all pending projects (admin only)
   */
  async getPendingProjects(): Promise<ProjectWithCreator[]> {
    const results = await db
      .select({
        project: projects,
        creator: {
          id: users.id,
          email: users.email,
          name: profiles.name,
          profileImageKey: profiles.profileImageKey,
        },
      })
      .from(projects)
      .innerJoin(users, eq(projects.creatorId, users.id))
      .innerJoin(profiles, eq(users.id, profiles.userId))
      .where(eq(projects.status, "pending_approval"))
      .orderBy(sql`${projects.createdAt} ASC`);

    return results.map((result) => ({
      ...result.project,
      creator: result.creator,
    }));
  }

  /**
   * Update a project (only if pending or rejected)
   */
  async updateProject(
    projectId: string,
    userId: string,
    input: UpdateProjectInput,
  ): Promise<Project> {
    // Verify ownership and editable status
    const [existing] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (!existing) {
      throw new Error("Project not found");
    }

    if (existing.creatorId !== userId) {
      throw new Error("You can only update your own projects");
    }

    if (existing.status !== "pending_approval" && existing.status !== "rejected") {
      throw new Error(
        "You can only update projects that are pending approval or rejected",
      );
    }

    const updateData: Partial<InsertProject> = {};

    if (input.title !== undefined) {
      updateData.title = input.title.trim();
    }

    if (input.description !== undefined) {
      updateData.description = input.description.trim();
    }

    if (input.category !== undefined) {
      updateData.category = input.category;
    }

    if (input.compensationType !== undefined) {
      updateData.compensationType = input.compensationType;
    }

    if (input.applicationDeadline !== undefined) {
      updateData.applicationDeadline = input.applicationDeadline ?? null;
    }

    if (input.requiredSkills !== undefined) {
      updateData.requiredSkills = this.normalizeSkills(input.requiredSkills);
    }

    // Reset status to pending if it was rejected
    if (existing.status === "rejected") {
      updateData.status = "pending_approval";
      updateData.approvedBy = null;
      updateData.approvedAt = null;
    }

    const [updated] = await db
      .update(projects)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, projectId))
      .returning();

    return updated;
  }

  /**
   * Delete a project (only creator can delete)
   */
  async deleteProject(projectId: string, userId: string): Promise<void> {
    const [existing] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (!existing) {
      throw new Error("Project not found");
    }

    if (existing.creatorId !== userId) {
      throw new Error("You can only delete your own projects");
    }

    await db.delete(projects).where(eq(projects.id, projectId));
  }

  /**
   * Approve a project (admin only)
   */
  async approveProject(
    projectId: string,
    adminId: string,
    reason?: string,
  ): Promise<Project> {
    const [project] = await db
      .update(projects)
      .set({
        status: "approved",
        approvedBy: adminId,
        approvedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(projects.id, projectId))
      .returning();

    if (!project) {
      throw new Error("Project not found");
    }

    // Log admin action
    await this.logAdminAction({
      adminId,
      actionType: "approve",
      targetType: "project",
      targetId: projectId,
      reason: reason ?? null,
    });

    // Log notification (console for now)
    console.log(
      `Project "${project.title}" (${projectId}) approved by admin ${adminId}`,
    );

    return project;
  }

  /**
   * Reject a project (admin only)
   */
  async rejectProject(
    projectId: string,
    adminId: string,
    reason: string,
  ): Promise<Project> {
    const [project] = await db
      .update(projects)
      .set({
        status: "rejected",
        approvedBy: adminId,
        approvedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(projects.id, projectId))
      .returning();

    if (!project) {
      throw new Error("Project not found");
    }

    // Log admin action
    await this.logAdminAction({
      adminId,
      actionType: "reject",
      targetType: "project",
      targetId: projectId,
      reason,
    });

    // Log notification (console for now)
    console.log(
      `Project "${project.title}" (${projectId}) rejected by admin ${adminId}. Reason: ${reason}`,
    );

    return project;
  }

  /**
   * Log an admin action to the audit trail
   */
  private async logAdminAction(action: InsertAdminAction): Promise<void> {
    await db.insert(adminActions).values(action);
  }

  /**
   * Normalize skills array (trim, dedupe, filter empty)
   */
  private normalizeSkills(skills: string[]): string[] {
    return Array.from(
      new Set(
        skills
          .map((skill) => skill.trim())
          .filter((skill) => skill.length > 0),
      ),
    );
  }
}

export const projectService = new ProjectService();

