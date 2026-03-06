import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCustomers, useCreateCustomer } from "@/hooks/use-customers";
import { insertCustomerSchema } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Users, Search, Filter, MoreHorizontal, Mail, Building2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const formSchema = insertCustomerSchema.extend({
  value: z.coerce.number().min(0, "Value must be at least 0"),
});

export default function Customers() {
  const { data: customers, isLoading } = useCustomers();
  const createMutation = useCreateCustomer();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      status: "lead",
      value: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createMutation.mutate(
      { 
        ...values, 
        value: String(values.value)
      },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          form.reset();
          toast({ title: "Customer added successfully" });
        },
        onError: (err) => {
          toast({ title: "Failed to add customer", description: err.message, variant: "destructive" });
        }
      }
    );
  }

  const filteredCustomers = customers?.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Customers</h1>
          <p className="text-muted-foreground mt-1">Manage your customer relationships and pipeline.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl gap-2 font-medium shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5">
              <Plus className="w-4 h-4" /> Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-display">Add New Customer</DialogTitle>
              <DialogDescription>
                Enter the details of the new customer or lead.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" className="rounded-xl" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" className="rounded-xl" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Corp" className="rounded-xl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="rounded-xl">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="lead">Lead</SelectItem>
                            <SelectItem value="churned">Churned</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LTV ($)</FormLabel>
                        <FormControl>
                          <Input type="number" className="rounded-xl" {...field} />
                        </FormControl>
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
                    {createMutation.isPending ? "Adding..." : "Add Customer"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4 bg-background p-4 rounded-2xl border border-border/50 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, email, or company..." 
            className="pl-9 rounded-xl border-none bg-muted/50 focus-visible:ring-primary/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="rounded-xl gap-2">
          <Filter className="size-4" /> Filter
        </Button>
      </div>

      <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        ) : !filteredCustomers || filteredCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-display font-semibold mb-1">No customers found</h3>
            <p className="text-muted-foreground max-w-sm mb-6 text-sm">
              {searchQuery ? "Try adjusting your search query." : "Start by adding your first customer or lead."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="border-border/50">
                  <TableHead className="font-medium">Customer</TableHead>
                  <TableHead className="font-medium">Company</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="font-medium text-right">LTV</TableHead>
                  <TableHead className="font-medium">Last Active</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} className="border-border/50 hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">{customer.name}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="size-3" /> {customer.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="size-4 text-muted-foreground" />
                        {customer.company}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`
                        capitalize font-medium text-[10px] px-2 py-0
                        ${customer.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : ''}
                        ${customer.status === 'lead' ? 'bg-primary/10 text-primary' : ''}
                        ${customer.status === 'churned' ? 'bg-destructive/10 text-destructive' : ''}
                      `}>
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${Number(customer.value).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {customer.lastActive ? format(new Date(customer.lastActive), "MMM d, yyyy") : "--"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            Edit Details
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