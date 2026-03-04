import { z } from 'zod';
import { insertUserSchema, insertMetricSchema, insertCampaignSchema, insertInsightSchema, users, metrics, campaigns, insights } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  users: {
    me: {
      method: 'GET' as const,
      path: '/api/users/me' as const,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        404: errorSchemas.notFound,
      }
    }
  },
  metrics: {
    list: {
      method: 'GET' as const,
      path: '/api/metrics' as const,
      responses: {
        200: z.array(z.custom<typeof metrics.$inferSelect>()),
      }
    }
  },
  campaigns: {
    list: {
      method: 'GET' as const,
      path: '/api/campaigns' as const,
      responses: {
        200: z.array(z.custom<typeof campaigns.$inferSelect>()),
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/campaigns' as const,
      input: insertCampaignSchema,
      responses: {
        201: z.custom<typeof campaigns.$inferSelect>(),
        400: errorSchemas.validation,
      }
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/campaigns/:id' as const,
      input: insertCampaignSchema.partial(),
      responses: {
        200: z.custom<typeof campaigns.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      }
    }
  },
  insights: {
    list: {
      method: 'GET' as const,
      path: '/api/insights' as const,
      responses: {
        200: z.array(z.custom<typeof insights.$inferSelect>()),
      }
    },
    updateStatus: {
      method: 'PATCH' as const,
      path: '/api/insights/:id/status' as const,
      input: z.object({ status: z.string() }),
      responses: {
        200: z.custom<typeof insights.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
