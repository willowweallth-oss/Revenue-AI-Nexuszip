import { pgTable, text, serial, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Flow Node Types
export const TriggerType = z.enum([
  "lead_created",
  "lead_status_changed",
  "message_received",
  "lead_score_threshold",
  "tag_added",
  "time_delay",
  "webhook_received"
]);

export const ConditionType = z.enum([
  "lead_score_greater_than",
  "lead_score_less_than",
  "has_tag",
  "source_equals",
  "status_equals",
  "field_equals",
  "field_contains",
  "time_window"
]);

export const ActionType = z.enum([
  "send_message",
  "send_email",
  "assign_agent",
  "update_status",
  "add_tag",
  "remove_tag",
  "update_field",
  "create_task",
  "webhook_post",
  "wait"
]);

// Flow Node Schema
export const FlowNodeSchema = z.object({
  id: z.string(),
  type: z.enum(["trigger", "condition", "action"]),
  nodeType: z.union([TriggerType, ConditionType, ActionType]),
  label: z.string(),
  config: z.record(z.any()),
  position: z.object({
    x: z.number(),
    y: z.number()
  })
});

// Flow Edge Schema
export const FlowEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  label: z.string().optional()
});

// Automation Flows Table
export const automationFlows = pgTable("automation_flows", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(false),
  nodes: jsonb("nodes").notNull().$type<z.infer<typeof FlowNodeSchema>[]>(),
  edges: jsonb("edges").notNull().$type<z.infer<typeof FlowEdgeSchema>[]>(),
  version: integer("version").notNull().default(1),
  lastActivatedAt: timestamp("last_activated_at"),
  executionCount: integer("execution_count").notNull().default(0),
  successCount: integer("success_count").notNull().default(0),
  failureCount: integer("failure_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Flow Execution Log Table
export const flowExecutionLogs = pgTable("flow_execution_logs", {
  id: serial("id").primaryKey(),
  flowId: integer("flow_id").notNull(),
  organizationId: integer("organization_id").notNull(),
  triggeredBy: text("triggered_by").notNull(),
  status: text("status").notNull(), // running, completed, failed
  executionData: jsonb("execution_data"),
  errorMessage: text("error_message"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

// Relations
export const automationFlowsRelations = relations(automationFlows, ({ many }) => ({
  executionLogs: many(flowExecutionLogs),
}));

export const flowExecutionLogsRelations = relations(flowExecutionLogs, ({ one }) => ({
  flow: one(automationFlows, {
    fields: [flowExecutionLogs.flowId],
    references: [automationFlows.id],
  }),
}));

// Insert/Select Schemas
export const insertAutomationFlowSchema = createInsertSchema(automationFlows).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  executionCount: true,
  successCount: true,
  failureCount: true,
});

export const selectAutomationFlowSchema = createSelectSchema(automationFlows);

export const insertFlowExecutionLogSchema = createInsertSchema(flowExecutionLogs).omit({
  id: true,
  startedAt: true,
});

// Types
export type AutomationFlow = typeof automationFlows.$inferSelect;
export type InsertAutomationFlow = z.infer<typeof insertAutomationFlowSchema>;
export type FlowNode = z.infer<typeof FlowNodeSchema>;
export type FlowEdge = z.infer<typeof FlowEdgeSchema>;
export type FlowExecutionLog = typeof flowExecutionLogs.$inferSelect;
export type InsertFlowExecutionLog = z.infer<typeof insertFlowExecutionLogSchema>;
