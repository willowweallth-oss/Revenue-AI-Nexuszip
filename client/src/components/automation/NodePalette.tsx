import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Zap, Filter, Play } from "lucide-react";
import { getNodesByCategory } from "@/config/flow-nodes";
import { NodeDefinition } from "@/types/automation";
import { cn } from "@/lib/utils";

interface NodePaletteProps {
  onNodeAdd: (definition: NodeDefinition) => void;
}

export function NodePalette({ onNodeAdd }: NodePaletteProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"trigger" | "condition" | "action">("trigger");

  const triggerCategories = getNodesByCategory("trigger");
  const conditionCategories = getNodesByCategory("condition");
  const actionCategories = getNodesByCategory("action");

  const filterNodes = (nodes: NodeDefinition[]) => {
    if (!searchQuery) return nodes;
    const query = searchQuery.toLowerCase();
    return nodes.filter(
      node =>
        node.label.toLowerCase().includes(query) ||
        node.description.toLowerCase().includes(query) ||
        node.category.toLowerCase().includes(query)
    );
  };

  const renderNodeList = (categories: { category: string; nodes: NodeDefinition[] }[]) => {
    return categories.map(({ category, nodes }) => {
      const filteredNodes = filterNodes(nodes);
      if (filteredNodes.length === 0) return null;

      return (
        <div key={category} className="mb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 px-2">
            {category}
          </h4>
          <div className="space-y-1">
            {filteredNodes.map((node) => {
              const Icon = node.icon;
              return (
                <button
                  key={node.nodeType}
                  onClick={() => onNodeAdd(node)}
                  className="w-full p-3 rounded-lg border border-border bg-card hover:bg-accent hover:border-primary/50 transition-all group text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "size-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                      node.type === "trigger" && "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
                      node.type === "condition" && "bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white",
                      node.type === "action" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white"
                    )}>
                      <Icon className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h5 className="text-sm font-semibold">{node.label}</h5>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {node.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      );
    });
  };

  return (
    <Card className="h-full flex flex-col border-border/50 rounded-2xl">
      <CardHeader className="border-b border-border/50 pb-4">
        <CardTitle className="text-lg font-display">Add Nodes</CardTitle>
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 rounded-lg"
          />
        </div>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4 grid w-auto grid-cols-3 bg-muted/50">
          <TabsTrigger value="trigger" className="text-xs gap-1.5">
            <Zap className="size-3" />
            Triggers
          </TabsTrigger>
          <TabsTrigger value="condition" className="text-xs gap-1.5">
            <Filter className="size-3" />
            Conditions
          </TabsTrigger>
          <TabsTrigger value="action" className="text-xs gap-1.5">
            <Play className="size-3" />
            Actions
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <CardContent className="p-4">
            <TabsContent value="trigger" className="m-0">
              {renderNodeList(triggerCategories)}
            </TabsContent>
            <TabsContent value="condition" className="m-0">
              {renderNodeList(conditionCategories)}
            </TabsContent>
            <TabsContent value="action" className="m-0">
              {renderNodeList(actionCategories)}
            </TabsContent>
          </CardContent>
        </ScrollArea>
      </Tabs>
    </Card>
  );
}
