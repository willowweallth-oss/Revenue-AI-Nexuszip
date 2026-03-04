import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

export function useInsights() {
  return useQuery({
    queryKey: [api.insights.list.path],
    queryFn: async () => {
      const res = await fetch(api.insights.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch insights");
      return api.insights.list.responses[200].parse(await res.json());
    },
  });
}

export function useUpdateInsightStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const validated = api.insights.updateStatus.input.parse({ status });
      const url = buildUrl(api.insights.updateStatus.path, { id });
      
      const res = await fetch(url, {
        method: api.insights.updateStatus.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to update insight status");
      return api.insights.updateStatus.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.insights.list.path] });
    },
  });
}
