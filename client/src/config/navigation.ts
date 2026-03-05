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
  Inbox,
  MessageSquare,
  Zap,
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
    title: "Operating System",
    items: [
      {
        name: "Overview",
        href: "/",
        icon: LayoutDashboard,
        exact: true,
      },
      {
        name: "Smart Inbox",
        href: "/inbox",
        icon: Inbox,
        badge: "2",
      },
      {
        name: "Conversations",
        href: "/conversations",
        icon: MessageSquare,
      },
    ],
  },
  {
    title: "Revenue Engine",
    items: [
      {
        name: "Campaigns",
        href: "/campaigns",
        icon: Megaphone,
      },
      {
        name: "Automation",
        href: "/automation",
        icon: Zap,
        badge: "New",
      },
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
    ],
  },
  {
    title: "Intelligence",
    items: [
      {
        name: "AI Insights",
        href: "/insights",
        icon: Lightbulb,
        badge: "New",
      },
      {
        name: "Analytics",
        href: "/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Management",
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
