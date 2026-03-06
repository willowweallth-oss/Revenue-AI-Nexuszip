import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AutomationFlow } from "@/types/automation";
import { apiRequest } from "@/lib/queryClient";

const API_BASE = "/api/automation";

export function useAutomationFlows() {
  return useQuery({
    queryKey: [API_BASE, "flows"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/flows`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch flows");
      return res.json() as Promise<AutomationFlow[]>;
    },
  });
}

export function useAutomationFlow(id: number | null) {
  return useQuery({
    queryKey: [API_BASE, "flows", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await fetch(`${API_BASE}/flows/${id}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch flow");
      return res.json() as Promise<AutomationFlow>;
    },
    enabled: !!id,
  });
}

export function useCreateFlow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<AutomationFlow>) => {
      const res = await fetch(`${API_BASE}/flows`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to create flow");
      return res.json() as Promise<AutomationFlow>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_BASE, "flows"] });
    },
  });
}

export function useUpdateFlow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<AutomationFlow> & { id: number }) => {
      const res = await fetch(`${API_BASE}/flows/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update flow");
      return res.json() as Promise<AutomationFlow>;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [API_BASE, "flows"] });
      queryClient.invalidateQueries({ queryKey: [API_BASE, "flows", variables.id] });
    },
  });
}

export function useDeleteFlow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API_BASE}/flows/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete flow");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_BASE, "flows"] });
    },
  });
}

export function useToggleFlowActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const res = await fetch(`${API_BASE}/flows/${id}/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to toggle flow");
      return res.json() as Promise<AutomationFlow>;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [API_BASE, "flows"] });
      queryClient.invalidateQueries({ queryKey: [API_BASE, "flows", variables.id] });
    },
  });
}

export function useExecuteFlow() {
  return useMutation({
    mutationFn: async ({ flowId, payload }: { flowId: number; payload: any }) => {
      const res = await apiRequest("POST", `${API_BASE}/execute-flow`, { flowId, payload });
      return res.json();
    },
  });
}