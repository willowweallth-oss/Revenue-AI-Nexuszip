import { ReactNode } from "react";
import { Redirect } from "wouter";
import { useUser } from "@/hooks/use-user";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: ('CEO' | 'Admin' | 'User')[];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = "/unauthorized"
}: ProtectedRouteProps) {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4 w-full max-w-md p-8">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  if (requiredRole && !requiredRole.includes(user.role as any)) {
    return <Redirect to={redirectTo} />;
  }

  return <>{children}</>;
}
