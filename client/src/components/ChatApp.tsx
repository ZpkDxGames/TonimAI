import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { createConversation, getMessages, sendMessage as apiSendMessage } from "@/lib/api";
import ChatHeader from "./ChatHeader";
import ChatContainer from "./ChatContainer";
import ChatInput from "./ChatInput";
import { Message } from "@shared/schema";
import { quickOptions, followUpOptions } from "@/lib/openai";
import { queryClient } from "@/lib/queryClient";

export default function ChatApp() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Create a new conversation when the component mounts
  useEffect(() => {
    async function initConversation() {
      try {
        const conversation = await createConversation();
        setConversationId(conversation.id);
      } catch (error) {
        console.error("Failed to create conversation:", error);
      }
    }

    if (!conversationId) {
      initConversation();
    }
  }, [conversationId]);

  // Fetch messages for the current conversation
  const { 
    data: messages = [] as Message[], 
    isLoading,
    error 
  } = useQuery<Message[]>({
    queryKey: conversationId ? [`/api/conversations/${conversationId}/messages`] : [],
    enabled: !!conversationId,
  });

  // Handle sending messages
  const handleSendMessage = async (messageText: string) => {
    if (!conversationId || !messageText.trim()) return;
    
    setIsTyping(true);
    
    try {
      await sendMessage({
        message: messageText,
        conversationId
      });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  // Mutation for sending messages
  const { mutateAsync: sendMessage } = useMutation({
    mutationFn: async ({ message, conversationId }: { message: string, conversationId: string }) => {
      return await apiSendMessage(message, conversationId);
    },
    onSuccess: () => {
      // Invalidate the messages query to fetch updated messages
      if (conversationId) {
        queryClient.invalidateQueries({ 
          queryKey: [`/api/conversations/${conversationId}/messages`] 
        });
      }
    }
  });

  // Handle quick option selection
  const handleQuickOptionSelect = (optionText: string) => {
    handleSendMessage(optionText);
  };

  if (!conversationId) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-light">
        <p>Initializing chat...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-xl mx-auto bg-white shadow-md">
      <ChatHeader />
      <ChatContainer 
        messages={messages} 
        isLoading={isLoading}
        isTyping={isTyping}
        quickOptions={quickOptions}
        followUpOptions={followUpOptions}
        onQuickOptionSelect={handleQuickOptionSelect}
      />
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
}
