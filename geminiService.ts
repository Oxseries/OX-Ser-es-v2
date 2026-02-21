
import { GoogleGenAI } from "@google/genai";
import { Message } from "./types";

// Lazy initialization to prevent crash if API key is missing
let aiInstance: any = null;

const getAI = () => {
  if (!aiInstance) {
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("Gemini API Key is missing. AI features will not work.");
      return null;
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

export const getSkincareAdvice = async (history: Message[], language: 'tr' | 'en') => {
  const ai = getAI();
  if (!ai) {
    return language === 'tr' 
      ? "Üzgünüm, şu anda AI asistanına bağlanılamıyor. Lütfen daha sonra tekrar deneyin."
      : "I'm sorry, I cannot connect to the AI assistant right now. Please try again later.";
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: history.map(m => ({
      parts: [{ text: m.content }],
      role: m.role === 'user' ? 'user' : 'model'
    })),
    config: {
      systemInstruction: `You are an expert skincare consultant for OX SERIES, a luxury brand. 
      The product range includes:
      1. OX Serum Peeling (Hero Product): Collagen-based gentle exfoliation with a "rolling" effect. Good for all skin types. Increases elasticity.
      2. Gel Cleanser: Gentle preparation, pH balanced. Use before peeling.
      3. Moisturizing Cream: Intensive hydration with Collagen and Panthenol. Use after peeling to lock in moisture.

      Personalized Recommendation Logic:
      - Oily/Combination: Recommend Gel Cleanser + Peeling (3x/week) + Light layer of Moisturizing Cream.
      - Dry: Recommend Peeling (1-2x/week) + Generous Moisturizing Cream.
      - Sensitive: Recommend Peeling (1x/week, short 1-min massage) + Moisturizing Cream immediately after.
      - Anti-Aging: Emphasize the Collagen and Resveratrol benefits. Recommend the full routine 3x/week.

      IMPORTANT SAFETY & SCOPE RULES:
      - You are a cosmetic consultant, NOT a medical professional or dermatologist.
      - DO NOT provide medical advice, diagnoses, or treatments for skin diseases (like eczema, psoriasis, or severe acne).
      - If a user asks for medical advice, politely state that you are a cosmetic specialist and they should consult a medical professional for clinical concerns.
      - Focus exclusively on cosmetic benefits and luxury skincare routines using OX SERIES products.

      Instructions:
      - If the user hasn't specified their skin type, politely ask.
      - Provide a "Routine Table" or a clear step-by-step list in your response.
      - Mention key ingredients like Panthenol B5, Vitamin E, and Resveratrol where appropriate.
      - Language: Respond in ${language === 'tr' ? 'Turkish' : 'English'}.
      - Tone: Professional, luxurious, helpful, and concise.`
    }
  });

  // Directly access the text property on GenerateContentResponse as per guidelines
  return response.text;
};
