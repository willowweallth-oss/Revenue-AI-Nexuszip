import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { LeadDetails } from "@/types/inbox";
import { User, Phone, Mail, Building2, ExternalLink, Activity, Target } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface LeadAssociationPanelProps {
  lead?: LeadDetails | null;
  isLoading: boolean;
}

export function LeadAssociationPanel({ lead, isLoading }: LeadAssociationPanelProps) {
  if (!lead && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground bg-muted/10">
        <p className="text-sm">Select a conversation to see lead details</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background border-l">
      <header className="p-4 border-b">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/70">Lead Details</h3>
      </header>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-40 rounded-xl" />
            </div>
          ) : lead && (
            <>
              <section className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                    {lead.qualificationScore}%
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-primary">High Intent</h4>
                    <p className="text-[10px] text-muted-foreground">AI Score based on initial interaction</p>
                  </div>
                </div>

                <div className="space-y-3 px-1">
                  <div className="flex items-center gap-3 group">
                    <User className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{lead.name}</span>
                  </div>
                  <div className="flex items-center gap-3 group">
                    <Mail className="size-4 text-muted-foreground" />
                    <span className="text-sm truncate">{lead.email}</span>
                  </div>
                  <div className="flex items-center gap-3 group">
                    <Phone className="size-4 text-muted-foreground" />
                    <span className="text-sm">{lead.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 group">
                    <Building2 className="size-4 text-muted-foreground" />
                    <span className="text-sm">{lead.company}</span>
                  </div>
                  <div className="flex items-center gap-3 group">
                    <Target className="size-4 text-muted-foreground" />
                    <span className="text-sm">{lead.source}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Badge variant="outline" className="uppercase text-[9px] font-bold tracking-widest">{lead.status}</Badge>
                  <Badge variant="secondary" className="uppercase text-[9px] font-bold tracking-widest bg-muted text-muted-foreground">Tier 1</Badge>
                </div>
              </section>

              <div className="h-px bg-border/50" />

              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Activity Timeline</h4>
                  <Activity className="size-3 text-muted-foreground" />
                </div>
                <div className="space-y-4 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-border/50">
                  {lead.activityTimeline.map((activity) => (
                    <div key={activity.id} className="relative pl-6">
                      <div className="absolute left-0 top-1.5 size-3.5 rounded-full bg-background border-2 border-primary flex items-center justify-center z-10">
                        <div className="size-1 rounded-full bg-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-foreground font-medium leading-tight">
                          {activity.content}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {format(new Date(activity.timestamp), "MMM dd, HH:mm")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </ScrollArea>
      
      <footer className="p-4 border-t bg-muted/5">
        <Button variant="outline" className="w-full text-xs gap-2 h-9 border-dashed hover:border-primary hover:bg-primary/5">
          <ExternalLink className="size-3" />
          Open Lead CRM
        </Button>
      </footer>
    </div>
  );
}
