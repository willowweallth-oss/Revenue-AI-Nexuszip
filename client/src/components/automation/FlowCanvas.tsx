import { useCallback, useState } from "react";
import { FlowNode, FlowEdge } from "@/types/automation";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, GripVertical, Trash2, AlertCircle, CheckCircle2 } from "lucide-react";
import { getNodeDefinition } from "@/config/flow-nodes";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FlowCanvasProps {
  nodes: FlowNode[];
  edges: FlowEdge[];
  selectedNodeId: string | null;
  nodeStatuses?: Record<string, { status: 'success' | 'fail' | 'running', message?: string }>;
  onNodeSelect: (nodeId: string | null) => void;
  onNodeMove: (nodeId: string, position: { x: number; y: number }) => void;
  onNodeDelete: (nodeId: string) => void;
  onEdgeCreate: (sourceId: string, targetId: string) => void;
  onEdgeDelete: (edgeId: string) => void;
  readOnly?: boolean;
}

export function FlowCanvas({
  nodes,
  edges,
  selectedNodeId,
  nodeStatuses = {},
  onNodeSelect,
  onNodeMove,
  onNodeDelete,
  onEdgeCreate,
  onEdgeDelete,
  readOnly = false
}: FlowCanvasProps) {
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);

  const handleNodeDragStart = (nodeId: string, e: React.MouseEvent) => {
    if (readOnly) return;
    setDraggedNode(nodeId);
    e.stopPropagation();
  };

  const handleNodeDrag = useCallback((e: React.MouseEvent) => {
    if (!draggedNode || readOnly) return;

    const node = nodes.find(n => n.id === draggedNode);
    if (!node) return;

    const newPosition = {
      x: node.position.x + e.movementX,
      y: node.position.y + e.movementY
    };

    onNodeMove(draggedNode, newPosition);
  }, [draggedNode, nodes, onNodeMove, readOnly]);

  const handleNodeDragEnd = () => {
    setDraggedNode(null);
  };

  const handleConnectStart = (nodeId: string, e: React.MouseEvent) => {
    if (readOnly) return;
    e.stopPropagation();
    setConnectingFrom(nodeId);
  };

  const handleConnectEnd = (targetId: string, e: React.MouseEvent) => {
    if (readOnly) return;
    e.stopPropagation();
    if (connectingFrom && connectingFrom !== targetId) {
      onEdgeCreate(connectingFrom, targetId);
    }
    setConnectingFrom(null);
  };

  const getNodeColor = (node: FlowNode) => {
    const status = nodeStatuses[node.id]?.status;
    
    if (status === 'success') return 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
    if (status === 'fail') return 'border-destructive bg-destructive/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]';
    if (status === 'running') return 'border-primary bg-primary/10 animate-pulse';

    switch (node.type) {
      case 'trigger': return 'border-primary bg-primary/5';
      case 'condition': return 'border-amber-500 bg-amber-500/5';
      case 'action': return 'border-emerald-500 bg-emerald-500/5';
      default: return 'border-border bg-card';
    }
  };

  const getNodeIcon = (nodeType: string) => {
    const definition = getNodeDefinition(nodeType);
    if (!definition) return null;
    const Icon = definition.icon;
    return <Icon className="size-4" />;
  };

  return (
    <div
      className="relative w-full h-full bg-muted/5 rounded-xl border overflow-hidden"
      onMouseMove={handleNodeDrag}
      onMouseUp={handleNodeDragEnd}
      onClick={() => onNodeSelect(null)}
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="hsl(var(--muted-foreground))" opacity="0.1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {edges.map((edge) => {
          const sourceNode = nodes.find(n => n.id === edge.source);
          const targetNode = nodes.find(n => n.id === edge.target);

          if (!sourceNode || !targetNode) return null;

          const x1 = sourceNode.position.x + 150;
          const y1 = sourceNode.position.y + 40;
          const x2 = targetNode.position.x;
          const y2 = targetNode.position.y + 40;

          const midX = (x1 + x2) / 2;

          return (
            <g key={edge.id} className="pointer-events-auto cursor-pointer group/edge">
              <defs>
                <marker
                  id={`arrowhead-${edge.id}`}
                  markerWidth="10"
                  markerHeight="10"
                  refX="8"
                  refY="3"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3, 0 6"
                    fill="hsl(var(--primary))"
                    opacity="0.6"
                  />
                </marker>
              </defs>

              <path
                d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                opacity="0.4"
                markerEnd={`url(#arrowhead-${edge.id})`}
                className="group-hover/edge:opacity-100 group-hover/edge:stroke-[3] transition-all"
              />

              {!readOnly && (
                <circle
                  cx={midX}
                  cy={(y1 + y2) / 2}
                  r="12"
                  fill="hsl(var(--destructive))"
                  opacity="0"
                  className="group-hover/edge:opacity-100 transition-opacity cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdgeDelete(edge.id);
                  }}
                />
              )}

              {!readOnly && (
                <text
                  x={midX}
                  y={(y1 + y2) / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="10"
                  opacity="0"
                  className="group-hover/edge:opacity-100 transition-opacity pointer-events-none select-none"
                >
                  ×
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-center p-8">
          <div className="max-w-sm">
            <div className="size-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <ArrowRight className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-display font-semibold mb-2">Build Your Flow</h3>
            <p className="text-sm text-muted-foreground">
              Add triggers, conditions, and actions from the sidebar to create your automation flow.
            </p>
          </div>
        </div>
      )}

      <TooltipProvider>
        {nodes.map((node) => {
          const isSelected = selectedNodeId === node.id;
          const isConnecting = connectingFrom === node.id;
          const status = nodeStatuses[node.id];

          return (
            <Tooltip key={node.id}>
              <TooltipTrigger asChild>
                <Card
                  className={cn(
                    "absolute w-[280px] cursor-move transition-all duration-200",
                    getNodeColor(node),
                    isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                    isConnecting && "ring-2 ring-primary ring-offset-2 ring-offset-background animate-pulse",
                    "hover:shadow-lg"
                  )}
                  style={{
                    left: `${node.position.x}px`,
                    top: `${node.position.y}px`,
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    onNodeSelect(node.id);
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {getNodeIcon(node.nodeType)}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold truncate">{node.label}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-[9px] uppercase tracking-wider">
                              {node.type}
                            </Badge>
                            {status?.status === 'success' && <CheckCircle2 className="size-3 text-emerald-500" />}
                            {status?.status === 'fail' && <AlertCircle className="size-3 text-destructive" />}
                          </div>
                        </div>
                      </div>

                      {!readOnly && (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            className="size-6 rounded hover:bg-background/80 flex items-center justify-center cursor-grab active:cursor-grabbing"
                            onMouseDown={(e) => handleNodeDragStart(node.id, e)}
                          >
                            <GripVertical className="size-3 text-muted-foreground" />
                          </button>
                          <button
                            className="size-6 rounded hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              onNodeDelete(node.id);
                            }}
                          >
                            <Trash2 className="size-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    {Object.keys(node.config).length > 0 && (
                      <div className="mt-2 pt-2 border-t border-border/50">
                        <div className="text-[10px] text-muted-foreground space-y-1">
                          {Object.entries(node.config).slice(0, 2).map(([key, value]) => (
                            <div key={key} className="flex justify-between gap-2">
                              <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span>
                              <span className="truncate">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {!readOnly && (
                      <div className="flex gap-2 mt-3">
                        <button
                          className="flex-1 h-6 rounded bg-background/50 hover:bg-background text-[10px] font-medium flex items-center justify-center gap-1 border border-border/50"
                          onClick={(e) => handleConnectStart(node.id, e)}
                        >
                          Connect →
                        </button>
                        {connectingFrom && connectingFrom !== node.id && (
                          <button
                            className="flex-1 h-6 rounded bg-primary/10 hover:bg-primary/20 text-[10px] font-medium flex items-center justify-center gap-1 border border-primary/30 text-primary"
                            onClick={(e) => handleConnectEnd(node.id, e)}
                          >
                            ← Connect Here
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              </TooltipTrigger>
              {status?.message && (
                <TooltipContent>
                  <p className="text-xs">{status.message}</p>
                </TooltipContent>
              )}
            </Tooltip>
          );
        })}
      </TooltipProvider>
    </div>
  );
}