import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeSecurityReport = async (description: string, type: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      You are a neighborhood security AI assistant. 
      A user is reporting a security incident.
      Type: ${type}
      Description: ${description}
      
      Provide a very brief (max 2 sentences) safety advice for the reporter. 
      If it sounds like an emergency, emphasize calling the police immediately.
      Tone: Calm, authoritative, and helpful.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Report received. Please stay safe.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Unable to generate AI advice at this moment. Proceed with caution.";
  }
};

export const getSafetyChatResponse = async (message: string, history: string[]): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const systemInstruction = "You are 'Siskamling AI', a helpful neighborhood security assistant. You answer questions about home safety, emergency preparedness, and community guidelines. Keep answers concise and practical.";
    
    // Construct a simple history context for single-turn logic or use chat if needed. 
    // For simplicity in this helper, we'll just send the message with context.
    
    const response = await ai.models.generateContent({
      model: model,
      contents: message,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "I couldn't understand that. How can I help with your safety?";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I'm having trouble connecting to the safety database. Please try again later.";
  }
};