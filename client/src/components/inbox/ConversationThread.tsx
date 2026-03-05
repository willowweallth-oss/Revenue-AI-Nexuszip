import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Conversation, Message } from "@/types/inbox";
import { Send, User, Sparkles, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ConversationThreadProps {
  conversation: Conversation | null;
  messages?: Message[] | null;
  isLoading: boolean;
}

export function ConversationThread({ conversation, messages, isLoading }: ConversationThreadProps) {
  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 text-muted-foreground bg-muted/5">
        <div className="size-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <Sparkles className="size-8 opacity-20" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-1">Select a conversation</h3>
        <p className="max-w-xs text-sm">Choose a lead from the list to start chatting or view their details.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-muted flex items-center justify-center font-bold text-sm">
            {conversation.leadName.charAt(0)}
          </div>
          <div>
            <h3 className="text-sm font-bold">{conversation.leadName}</h3>
            <div className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Online</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs gap-2">
            <Sparkles className="size-3 text-primary" />
            AI Draft
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs">Close</Button>
        </div>
      </header>

      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-10 w-1/2 ml-auto" />
            <Skeleton className="h-20 w-2/3" />
          </div>
        ) : (
          <div className="space-y-6">
            {messages?.map((m) => {
              const isSystem = m.type === "system";
              const isLead = m.senderId !== "agent"; // Simplification for demo

              if (isSystem) {
                return (
                  <div key={m.id} className="flex justify-center">
                    <div className="bg-primary/5 border border-primary/10 rounded-lg px-3 py-1.5 text-[10px] font-medium text-primary flex items-center gap-2 uppercase tracking-wider">
                      <Sparkles className="size-3" />
                      {m.content}
                    </div>
                  </div>
                );
              }

              return (
                <div key={m.id} className={cn(
                  "flex gap-3 max-w-[85%]",
                  !isLead && "ml-auto flex-row-reverse"
                )}>
                  <div className={cn(
                    "size-8 rounded-full flex items-center justify-center shrink-0",
                    isLead ? "bg-muted" : "bg-primary"
                  )}>
                    {isLead ? <User className="size-4" /> : <Sparkles className="size-4 text-primary-foreground" />}
                  </div>
                  <div className={cn(
                    "space-y-1",
                    !isLead && "text-right"
                  )}>
                    <div className={cn(
                      "p-3 rounded-2xl text-sm shadow-sm",
                      isLead 
                        ? "bg-muted/50 rounded-tl-none border border-border/50" 
                        : "bg-primary text-primary-foreground rounded-tr-none"
                    )}>
                      {m.content}
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {format(new Date(m.timestamp), "HH:mm")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>

      <footer className="p-4 border-t bg-muted/5">
        <div className="relative group">
          <Input 
            placeholder="Type a message or use / for commands..." 
            className="pr-24 h-12 bg-background border-border/50 shadow-sm focus-visible:ring-primary/20"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            <Button size="icon" variant="ghost" className="size-8">
              <AlertCircle className="size-4 opacity-50" />
            </Button>
            <Button size="icon" className="size-8 rounded-lg shadow-sm">
              <Send className="size-4" />
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center mt-2 px-1">
          <p className="text-[10px] text-muted-foreground italic">AI-ROS is monitoring this conversation for auto-reply opportunities.</p>
          <div className="flex gap-2">
            <span className="text-[10px] font-bold text-primary cursor-pointer hover:underline">Internal Note</span>
            <span className="text-[10px] font-bold text-primary cursor-pointer hover:underline">Add Action</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
