/*
  # Automation Flow Engine Tables

  1. New Tables
    - `automation_flows`
      - `id` (serial, primary key)
      - `organization_id` (integer, not null) - Multi-tenant isolation
      - `user_id` (integer, not null) - Flow creator
      - `name` (text, not null) - Flow name
      - `description` (text) - Flow description
      - `is_active` (boolean, default false) - Activation status
      - `nodes` (jsonb, not null) - Flow nodes configuration
      - `edges` (jsonb, not null) - Flow edges configuration
      - `version` (integer, default 1) - Version tracking
      - `last_activated_at` (timestamp) - Last activation time
      - `execution_count` (integer, default 0) - Total executions
      - `success_count` (integer, default 0) - Successful executions
      - `failure_count` (integer, default 0) - Failed executions
      - `created_at` (timestamp, default now())
      - `updated_at` (timestamp, default now())

    - `flow_execution_logs`
      - `id` (serial, primary key)
      - `flow_id` (integer, not null) - Reference to automation_flows
      - `organization_id` (integer, not null) - Multi-tenant isolation
      - `triggered_by` (text, not null) - Event that triggered the flow
      - `status` (text, not null) - running, completed, failed
      - `execution_data` (jsonb) - Execution context and results
      - `error_message` (text) - Error details if failed
      - `started_at` (timestamp, default now())
      - `completed_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for organization-scoped access
    - Add policies for role-based management

  3. Performance
    - Add indexes for common queries
    - Add foreign key constraints
*/

-- Create automation_flows table
CREATE TABLE IF NOT EXISTS automation_flows (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT false,
  nodes JSONB NOT NULL,
  edges JSONB NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  last_activated_at TIMESTAMP,
  execution_count INTEGER NOT NULL DEFAULT 0,
  success_count INTEGER NOT NULL DEFAULT 0,
  failure_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create flow_execution_logs table
CREATE TABLE IF NOT EXISTS flow_execution_logs (
  id SERIAL PRIMARY KEY,
  flow_id INTEGER NOT NULL,
  organization_id INTEGER NOT NULL,
  triggered_by TEXT NOT NULL,
  status TEXT NOT NULL,
  execution_data JSONB,
  error_message TEXT,
  started_at TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP,
  CONSTRAINT fk_flow
    FOREIGN KEY(flow_id)
    REFERENCES automation_flows(id)
    ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_automation_flows_org_id ON automation_flows(organization_id);
CREATE INDEX IF NOT EXISTS idx_automation_flows_user_id ON automation_flows(user_id);
CREATE INDEX IF NOT EXISTS idx_automation_flows_is_active ON automation_flows(is_active);
CREATE INDEX IF NOT EXISTS idx_flow_execution_logs_flow_id ON flow_execution_logs(flow_id);
CREATE INDEX IF NOT EXISTS idx_flow_execution_logs_org_id ON flow_execution_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_flow_execution_logs_status ON flow_execution_logs(status);

-- Enable Row Level Security
ALTER TABLE automation_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow_execution_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for automation_flows

-- Users can view flows in their organization
CREATE POLICY "Users can view flows in their organization"
  ON automation_flows
  FOR SELECT
  TO authenticated
  USING (organization_id = current_setting('app.current_organization_id')::integer);

-- Admins and managers can create flows
CREATE POLICY "Admins and managers can create flows"
  ON automation_flows
  FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id = current_setting('app.current_organization_id')::integer
    AND current_setting('app.current_user_role') IN ('admin', 'manager', 'CEO')
  );

-- Admins and managers can update flows
CREATE POLICY "Admins and managers can update flows"
  ON automation_flows
  FOR UPDATE
  TO authenticated
  USING (
    organization_id = current_setting('app.current_organization_id')::integer
    AND current_setting('app.current_user_role') IN ('admin', 'manager', 'CEO')
  )
  WITH CHECK (
    organization_id = current_setting('app.current_organization_id')::integer
  );

-- Admins can delete flows
CREATE POLICY "Admins can delete flows"
  ON automation_flows
  FOR DELETE
  TO authenticated
  USING (
    organization_id = current_setting('app.current_organization_id')::integer
    AND current_setting('app.current_user_role') IN ('admin', 'CEO')
  );

-- RLS Policies for flow_execution_logs

-- Users can view execution logs in their organization
CREATE POLICY "Users can view execution logs in their organization"
  ON flow_execution_logs
  FOR SELECT
  TO authenticated
  USING (organization_id = current_setting('app.current_organization_id')::integer);

-- System can insert execution logs
CREATE POLICY "System can insert execution logs"
  ON flow_execution_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (organization_id = current_setting('app.current_organization_id')::integer);

-- System can update execution logs
CREATE POLICY "System can update execution logs"
  ON flow_execution_logs
  FOR UPDATE
  TO authenticated
  USING (organization_id = current_setting('app.current_organization_id')::integer)
  WITH CHECK (organization_id = current_setting('app.current_organization_id')::integer);
