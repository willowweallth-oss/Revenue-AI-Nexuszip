import { db } from "./db";
import {
  users, metrics, campaigns, insights, customers,
  type User, type InsertUser,
  type Metric, type InsertMetric,
  type Campaign, type InsertCampaign,
  type Insight, type InsertInsight,
  type Customer, type InsertCustomer
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

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
}

export const storage = new DatabaseStorage();