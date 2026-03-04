import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useMetrics() {
  return useQuery({
    queryKey: [api.metrics.list.path],
    queryFn: async () => {
      const res = await fetch(api.metrics.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch metrics");
      return api.metrics.list.responses[200].parse(await res.json());
    },
  });
}
