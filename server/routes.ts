import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { automationStorage } from "./automation-storage";
import { automationEngine } from "./automation-engine";
import { api } from "@shared/routes";
import { z } from "zod";
import { verifyAuth, AuthRequest } from "./middleware/auth";
import { WebSocketServer, WebSocket } from "ws";
import { log } from "./index";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Setup WebSocket Server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const clients = new Set<WebSocket>();

  wss.on('connection', (ws) => {
    clients.add(ws);
    log("[ws] Client connected", "websocket");
    
    ws.on('close', () => {
      clients.delete(ws);
      log("[ws] Client disconnected", "websocket");
    });
  });

  const broadcast = (data: any) => {
    const message = JSON.stringify(data);
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

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

  app.post("/api/automation/execute-flow", async (req: AuthRequest, res) => {
    try {
      const { flowId, payload } = z.object({
        flowId: z.union([z.string(), z.number()]),
        payload: z.any()
      }).parse(req.body);

      const organizationId = 1; // Placeholder
      const id = typeof flowId === 'string' ? parseInt(flowId) : flowId;

      const result = await automationEngine.executeFlow({
        flowId: id,
        organizationId,
        payload,
        broadcast
      });

      res.json(result);
    } catch (err: any) {
      log(`[api] Flow execution error: ${err.message}`, "error");
      res.status(400).json({ message: err.message });
    }
  });

  // Notifications
  app.get("/api/notifications", async (req: AuthRequest, res) => {
    const userId = 1; // Placeholder
    let notifications = await storage.getNotifications(userId);
    
    if (notifications.length === 0) {
      await storage.createNotification({
        userId,
        organizationId: 1,
        title: "Welcome to RevAuto AI",
        description: "Your revenue operating system is ready. Start by exploring your dashboard.",
        type: "info",
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
  
  return httpServer;
}