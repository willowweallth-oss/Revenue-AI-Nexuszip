import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AuthProvider, useAuth } from "@/store/auth-context";
import NotFound from "@/pages/not-found";

// Pages
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/pages/Dashboard";
import Campaigns from "@/pages/Campaigns";
import Insights from "@/pages/Insights";
import Analytics from "@/pages/Analytics";
import Customers from "@/pages/Customers";
import Unauthorized from "@/pages/Unauthorized";
import InboxPage from "@/pages/inbox/InboxPage";
import AutomationPage from "@/pages/AutomationPage";
import AutomationBuilder from "@/pages/AutomationBuilder";
import Settings from "@/pages/Settings";
import Help from "@/pages/Help";
import Conversations from "@/pages/Conversations";
import Login from "@/pages/Login";
import ForgotPassword from "@/pages/ForgotPassword";

function ProtectedRoute({ component: Component, ...rest }: any) {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <Redirect to="/login" />;

  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Onboarding} />
      <Route path="/login" component={Login} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/unauthorized" component={Unauthorized} />

      <Route path="/dashboard">
        <DashboardLayout>
          <Switch>
            <Route path="/">
              {(params) => <ProtectedRoute component={Dashboard} {...params} />}
            </Route>
            <Route path="/inbox">
              {(params) => <ProtectedRoute component={InboxPage} {...params} />}
            </Route>
            <Route path="/conversations">
              {(params) => <ProtectedRoute component={Conversations} {...params} />}
            </Route>
            <Route path="/analytics">
              {(params) => <ProtectedRoute component={Analytics} {...params} />}
            </Route>
            <Route path="/campaigns">
              {(params) => <ProtectedRoute component={Campaigns} {...params} />}
            </Route>
            <Route path="/automation">
              {(params) => <ProtectedRoute component={AutomationPage} {...params} />}
            </Route>
            <Route path="/automation/builder/:id">
              {(params) => <ProtectedRoute component={AutomationBuilder} {...params} />}
            </Route>
            <Route path="/insights">
              {(params) => <ProtectedRoute component={Insights} {...params} />}
            </Route>
            <Route path="/customers">
              {(params) => <ProtectedRoute component={Customers} {...params} />}
            </Route>
            <Route path="/settings">
              {(params) => <ProtectedRoute component={Settings} {...params} />}
            </Route>
            <Route path="/help">
              {(params) => <ProtectedRoute component={Help} {...params} />}
            </Route>

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
      <AuthProvider>
        <ThemeProvider defaultTheme="system" storageKey="revauto-theme">
          <TooltipProvider delayDuration={300}>
            <Router />
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;