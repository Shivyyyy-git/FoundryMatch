import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertProjectSchema, insertStartupSchema, insertMessageSchema } from "@shared/schema";

// Admin middleware
const isAdmin = async (req: any, res: any, next: any) => {
  try {
    const userId = req.user.claims.sub;
    const user = await storage.getUser(userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    next();
  } catch (error) {
    console.error("Error checking admin status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware setup
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User routes
  app.get('/api/users', isAuthenticated, async (req, res) => {
    try {
      const query = req.query.q as string | undefined;
      const users = await storage.searchUsers(query);
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.patch('/api/users/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.updateUserProfile(userId, req.body);
      res.json(user);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Project routes
  app.get('/api/projects', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const approvedOnly = req.query.approved === 'true' || !user?.isAdmin;
      const projects = await storage.getAllProjects(approvedOnly);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post('/api/projects', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validated = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validated, userId);
      res.json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(400).json({ message: "Failed to create project" });
    }
  });

  app.get('/api/projects/:id', isAuthenticated, async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.patch('/api/projects/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const project = await storage.getProject(req.params.id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Only owner or admin can update
      if (project.userId !== userId && !user?.isAdmin) {
        return res.status(403).json({ message: "Forbidden: Can only update your own projects" });
      }
      
      // Prevent non-admins from changing approval status
      if (!user?.isAdmin && 'isApproved' in req.body) {
        delete req.body.isApproved;
      }
      
      const updated = await storage.updateProject(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete('/api/projects/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
      await storage.deleteProject(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  app.post('/api/projects/:id/approve', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const project = await storage.approveProject(req.params.id);
      res.json(project);
    } catch (error) {
      console.error("Error approving project:", error);
      res.status(500).json({ message: "Failed to approve project" });
    }
  });

  // Startup routes
  app.get('/api/startups', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const approvedOnly = req.query.approved === 'true' || !user?.isAdmin;
      const startups = await storage.getAllStartups(approvedOnly);
      res.json(startups);
    } catch (error) {
      console.error("Error fetching startups:", error);
      res.status(500).json({ message: "Failed to fetch startups" });
    }
  });

  app.post('/api/startups', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validated = insertStartupSchema.parse(req.body);
      const startup = await storage.createStartup(validated, userId);
      res.json(startup);
    } catch (error) {
      console.error("Error creating startup:", error);
      res.status(400).json({ message: "Failed to create startup" });
    }
  });

  app.get('/api/startups/:id', isAuthenticated, async (req, res) => {
    try {
      const startup = await storage.getStartup(req.params.id);
      if (!startup) {
        return res.status(404).json({ message: "Startup not found" });
      }
      res.json(startup);
    } catch (error) {
      console.error("Error fetching startup:", error);
      res.status(500).json({ message: "Failed to fetch startup" });
    }
  });

  app.patch('/api/startups/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const startup = await storage.getStartup(req.params.id);
      
      if (!startup) {
        return res.status(404).json({ message: "Startup not found" });
      }
      
      // Only owner or admin can update
      if (startup.userId !== userId && !user?.isAdmin) {
        return res.status(403).json({ message: "Forbidden: Can only update your own startups" });
      }
      
      // Prevent non-admins from changing approval status
      if (!user?.isAdmin && 'isApproved' in req.body) {
        delete req.body.isApproved;
      }
      
      const updated = await storage.updateStartup(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Error updating startup:", error);
      res.status(500).json({ message: "Failed to update startup" });
    }
  });

  app.delete('/api/startups/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
      await storage.deleteStartup(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting startup:", error);
      res.status(500).json({ message: "Failed to delete startup" });
    }
  });

  app.post('/api/startups/:id/approve', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const startup = await storage.approveStartup(req.params.id);
      res.json(startup);
    } catch (error) {
      console.error("Error approving startup:", error);
      res.status(500).json({ message: "Failed to approve startup" });
    }
  });

  // Message routes
  app.get('/api/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const messages = await storage.getUserMessages(userId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.get('/api/messages/conversation/:otherUserId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const messages = await storage.getConversation(userId, req.params.otherUserId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ message: "Failed to fetch conversation" });
    }
  });

  app.post('/api/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validated = insertMessageSchema.parse({ ...req.body, senderId: userId });
      const message = await storage.createMessage(validated);
      res.json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(400).json({ message: "Failed to send message" });
    }
  });

  app.patch('/api/messages/:id/read', isAuthenticated, async (req, res) => {
    try {
      const message = await storage.markMessageAsRead(req.params.id);
      res.json(message);
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
