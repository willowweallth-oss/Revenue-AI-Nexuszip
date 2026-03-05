import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, Organization, Role } from "@/types/auth";
import { apiService } from "@/services/api";

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  isLoading: boolean;
  isAdmin: boolean;
  isManager: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/users/me"],
    queryFn: () => apiService.getCurrentUser(),
  });

  // Mock organization for now based on user data
  const organization: Organization | null = user ? {
    id: user.organizationId,
    name: user.company,
    slug: "acme-corp",
    tier: "growth",
  } : null;

  const value = {
    user,
    organization,
    isLoading,
    isAdmin: user?.role === "CEO" || user?.role === "admin",
    isManager: user?.role === "manager",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
