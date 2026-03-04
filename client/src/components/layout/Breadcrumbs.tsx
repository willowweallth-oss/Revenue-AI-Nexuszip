import { Link, useLocation } from "wouter";
import { ChevronRight, Chrome as Home } from "lucide-react";
import { navigationConfig } from "@/config/navigation";

export function Breadcrumbs() {
  const [location] = useLocation();

  const breadcrumbs = getBreadcrumbs(location);

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center gap-2 text-sm hidden md:flex">
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>

      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center gap-2">
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
          {index === breadcrumbs.length - 1 ? (
            <span className="font-medium text-foreground">{crumb.name}</span>
          ) : (
            <Link
              href={crumb.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {crumb.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}

function getBreadcrumbs(path: string) {
  const breadcrumbs: Array<{ name: string; href: string }> = [];

  for (const section of navigationConfig) {
    for (const item of section.items) {
      if (item.href === path && path !== '/') {
        breadcrumbs.push({ name: item.name, href: item.href });
        break;
      }

      if (item.children) {
        for (const child of item.children) {
          if (child.href === path) {
            breadcrumbs.push({ name: item.name, href: item.href });
            breadcrumbs.push({ name: child.name, href: child.href });
            break;
          }
        }
      }
    }
  }

  return breadcrumbs;
}
