import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { UserProfileDropdown } from "./UserProfileDropdown";
import { navigationConfig } from "@/config/navigation";
import { useUser } from "@/hooks/use-user";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSidebar() {
  const [location] = useLocation();
  const { data: user, isLoading } = useUser();

  const filteredNavigation = navigationConfig.filter(section => {
    if (!section.requiredRole) return true;
    if (!user) return false;
    return section.requiredRole.includes(user.role as any);
  });

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="h-16 flex items-center px-4 border-b border-border/50">
        <Link href="/" className="flex items-center gap-2 font-semibold font-display text-lg tracking-tight hover:opacity-80 transition-opacity">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          SaaS Platform
        </Link>
      </SidebarHeader>

      <SidebarContent className="py-4">
        {filteredNavigation.map((section, idx) => (
          <div key={section.title}>
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                {section.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => {
                    const isActive = item.exact
                      ? location === item.href
                      : location.startsWith(item.href);

                    if (item.children) {
                      return (
                        <SidebarMenuItem key={item.name}>
                          <SidebarMenuButton
                            className={`
                              h-10 px-3 rounded-lg transition-all duration-200
                              ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}
                            `}
                          >
                            <item.icon className={`h-4 w-4 ${isActive ? 'text-primary' : ''}`} />
                            <span>{item.name}</span>
                            {item.badge && (
                              <span className="ml-auto bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
                                {item.badge}
                              </span>
                            )}
                          </SidebarMenuButton>
                          <SidebarMenu className="ml-6 mt-1 space-y-1">
                            {item.children.map((child) => {
                              const childActive = location === child.href;
                              return (
                                <SidebarMenuItem key={child.name}>
                                  <SidebarMenuButton
                                    asChild
                                    isActive={childActive}
                                    className={`
                                      h-9 px-3 rounded-lg transition-all duration-200
                                      ${childActive ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}
                                    `}
                                  >
                                    <Link href={child.href} className="flex items-center gap-3">
                                      <child.icon className={`h-3.5 w-3.5 ${childActive ? 'text-primary' : ''}`} />
                                      <span className="text-sm">{child.name}</span>
                                      {child.badge && (
                                        <span className="ml-auto bg-primary/20 text-primary text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                                          {child.badge}
                                        </span>
                                      )}
                                    </Link>
                                  </SidebarMenuButton>
                                </SidebarMenuItem>
                              );
                            })}
                          </SidebarMenu>
                        </SidebarMenuItem>
                      );
                    }

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
                            {item.badge && (
                              <span className="ml-auto bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
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
            {idx < filteredNavigation.length - 1 && <SidebarSeparator className="my-4" />}
          </div>
        ))}
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
          <UserProfileDropdown user={user} />
        ) : null}
      </SidebarFooter>
    </Sidebar>
  );
}
