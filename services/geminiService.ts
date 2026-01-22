import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
const getClient = () => {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("Gemini API Key is missing. Ensure REACT_APP_GEMINI_API_KEY is set in your .env file.");
    return null;
  }

  return new GoogleGenAI({ apiKey });
};

export const getRecommendation = async (userQuery: string): Promise<string> => {
  const client = getClient();
  if (!client) {
    return "Configuration Error: Gemini API Key is missing. Please add REACT_APP_GEMINI_API_KEY to your .env file.";
  }

  try {
    const model = 'gemini-2.0-flash-exp';
    
    const systemPrompt = `You are an expert movie and TV show concierge for "UniWatch". 
    Recommend 3 items based on the user's request. Keep it short, punchy, and enthusiastic. 
    Format the response as a list with titles and brief descriptions.`;

    const response = await client.models.generateContent({
      model,
      contents: userQuery,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    });

    return response.text || "I couldn't find anything matching that description.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the recommendation engine right now.";
  }
};