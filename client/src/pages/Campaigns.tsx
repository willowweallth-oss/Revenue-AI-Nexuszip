import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCampaigns, useCreateCampaign, useUpdateCampaign } from "@/hooks/use-campaigns";
import { useUser } from "@/hooks/use-user";
import { insertCampaignSchema } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Megaphone, Play, Pause, MoreHorizontal, ArrowRight } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const formSchema = insertCampaignSchema.pick({
  name: true,
  budget: true,
  status: true,
}).extend({
  budget: z.coerce.number().min(1, "Budget must be greater than 0"),
});

export default function Campaigns() {
  const { data: campaigns, isLoading } = useCampaigns();
  const { data: user } = useUser();
  const createMutation = useCreateCampaign();
  const updateMutation = useUpdateCampaign();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      budget: 1000,
      status: "active",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return;
    createMutation.mutate(
      { 
        ...values, 
        budget: String(values.budget),
        userId: user.id 
      },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          form.reset();
          toast({ title: "Campaign created successfully" });
        },
        onError: (err) => {
          toast({ title: "Failed to create campaign", description: err.message, variant: "destructive" });
        }
      }
    );
}

  function toggleStatus(id: number, currentStatus: string) {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    updateMutation.mutate(
      { id, status: newStatus },
      {
        onSuccess: () => toast({ title: `Campaign ${newStatus}` })
      }
    );
  }

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Campaigns</h1>
          <p className="text-muted-foreground mt-1">Manage and track your automated revenue campaigns.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl gap-2 font-medium shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5">
              <Plus className="w-4 h-4" /> New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-display">Create Campaign</DialogTitle>
              <DialogDescription>
                Set up a new revenue automation campaign.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Q4 Reactivation..." className="rounded-xl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget ($)</FormLabel>
                        <FormControl>
                          <Input type="number" className="rounded-xl" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Initial Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="rounded-xl">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="paused">Paused</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full rounded-xl" 
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? "Creating..." : "Create Campaign"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        ) : !campaigns || campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Megaphone className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-display font-semibold mb-1">No campaigns yet</h3>
            <p className="text-muted-foreground max-w-sm mb-6 text-sm">
              Create your first automation campaign to start engaging with customers and driving revenue.
            </p>
            <Button onClick={() => setIsDialogOpen(true)} variant="outline" className="rounded-xl">
              Create your first campaign
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="border-border/50">
                  <TableHead className="font-medium">Campaign Name</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="font-medium text-right">Budget</TableHead>
                  <TableHead className="font-medium text-right">ROI</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id} className="border-border/50 hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${campaign.status === 'active' ? 'bg-emerald-500' : campaign.status === 'paused' ? 'bg-amber-500' : 'bg-muted-foreground'}`} />
                        {campaign.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`
                        capitalize font-medium text-xs
                        ${campaign.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : ''}
                        ${campaign.status === 'paused' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : ''}
                      `}>
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${Number(campaign.budget).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {campaign.roi ? (
                        <span className="flex items-center justify-end gap-1 text-emerald-500 font-medium">
                          {Number(campaign.roi).toFixed(1)}% <ArrowRight className="w-3 h-3 -rotate-45" />
                        </span>
                      ) : (
                        "--"
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuItem 
                            onClick={() => toggleStatus(campaign.id, campaign.status)}
                            className="gap-2 cursor-pointer"
                          >
                            {campaign.status === 'active' ? (
                              <><Pause className="w-4 h-4" /> Pause Campaign</>
                            ) : (
                              <><Play className="w-4 h-4" /> Resume Campaign</>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </motion.div>
  );
}