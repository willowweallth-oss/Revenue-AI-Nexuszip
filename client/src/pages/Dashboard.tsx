import { motion } from "framer-motion";
import { useMetrics } from "@/hooks/use-metrics";
import { useInsights } from "@/hooks/use-insights";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight, DollarSign, Users, Activity, Target, Sparkles } from "lucide-react";
import { format } from "date-fns";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: metrics, isLoading: loadingMetrics } = useMetrics();
  const { data: insights, isLoading: loadingInsights } = useInsights();

  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVars = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (loadingMetrics || loadingInsights) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
        <Skeleton className="h-[400px] rounded-2xl" />
      </div>
    );
  }

  // Get latest metric for top cards
  const latestMetric = metrics && metrics.length > 0 ? metrics[metrics.length - 1] : null;
  const previousMetric = metrics && metrics.length > 1 ? metrics[metrics.length - 2] : null;

  const calculateGrowth = (current: number, prev: number) => {
    if (!prev) return 0;
    return ((current - prev) / prev) * 100;
  };

  const mrrGrowth = latestMetric && previousMetric 
    ? calculateGrowth(Number(latestMetric.mrr), Number(previousMetric.mrr)) 
    : 0;

  const chartData = metrics?.map(m => ({
    date: format(new Date(m.date), "MMM dd"),
    mrr: Number(m.mrr),
    customers: m.activeCustomers
  })) || [];

  const topInsights = insights?.filter(i => i.status === 'new').slice(0, 3) || [];

  return (
    <motion.div 
      className="space-y-8 pb-8"
      variants={containerVars}
      initial="hidden"
      animate="show"
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-display text-foreground">Overview</h1>
        <p className="text-muted-foreground">Monitor your revenue engine performance and AI insights.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <motion.div variants={itemVars}>
          <Card className="rounded-2xl border-border/50 shadow-sm hover-elevate overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <DollarSign className="w-16 h-16" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total MRR</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-display text-foreground">
                ${Number(latestMetric?.mrr || 0).toLocaleString()}
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs">
                <span className={`flex items-center font-medium ${mrrGrowth >= 0 ? 'text-emerald-500' : 'text-destructive'}`}>
                  {mrrGrowth >= 0 ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                  {Math.abs(mrrGrowth).toFixed(1)}%
                </span>
                <span className="text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVars}>
          <Card className="rounded-2xl border-border/50 shadow-sm hover-elevate">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-display text-foreground">
                {latestMetric?.activeCustomers || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Active paying accounts
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVars}>
          <Card className="rounded-2xl border-border/50 shadow-sm hover-elevate">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Churn Rate</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-display text-foreground">
                {Number(latestMetric?.churnRate || 0).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Monthly revenue churn
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVars}>
          <Card className="rounded-2xl border-border/50 shadow-sm hover-elevate">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">CAC</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-display text-foreground">
                ${Number(latestMetric?.cac || 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Customer acquisition cost
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <motion.div variants={itemVars} className="lg:col-span-2">
          <Card className="rounded-2xl border-border/50 shadow-sm h-full flex flex-col">
            <CardHeader>
              <CardTitle className="font-display font-semibold text-lg">Revenue Growth</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    tickFormatter={(value) => `$${value/1000}k`}
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--popover))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '0.75rem',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="mrr" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorMrr)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Insights Sidebar */}
        <motion.div variants={itemVars}>
          <Card className="rounded-2xl border-border/50 shadow-sm h-full bg-gradient-to-b from-card to-secondary/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-display font-semibold text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Actionable Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topInsights.length === 0 ? (
                <div className="text-center py-10">
                  <div className="bg-muted w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">All caught up! No new insights right now.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {topInsights.map((insight) => (
                    <div key={insight.id} className="p-4 rounded-xl bg-background border border-border/50 shadow-sm hover-elevate transition-all group cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className={
                          insight.type === 'opportunity' ? 'text-primary border-primary/30 bg-primary/5' : 
                          insight.type === 'risk' ? 'text-destructive border-destructive/30 bg-destructive/5' : 
                          'text-amber-500 border-amber-500/30 bg-amber-500/5'
                        }>
                          {insight.type}
                        </Badge>
                        <span className="text-xs font-semibold px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
                          Impact: {insight.impactScore}
                        </span>
                      </div>
                      <h4 className="font-medium text-sm text-foreground mb-1 group-hover:text-primary transition-colors">{insight.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{insight.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
