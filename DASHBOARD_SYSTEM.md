# High-End SaaS Dashboard Layout System

A comprehensive, modular dashboard layout system built with TypeScript, React, and modern UI components.

## Architecture Overview

The dashboard system is built with a clean, modular architecture that separates concerns and promotes scalability.

### Core Components

```
client/src/components/layout/
├── DashboardLayout.tsx          # Main layout wrapper
├── DashboardSidebar.tsx         # Collapsible sidebar navigation
├── DashboardHeader.tsx          # Top navigation bar
├── Breadcrumbs.tsx              # Dynamic breadcrumb navigation
├── UserProfileDropdown.tsx      # User profile menu
├── NotificationDropdown.tsx     # Notification center UI
├── SearchCommand.tsx            # Global search (⌘K)
└── ProtectedRoute.tsx           # Route protection wrapper
```

### Configuration

```
client/src/config/
└── navigation.ts                # Centralized navigation config
```

## Features

### 1. Persistent Sidebar Navigation

The sidebar is fully collapsible and includes:
- Multi-level navigation support (parent/child items)
- Active state styling with visual indicators
- Role-based navigation filtering
- Icon support for all navigation items
- Badge support for new/beta features
- Smooth animations and transitions

```typescript
// Example navigation item with children
{
  name: "Customers",
  href: "/customers",
  icon: Users,
  children: [
    { name: "All Customers", href: "/customers/all", icon: Users },
    { name: "Segments", href: "/customers/segments", icon: Package }
  ]
}
```

### 2. Top Navigation Bar

Features include:
- Collapsible sidebar trigger
- Dynamic breadcrumbs
- Global search (⌘K shortcut)
- Notification dropdown
- Theme toggle (dark/light mode)
- Sticky positioning with blur effect

### 3. Breadcrumb Navigation

Automatically generated breadcrumbs based on:
- Current route
- Navigation hierarchy
- Multi-level navigation support

### 4. User Profile Dropdown

Includes quick access to:
- User profile
- Account settings
- Billing management
- Support resources
- Logout functionality

### 5. Notification System UI

Real-time notification center with:
- Unread count badge
- Mark as read/unread
- Delete notifications
- Type-based color coding (success, warning, error, info)
- Scrollable notification list
- Time stamps

### 6. Global Search Command

Keyboard-first search interface:
- Trigger with `⌘K` (Mac) or `Ctrl+K` (Windows)
- Search all navigation items
- Quick navigation to any page
- Grouped results by section

### 7. Role-Based Access Control

Navigation sections can be restricted by role:

```typescript
{
  title: "Admin",
  items: [...],
  requiredRole: ['CEO', 'Admin']  // Only visible to these roles
}
```

### 8. Protected Routes

Wrap routes that require authentication or specific roles:

```typescript
<ProtectedRoute requiredRole={['Admin']}>
  <AdminPage />
</ProtectedRoute>
```

### 9. Mobile Adaptive Navigation

- Automatically adapts to mobile screens
- Touch-friendly interface
- Responsive breakpoints
- Mobile-optimized search button

## Usage

### Basic Implementation

```typescript
import { DashboardLayout } from "@/components/layout/DashboardLayout";

function App() {
  return (
    <DashboardLayout>
      <YourPageContent />
    </DashboardLayout>
  );
}
```

### Adding Navigation Items

Edit `client/src/config/navigation.ts`:

```typescript
export const navigationConfig: NavigationSection[] = [
  {
    title: "Main",
    items: [
      {
        name: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
        exact: true,  // Exact match only
      },
      {
        name: "Analytics",
        href: "/analytics",
        icon: BarChart3,
        badge: "New",  // Optional badge
      }
    ]
  }
];
```

### Multi-Level Navigation

```typescript
{
  name: "Settings",
  href: "/settings",
  icon: Settings,
  children: [
    {
      name: "General",
      href: "/settings/general",
      icon: Settings
    },
    {
      name: "Security",
      href: "/settings/security",
      icon: Shield
    }
  ]
}
```

### Role-Based Navigation

```typescript
{
  title: "Admin",
  items: [...],
  requiredRole: ['CEO', 'Admin']  // Only CEO and Admin can see
}
```

### Protected Routes

```typescript
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";

<Route path="/admin">
  <ProtectedRoute requiredRole={['Admin']}>
    <AdminDashboard />
  </ProtectedRoute>
</Route>
```

## Customization

### Branding

Update the logo in `DashboardSidebar.tsx`:

```typescript
<SidebarHeader>
  <Link href="/">
    <div className="your-logo">Your Brand</div>
  </Link>
</SidebarHeader>
```

### Colors and Theme

The system uses CSS variables for theming. Update in `client/src/index.css`:

```css
:root {
  --primary: 243 75% 59%;
  --sidebar: 0 0% 98%;
  /* etc. */
}
```

### Sidebar Width

Adjust in `DashboardLayout.tsx`:

```typescript
<SidebarProvider
  style={{ "--sidebar-width": "16rem" } as React.CSSProperties}
>
```

## Keyboard Shortcuts

- `⌘K` or `Ctrl+K` - Open global search
- `⌘B` or `Ctrl+B` - Toggle sidebar (built into Sidebar component)

## Mobile Responsiveness

The layout automatically adapts to mobile screens:
- Sidebar becomes a slide-out drawer
- Search button replaces search bar
- Breadcrumbs hidden on small screens
- Touch-optimized spacing and targets

## TypeScript Support

All components are fully typed with TypeScript:

```typescript
interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  exact?: boolean;
  children?: NavigationItem[];
}
```

## Integration with Authentication

The system is ready for authentication integration:

1. User data is fetched via `useUser()` hook
2. Protected routes check authentication status
3. Role-based navigation filtering
4. User profile dropdown shows user info

To integrate your auth system, update the `useUser()` hook in `client/src/hooks/use-user.ts`.

## Performance Optimizations

- Lazy loading of route components
- Memoized navigation items
- Optimized re-renders with React.memo where appropriate
- Efficient state management

## Accessibility

- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader friendly

## File Structure

```
client/src/
├── components/
│   ├── layout/                  # Layout components
│   │   ├── DashboardLayout.tsx
│   │   ├── DashboardSidebar.tsx
│   │   ├── DashboardHeader.tsx
│   │   ├── Breadcrumbs.tsx
│   │   ├── UserProfileDropdown.tsx
│   │   ├── NotificationDropdown.tsx
│   │   ├── SearchCommand.tsx
│   │   └── ProtectedRoute.tsx
│   └── ui/                      # Shadcn UI components
├── config/
│   └── navigation.ts            # Navigation configuration
├── pages/                       # Route pages
│   ├── Dashboard.tsx
│   ├── Analytics.tsx
│   ├── Campaigns.tsx
│   ├── Insights.tsx
│   ├── Customers.tsx
│   └── Unauthorized.tsx
└── App.tsx                      # Router configuration
```

## Best Practices

1. **Keep Navigation Config Centralized**: All navigation items in `navigation.ts`
2. **Use Consistent Icons**: Import from `lucide-react` for consistency
3. **Follow Naming Conventions**: Use descriptive names for routes and components
4. **Implement Loading States**: Show skeletons while data loads
5. **Handle Errors Gracefully**: Provide user-friendly error messages
6. **Test Across Devices**: Ensure mobile responsiveness
7. **Document Changes**: Update navigation config when adding routes

## Extending the System

### Adding a New Page

1. Create page component in `client/src/pages/`
2. Add route in `App.tsx`
3. Add navigation item in `navigation.ts`
4. Optionally wrap with `ProtectedRoute` for auth

### Adding a New Notification Type

Update `NotificationDropdown.tsx`:

```typescript
type: 'info' | 'success' | 'warning' | 'error' | 'custom'
```

### Customizing Search

Update `SearchCommand.tsx` to search custom data sources beyond navigation.

## Troubleshooting

### Sidebar Not Collapsing
- Check SidebarProvider is wrapping the layout
- Verify sidebar width CSS variable is set

### Navigation Not Showing
- Verify user role matches `requiredRole` in config
- Check navigation config is properly imported

### Breadcrumbs Not Appearing
- Ensure route exists in navigation config
- Check exact/non-exact matching settings

## Support and Maintenance

This system is built to be maintainable and extensible. When making changes:

1. Update the navigation config first
2. Test on mobile and desktop
3. Verify protected routes work correctly
4. Check keyboard navigation
5. Ensure accessibility standards are met
