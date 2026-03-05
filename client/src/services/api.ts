import { api, buildUrl } from "@shared/routes";
import { queryClient } from "@/lib/queryClient";

class ApiService {
  private async request<T>(
    path: string,
    method: string = "GET",
    body?: any,
    params?: Record<string, string | number>
  ): Promise<T> {
    const url = buildUrl(path, params);
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "An unexpected error occurred");
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // Auth & User
  async getCurrentUser() {
    return this.request<any>("/api/users/me");
  }

  // Metrics
  async getMetrics() {
    return this.request<any[]>("/api/metrics");
  }

  // Campaigns
  async getCampaigns() {
    return this.request<any[]>("/api/campaigns");
  }

  async createCampaign(data: any) {
    return this.request<any>("/api/campaigns", "POST", data);
  }

  // Insights
  async getInsights() {
    return this.request<any[]>("/api/insights");
  }

  // Inbox
  async getConversations(params?: any) {
    // In a real app, this would be /api/conversations
    return [
      {
        id: "1",
        leadId: "l1",
        leadName: "John Doe",
        lastMessage: "I'm interested in the enterprise plan.",
        lastMessageAt: new Date().toISOString(),
        status: "new" as const,
        unreadCount: 2,
        qualificationScore: 85,
      },
      {
        id: "2",
        leadId: "l2",
        leadName: "Sarah Smith",
        lastMessage: "When can we schedule a demo?",
        lastMessageAt: new Date(Date.now() - 3600000).toISOString(),
        status: "qualified" as const,
        unreadCount: 0,
        qualificationScore: 92,
      }
    ];
  }

  async getMessages(conversationId: string) {
    return [
      {
        id: "m1",
        conversationId,
        senderId: "u1",
        senderName: "John Doe",
        content: "Hello, I saw your ad for the Revenue OS.",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        type: "text" as const,
      },
      {
        id: "m2",
        conversationId,
        senderId: "system",
        senderName: "AI Assistant",
        content: "Lead qualified: Score 85. Budget and Timeline confirmed.",
        timestamp: new Date(Date.now() - 7000000).toISOString(),
        type: "system" as const,
      },
      {
        id: "m3",
        conversationId,
        senderId: "u1",
        senderName: "John Doe",
        content: "I'm interested in the enterprise plan.",
        timestamp: new Date(Date.now() - 6800000).toISOString(),
        type: "text" as const,
      }
    ];
  }

  async getLeadDetails(leadId: string) {
    return {
      id: leadId,
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      company: "TechFlow Inc",
      source: "Google Ads",
      status: "Qualified",
      qualificationScore: 85,
      activityTimeline: [
        { id: "a1", type: "lead_created", content: "Lead captured from Google Ads", timestamp: new Date(Date.now() - 86400000).toISOString() },
        { id: "a2", type: "message_received", content: "Initial message received", timestamp: new Date(Date.now() - 7200000).toISOString() },
        { id: "a3", type: "ai_qualified", content: "AI Qualification completed: Score 85", timestamp: new Date(Date.now() - 7000000).toISOString() },
      ]
    };
  }
}

export const apiService = new ApiService();
