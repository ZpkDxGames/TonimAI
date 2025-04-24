import { Groq } from "groq-sdk";

// Define the types we need
type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

// Initialize Groq client
export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || ""
});

// Function to get chat completion from Groq
export async function getGroqChatCompletion(messages: any[]) {
  try {
    // Request completion from Groq
    const completion = await groq.chat.completions.create({
      messages,
      model: "llama3-70b-8192", // Using Llama 3 70B model
      temperature: 0.7,
      max_tokens: 300
    });
    
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error in Groq chat completion:", error);
    throw error;
  }
}

// Available models in Groq
export const availableModels = [
  "llama3-70b-8192",  // Llama 3 70B (default)
  "llama3-8b-8192",   // Llama 3 8B
  "mixtral-8x7b-32768", // Mixtral 8x7B
  "gemma-7b-it"       // Gemma 7B
];