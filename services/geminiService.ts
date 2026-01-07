
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the GoogleGenAI client with the API key from environment variables.
// Following the instructions to instantiate it right before use to ensure the latest key is used.

export const generateChecklist = async (siteType: string, context: string): Promise<string[]> => {
  // Always use new GoogleGenAI({ apiKey: process.env.API_KEY })
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const prompt = `Génère une liste de tâches (checklist) pour un chantier de type : "${siteType}". Contexte supplémentaire : ${context}. Retourne uniquement un tableau JSON de chaînes de caractères (strings).`;

    const response = await ai.models.generateContent({
      // Use 'gemini-3-flash-preview' for basic text tasks as recommended.
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    // Directly access the text property as it's a getter, not a method.
    const text = response.text;
    if (!text) return [];

    const tasks = JSON.parse(text);
    return Array.isArray(tasks) ? tasks : [];
  } catch (error) {
    console.error("Error generating checklist:", error);
    throw new Error("Erreur lors de la génération de la checklist par l'IA.");
  }
};
