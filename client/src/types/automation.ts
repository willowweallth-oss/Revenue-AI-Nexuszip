import { z } from "zod";

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

export type TriggerType = z.infer<typeof TriggerType>;
export type ConditionType = z.infer<typeof ConditionType>;
export type ActionType = z.infer<typeof ActionType>;

export interface FlowNode {
  id: string;
  type: "trigger" | "condition" | "action";
  nodeType: TriggerType | ConditionType | ActionType;
  label: string;
  config: Record<string, any>;
  position: {
    x: number;
    y: number;
  };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface AutomationFlow {
  id: number;
  organizationId: number;
  userId: number;
  name: string;
  description?: string;
  isActive: boolean;
  nodes: FlowNode[];
  edges: FlowEdge[];
  version: number;
  lastActivatedAt?: string;
  executionCount: number;
  successCount: number;
  failureCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface FlowExecutionLog {
  id: number;
  flowId: number;
  organizationId: number;
  triggeredBy: string;
  status: "running" | "completed" | "failed";
  executionData?: Record<string, any>;
  errorMessage?: string;
  startedAt: string;
  completedAt?: string;
}

export interface NodeConfig {
  trigger?: {
    [key: string]: any;
  };
  condition?: {
    operator?: string;
    value?: any;
    field?: string;
  };
  action?: {
    [key: string]: any;
  };
}

export interface NodeDefinition {
  type: "trigger" | "condition" | "action";
  nodeType: string;
  label: string;
  icon: any;
  description: string;
  configFields: ConfigField[];
  category: string;
}

export interface ConfigField {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "multiselect" | "textarea" | "toggle";
  placeholder?: string;
  options?: { label: string; value: string }[];
  required?: boolean;
  defaultValue?: any;
}
