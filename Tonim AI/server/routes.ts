import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  chatCompletionSchema, 
  insertMessageSchema, 
  insertConversationSchema 
} from "@shared/schema";
import { groq, getGroqChatCompletion } from "./groq";
import { randomUUID } from "crypto";


export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Helper to validate API key
  const validateApiKey = (req: any, res: any, next: any) => {
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ message: "Groq API key is not configured" });
    }
    next();
  };

  // Get chat history for a conversation
  app.get("/api/conversations/:id/messages", async (req, res) => {
    try {
      const conversationId = req.params.id;
      const conversation = await storage.getConversation(conversationId);
      
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      const messages = await storage.getMessagesByConversationId(conversationId);
      return res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      return res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // List all conversations
  app.get("/api/conversations", async (req, res) => {
    try {
      const conversations = await storage.listConversations();
      return res.json(conversations);
    } catch (error) {
      console.error("Error listing conversations:", error);
      return res.status(500).json({ message: "Failed to list conversations" });
    }
  });

  // Create a new conversation
  app.post("/api/conversations", async (req, res) => {
    try {
      const conversationData = insertConversationSchema.parse({
        id: randomUUID(),
        name: req.body.name || "New conversation"
      });
      
      const conversation = await storage.createConversation(conversationData);
      
      // Add welcome message
      await storage.createMessage({
        content: "Hey there! I'm your personal AI assistant. How can I help you today?",
        sender: "ai",
        conversationId: conversation.id
      });
      
      return res.status(201).json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      return res.status(500).json({ message: "Failed to create conversation" });
    }
  });

  // Send message to Groq and get response
  app.post("/api/chat", validateApiKey, async (req, res) => {
    try {
      const { messages, conversationId } = chatCompletionSchema.parse(req.body);
      
      // Check if conversation exists
      const conversation = await storage.getConversation(conversationId);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      // Save user message
      const userMessage = messages[messages.length - 1];
      if (userMessage.role === "user") {
        await storage.createMessage({
          content: userMessage.content,
          sender: "user",
          conversationId
        });
      }
      
      // Prepend system message to set personality
      const personalityPrompt = "You are a helpful AI assistant with a friendly and conversational tone. You're representing the personality of the chat creator. Keep your responses concise and helpful. If you don't know something, be honest about it.";
      
      const messagesWithSystem = [
        { role: "system", content: personalityPrompt },
        ...messages
      ];
      
      // Request completion from Groq
      const aiResponse = await getGroqChatCompletion(messagesWithSystem);
      
      // Save AI response
      const savedMessage = await storage.createMessage({
        content: aiResponse || "Sorry, I couldn't generate a response.",
        sender: "ai",
        conversationId
      });
      
      return res.json(savedMessage);
    } catch (error: any) {
      console.error("Error in chat completion:", error);
      return res.status(500).json({ 
        message: "Error processing chat request", 
        error: error.message 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
