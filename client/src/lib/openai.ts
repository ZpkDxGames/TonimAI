import { ChatMessage } from "./api";

// Convert Message[] to ChatMessage[] format for OpenAI API
export function formatMessagesForOpenAI(
  messages: Array<{ content: string; sender: string }>
): ChatMessage[] {
  return messages.map(message => ({
    role: message.sender === "user" ? "user" : "assistant",
    content: message.content
  }));
}

// Quick response options for the chat
export const quickOptions = [
  { id: 1, text: "Tell me about yourself" },
  { id: 2, text: "What can you do?" },
  { id: 3, text: "Help me with something" }
];

// Follow-up options after the "about yourself" response
export const followUpOptions = [
  { id: 1, text: "How were you made?" },
  { id: 2, text: "Show me something cool" }
];

// Format timestamp for chat messages
export function formatTimestamp(date: Date): string {
  return new Date(date).toLocaleTimeString([], { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true
  });
}
