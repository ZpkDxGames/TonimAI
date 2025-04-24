import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "@shared/schema";
import { formatTimestamp } from "@/lib/openai";
import { motion } from "framer-motion";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === "user";
  
  if (isUser) {
    return (
      <motion.div 
        className="flex flex-row-reverse mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="message-out mr-0 p-3 max-w-xs">
          <p className="text-sm">{message.content}</p>
          <span className="text-xs text-white opacity-70 mt-1 block">
            {formatTimestamp(message.timestamp)}
          </span>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      className="flex mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Avatar className="w-8 h-8 rounded-full bg-white overflow-hidden flex-shrink-0 shadow-sm">
        <AvatarImage src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="AI Avatar" />
        <AvatarFallback className="bg-white text-primary">AI</AvatarFallback>
      </Avatar>
      <div className="message-in ml-2 p-3 max-w-xs">
        <div className="whitespace-pre-wrap text-sm">
          {message.content.includes("\n") ? (
            message.content.split("\n").map((line, i) => (
              <p key={i} className={i > 0 ? "mt-2" : ""}>
                {line}
              </p>
            ))
          ) : (
            <p>{message.content}</p>
          )}
        </div>
        
        {message.content.includes("•") && (
          <ul className="text-sm list-disc ml-4 mt-2">
            {message.content
              .split("\n")
              .filter(line => line.trim().startsWith("•"))
              .map((line, i) => (
                <li key={i}>{line.trim().substring(1).trim()}</li>
              ))}
          </ul>
        )}
        
        <span className="text-xs text-gray-500 mt-1 block">
          {formatTimestamp(message.timestamp)}
        </span>
      </div>
    </motion.div>
  );
}
