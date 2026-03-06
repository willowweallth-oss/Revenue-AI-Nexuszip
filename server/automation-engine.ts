import { AutomationFlow, FlowNode, FlowEdge } from "@shared/automation-schema";
import { automationStorage } from "./automation-storage";
import { log } from "./index";

export interface ExecutionContext {
  flowId: number;
  organizationId: number;
  payload: any;
  broadcast: (data: any) => void;
}

export class AutomationEngine {
  async executeFlow(context: ExecutionContext) {
    const { flowId, organizationId, payload, broadcast } = context;
    
    log(`[automation-engine] Starting execution for flow ${flowId}`, "automation");
    
    const flow = await automationStorage.getFlow(flowId, organizationId);
    if (!flow || !flow.isActive) {
      log(`[automation-engine] Flow ${flowId} not found or inactive`, "automation");
      return { status: "error", message: "Flow not found or inactive" };
    }

    const executionLog = await automationStorage.createExecutionLog({
      flowId,
      organizationId,
      triggeredBy: payload.source || "manual",
      status: "running",
      executionData: { payload },
    });

    const results: any[] = [];
    let success = true;
    let errorMessage: string | undefined;

    try {
      // Simple linear execution for now based on edges
      // In a real system, this would handle branching and complex graphs
      const triggerNodes = flow.nodes.filter(n => n.type === 'trigger');
      
      for (const trigger of triggerNodes) {
        await this.processNode(trigger, context, results);
        
        let currentNodes = this.getNextNodes(trigger.id, flow.nodes, flow.edges);
        
        while (currentNodes.length > 0) {
          const nextNode = currentNodes[0]; // Simple linear path for mock
          const nodeResult = await this.processNode(nextNode, context, results);
          
          if (nodeResult.status === 'fail' && nextNode.type === 'condition') {
            log(`[automation-engine] Condition failed at node ${nextNode.id}, stopping path`, "automation");
            break;
          }
          
          currentNodes = this.getNextNodes(nextNode.id, flow.nodes, flow.edges);
        }
      }
    } catch (err: any) {
      success = false;
      errorMessage = err.message;
      log(`[automation-engine] Execution failed: ${err.message}`, "automation");
    }

    await automationStorage.incrementExecutionCount(flowId, success);
    
    // Update log status
    // Note: In a real app, we'd update the existing log entry
    
    return {
      executionId: executionLog.id,
      status: success ? "completed" : "failed",
      results,
      errorMessage
    };
  }

  private async processNode(node: FlowNode, context: ExecutionContext, results: any[]) {
    log(`[automation-engine] Processing node: ${node.label} (${node.type})`, "automation");
    
    // Mock processing delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const result = {
      nodeId: node.id,
      status: "success" as const,
      message: `Processed ${node.label}`
    };

    // Mock condition logic
    if (node.nodeType === 'lead_score_greater_than') {
      const threshold = node.config.value || 0;
      const leadScore = context.payload.leadScore || 0;
      if (leadScore <= threshold) {
        result.status = "fail";
        result.message = `Score ${leadScore} is not greater than ${threshold}`;
      }
    }

    results.push(result);
    context.broadcast({
      type: "FLOW_NODE_UPDATE",
      flowId: context.flowId,
      nodeId: node.id,
      status: result.status,
      message: result.message
    });

    return result;
  }

  private getNextNodes(nodeId: string, nodes: FlowNode[], edges: FlowEdge[]): FlowNode[] {
    const targetIds = edges.filter(e => e.source === nodeId).map(e => e.target);
    return nodes.filter(n => targetIds.includes(n.id));
  }
}

export const automationEngine = new AutomationEngine();