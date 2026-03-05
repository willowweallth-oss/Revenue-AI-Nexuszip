import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import { Conversation, Message, LeadDetails } from "@/types/inbox";

export function useInbox() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const { data: conversations, isLoading: loadingConversations } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => apiService.getConversations(),
  });

  const selectedConversation = useMemo(() => 
    conversations?.find(c => c.id === selectedConversationId) || null,
  [conversations, selectedConversationId]);

  const { data: messages, isLoading: loadingMessages } = useQuery({
    queryKey: ["messages", selectedConversationId],
    queryFn: () => selectedConversationId ? apiService.getMessages(selectedConversationId) : null,
    enabled: !!selectedConversationId,
  });

  const { data: leadDetails, isLoading: loadingLeadDetails } = useQuery({
    queryKey: ["lead", selectedConversation?.leadId],
    queryFn: () => selectedConversation?.leadId ? apiService.getLeadDetails(selectedConversation.leadId) : null,
    enabled: !!selectedConversation?.leadId,
  });

  const filteredConversations = useMemo(() => {
    if (!conversations) return [];
    return conversations.filter(c => {
      const matchesSearch = c.leadName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [conversations, searchQuery, statusFilter]);

  return {
    conversations: filteredConversations,
    selectedConversation,
    messages,
    leadDetails,
    isLoading: loadingConversations,
    loadingMessages,
    loadingLeadDetails,
    setSelectedConversationId,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter
  };
}
