import { useState, useRef, useEffect } from "react";
import { SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="p-4 border-t border-neutral-medium bg-background">
      <div className="relative flex items-center">
        <Input
          ref={inputRef}
          className="flex-1 p-3 bg-muted text-foreground rounded-full pl-5 pr-12 outline-none focus:ring-2 focus:ring-primary mr-2"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        
        <AnimatePresence>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            className="absolute right-2"
          >
            <Button 
              className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-full hover:bg-primary-dark transition-all shadow-md"
              onClick={handleSendMessage}
              disabled={!message.trim()}
            >
              <SendIcon size={18} />
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="flex justify-center mt-2">
        <span className="text-xs text-muted-foreground">Powered by AI • Responses may not be perfect</span>
      </div>
    </div>
  );
}
