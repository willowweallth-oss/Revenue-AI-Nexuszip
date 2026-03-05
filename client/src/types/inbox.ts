import { z } from "zod";

export const ConversationStatus = z.enum(["new", "qualified", "closed"]);
export type ConversationStatus = z.infer<typeof ConversationStatus>;

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: "text" | "system" | "note";
}

export interface Conversation {
  id: string;
  leadId: string;
  leadName: string;
  lastMessage: string;
  lastMessageAt: string;
  status: ConversationStatus;
  unreadCount: number;
  avatarUrl?: string;
  qualificationScore?: number;
}

export interface LeadDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  status: string;
  qualificationScore: number;
  activityTimeline: {
    id: string;
    type: string;
    content: string;
    timestamp: string;
  }[];
}
