import type { Express, NextFunction, Request, Response } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "../shared/schema.js";
import {
  ObjectNotFoundError,
  ObjectStorageService,
} from "./objectStorage.js";
import { storage } from "./storage.js";
import { requireAuth } from "./auth/middleware.js";
import authRouter from "./routes/authRoutes.js";
import projectRouter from "./routes/projectRoutes.js";
import { csrfProtection } from "./auth/csrf.js";
import { serializeUserContext } from "./utils/userResponse.js";

type ValidatedRequest<T> = Request & { validatedBody: T };

function validateBody<T>(schema: z.ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
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

export async function registerRoutes(app: Express): Promise<Server> {
  const objectStorageService = new ObjectStorageService();

  app.use("/api/auth", authRouter);
  app.use("/api/projects", projectRouter);

  app.get("/objects/:objectPath(*)", requireAuth, async (req, res) => {
    try {
      const authUser = req.authUser;
      if (!authUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const objectFile = await objectStorageService.getObjectEntityFile(
        req.path,
      );
      const canAccess = await objectStorageService.canAccessObjectEntity({
        objectFile,
        userId: authUser.id,
      });
      if (!canAccess) {
        return res.sendStatus(401);
      }
      await objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error serving object:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      if ((error as any).status === 401) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      return res.sendStatus(500);
    }
  });

  app.post("/api/objects/upload", requireAuth, async (_req, res) => {
    const uploadURL = await objectStorageService.getObjectEntityUploadURL();
    res.json({ uploadURL });
  });

  app.put(
    "/api/profile/image",
    requireAuth,
    csrfProtection,
    async (req, res) => {
    if (!req.body.imageURL) {
      return res.status(400).json({ error: "imageURL is required" });
    }

    try {
        const authUser = req.authUser;
        if (!authUser) {
          return res.status(401).json({ message: "Unauthorized" });
        }
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
        req.body.imageURL,
        {
            owner: authUser.id,
          visibility: "public",
        },
      );

      res.status(200).json({ objectPath });
    } catch (error) {
      console.error("Error setting profile image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
    },
  );

  app.get("/api/auth/user", requireAuth, (req, res) => {
    if (!req.authContext) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(serializeUserContext(req.authContext));
  });

  app.get("/api/profile/me", requireAuth, (req, res) => {
    if (!req.authContext) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(serializeUserContext(req.authContext));
  });

  app.put(
    "/api/profile",
    requireAuth,
    csrfProtection,
    validateBody(updateProfileSchema),
    async (req, res) => {
      if (!req.authUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      try {
        const { validatedBody } = req as ValidatedRequest<UpdateProfileInput>;
        const context = await storage.updateProfile(
          req.authUser.id,
          validatedBody,
        );
        res.json(serializeUserContext(context));
      } catch (error) {
        console.error("Error updating profile:", error);
        const status =
          (error as any).message === "Name cannot be empty" ? 400 : 500;
        res.status(status).json({ message: (error as Error).message });
      }
    },
  );

  const httpServer = createServer(app);
  return httpServer;
}

