import type { Request, Response, Router } from "express";
import { z } from "zod";
import {
  insertProjectSchema,
  type Project,
  type Project as ProjectType,
} from "../../shared/schema.js";
import { requireAuth, requireAdmin } from "../auth/middleware.js";
import { csrfProtection } from "../auth/csrf.js";
import { projectService, type CreateProjectInput, type ProjectFilters } from "../services/projectService.js";

const router: Router = require("express").Router();

// Validation schemas
const createProjectSchema = insertProjectSchema.omit({
  id: true,
  creatorId: true,
  status: true,
  approvedBy: true,
  approvedAt: true,
  createdAt: true,
  updatedAt: true,
});

const updateProjectSchema = createProjectSchema.partial();

const projectFiltersSchema = z.object({
  category: z.enum([
    "software",
    "research",
    "product",
    "design",
    "marketing",
    "hardware",
    "data_science",
  ]).optional(),
  compensationType: z.enum(["paid", "equity", "academic_credit", "volunteer"]).optional(),
  skills: z.array(z.string()).optional(),
  search: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});

const rejectProjectSchema = z.object({
  reason: z.string().trim().min(1, "Rejection reason is required").max(1000),
});

type ValidatedRequest<TBody = unknown, TQuery = unknown> = Request & {
  validatedBody?: TBody;
  validatedQuery?: TQuery;
};

function validateBody<T>(schema: z.ZodSchema<T>) {
  return (req: Request, res: Response, next: any) => {
    try {
      const parsed = schema.parse(req.body);
      (req as ValidatedRequest<T>).validatedBody = parsed;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.flatten(),
        });
      }
      next(error);
    }
  };
}

function validateQuery<T>(schema: z.ZodSchema<T>) {
  return (req: Request, res: Response, next: any) => {
    try {
      const parsed = schema.parse(req.query);
      (req as ValidatedRequest<unknown, T>).validatedQuery = parsed;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Invalid query parameters",
          errors: error.flatten(),
        });
      }
      next(error);
    }
  };
}

// Public routes

/**
 * GET /api/projects
 * List approved projects with optional filters
 */
router.get(
  "/",
  validateQuery(projectFiltersSchema),
  async (req: Request, res: Response, next: any) => {
    try {
      const validatedReq = req as ValidatedRequest<unknown, ProjectFilters>;
      const filters = validatedReq.validatedQuery ?? {};
      const projects = await projectService.listProjects(filters);
      res.json({ projects });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * GET /api/projects/:id
 * Get a single approved project
 */
router.get("/:id", async (req: Request, res: Response, next: any) => {
  try {
    const { id } = req.params;
    const project = await projectService.getProjectById(id, false);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ project });
  } catch (error) {
    next(error);
  }
});

// Protected routes (auth required)

/**
 * POST /api/projects
 * Create a new project (status: 'pending_approval')
 */
router.post(
  "/",
  requireAuth,
  csrfProtection,
  validateBody(createProjectSchema),
  async (req: Request, res: Response, next: any) => {
    try {
      if (!req.authUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { validatedBody } = req as ValidatedRequest<CreateProjectInput>;
      
      if (!validatedBody) {
        return res.status(400).json({ message: "Validation failed" });
      }

      const project = await projectService.createProject(
        req.authUser.id,
        validatedBody,
      );

      res.status(201).json({ project });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * GET /api/projects/mine
 * Get all projects created by the authenticated user (all statuses)
 */
router.get("/mine", requireAuth, async (req: Request, res: Response, next: any) => {
  try {
    if (!req.authUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userProjects = await projectService.getUserProjects(req.authUser.id);
    res.json({ projects: userProjects });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/projects/:id
 * Update a project (only if pending or rejected)
 */
router.put(
  "/:id",
  requireAuth,
  csrfProtection,
  validateBody(updateProjectSchema),
  async (req: Request, res: Response, next: any) => {
    try {
      if (!req.authUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { id } = req.params;
      const { validatedBody } = req as ValidatedRequest<Partial<CreateProjectInput>>;

      if (!validatedBody) {
        return res.status(400).json({ message: "Validation failed" });
      }

      const project = await projectService.updateProject(
        id,
        req.authUser.id,
        validatedBody,
      );

      res.json({ project });
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message === "Project not found" ||
          error.message === "You can only update your own projects" ||
          error.message.includes("can only update projects that are")
        ) {
          return res.status(403).json({ message: error.message });
        }
      }
      next(error);
    }
  },
);

/**
 * DELETE /api/projects/:id
 * Delete a project (only creator can delete)
 */
router.delete(
  "/:id",
  requireAuth,
  csrfProtection,
  async (req: Request, res: Response, next: any) => {
    try {
      if (!req.authUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { id } = req.params;
      await projectService.deleteProject(id, req.authUser.id);

      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message === "Project not found" ||
          error.message === "You can only delete your own projects"
        ) {
          return res.status(403).json({ message: error.message });
        }
      }
      next(error);
    }
  },
);

// Admin only routes

/**
 * GET /api/projects/pending
 * Get all pending projects (admin only)
 */
router.get("/pending", requireAdmin, async (req: Request, res: Response, next: any) => {
  try {
    const pendingProjects = await projectService.getPendingProjects();
    res.json({ projects: pendingProjects });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/projects/:id/approve
 * Approve a project (admin only)
 */
router.put(
  "/:id/approve",
  requireAdmin,
  csrfProtection,
  async (req: Request, res: Response, next: any) => {
    try {
      if (!req.authUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { id } = req.params;
      const reason = req.body.reason as string | undefined;

      const project = await projectService.approveProject(id, req.authUser.id, reason);

      res.json({ project });
    } catch (error) {
      if (error instanceof Error && error.message === "Project not found") {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  },
);

/**
 * PUT /api/projects/:id/reject
 * Reject a project with reason (admin only)
 */
router.put(
  "/:id/reject",
  requireAdmin,
  csrfProtection,
  validateBody(rejectProjectSchema),
  async (req: Request, res: Response, next: any) => {
    try {
      if (!req.authUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { id } = req.params;
      const { validatedBody } = req as ValidatedRequest<{ reason: string }>;

      if (!validatedBody) {
        return res.status(400).json({ message: "Validation failed" });
      }

      const project = await projectService.rejectProject(
        id,
        req.authUser.id,
        validatedBody.reason,
      );

      res.json({ project });
    } catch (error) {
      if (error instanceof Error && error.message === "Project not found") {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  },
);

export default router;

