import { ReactNode } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/store/auth-context";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "@/components/ui/button";

function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <pre className="text-sm bg-muted p-4 rounded mb-4 max-w-full overflow-auto">
        {error.message}
      </pre>
      <Button onClick={resetErrorBoundary}>Try again</Button>
    </div>
  );
}

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AuthProvider>
        <SidebarProvider
          defaultOpen={true}
          style={{ "--sidebar-width": "16rem" } as React.CSSProperties}
        >
          <div className="flex h-screen w-full bg-background overflow-hidden">
            <DashboardSidebar />

            <div className="flex flex-col flex-1 min-w-0">
              <DashboardHeader />

              <main className="flex-1 overflow-auto bg-muted/20">
                <div className="p-6 md:p-8 max-w-7xl mx-auto w-full h-full">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
