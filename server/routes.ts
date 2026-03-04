import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

async function seedDatabase() {
  const existingUsers = await storage.getUser(1);
  if (!existingUsers) {
    const adminUser = await storage.createUser({
      name: "Admin User",
      email: "admin@example.com",
      company: "Acme Corp",
      role: "CEO",
      avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
    });

    // Seed Metrics
    const today = new Date();
    for (let i = 0; i < 6; i++) {
      const d = new Date(today);
      d.setMonth(d.getMonth() - i);
      await storage.createMetric({
        userId: adminUser.id,
        date: d,
        mrr: (50000 + Math.random() * 10000 - i * 2000).toString(),
        churnRate: (2.5 + Math.random() * 1.5).toString(),
        activeCustomers: 1200 + Math.floor(Math.random() * 100) - i * 50,
        cac: (150 + Math.random() * 50).toString()
      });
    }

    // Seed Campaigns
    await storage.createCampaign({
      userId: adminUser.id,
      name: "Q3 Expansion",
      status: "active",
      budget: "15000.00",
      roi: "2.4"
    });
    await storage.createCampaign({
      userId: adminUser.id,
      name: "Re-engagement Flow",
      status: "paused",
      budget: "5000.00",
      roi: "1.1"
    });
    
    // Seed Insights
    await storage.createInsight({
      userId: adminUser.id,
      title: "High Churn Segment Detected",
      description: "Enterprise users on legacy plans have a 15% higher churn rate. Consider targeted outreach.",
      impactScore: 85,
      type: "risk",
      status: "new"
    });
    await storage.createInsight({
      userId: adminUser.id,
      title: "Upsell Opportunity: API Add-on",
      description: "30% of active users hit the API limit last month but haven't upgraded.",
      impactScore: 92,
      type: "opportunity",
      status: "new"
    });
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed initial data
  await seedDatabase();

  // Users
  app.get(api.users.me.path, async (req, res) => {
    // In a real app this would use auth. For now, just return the seeded admin user
    const user = await storage.getUser(1);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  });

  // Metrics
  app.get(api.metrics.list.path, async (req, res) => {
    const metrics = await storage.getMetrics();
    res.json(metrics);
  });

  // Campaigns
  app.get(api.campaigns.list.path, async (req, res) => {
    const campaigns = await storage.getCampaigns();
    res.json(campaigns);
  });

  app.post(api.campaigns.create.path, async (req, res) => {
    try {
      const input = api.campaigns.create.input.parse(req.body);
      const campaign = await storage.createCampaign(input);
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

  app.patch(api.campaigns.update.path, async (req, res) => {
    try {
      const input = api.campaigns.update.input.parse(req.body);
      const campaign = await storage.updateCampaign(Number(req.params.id), input);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json(campaign);
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

  // Insights
  app.get(api.insights.list.path, async (req, res) => {
    const insights = await storage.getInsights();
    res.json(insights);
  });

  app.patch(api.insights.updateStatus.path, async (req, res) => {
    try {
      const input = api.insights.updateStatus.input.parse(req.body);
      const insight = await storage.updateInsightStatus(Number(req.params.id), input.status);
      if (!insight) {
        return res.status(404).json({ message: "Insight not found" });
      }
      res.json(insight);
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

  return httpServer;
}
