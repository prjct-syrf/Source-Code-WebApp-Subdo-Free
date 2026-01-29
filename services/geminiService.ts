
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { ImageSize } from "../types";

// Check if user has selected an API key for Gemini 3 Pro models
export const checkApiKey = async (): Promise<boolean> => {
  if (typeof (window as any).aistudio?.hasSelectedApiKey === 'function') {
    return await (window as any).aistudio.hasSelectedApiKey();
  }
  return false;
};

// Open the API key selection dialog
export const openApiKeyDialog = async () => {
  if (typeof (window as any).aistudio?.openSelectKey === 'function') {
    await (window as any).aistudio.openSelectKey();
    return true;
  }
  return false;
};

export const generateSubdomainNames = async (prompt: string): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Brainstorm 10 creative, catchy, and professional subdomain names for a service with this description: "${prompt}". Return only a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const text = response.text || '[]';
    return JSON.parse(text);
  } catch (error) {
    console.error("Brainstorming failed:", error);
    return [];
  }
};

export const generateBrandVisual = async (prompt: string, size: ImageSize): Promise<string | null> => {
  // Ensure we use a fresh instance to catch the latest API Key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: `A high-quality, professional technology logo or brand asset for: ${prompt}. Modern, clean, flat design style.` }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: size as any // Cast because the SDK expects specific union types
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error: any) {
    console.error("Image generation failed:", error);
    if (error.message?.includes("Requested entity was not found")) {
        throw new Error("API_KEY_RESET");
    }
    return null;
  }
};

export const startChatSession = (systemInstruction: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: systemInstruction,
    },
  });
};
