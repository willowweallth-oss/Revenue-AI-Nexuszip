import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { automationStorage } from "./automation-storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { verifyAuth, AuthRequest } from "./middleware/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Apply auth middleware to all /api routes
  app.use("/api", verifyAuth as any);

  // Users
  app.get(api.users.me.path, async (req: AuthRequest, res) => {
    res.json({
      id: req.user?.id,
      email: req.user?.email,
      name: req.user?.email?.split('@')[0] || "User",
      company: "Acme Corp",
      role: "Admin"
    });
  });

  // Metrics
  app.get(api.metrics.list.path, async (req: AuthRequest, res) => {
    const metrics = await storage.getMetrics();
    res.json(metrics);
  });

  // Campaigns
  app.get(api.campaigns.list.path, async (req: AuthRequest, res) => {
    const campaigns = await storage.getCampaigns();
    res.json(campaigns);
  });

  app.post(api.campaigns.create.path, async (req: AuthRequest, res) => {
    try {
      const input = api.campaigns.create.input.parse(req.body);
      const campaign = await storage.createCampaign({
        ...input,
        userId: 1 
      });
      res.status(201).json(campaign);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Notifications
  app.get("/api/notifications", async (req: AuthRequest, res) => {
    const userId = 1; // Placeholder
    let notifications = await storage.getNotifications(userId);
    
    // Seed sample data if empty
    if (notifications.length === 0) {
      await storage.createNotification({
        userId,
        organizationId: 1,
        title: "Welcome to RevAuto AI",
        description: "Your revenue operating system is ready. Start by exploring your dashboard.",
        type: "info",
        read: false
      });
      await storage.createNotification({
        userId,
        organizationId: 1,
        title: "New Insight Available",
        description: "We've identified a potential expansion opportunity in your Enterprise segment.",
        type: "success",
        read: false
      });
      notifications = await storage.getNotifications(userId);
    }
    
    res.json(notifications);
  });

  app.post("/api/notifications/:id/read", async (req: AuthRequest, res) => {
    const userId = 1; // Placeholder
    const notification = await storage.markNotificationRead(Number(req.params.id), userId);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json(notification);
  });

  app.post("/api/notifications/read-all", async (req: AuthRequest, res) => {
    const userId = 1; // Placeholder
    await storage.markAllNotificationsRead(userId);
    res.json({ message: "All notifications marked as read" });
  });

  app.delete("/api/notifications/:id", async (req: AuthRequest, res) => {
    const userId = 1; // Placeholder
    const success = await storage.deleteNotification(Number(req.params.id), userId);
    if (!success) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(204).end();
  });

  // Automation Flows
  app.get("/api/automation/flows", async (req: AuthRequest, res) => {
    const organizationId = 1; 
    const flows = await automationStorage.getFlows(organizationId);
    res.json(flows);
  });

  app.get("/api/automation/flows/:id", async (req: AuthRequest, res) => {
    const organizationId = 1; 
    const flow = await automationStorage.getFlow(Number(req.params.id), organizationId);
    if (!flow) {
      return res.status(404).json({ message: "Flow not found" });
    }
    res.json(flow);
  });
  
  return httpServer;
}