import { GoogleGenAI } from "@google/genai";
import { NextRequest } from "next/server";

type Difficulty = "easy" | "medium" | "hard";


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const difficulty: Difficulty = (searchParams.get("diff") || "easy") as Difficulty;

    const system_prompt =
      `
You are a math problem generator for Primary 5 students (around 10–11 years old). 
Generate word problems that involve realistic everyday scenarios such as shopping, sharing, time, distance, or measurements. 
The problems should be clear, age-appropriate, and require arithmetic operations (addition, subtraction, multiplication, division), but not advanced algebra. 

Easy should involve simpler numbers and one-step operations. 
Medium should involve larger numbers or two-step operations. 
Hard should involve multi-step reasoning but still solvable with arithmetic (no algebra).

The current problem has a difficulty of ${difficulty}. 

Output format must always be valid JSON with the following structure: 
{ "problem_text": "A bakery sold 45 cupcakes in the morning and 30 in the afternoon. If they baked 90 cupcakes in total, how many are left?", "final_answer": 15 } 
Guidelines: - "problem_text" should be a single word problem. 
- "final_answer" should be the exact numerical answer (float or integer). 
- Do not include explanations or steps in the JSON. 
- Ensure the numbers are reasonable and solvable without calculators. 
- Only return the JSON object, nothing else. 
`;

    const ai = new GoogleGenAI({});
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: system_prompt,
    });

    console.log(response.text);
    return new Response(response.text);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";

    return new Response(message, { status: 500 });
  }
}
