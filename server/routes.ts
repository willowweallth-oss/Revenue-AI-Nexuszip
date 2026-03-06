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
    // In a real app, we'd fetch the profile from the DB using req.user.id
    // For now, we'll return the auth user info
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
    const metrics = await storage.getMetrics(); // In real app, filter by userId
    res.json(metrics);
  });

  // Campaigns
  app.get(api.campaigns.list.path, async (req: AuthRequest, res) => {
    const campaigns = await storage.getCampaigns(); // In real app, filter by userId
    res.json(campaigns);
  });

  app.post(api.campaigns.create.path, async (req: AuthRequest, res) => {
    try {
      const input = api.campaigns.create.input.parse(req.body);
      // Use authenticated user ID
      const campaign = await storage.createCampaign({
        ...input,
        userId: 1 // Placeholder until schema is updated for UUIDs
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

  // ... other routes would follow the same pattern of using req.user.id
  
  return httpServer;
}