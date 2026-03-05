import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useAutomationFlows, useCreateFlow, useUpdateFlow, useDeleteFlow, useToggleFlowActive } from "@/hooks/use-automation";
import { useAuth } from "@/store/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Plus, Zap, Play, Pause, MoveHorizontal as MoreHorizontal, CreditCard as Edit, Trash2, Copy, Activity, TrendingUp, CircleAlert as AlertCircle } from "lucide-react";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { AutomationFlow } from "@/types/automation";
import { useForm } from "react-hook-form";

export default function AutomationPage() {
  const [, navigate] = useLocation();
  const { data: flows, isLoading } = useAutomationFlows();
  const { user, organization } = useAuth();
  const createMutation = useCreateFlow();
  const updateMutation = useUpdateFlow();
  const deleteMutation = useDeleteFlow();
  const toggleMutation = useToggleFlowActive();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      description: "",
    }
  });

  const onCreateFlow = (data: { name: string; description: string }) => {
    if (!user || !organization) return;

    createMutation.mutate(
      {
        organizationId: organization.id,
        userId: user.id,
        name: data.name,
        description: data.description,
        nodes: [],
        edges: [],
        isActive: false,
      },
      {
        onSuccess: (flow) => {
          setIsDialogOpen(false);
          reset();
          toast({ title: "Flow created successfully" });
          navigate(`/automation/builder/${flow.id}`);
        },
        onError: (err) => {
          toast({
            title: "Failed to create flow",
            description: err.message,
            variant: "destructive"
          });
        }
      }
    );
  };

  const handleToggleActive = (flow: AutomationFlow) => {
    toggleMutation.mutate(
      { id: flow.id, isActive: !flow.isActive },
      {
        onSuccess: () => {
          toast({
            title: flow.isActive ? "Flow deactivated" : "Flow activated",
            description: flow.isActive
              ? "The automation flow has been paused."
              : "The automation flow is now running."
          });
        }
      }
    );
  };

  const handleDelete = (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast({ title: "Flow deleted successfully" });
      }
    });
  };

  const handleDuplicate = (flow: AutomationFlow) => {
    if (!user || !organization) return;

    createMutation.mutate(
      {
        organizationId: organization.id,
        userId: user.id,
        name: `${flow.name} (Copy)`,
        description: flow.description,
        nodes: flow.nodes,
        edges: flow.edges,
        isActive: false,
      },
      {
        onSuccess: () => {
          toast({ title: "Flow duplicated successfully" });
        }
      }
    );
  };

  const activeFlows = flows?.filter(f => f.isActive).length || 0;
  const totalExecutions = flows?.reduce((sum, f) => sum + f.executionCount, 0) || 0;
  const avgSuccessRate = flows && flows.length > 0
    ? flows.reduce((sum, f) => {
        const rate = f.executionCount > 0 ? (f.successCount / f.executionCount) * 100 : 0;
        return sum + rate;
      }, 0) / flows.length
    : 0;

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground flex items-center gap-3">
            Automation Flows
          </h1>
          <p className="text-muted-foreground mt-1">
            Build intelligent workflows that run on autopilot and scale your revenue operations.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl gap-2 font-medium shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5">
              <Plus className="w-4 h-4" /> Create Flow
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-display">Create Automation Flow</DialogTitle>
              <DialogDescription>
                Start building a new revenue automation workflow.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onCreateFlow)}>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="name">Flow Name</Label>
                  <Input
                    id="name"
                    {...register("name", { required: "Flow name is required" })}
                    placeholder="High-Intent Lead Nurture"
                    className="mt-1.5 rounded-xl"
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Automatically engage leads with high qualification scores..."
                    className="mt-1.5 rounded-xl min-h-[100px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  className="w-full rounded-xl"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Creating..." : "Create & Build Flow"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-2xl border-border/50 shadow-sm hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Flows</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display text-foreground">{activeFlows}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {flows?.length || 0} total flows
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/50 shadow-sm hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Executions</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display text-foreground">
              {totalExecutions.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">All-time runs</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/50 shadow-sm hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display text-foreground">
              {avgSuccessRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Average across flows</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        ) : !flows || flows.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-display font-semibold mb-1">No automation flows yet</h3>
            <p className="text-muted-foreground max-w-sm mb-6 text-sm">
              Create your first automation flow to intelligently manage leads, nurture prospects, and scale revenue operations.
            </p>
            <Button onClick={() => setIsDialogOpen(true)} variant="outline" className="rounded-xl">
              Create your first flow
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="border-border/50">
                  <TableHead className="font-medium">Flow Name</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="font-medium text-right">Executions</TableHead>
                  <TableHead className="font-medium text-right">Success Rate</TableHead>
                  <TableHead className="font-medium">Last Updated</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flows.map((flow) => {
                  const successRate = flow.executionCount > 0
                    ? ((flow.successCount / flow.executionCount) * 100).toFixed(1)
                    : "0.0";

                  return (
                    <TableRow
                      key={flow.id}
                      className="border-border/50 hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => navigate(`/automation/builder/${flow.id}`)}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${flow.isActive ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
                          <div>
                            <div className="font-semibold">{flow.name}</div>
                            {flow.description && (
                              <div className="text-xs text-muted-foreground line-clamp-1">
                                {flow.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`
                            capitalize font-medium text-xs
                            ${flow.isActive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-muted-foreground/10 text-muted-foreground'}
                          `}
                        >
                          {flow.isActive ? 'Active' : 'Paused'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {flow.executionCount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`font-medium ${parseFloat(successRate) > 80 ? 'text-emerald-500' : parseFloat(successRate) > 50 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                          {successRate}%
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(flow.updatedAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl w-48">
                            <DropdownMenuItem
                              onClick={() => navigate(`/automation/builder/${flow.id}`)}
                              className="gap-2 cursor-pointer"
                            >
                              <Edit className="w-4 h-4" />
                              Edit Flow
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleActive(flow)}
                              className="gap-2 cursor-pointer"
                            >
                              {flow.isActive ? (
                                <><Pause className="w-4 h-4" /> Pause Flow</>
                              ) : (
                                <><Play className="w-4 h-4" /> Activate Flow</>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDuplicate(flow)}
                              className="gap-2 cursor-pointer"
                            >
                              <Copy className="w-4 h-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(flow.id, flow.name)}
                              className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
