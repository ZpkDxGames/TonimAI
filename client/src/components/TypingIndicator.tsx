import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

export default function TypingIndicator() {
  return (
    <div className="flex mb-6">
      <Avatar className="w-8 h-8 rounded-full bg-white overflow-hidden flex-shrink-0 shadow-sm">
        <AvatarImage src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="AI Avatar" />
        <AvatarFallback className="bg-white text-primary">AI</AvatarFallback>
      </Avatar>
      <div className="typing-indicator ml-2 p-3 bg-white rounded-full">
        <motion.span 
          className="inline-block w-2 h-2 bg-primary-light rounded-full"
          animate={{ y: [0, -5, 0] }}
          transition={{ 
            repeat: Infinity, 
            duration: 1,
            ease: "easeInOut" 
          }}
        />
        <motion.span 
          className="inline-block w-2 h-2 bg-primary-light rounded-full mx-1"
          animate={{ y: [0, -5, 0] }}
          transition={{ 
            repeat: Infinity, 
            duration: 1,
            delay: 0.2,
            ease: "easeInOut" 
          }}
        />
        <motion.span 
          className="inline-block w-2 h-2 bg-primary-light rounded-full"
          animate={{ y: [0, -5, 0] }}
          transition={{ 
            repeat: Infinity, 
            duration: 1,
            delay: 0.4,
            ease: "easeInOut" 
          }}
        />
      </div>
    </div>
  );
}
