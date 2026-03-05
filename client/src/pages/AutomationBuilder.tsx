import { useState, useCallback, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAutomationFlow, useUpdateFlow, useToggleFlowActive } from "@/hooks/use-automation";
import { FlowCanvas } from "@/components/automation/FlowCanvas";
import { NodePalette } from "@/components/automation/NodePalette";
import { NodeConfigPanel } from "@/components/automation/NodeConfigPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Play, Pause, Eye, AlertCircle } from "lucide-react";
import { FlowNode, FlowEdge, NodeDefinition } from "@/types/automation";
import { nanoid } from "nanoid";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

export default function AutomationBuilder() {
  const params = useParams();
  const flowId = params.id ? parseInt(params.id) : null;
  const [, navigate] = useLocation();
  const { data: flow, isLoading } = useAutomationFlow(flowId);
  const updateMutation = useUpdateFlow();
  const toggleMutation = useToggleFlowActive();
  const { toast } = useToast();

  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [edges, setEdges] = useState<FlowEdge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (flow) {
      setNodes(flow.nodes);
      setEdges(flow.edges);
    }
  }, [flow]);

  useEffect(() => {
    if (flow && (JSON.stringify(nodes) !== JSON.stringify(flow.nodes) || JSON.stringify(edges) !== JSON.stringify(flow.edges))) {
      setHasUnsavedChanges(true);
    }
  }, [nodes, edges, flow]);

  const handleNodeAdd = useCallback((definition: NodeDefinition) => {
    const newNode: FlowNode = {
      id: nanoid(),
      type: definition.type,
      nodeType: definition.nodeType as any,
      label: definition.label,
      config: definition.configFields.reduce((acc, field) => {
        if (field.defaultValue !== undefined) {
          acc[field.name] = field.defaultValue;
        }
        return acc;
      }, {} as Record<string, any>),
      position: {
        x: 100 + nodes.length * 50,
        y: 100 + nodes.length * 30
      }
    };

    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
  }, [nodes.length]);

  const handleNodeMove = useCallback((nodeId: string, position: { x: number; y: number }) => {
    setNodes(prev => prev.map(node =>
      node.id === nodeId ? { ...node, position } : node
    ));
  }, []);

  const handleNodeUpdate = useCallback((nodeId: string, updates: Partial<FlowNode>) => {
    setNodes(prev => prev.map(node =>
      node.id === nodeId ? { ...node, ...updates } : node
    ));
  }, []);

  const handleNodeDelete = useCallback((nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    setEdges(prev => prev.filter(edge => edge.source !== nodeId && edge.target !== nodeId));
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
  }, [selectedNodeId]);

  const handleEdgeCreate = useCallback((sourceId: string, targetId: string) => {
    const edgeExists = edges.some(e => e.source === sourceId && e.target === targetId);
    if (edgeExists) {
      toast({ title: "Connection already exists", variant: "destructive" });
      return;
    }

    const newEdge: FlowEdge = {
      id: nanoid(),
      source: sourceId,
      target: targetId
    };

    setEdges(prev => [...prev, newEdge]);
  }, [edges, toast]);

  const handleEdgeDelete = useCallback((edgeId: string) => {
    setEdges(prev => prev.filter(edge => edge.id !== edgeId));
  }, []);

  const handleSave = () => {
    if (!flow) return;

    updateMutation.mutate(
      {
        id: flow.id,
        nodes,
        edges,
        updatedAt: new Date().toISOString()
      },
      {
        onSuccess: () => {
          setHasUnsavedChanges(false);
          toast({ title: "Flow saved successfully" });
        },
        onError: (err) => {
          toast({
            title: "Failed to save flow",
            description: err.message,
            variant: "destructive"
          });
        }
      }
    );
  };

  const handleToggleActive = () => {
    if (!flow) return;

    if (!flow.isActive && nodes.length === 0) {
      toast({
        title: "Cannot activate empty flow",
        description: "Add at least one trigger to activate this flow.",
        variant: "destructive"
      });
      return;
    }

    const hasTrigger = nodes.some(n => n.type === "trigger");
    if (!flow.isActive && !hasTrigger) {
      toast({
        title: "Cannot activate flow",
        description: "Flow must contain at least one trigger node.",
        variant: "destructive"
      });
      return;
    }

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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full rounded-2xl" />
        <div className="grid grid-cols-4 gap-4 h-[calc(100vh-12rem)]">
          <Skeleton className="rounded-2xl" />
          <Skeleton className="col-span-2 rounded-2xl" />
          <Skeleton className="rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!flow) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="text-center">
          <AlertCircle className="size-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Flow not found</h3>
          <Button onClick={() => navigate("/automation")} variant="outline" className="rounded-xl">
            Back to Flows
          </Button>
        </div>
      </div>
    );
  }

  const selectedNode = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) || null : null;

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between gap-4 bg-background sticky top-0 z-10 py-4 border-b border-border/50">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/automation")}
            className="rounded-lg shrink-0"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold font-display truncate">{flow.name}</h1>
              <Badge variant={flow.isActive ? "default" : "secondary"} className="shrink-0">
                {flow.isActive ? "Active" : "Paused"}
              </Badge>
              {hasUnsavedChanges && (
                <Badge variant="outline" className="shrink-0 border-amber-500/50 text-amber-600 dark:text-amber-400">
                  Unsaved
                </Badge>
              )}
            </div>
            {flow.description && (
              <p className="text-sm text-muted-foreground truncate">{flow.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            onClick={handleSave}
            disabled={!hasUnsavedChanges || updateMutation.isPending}
            className="rounded-xl gap-2"
          >
            <Save className="size-4" />
            {updateMutation.isPending ? "Saving..." : "Save"}
          </Button>
          <Button
            onClick={handleToggleActive}
            disabled={toggleMutation.isPending}
            className={`rounded-xl gap-2 ${flow.isActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
          >
            {flow.isActive ? <Pause className="size-4" /> : <Play className="size-4" />}
            {flow.isActive ? "Pause" : "Activate"}
          </Button>
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal" className="h-[calc(100vh-14rem)] rounded-2xl border">
        <ResizablePanel defaultSize={20} minSize={15}>
          <NodePalette onNodeAdd={handleNodeAdd} />
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={55} minSize={30}>
          <div className="h-full bg-background rounded-none">
            <FlowCanvas
              nodes={nodes}
              edges={edges}
              selectedNodeId={selectedNodeId}
              onNodeSelect={setSelectedNodeId}
              onNodeMove={handleNodeMove}
              onNodeDelete={handleNodeDelete}
              onEdgeCreate={handleEdgeCreate}
              onEdgeDelete={handleEdgeDelete}
            />
          </div>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={25} minSize={20}>
          <NodeConfigPanel
            node={selectedNode}
            onUpdate={handleNodeUpdate}
            onClose={() => setSelectedNodeId(null)}
          />
        </ResizablePanel>
      </ResizablePanelGroup>

      <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground p-4 bg-muted/20 rounded-xl border border-border/50">
        <div className="flex items-center gap-6">
          <span>Nodes: {nodes.length}</span>
          <span>Connections: {edges.length}</span>
          <span>Version: {flow.version}</span>
        </div>
        <div className="flex items-center gap-2">
          <Eye className="size-3" />
          <span>Last saved: {new Date(flow.updatedAt).toLocaleString()}</span>
        </div>
      </div>
    </motion.div>
  );
}
