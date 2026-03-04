import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

export function useCampaigns() {
  return useQuery({
    queryKey: [api.campaigns.list.path],
    queryFn: async () => {
      const res = await fetch(api.campaigns.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch campaigns");
      return api.campaigns.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: z.infer<typeof api.campaigns.create.input>) => {
      const validated = api.campaigns.create.input.parse(data);
      const res = await fetch(api.campaigns.create.path, {
        method: api.campaigns.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to create campaign");
      return api.campaigns.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.campaigns.list.path] });
    },
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & z.infer<typeof api.campaigns.update.input>) => {
      const validated = api.campaigns.update.input.parse(updates);
      const url = buildUrl(api.campaigns.update.path, { id });
      
      const res = await fetch(url, {
        method: api.campaigns.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to update campaign");
      return api.campaigns.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.campaigns.list.path] });
    },
  });
}
