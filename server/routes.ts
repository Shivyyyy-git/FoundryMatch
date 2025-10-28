import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertStudentProfileSchema, insertProjectSchema, insertStartupSchema, insertTeamSchema, insertTeamMemberSchema, insertMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
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

  // Student Profile routes
  app.get('/api/profiles', isAuthenticated, async (_req, res) => {
    try {
      const profiles = await storage.getStudentProfiles();
      res.json(profiles);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      res.status(500).json({ message: "Failed to fetch profiles" });
    }
  });

  app.get('/api/profiles/:userId', isAuthenticated, async (req, res) => {
    try {
      const profile = await storage.getStudentProfile(req.params.userId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.post('/api/profiles', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validated = insertStudentProfileSchema.parse({ ...req.body, userId });
      const profile = await storage.createStudentProfile(validated);
      res.json(profile);
    } catch (error) {
      console.error("Error creating profile:", error);
      res.status(400).json({ message: "Failed to create profile" });
    }
  });

  app.patch('/api/profiles/:userId', isAuthenticated, async (req: any, res) => {
    try {
      const requestingUserId = req.user.claims.sub;
      if (requestingUserId !== req.params.userId) {
        return res.status(403).json({ message: "Unauthorized to update this profile" });
      }
      const profile = await storage.updateStudentProfile(req.params.userId, req.body);
      res.json(profile);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(400).json({ message: "Failed to update profile" });
    }
  });

  // Project routes
  app.get('/api/projects', isAuthenticated, async (_req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get('/api/projects/:id', isAuthenticated, async (req, res) => {
    try {
      const project = await storage.getProject(parseInt(req.params.id));
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post('/api/projects', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validated = insertProjectSchema.parse({ ...req.body, userId });
      const project = await storage.createProject(validated);
      res.json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(400).json({ message: "Failed to create project" });
    }
  });

  app.patch('/api/projects/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const project = await storage.getProject(parseInt(req.params.id));
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      if (project.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized to update this project" });
      }
      const updated = await storage.updateProject(parseInt(req.params.id), req.body);
      res.json(updated);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(400).json({ message: "Failed to update project" });
    }
  });

  app.delete('/api/projects/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const project = await storage.getProject(parseInt(req.params.id));
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      if (project.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized to delete this project" });
      }
      await storage.deleteProject(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Startup routes
  app.get('/api/startups', isAuthenticated, async (_req, res) => {
    try {
      const startups = await storage.getStartups();
      res.json(startups);
    } catch (error) {
      console.error("Error fetching startups:", error);
      res.status(500).json({ message: "Failed to fetch startups" });
    }
  });

  app.get('/api/startups/:id', isAuthenticated, async (req, res) => {
    try {
      const startup = await storage.getStartup(parseInt(req.params.id));
      if (!startup) {
        return res.status(404).json({ message: "Startup not found" });
      }
      res.json(startup);
    } catch (error) {
      console.error("Error fetching startup:", error);
      res.status(500).json({ message: "Failed to fetch startup" });
    }
  });

  app.post('/api/startups', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validated = insertStartupSchema.parse({ ...req.body, userId });
      const startup = await storage.createStartup(validated);
      res.json(startup);
    } catch (error) {
      console.error("Error creating startup:", error);
      res.status(400).json({ message: "Failed to create startup" });
    }
  });

  app.patch('/api/startups/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const startup = await storage.getStartup(parseInt(req.params.id));
      if (!startup) {
        return res.status(404).json({ message: "Startup not found" });
      }
      if (startup.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized to update this startup" });
      }
      const updated = await storage.updateStartup(parseInt(req.params.id), req.body);
      res.json(updated);
    } catch (error) {
      console.error("Error updating startup:", error);
      res.status(400).json({ message: "Failed to update startup" });
    }
  });

  app.post('/api/startups/:id/upvote', isAuthenticated, async (req, res) => {
    try {
      const startup = await storage.upvoteStartup(parseInt(req.params.id));
      res.json(startup);
    } catch (error) {
      console.error("Error upvoting startup:", error);
      res.status(400).json({ message: "Failed to upvote startup" });
    }
  });

  app.delete('/api/startups/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const startup = await storage.getStartup(parseInt(req.params.id));
      if (!startup) {
        return res.status(404).json({ message: "Startup not found" });
      }
      if (startup.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized to delete this startup" });
      }
      await storage.deleteStartup(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting startup:", error);
      res.status(500).json({ message: "Failed to delete startup" });
    }
  });

  // Team routes
  app.get('/api/teams', isAuthenticated, async (_req, res) => {
    try {
      const teams = await storage.getTeams();
      res.json(teams);
    } catch (error) {
      console.error("Error fetching teams:", error);
      res.status(500).json({ message: "Failed to fetch teams" });
    }
  });

  app.get('/api/teams/:id', isAuthenticated, async (req, res) => {
    try {
      const team = await storage.getTeam(parseInt(req.params.id));
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      res.json(team);
    } catch (error) {
      console.error("Error fetching team:", error);
      res.status(500).json({ message: "Failed to fetch team" });
    }
  });

  app.post('/api/teams', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validated = insertTeamSchema.parse({ ...req.body, createdBy: userId });
      const team = await storage.createTeam(validated);
      res.json(team);
    } catch (error) {
      console.error("Error creating team:", error);
      res.status(400).json({ message: "Failed to create team" });
    }
  });

  app.patch('/api/teams/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const team = await storage.getTeam(parseInt(req.params.id));
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      if (team.createdBy !== userId) {
        return res.status(403).json({ message: "Unauthorized to update this team" });
      }
      const updated = await storage.updateTeam(parseInt(req.params.id), req.body);
      res.json(updated);
    } catch (error) {
      console.error("Error updating team:", error);
      res.status(400).json({ message: "Failed to update team" });
    }
  });

  app.delete('/api/teams/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const team = await storage.getTeam(parseInt(req.params.id));
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      if (team.createdBy !== userId) {
        return res.status(403).json({ message: "Unauthorized to delete this team" });
      }
      await storage.deleteTeam(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting team:", error);
      res.status(500).json({ message: "Failed to delete team" });
    }
  });

  // Team member routes
  app.get('/api/teams/:id/members', isAuthenticated, async (req, res) => {
    try {
      const members = await storage.getTeamMembers(parseInt(req.params.id));
      res.json(members);
    } catch (error) {
      console.error("Error fetching team members:", error);
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });

  app.post('/api/teams/:id/members', isAuthenticated, async (req, res) => {
    try {
      const validated = insertTeamMemberSchema.parse({ ...req.body, teamId: parseInt(req.params.id) });
      const member = await storage.addTeamMember(validated);
      res.json(member);
    } catch (error) {
      console.error("Error adding team member:", error);
      res.status(400).json({ message: "Failed to add team member" });
    }
  });

  app.delete('/api/team-members/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.removeTeamMember(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing team member:", error);
      res.status(500).json({ message: "Failed to remove team member" });
    }
  });

  // Message routes
  app.get('/api/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const messages = await storage.getMessages(userId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.get('/api/messages/:userId', isAuthenticated, async (req: any, res) => {
    try {
      const currentUserId = req.user.claims.sub;
      const otherUserId = req.params.userId;
      const messages = await storage.getConversation(currentUserId, otherUserId);
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
      const message = await storage.sendMessage(validated);
      res.json(message);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(400).json({ message: "Failed to send message" });
    }
  });

  app.patch('/api/messages/:id/read', isAuthenticated, async (req, res) => {
    try {
      await storage.markMessageRead(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
