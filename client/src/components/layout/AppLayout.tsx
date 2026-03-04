import { Link, useLocation } from "wouter";
import { useTheme } from "@/components/theme-provider";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LayoutDashboard, Megaphone, Lightbulb, Settings, Moon, Sun, ChevronsUpDown, Command } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { Skeleton } from "@/components/ui/skeleton";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const { data: user, isLoading } = useUser();

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Campaigns", href: "/campaigns", icon: Megaphone },
    { name: "AI Insights", href: "/insights", icon: Lightbulb },
  ];

  return (
    <SidebarProvider style={{ "--sidebar-width": "16rem" } as React.CSSProperties}>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <Sidebar className="border-r border-border/50">
          <SidebarHeader className="h-16 flex items-center px-4 border-b border-border/50">
            <div className="flex items-center gap-2 font-semibold font-display text-lg tracking-tight">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Command className="h-4 w-4" />
              </div>
              RevAuto AI
            </div>
          </SidebarHeader>
          
          <SidebarContent className="py-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Platform
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigation.map((item) => {
                    const isActive = location === item.href;
                    return (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton 
                          asChild 
                          isActive={isActive}
                          className={`
                            h-10 px-3 rounded-lg transition-all duration-200
                            ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}
                          `}
                        >
                          <Link href={item.href} className="flex items-center gap-3">
                            <item.icon className={`h-4 w-4 ${isActive ? 'text-primary' : ''}`} />
                            <span>{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-border/50">
            {isLoading ? (
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-2 w-24" />
                </div>
              </div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start gap-3 h-12 px-2 hover:bg-secondary/50 rounded-xl">
                    <Avatar className="h-8 w-8 border border-border/50">
                      <AvatarImage src={user.avatarUrl || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start flex-1 text-sm overflow-hidden">
                      <span className="font-medium truncate w-full">{user.name}</span>
                      <span className="text-xs text-muted-foreground truncate w-full">{user.company}</span>
                    </div>
                    <ChevronsUpDown className="h-4 w-4 text-muted-foreground ml-auto" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer gap-2">
                    <Settings className="h-4 w-4" /> Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-col flex-1 min-w-0">
          <header className="h-16 flex items-center justify-between px-6 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors" />
              <div className="h-4 w-px bg-border"></div>
              <h1 className="font-medium font-display text-sm text-muted-foreground">
                {navigation.find(n => n.href === location)?.name || 'Platform'}
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="rounded-full h-9 w-9 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </header>

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
