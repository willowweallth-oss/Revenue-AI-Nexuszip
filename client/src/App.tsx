import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import NotFound from "@/pages/not-found";

// Pages
import Dashboard from "@/pages/Dashboard";
import Campaigns from "@/pages/Campaigns";
import Insights from "@/pages/Insights";
import Analytics from "@/pages/Analytics";
import Customers from "@/pages/Customers";
import Unauthorized from "@/pages/Unauthorized";

function Router() {
  return (
    <Switch>
      <Route path="/unauthorized" component={Unauthorized} />

      <Route>
        <DashboardLayout>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/analytics" component={Analytics} />
            <Route path="/campaigns" component={Campaigns} />
            <Route path="/insights" component={Insights} />
            <Route path="/customers" component={Customers} />
            <Route path="/customers/:id" component={Customers} />

            <Route component={NotFound} />
          </Switch>
        </DashboardLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="revauto-theme">
        <TooltipProvider delayDuration={300}>
          <Router />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
