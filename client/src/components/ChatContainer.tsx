import { useRef, useEffect } from "react";
import { Message } from "@shared/schema";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import QuickOptions from "./QuickOptions";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  isTyping: boolean;
  quickOptions: { id: number; text: string }[];
  followUpOptions: { id: number; text: string }[];
  onQuickOptionSelect: (text: string) => void;
}

export default function ChatContainer({
  messages,
  isLoading,
  isTyping,
  quickOptions,
  followUpOptions,
  onQuickOptionSelect
}: ChatContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change or typing state changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);
  
  // Show quick options only after the first AI message
  const shouldShowQuickOptions = messages.length === 1 && messages[0].sender === "ai";
  
  // Show follow-up options after the user asks about the AI
  const shouldShowFollowUpOptions = messages.length >= 4 && 
    messages[messages.length - 2]?.content?.toLowerCase().includes("tell me about yourself") &&
    messages[messages.length - 1]?.sender === "ai";
  
  return (
    <ScrollArea 
      className="chat-container flex-1 p-4 bg-background"
      ref={scrollRef}
    >
      <div className="flex flex-col">
        {isLoading ? (
          <p className="text-center py-4">Loading messages...</p>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {shouldShowQuickOptions && (
              <QuickOptions 
                options={quickOptions} 
                onOptionSelect={onQuickOptionSelect} 
              />
            )}
            
            {shouldShowFollowUpOptions && (
              <QuickOptions 
                options={followUpOptions} 
                onOptionSelect={onQuickOptionSelect} 
              />
            )}
            
            {isTyping && <TypingIndicator />}
          </>
        )}
      </div>
    </ScrollArea>
  );
}
