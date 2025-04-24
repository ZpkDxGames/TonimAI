import { queryClient, apiRequest } from "./queryClient";
import { Message, Conversation } from "@shared/schema";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// Create a new conversation
export async function createConversation(): Promise<Conversation> {
  const response = await apiRequest("POST", "/api/conversations", {
    name: "New conversation"
  });
  return await response.json();
}

// Get all conversations
export async function getConversations(): Promise<Conversation[]> {
  const response = await apiRequest("GET", "/api/conversations");
  return await response.json();
}

// Get messages for a conversation
export async function getMessages(conversationId: string): Promise<Message[]> {
  const response = await apiRequest(
    "GET", 
    `/api/conversations/${conversationId}/messages`
  );
  return await response.json();
}

// Send a message and get AI response
export async function sendMessage(
  message: string, 
  conversationId: string,
  previousMessages: ChatMessage[] = []
): Promise<Message> {
  // Add the new user message to the conversation
  const messages = [
    ...previousMessages,
    { role: "user", content: message }
  ];
  
  const response = await apiRequest("POST", "/api/chat", {
    messages,
    conversationId
  });
  
  const aiResponse = await response.json();
  
  // Invalidate the messages query to refresh the chat
  queryClient.invalidateQueries({ queryKey: [`/api/conversations/${conversationId}/messages`] });
  
  return aiResponse;
}
