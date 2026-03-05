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
}

export const apiService = new ApiService();
