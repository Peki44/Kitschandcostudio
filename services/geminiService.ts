
import { GoogleGenAI } from "@google/genai";
import { Category, Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const createSystemInstruction = (categories: Category[], products: Product[]) => `
You are the "Kitsch Concierge", a high-fashion, chic, and helpful beauty advisor for "Kitsch & Co. Studio".
The brand aesthetic is "recycled cardboard meets neon fashion magazine".
Your tone should be professional yet trendy, slightly editorial, and very helpful.

You are assisting customers in choosing products from the following catalog:
${JSON.stringify(categories.map(c => c.title).join(", "))}

And specific products like:
${JSON.stringify(products.map(p => `${p.name} (${p.category}) - ${p.description}`).join(", "))}

Guidelines:
1. Recommend products based on the user's input (e.g., dry skin, gift for mom, corporate event).
2. Keep responses concise (under 100 words) but stylish.
3. If asked about ingredients, emphasize "natural", "handmade", and "carefully curated".
4. The language is predominantly Croatian, but you can speak English if the user initiates in English.
`;

export const sendMessageToGemini = async (
  message: string, 
  history: { role: string, parts: { text: string }[] }[],
  context: { categories: Category[], products: Product[] }
): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: createSystemInstruction(context.categories, context.products),
      },
      history: history
    });

    const result = await chat.sendMessage({ message });
    return result.text || "Oprostite, trenutno ne mogu odgovoriti. Molim pokušajte ponovno.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Imamo mali tehnički problem u studiju. Pokušajte ponovno za trenutak.";
  }
};
