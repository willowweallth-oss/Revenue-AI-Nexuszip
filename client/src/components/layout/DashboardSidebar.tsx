import { useAuth } from "@/store/auth-context";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator
} from "@/components/ui/sidebar";
import { navigationConfig } from "@/config/navigation";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { UsageLimitDisplay } from "@/components/dashboard/UsageLimitDisplay";
import { Sparkles, Building2, ChevronDown, LogOut, Settings, User } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function DashboardSidebar() {
  const [location] = useLocation();
  const { user, organization, isAdmin } = useAuth();

  const filteredNav = navigationConfig.filter(section => {
    if (!section.requiredRole) return true;
    const userRole = user?.role as any;
    return section.requiredRole.includes(userRole);
  });

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r border-border/50">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="hover-elevate transition-all">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <Building2 className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none overflow-hidden">
                <span className="font-semibold truncate">{organization?.name || "Loading..."}</span>
                <span className="text-xs text-muted-foreground capitalize">{organization?.tier || "Basic"} Plan</span>
              </div>
              <ChevronDown className="ml-auto size-4 opacity-50 shrink-0" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="start" side="right" sideOffset={10}>
            <DropdownMenuLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Organizations</DropdownMenuLabel>
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <div className="flex size-6 items-center justify-center rounded bg-muted">
                <Building2 className="size-3" />
              </div>
              <span className="flex-1 truncate">{organization?.name}</span>
              <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase font-bold">Active</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-muted-foreground">
              <Plus className="mr-2 size-4" />
              <span>Create Organization</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>

      <SidebarContent className="py-2">
        {filteredNav.map((section, idx) => (
          <div key={section.title}>
            <SidebarGroup>
              <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/70 px-4 mb-2">
                {section.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => {
                    const isActive = location === item.href;
                    return (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton 
                          asChild 
                          tooltip={item.name}
                          isActive={isActive}
                          className={cn(
                            "h-10 px-4 transition-all duration-200 rounded-none border-l-2 border-transparent",
                            isActive && "bg-primary/5 text-primary font-semibold border-l-primary"
                          )}
                        >
                          <Link href={item.href} className="flex items-center gap-3">
                            <item.icon className={cn("size-4 shrink-0", isActive && "text-primary")} />
                            <span className="truncate">{item.name}</span>
                            {item.badge && (
                              <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary px-1">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            {idx < filteredNav.length - 1 && <SidebarSeparator className="mx-4 my-2 opacity-50" />}
          </div>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4 gap-4 bg-muted/5">
        <div className="space-y-4 px-2">
          <UsageLimitDisplay label="Leads" used={450} limit={1000} />
          <UsageLimitDisplay label="AI Tokens" used={8.5} limit={10} unit="M" />
        </div>
        
        <div className="rounded-xl bg-primary/5 p-4 border border-primary/10 relative overflow-hidden group">
          <div className="absolute -right-2 -top-2 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Sparkles className="size-12 text-primary" />
          </div>
          <div className="flex items-center gap-2 mb-2 relative z-10">
            <Sparkles className="size-3.5 text-primary" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Pro Tip</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed relative z-10">
            Scale your outreach by connecting your custom domain in settings.
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="hover-elevate mt-2">
              <Avatar className="size-8 rounded-lg">
                <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5 leading-none overflow-hidden">
                <span className="font-semibold truncate">{user?.name || "User"}</span>
                <span className="text-[10px] text-muted-foreground truncate">{user?.email}</span>
              </div>
              <ChevronDown className="ml-auto size-4 opacity-50 shrink-0" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" side="right" sideOffset={10}>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <User className="size-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <Settings className="size-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="size-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function Plus({ className, ...props }: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
