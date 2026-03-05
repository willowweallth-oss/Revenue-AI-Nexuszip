import { z } from "zod";

export const Role = z.enum(["admin", "manager", "agent"]);
export type Role = z.infer<typeof Role>;

export const SubscriptionTier = z.enum(["starter", "growth", "enterprise"]);
export type SubscriptionTier = z.infer<typeof SubscriptionTier>;

export interface Organization {
  id: number;
  name: string;
  slug: string;
  tier: SubscriptionTier;
  avatarUrl?: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
  organizationId: number;
  avatarUrl?: string;
}

export interface UsageMetrics {
  leadsUsed: number;
  leadsLimit: number;
  aiTokensUsed: number;
  aiTokensLimit: number;
}
