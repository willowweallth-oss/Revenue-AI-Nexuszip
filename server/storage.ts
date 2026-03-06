import { db } from "./db";
import {
  users, metrics, campaigns, insights, customers, notifications,
  type User, type InsertUser,
  type Metric, type InsertMetric,
  type Campaign, type InsertCampaign,
  type Insight, type InsertInsight,
  type Customer, type InsertCustomer,
  type Notification, type InsertNotification
} from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Metrics
  getMetrics(): Promise<Metric[]>;
  createMetric(metric: InsertMetric): Promise<Metric>;

  // Campaigns
  getCampaigns(): Promise<Campaign[]>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: number, campaign: Partial<InsertCampaign>): Promise<Campaign | undefined>;

  // Insights
  getInsights(): Promise<Insight[]>;
  createInsight(insight: InsertInsight): Promise<Insight>;
  updateInsightStatus(id: number, status: string): Promise<Insight | undefined>;

  // Customers
  getCustomers(): Promise<Customer[]>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;

  // Notifications
  getNotifications(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationRead(id: number, userId: number): Promise<Notification | undefined>;
  markAllNotificationsRead(userId: number): Promise<void>;
  deleteNotification(id: number, userId: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Metrics
  async getMetrics(): Promise<Metric[]> {
    return await db.select().from(metrics).orderBy(desc(metrics.date));
  }

  async createMetric(metric: InsertMetric): Promise<Metric> {
    const [newMetric] = await db.insert(metrics).values(metric).returning();
    return newMetric;
  }

  // Campaigns
  async getCampaigns(): Promise<Campaign[]> {
    return await db.select().from(campaigns).orderBy(desc(campaigns.createdAt));
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const [newCampaign] = await db.insert(campaigns).values(campaign).returning();
    return newCampaign;
  }

  async updateCampaign(id: number, updateData: Partial<InsertCampaign>): Promise<Campaign | undefined> {
    const [updated] = await db.update(campaigns)
      .set(updateData)
      .where(eq(campaigns.id, id))
      .returning();
    return updated;
  }

  // Insights
  async getInsights(): Promise<Insight[]> {
    return await db.select().from(insights).orderBy(desc(insights.createdAt));
  }

  async createInsight(insight: InsertInsight): Promise<Insight> {
    const [newInsight] = await db.insert(insights).values(insight).returning();
    return newInsight;
  }

  async updateInsightStatus(id: number, status: string): Promise<Insight | undefined> {
    const [updated] = await db.update(insights)
      .set({ status })
      .where(eq(insights.id, id))
      .returning();
    return updated;
  }

  // Customers
  async getCustomers(): Promise<Customer[]> {
    return await db.select().from(customers).orderBy(desc(customers.createdAt));
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [newCustomer] = await db.insert(customers).values(customer).returning();
    return newCustomer;
  }

  // Notifications
  async getNotifications(userId: number): Promise<Notification[]> {
    return await db.select().from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db.insert(notifications).values(notification).returning();
    return newNotification;
  }

  async markNotificationRead(id: number, userId: number): Promise<Notification | undefined> {
    const [updated] = await db.update(notifications)
      .set({ read: true })
      .where(and(eq(notifications.id, id), eq(notifications.userId, userId)))
      .returning();
    return updated;
  }

  async markAllNotificationsRead(userId: number): Promise<void> {
    await db.update(notifications)
      .set({ read: true })
      .where(eq(notifications.userId, userId));
  }

  async deleteNotification(id: number, userId: number): Promise<boolean> {
    const result = await db.delete(notifications)
      .where(and(eq(notifications.id, id), eq(notifications.userId, userId)))
      .returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();