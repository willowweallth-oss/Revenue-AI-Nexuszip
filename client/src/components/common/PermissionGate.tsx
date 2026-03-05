import { ReactNode } from "react";
import { useAuth } from "@/store/auth-context";

interface PermissionGateProps {
  children: ReactNode;
  roles?: string[];
  fallback?: ReactNode;
}

export function PermissionGate({ children, roles, fallback = null }: PermissionGateProps) {
  const { user, isAdmin } = useAuth();

  if (!user) return null;
  if (isAdmin) return <>{children}</>;
  
  if (roles && !roles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
