import { motion } from "framer-motion";
import { useInsights, useUpdateInsightStatus } from "@/hooks/use-insights";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Lightbulb, CheckCircle2, XCircle, Clock, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Insights() {
  const { data: insights, isLoading } = useInsights();
  const updateMutation = useUpdateInsightStatus();
  const { toast } = useToast();

  const handleStatusUpdate = (id: number, status: string) => {
    updateMutation.mutate(
      { id, status },
      {
        onSuccess: () => {
          toast({ 
            title: `Insight marked as ${status}`,
            description: status === 'implemented' ? "Great job taking action!" : "Insight dismissed for now."
          });
        }
      }
    );
  };

  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVars = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const pendingInsights = insights?.filter(i => i.status === 'new') || [];
  const processedInsights = insights?.filter(i => i.status !== 'new') || [];

  return (
    <motion.div 
      className="space-y-8 pb-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-display text-foreground flex items-center gap-3">
          AI Recommendations
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 pointer-events-none px-2 rounded-md">Beta</Badge>
        </h1>
        <p className="text-muted-foreground">Actionable steps identified by our AI to improve revenue and retention.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)}
        </div>
      ) : pendingInsights.length === 0 ? (
        <Card className="rounded-2xl border-dashed border-border border-2 bg-transparent shadow-none py-16 flex flex-col items-center justify-center text-center">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-display font-semibold mb-2 text-foreground">You're all caught up!</h3>
          <p className="text-muted-foreground max-w-md">
            Our models are continually analyzing your data. We'll let you know when new revenue opportunities are found.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold font-display flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Action Required
          </h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            variants={containerVars}
            initial="hidden"
            animate="show"
          >
            {pendingInsights.map((insight) => (
              <motion.div key={insight.id} variants={itemVars}>
                <Card className="h-full flex flex-col rounded-2xl border-border/50 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className={`absolute top-0 left-0 w-full h-1 ${
                    insight.type === 'opportunity' ? 'bg-primary' : 
                    insight.type === 'risk' ? 'bg-destructive' : 'bg-amber-500'
                  }`} />
                  <CardHeader className="pb-3 pt-6">
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant="outline" className={`
                        capitalize rounded-md font-medium px-2 py-0.5
                        ${insight.type === 'opportunity' ? 'text-primary border-primary/30 bg-primary/5' : 
                          insight.type === 'risk' ? 'text-destructive border-destructive/30 bg-destructive/5' : 
                          'text-amber-500 border-amber-500/30 bg-amber-500/5'}
                      `}>
                        {insight.type}
                      </Badge>
                      <div className="flex items-center gap-1.5 text-xs font-semibold bg-secondary text-secondary-foreground px-2 py-1 rounded-md">
                        Impact: <span className={insight.impactScore > 80 ? 'text-emerald-500' : ''}>{insight.impactScore}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-tight font-display">{insight.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {insight.description}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-4 border-t border-border/50 gap-3 bg-muted/10">
                    <Button 
                      className="flex-1 rounded-xl bg-foreground hover:bg-foreground/90 text-background"
                      onClick={() => handleStatusUpdate(insight.id, 'implemented')}
                      disabled={updateMutation.isPending}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Implement
                    </Button>
                    <Button 
                      variant="outline" 
                      className="rounded-xl flex-shrink-0 px-3 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
                      onClick={() => handleStatusUpdate(insight.id, 'dismissed')}
                      disabled={updateMutation.isPending}
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {processedInsights.length > 0 && (
        <div className="pt-8 border-t border-border/50">
          <h2 className="text-lg font-semibold font-display flex items-center gap-2 mb-6 text-muted-foreground">
            <Clock className="w-5 h-5" />
            Previously Reviewed
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-70">
            {processedInsights.map(insight => (
              <Card key={insight.id} className="rounded-xl border-border/30 bg-muted/20">
                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                  <h4 className="font-medium text-sm truncate pr-4">{insight.title}</h4>
                  <Badge variant="secondary" className="text-[10px] capitalize shrink-0">
                    {insight.status}
                  </Badge>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-xs text-muted-foreground line-clamp-1">{insight.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
