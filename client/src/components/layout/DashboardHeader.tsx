import { useLocation } from "wouter";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { Breadcrumbs } from "./Breadcrumbs";
import { NotificationDropdown } from "./NotificationDropdown";
import { SearchCommand } from "./SearchCommand";

export function DashboardHeader() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        <SidebarTrigger className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors" />
        <div className="h-4 w-px bg-border hidden md:block"></div>
        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-2">
        <SearchCommand />

        <NotificationDropdown />

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
  );
}
