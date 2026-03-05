import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Conversation } from "@/types/inbox";
import { Search, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ConversationListProps {
  conversations: Conversation[];
  isLoading: boolean;
  selectedId?: string;
  onSelect: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: string | null;
  setStatusFilter: (s: string | null) => void;
}

export function ConversationList({ 
  conversations, 
  isLoading, 
  selectedId, 
  onSelect,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter
}: ConversationListProps) {
  return (
    <div className="flex flex-col h-full bg-muted/10">
      <div className="p-4 border-b space-y-4 bg-background">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Inbox</h2>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {conversations.length} Active
          </Badge>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            placeholder="Search leads..." 
            className="pl-9 h-9" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {["new", "qualified", "closed"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(statusFilter === status ? null : status)}
              className={cn(
                "px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border transition-all",
                statusFilter === status 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "bg-background text-muted-foreground border-border hover:border-primary/50"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground h-full">
            <Search className="size-8 mb-2 opacity-20" />
            <p className="text-sm">No conversations found</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => onSelect(c.id)}
                className={cn(
                  "w-full p-4 flex gap-3 text-left transition-all hover:bg-primary/5",
                  selectedId === c.id && "bg-primary/10 border-r-2 border-r-primary"
                )}
              >
                <div className="relative">
                  <div className="size-10 rounded-full bg-muted flex items-center justify-center font-bold text-sm">
                    {c.leadName.charAt(0)}
                  </div>
                  {c.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 size-4 bg-primary text-[10px] text-primary-foreground flex items-center justify-center rounded-full font-bold">
                      {c.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <span className="font-semibold text-sm truncate">{c.leadName}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {format(new Date(c.lastMessageAt), "HH:mm")}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mb-2">
                    {c.lastMessage}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] h-4 py-0 uppercase">
                      {c.status}
                    </Badge>
                    {c.qualificationScore && (
                      <span className="text-[10px] font-bold text-emerald-500">
                        {c.qualificationScore}% Match
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
