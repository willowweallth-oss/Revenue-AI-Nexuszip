import { ReactNode } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { SidebarProvider } from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
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
  );
}
