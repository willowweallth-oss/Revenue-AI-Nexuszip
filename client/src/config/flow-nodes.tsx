import {
  Zap,
  MessageSquare,
  UserPlus,
  Tag,
  Clock,
  Webhook,
  Filter,
  Hash,
  FileText,
  Mail,
  UserCheck,
  RefreshCw,
  TagIcon,
  X,
  Edit,
  CheckSquare,
  Send,
  PauseCircle,
  type LucideIcon
} from "lucide-react";
import { NodeDefinition } from "@/types/automation";

export const TRIGGER_NODES: NodeDefinition[] = [
  {
    type: "trigger",
    nodeType: "lead_created",
    label: "Lead Created",
    icon: UserPlus,
    description: "Triggers when a new lead is created",
    category: "Leads",
    configFields: [
      {
        name: "source",
        label: "From Source",
        type: "select",
        options: [
          { label: "Any Source", value: "any" },
          { label: "Website Form", value: "website" },
          { label: "Google Ads", value: "google_ads" },
          { label: "Facebook Ads", value: "facebook_ads" },
          { label: "LinkedIn", value: "linkedin" },
          { label: "Referral", value: "referral" },
        ],
        defaultValue: "any",
      }
    ]
  },
  {
    type: "trigger",
    nodeType: "lead_status_changed",
    label: "Status Changed",
    icon: RefreshCw,
    description: "Triggers when lead status changes",
    category: "Leads",
    configFields: [
      {
        name: "from_status",
        label: "From Status",
        type: "select",
        options: [
          { label: "Any Status", value: "any" },
          { label: "New", value: "new" },
          { label: "Qualified", value: "qualified" },
          { label: "Contacted", value: "contacted" },
          { label: "Converted", value: "converted" },
        ],
        defaultValue: "any",
      },
      {
        name: "to_status",
        label: "To Status",
        type: "select",
        required: true,
        options: [
          { label: "New", value: "new" },
          { label: "Qualified", value: "qualified" },
          { label: "Contacted", value: "contacted" },
          { label: "Converted", value: "converted" },
        ],
      }
    ]
  },
  {
    type: "trigger",
    nodeType: "message_received",
    label: "Message Received",
    icon: MessageSquare,
    description: "Triggers when a message is received",
    category: "Communication",
    configFields: [
      {
        name: "channel",
        label: "Channel",
        type: "select",
        options: [
          { label: "Any Channel", value: "any" },
          { label: "SMS", value: "sms" },
          { label: "Email", value: "email" },
          { label: "Chat", value: "chat" },
        ],
        defaultValue: "any",
      }
    ]
  },
  {
    type: "trigger",
    nodeType: "lead_score_threshold",
    label: "Score Threshold",
    icon: Hash,
    description: "Triggers when lead score crosses threshold",
    category: "AI & Scoring",
    configFields: [
      {
        name: "threshold",
        label: "Score Threshold",
        type: "number",
        placeholder: "85",
        required: true,
      },
      {
        name: "direction",
        label: "Direction",
        type: "select",
        options: [
          { label: "Exceeds", value: "above" },
          { label: "Falls Below", value: "below" },
        ],
        defaultValue: "above",
      }
    ]
  },
  {
    type: "trigger",
    nodeType: "tag_added",
    label: "Tag Added",
    icon: Tag,
    description: "Triggers when a tag is added to lead",
    category: "Leads",
    configFields: [
      {
        name: "tag",
        label: "Tag Name",
        type: "text",
        placeholder: "high-intent",
        required: true,
      }
    ]
  },
  {
    type: "trigger",
    nodeType: "webhook_received",
    label: "Webhook",
    icon: Webhook,
    description: "Triggers from external webhook",
    category: "Integration",
    configFields: [
      {
        name: "webhook_name",
        label: "Webhook Name",
        type: "text",
        placeholder: "zapier-trigger",
        required: true,
      }
    ]
  }
];

export const CONDITION_NODES: NodeDefinition[] = [
  {
    type: "condition",
    nodeType: "lead_score_greater_than",
    label: "Score >",
    icon: Filter,
    description: "Check if lead score is greater than value",
    category: "Scoring",
    configFields: [
      {
        name: "value",
        label: "Score Value",
        type: "number",
        placeholder: "80",
        required: true,
      }
    ]
  },
  {
    type: "condition",
    nodeType: "lead_score_less_than",
    label: "Score <",
    icon: Filter,
    description: "Check if lead score is less than value",
    category: "Scoring",
    configFields: [
      {
        name: "value",
        label: "Score Value",
        type: "number",
        placeholder: "50",
        required: true,
      }
    ]
  },
  {
    type: "condition",
    nodeType: "has_tag",
    label: "Has Tag",
    icon: Tag,
    description: "Check if lead has specific tag",
    category: "Tags",
    configFields: [
      {
        name: "tag",
        label: "Tag Name",
        type: "text",
        placeholder: "enterprise",
        required: true,
      }
    ]
  },
  {
    type: "condition",
    nodeType: "source_equals",
    label: "Source Equals",
    icon: Filter,
    description: "Check lead source",
    category: "Lead Info",
    configFields: [
      {
        name: "source",
        label: "Source",
        type: "select",
        required: true,
        options: [
          { label: "Website Form", value: "website" },
          { label: "Google Ads", value: "google_ads" },
          { label: "Facebook Ads", value: "facebook_ads" },
          { label: "LinkedIn", value: "linkedin" },
        ],
      }
    ]
  },
  {
    type: "condition",
    nodeType: "status_equals",
    label: "Status Equals",
    icon: Filter,
    description: "Check lead status",
    category: "Lead Info",
    configFields: [
      {
        name: "status",
        label: "Status",
        type: "select",
        required: true,
        options: [
          { label: "New", value: "new" },
          { label: "Qualified", value: "qualified" },
          { label: "Contacted", value: "contacted" },
        ],
      }
    ]
  },
  {
    type: "condition",
    nodeType: "field_contains",
    label: "Field Contains",
    icon: FileText,
    description: "Check if field contains text",
    category: "Lead Info",
    configFields: [
      {
        name: "field",
        label: "Field Name",
        type: "select",
        required: true,
        options: [
          { label: "Company", value: "company" },
          { label: "Email", value: "email" },
          { label: "Phone", value: "phone" },
          { label: "Notes", value: "notes" },
        ],
      },
      {
        name: "value",
        label: "Contains Text",
        type: "text",
        placeholder: "enterprise",
        required: true,
      }
    ]
  }
];

export const ACTION_NODES: NodeDefinition[] = [
  {
    type: "action",
    nodeType: "send_message",
    label: "Send Message",
    icon: MessageSquare,
    description: "Send SMS or chat message",
    category: "Communication",
    configFields: [
      {
        name: "channel",
        label: "Channel",
        type: "select",
        required: true,
        options: [
          { label: "SMS", value: "sms" },
          { label: "Chat", value: "chat" },
        ],
      },
      {
        name: "message",
        label: "Message Template",
        type: "textarea",
        placeholder: "Hi {{name}}, thanks for reaching out...",
        required: true,
      }
    ]
  },
  {
    type: "action",
    nodeType: "send_email",
    label: "Send Email",
    icon: Mail,
    description: "Send automated email",
    category: "Communication",
    configFields: [
      {
        name: "subject",
        label: "Email Subject",
        type: "text",
        placeholder: "Welcome to our platform",
        required: true,
      },
      {
        name: "body",
        label: "Email Body",
        type: "textarea",
        placeholder: "Hi {{name}},\n\nWelcome aboard...",
        required: true,
      }
    ]
  },
  {
    type: "action",
    nodeType: "assign_agent",
    label: "Assign Agent",
    icon: UserCheck,
    description: "Assign lead to agent",
    category: "Lead Management",
    configFields: [
      {
        name: "assignment_type",
        label: "Assignment Type",
        type: "select",
        required: true,
        options: [
          { label: "Round Robin", value: "round_robin" },
          { label: "Least Active", value: "least_active" },
          { label: "Specific Agent", value: "specific" },
        ],
      },
      {
        name: "agent_id",
        label: "Agent (if specific)",
        type: "text",
        placeholder: "agent@company.com",
      }
    ]
  },
  {
    type: "action",
    nodeType: "update_status",
    label: "Update Status",
    icon: RefreshCw,
    description: "Change lead status",
    category: "Lead Management",
    configFields: [
      {
        name: "status",
        label: "New Status",
        type: "select",
        required: true,
        options: [
          { label: "Qualified", value: "qualified" },
          { label: "Contacted", value: "contacted" },
          { label: "Converted", value: "converted" },
          { label: "Lost", value: "lost" },
        ],
      }
    ]
  },
  {
    type: "action",
    nodeType: "add_tag",
    label: "Add Tag",
    icon: TagIcon,
    description: "Add tag to lead",
    category: "Lead Management",
    configFields: [
      {
        name: "tag",
        label: "Tag Name",
        type: "text",
        placeholder: "high-priority",
        required: true,
      }
    ]
  },
  {
    type: "action",
    nodeType: "remove_tag",
    label: "Remove Tag",
    icon: X,
    description: "Remove tag from lead",
    category: "Lead Management",
    configFields: [
      {
        name: "tag",
        label: "Tag Name",
        type: "text",
        placeholder: "low-priority",
        required: true,
      }
    ]
  },
  {
    type: "action",
    nodeType: "update_field",
    label: "Update Field",
    icon: Edit,
    description: "Update lead field value",
    category: "Lead Management",
    configFields: [
      {
        name: "field",
        label: "Field Name",
        type: "select",
        required: true,
        options: [
          { label: "Company", value: "company" },
          { label: "Phone", value: "phone" },
          { label: "Notes", value: "notes" },
        ],
      },
      {
        name: "value",
        label: "New Value",
        type: "text",
        required: true,
      }
    ]
  },
  {
    type: "action",
    nodeType: "create_task",
    label: "Create Task",
    icon: CheckSquare,
    description: "Create task for team",
    category: "Workflow",
    configFields: [
      {
        name: "title",
        label: "Task Title",
        type: "text",
        placeholder: "Follow up with lead",
        required: true,
      },
      {
        name: "assignee",
        label: "Assign To",
        type: "text",
        placeholder: "agent@company.com",
      }
    ]
  },
  {
    type: "action",
    nodeType: "webhook_post",
    label: "Webhook POST",
    icon: Send,
    description: "Send data to external webhook",
    category: "Integration",
    configFields: [
      {
        name: "url",
        label: "Webhook URL",
        type: "text",
        placeholder: "https://api.example.com/webhook",
        required: true,
      }
    ]
  },
  {
    type: "action",
    nodeType: "wait",
    label: "Wait",
    icon: PauseCircle,
    description: "Pause flow execution",
    category: "Workflow",
    configFields: [
      {
        name: "duration",
        label: "Wait Duration",
        type: "number",
        placeholder: "60",
        required: true,
      },
      {
        name: "unit",
        label: "Time Unit",
        type: "select",
        required: true,
        options: [
          { label: "Minutes", value: "minutes" },
          { label: "Hours", value: "hours" },
          { label: "Days", value: "days" },
        ],
        defaultValue: "minutes",
      }
    ]
  }
];

export const ALL_NODES = [...TRIGGER_NODES, ...CONDITION_NODES, ...ACTION_NODES];

export function getNodeDefinition(nodeType: string): NodeDefinition | undefined {
  return ALL_NODES.find(n => n.nodeType === nodeType);
}

export function getNodesByCategory(type: "trigger" | "condition" | "action") {
  const nodes = type === "trigger" ? TRIGGER_NODES : type === "condition" ? CONDITION_NODES : ACTION_NODES;

  const categories = new Map<string, NodeDefinition[]>();
  nodes.forEach(node => {
    const existing = categories.get(node.category) || [];
    categories.set(node.category, [...existing, node]);
  });

  return Array.from(categories.entries()).map(([category, nodes]) => ({
    category,
    nodes
  }));
}
