import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FlowNode } from "@/types/automation";
import { getNodeDefinition } from "@/config/flow-nodes";
import { Settings, X } from "lucide-react";
import { useForm } from "react-hook-form";

interface NodeConfigPanelProps {
  node: FlowNode | null;
  onUpdate: (nodeId: string, updates: Partial<FlowNode>) => void;
  onClose: () => void;
}

export function NodeConfigPanel({ node, onUpdate, onClose }: NodeConfigPanelProps) {
  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: node?.config || {}
  });

  useEffect(() => {
    if (node) {
      reset(node.config);
    }
  }, [node, reset]);

  if (!node) {
    return (
      <Card className="h-full border-border/50 rounded-2xl bg-muted/5">
        <CardContent className="flex flex-col items-center justify-center h-full text-center p-8">
          <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Settings className="size-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-display font-semibold mb-2">No Node Selected</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Select a node from the canvas to configure its settings and behavior.
          </p>
        </CardContent>
      </Card>
    );
  }

  const definition = getNodeDefinition(node.nodeType);
  if (!definition) return null;

  const Icon = definition.icon;

  const onSubmit = (data: any) => {
    onUpdate(node.id, { config: data });
  };

  const formValues = watch();

  return (
    <Card className="h-full flex flex-col border-border/50 rounded-2xl">
      <CardHeader className="border-b border-border/50">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`
              size-10 rounded-lg flex items-center justify-center shrink-0
              ${node.type === 'trigger' ? 'bg-primary/10 text-primary' : ''}
              ${node.type === 'condition' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : ''}
              ${node.type === 'action' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : ''}
            `}>
              <Icon className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-display">{definition.label}</CardTitle>
              <CardDescription className="text-xs mt-1">{definition.description}</CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 shrink-0 rounded-lg"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        </div>
      </CardHeader>

      <ScrollArea className="flex-1">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="node-label" className="text-sm font-medium">Node Label</Label>
                <Input
                  id="node-label"
                  value={node.label}
                  onChange={(e) => onUpdate(node.id, { label: e.target.value })}
                  className="mt-1.5 rounded-lg"
                  placeholder="Enter node label"
                />
              </div>

              {definition.configFields.length > 0 && (
                <>
                  <div className="h-px bg-border" />
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold">Configuration</h4>
                    {definition.configFields.map((field) => (
                      <div key={field.name}>
                        <Label htmlFor={field.name} className="text-sm font-medium">
                          {field.label}
                          {field.required && <span className="text-destructive ml-1">*</span>}
                        </Label>

                        {field.type === "text" && (
                          <Input
                            id={field.name}
                            {...register(field.name, { required: field.required })}
                            placeholder={field.placeholder}
                            className="mt-1.5 rounded-lg"
                          />
                        )}

                        {field.type === "number" && (
                          <Input
                            id={field.name}
                            type="number"
                            {...register(field.name, {
                              required: field.required,
                              valueAsNumber: true
                            })}
                            placeholder={field.placeholder}
                            className="mt-1.5 rounded-lg"
                          />
                        )}

                        {field.type === "textarea" && (
                          <Textarea
                            id={field.name}
                            {...register(field.name, { required: field.required })}
                            placeholder={field.placeholder}
                            className="mt-1.5 rounded-lg min-h-[100px]"
                          />
                        )}

                        {field.type === "select" && field.options && (
                          <Select
                            value={formValues[field.name] || field.defaultValue}
                            onValueChange={(value) => setValue(field.name, value)}
                          >
                            <SelectTrigger className="mt-1.5 rounded-lg">
                              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              {field.options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}

                        {field.type === "toggle" && (
                          <div className="flex items-center gap-3 mt-1.5">
                            <Switch
                              id={field.name}
                              checked={formValues[field.name] || false}
                              onCheckedChange={(checked) => setValue(field.name, checked)}
                            />
                            <Label htmlFor={field.name} className="text-sm text-muted-foreground cursor-pointer">
                              {field.placeholder || "Enable"}
                            </Label>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="pt-4 border-t border-border/50">
              <Button
                type="submit"
                className="w-full rounded-lg"
              >
                Save Configuration
              </Button>
            </div>
          </form>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
