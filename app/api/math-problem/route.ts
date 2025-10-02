import { GoogleGenAI } from "@google/genai";

export async function GET(req: Request) {
  try {
    const ai = new GoogleGenAI({});
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Explain how AI works in a few words",
    });
    console.log(response.text);
  } catch (err) {}
}
