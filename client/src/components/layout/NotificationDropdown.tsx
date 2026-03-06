import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, X, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  useNotifications, 
  useMarkNotificationRead, 
  useMarkAllNotificationsRead, 
  useDeleteNotification 
} from "@/hooks/use-notifications";
import { formatDistanceToNow } from "date-fns";

export function NotificationDropdown() {
  const { data: notifications = [], isLoading, error } = useNotifications();
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();
  const deleteMutation = useDeleteNotification();

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-emerald-500';
      case 'warning': return 'text-amber-500';
      case 'error': return 'text-destructive';
      default: return 'text-primary';
    }
  };

  if (error) {
    console.error("[NotificationDropdown] Error fetching notifications:", error);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-9 w-9 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors relative"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-primary hover:bg-primary"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 rounded-xl shadow-xl p-0">
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => markAllReadMutation.mutate()}
              disabled={markAllReadMutation.isPending}
            >
              {markAllReadMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Mark all read"}
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/50 transition-colors group ${!notification.read ? 'bg-primary/5' : ''}`}
                >
                  <div className="flex gap-3">
                    <div className={`mt-1 ${getTypeColor(notification.type)}`}>
                      <div className="h-2 w-2 rounded-full bg-current"></div>
                    </div>
                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium leading-tight">{notification.title}</p>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-full"
                              onClick={() => markReadMutation.mutate(notification.id)}
                              disabled={markReadMutation.isPending}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => deleteMutation.mutate(notification.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{notification.description}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}