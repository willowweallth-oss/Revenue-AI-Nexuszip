import { useInbox } from "@/hooks/inbox/useInbox";
import { ConversationList } from "@/components/inbox/ConversationList";
import { ConversationThread } from "@/components/inbox/ConversationThread";
import { LeadAssociationPanel } from "@/components/inbox/LeadAssociationPanel";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useIsMobile } from "@/hooks/use-mobile";
import { Conversation, Message } from "@/types/inbox";

export default function InboxPage() {
  const isMobile = useIsMobile();
  const { 
    conversations, 
    selectedConversation, 
    messages, 
    leadDetails,
    isLoading,
    loadingMessages,
    loadingLeadDetails,
    setSelectedConversationId,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter
  } = useInbox();

  const typedConversations = conversations as Conversation[];
  const typedSelectedConversation = selectedConversation as Conversation | null;
  const typedMessages = messages as Message[] | null | undefined;

  if (isMobile) {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {!typedSelectedConversation ? (
          <ConversationList 
            conversations={typedConversations} 
            isLoading={isLoading} 
            onSelect={setSelectedConversationId}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        ) : (
          <div className="flex flex-col h-full">
            <button 
              onClick={() => setSelectedConversationId(null)}
              className="p-4 text-primary font-medium flex items-center gap-2 border-b"
            >
              ← Back to Inbox
            </button>
            <ConversationThread 
              conversation={typedSelectedConversation} 
              messages={typedMessages} 
              isLoading={loadingMessages} 
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-10rem)] bg-background rounded-2xl border shadow-sm overflow-hidden">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={30} minSize={20}>
          <ConversationList 
            conversations={typedConversations} 
            isLoading={isLoading} 
            selectedId={typedSelectedConversation?.id}
            onSelect={setSelectedConversationId}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        </ResizablePanel>
        
        <ResizableHandle />
        
        <ResizablePanel defaultSize={45}>
          <ConversationThread 
            conversation={typedSelectedConversation} 
            messages={typedMessages} 
            isLoading={loadingMessages} 
          />
        </ResizablePanel>
        
        <ResizableHandle />
        
        <ResizablePanel defaultSize={25} minSize={20}>
          <LeadAssociationPanel 
            lead={leadDetails} 
            isLoading={loadingLeadDetails} 
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
