import { db } from "./db";
import {
  automationFlows,
  flowExecutionLogs,
  type AutomationFlow,
  type InsertAutomationFlow,
  type FlowExecutionLog,
  type InsertFlowExecutionLog
} from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";

export class AutomationStorage {
  async getFlows(organizationId: number): Promise<AutomationFlow[]> {
    return await db
      .select()
      .from(automationFlows)
      .where(eq(automationFlows.organizationId, organizationId))
      .orderBy(desc(automationFlows.updatedAt));
  }

  async getFlow(id: number, organizationId: number): Promise<AutomationFlow | undefined> {
    const [flow] = await db
      .select()
      .from(automationFlows)
      .where(
        and(
          eq(automationFlows.id, id),
          eq(automationFlows.organizationId, organizationId)
        )
      );
    return flow;
  }

  async createFlow(flow: InsertAutomationFlow): Promise<AutomationFlow> {
    const [newFlow] = await db
      .insert(automationFlows)
      .values({
        ...flow,
        updatedAt: new Date()
      })
      .returning();
    return newFlow;
  }

  async updateFlow(
    id: number,
    organizationId: number,
    updates: Partial<InsertAutomationFlow>
  ): Promise<AutomationFlow | undefined> {
    const [updated] = await db
      .update(automationFlows)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(
        and(
          eq(automationFlows.id, id),
          eq(automationFlows.organizationId, organizationId)
        )
      )
      .returning();
    return updated;
  }

  async deleteFlow(id: number, organizationId: number): Promise<boolean> {
    const result = await db
      .delete(automationFlows)
      .where(
        and(
          eq(automationFlows.id, id),
          eq(automationFlows.organizationId, organizationId)
        )
      );
    return true;
  }

  async toggleFlowActive(
    id: number,
    organizationId: number,
    isActive: boolean
  ): Promise<AutomationFlow | undefined> {
    const [updated] = await db
      .update(automationFlows)
      .set({
        isActive,
        lastActivatedAt: isActive ? new Date() : undefined,
        updatedAt: new Date()
      })
      .where(
        and(
          eq(automationFlows.id, id),
          eq(automationFlows.organizationId, organizationId)
        )
      )
      .returning();
    return updated;
  }

  async getExecutionLogs(flowId: number, organizationId: number): Promise<FlowExecutionLog[]> {
    return await db
      .select()
      .from(flowExecutionLogs)
      .where(
        and(
          eq(flowExecutionLogs.flowId, flowId),
          eq(flowExecutionLogs.organizationId, organizationId)
        )
      )
      .orderBy(desc(flowExecutionLogs.startedAt))
      .limit(100);
  }

  async createExecutionLog(log: InsertFlowExecutionLog): Promise<FlowExecutionLog> {
    const [newLog] = await db
      .insert(flowExecutionLogs)
      .values(log)
      .returning();
    return newLog;
  }

  async incrementExecutionCount(id: number, success: boolean): Promise<void> {
    await db
      .update(automationFlows)
      .set({
        executionCount: db.$increment(automationFlows.executionCount, 1),
        successCount: success ? db.$increment(automationFlows.successCount, 1) : undefined,
        failureCount: !success ? db.$increment(automationFlows.failureCount, 1) : undefined
      })
      .where(eq(automationFlows.id, id));
  }
}

export const automationStorage = new AutomationStorage();
