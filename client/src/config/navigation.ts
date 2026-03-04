import {
  LayoutDashboard,
  Megaphone,
  Lightbulb,
  Users,
  Settings,
  BarChart3,
  Bell,
  CreditCard,
  Shield,
  Package,
  FileText,
  HelpCircle,
  type LucideIcon
} from "lucide-react";

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  exact?: boolean;
  children?: NavigationItem[];
}

export interface NavigationSection {
  title: string;
  items: NavigationItem[];
  requiredRole?: ('CEO' | 'Admin' | 'User')[];
}

export const navigationConfig: NavigationSection[] = [
  {
    title: "Main",
    items: [
      {
        name: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
        exact: true,
      },
      {
        name: "Analytics",
        href: "/analytics",
        icon: BarChart3,
      },
      {
        name: "Campaigns",
        href: "/campaigns",
        icon: Megaphone,
      },
      {
        name: "AI Insights",
        href: "/insights",
        icon: Lightbulb,
        badge: "New",
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        name: "Customers",
        href: "/customers",
        icon: Users,
        children: [
          {
            name: "All Customers",
            href: "/customers/all",
            icon: Users,
          },
          {
            name: "Segments",
            href: "/customers/segments",
            icon: Package,
          },
        ],
      },
      {
        name: "Reports",
        href: "/reports",
        icon: FileText,
        children: [
          {
            name: "Revenue Reports",
            href: "/reports/revenue",
            icon: BarChart3,
          },
          {
            name: "Usage Reports",
            href: "/reports/usage",
            icon: FileText,
          },
        ],
      },
    ],
  },
  {
    title: "Admin",
    items: [
      {
        name: "Settings",
        href: "/settings",
        icon: Settings,
        children: [
          {
            name: "General",
            href: "/settings/general",
            icon: Settings,
          },
          {
            name: "Notifications",
            href: "/settings/notifications",
            icon: Bell,
          },
          {
            name: "Billing",
            href: "/settings/billing",
            icon: CreditCard,
          },
          {
            name: "Security",
            href: "/settings/security",
            icon: Shield,
          },
        ],
      },
      {
        name: "Help",
        href: "/help",
        icon: HelpCircle,
      },
    ],
    requiredRole: ['CEO', 'Admin'],
  },
];
