import { GoogleGenAI } from "@google/genai";
import {
  ArithmeticType,
  Difficulty,
  MathProblem,
  MathProblemOptions,
  MathProblemResponse,
} from "../../types";
import { supabase } from "../../../lib/supabaseClient";

async function submit_question(Problem: MathProblem) {
  try {
    const { problem_text, final_answer } = Problem;
    const { data, error } = await supabase
      .from("math_problem_sessions")
      .insert([
        {
          problem_text: problem_text,
          correct_answer: final_answer,
        },
      ])
      .select();
    // console.log(data[0], error);
    if (error) throw error;
    return data[0];
  } catch (err) {
    return err;
  }
}

export async function POST(Req: Request) {
  try {
    const body: MathProblemOptions = await Req.json();

    // return new Response(JSON.stringify({ message: "Test response", data: body }), {
    //   status: 200,
    //   headers: { "Content-Type": "application/json" },
    // });

    const difficulty: Difficulty = (body.difficulty || "easy") as Difficulty;
    const arithType: ArithmeticType = (body.type || "any") as ArithmeticType;

    const system_prompt = `
You are a math problem generator for Primary 5 students (around 10–11 years old). 
Generate word problems that involve realistic everyday scenarios such as shopping, sharing, time, distance, or measurements. 
The problems should be clear, age-appropriate, and require arithmetic operations (addition, subtraction, multiplication, division), but not advanced algebra. 

Easy should involve simpler numbers and one-step operations. 
Medium should involve larger numbers or two-step operations. 
Hard should involve multi-step reasoning but still solvable with arithmetic (no algebra).

The current problem has a difficulty of ${difficulty}. 
${
  arithType === "any"
    ? ""
    : `The arithmetic operation for this problem should be ${arithType}.`
}
Output format must always be valid JSON with the following structure: 
{
  "problem_text": "A bakery sold 45 cupcakes in the morning and 30 in the afternoon. If they baked 90 cupcakes in total, how many are left?",
  "final_answer": 15,
  "solution": "The bakery baked 90 cupcakes, sold 45 in the morning and 30 in the afternoon (45 + 30 = 75), so 90 - 75 = 15 cupcakes are left."
  "hint": Add the number of cupcakes sold in the morning and afternoon, then subtract that total from the number of cupcakes baked.
} 
Guidelines:
- "problem_text" should be a single word problem. 
- "final_answer" should be the exact numerical answer (float or integer). 
- Do not include explanations or steps in the JSON. 
- Ensure the numbers are reasonable and solvable without calculators. 
- Only return the JSON object, nothing else. 
- Do not include Markdown formatting.
- Do not include any step-by-step solutions and final answer in the hint.
`;
    // console.log(system_prompt);
    const ai = new GoogleGenAI({});
    const problem_raw = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: system_prompt,
    });
    const problem: MathProblem = JSON.parse(problem_raw.text);

    const { id, created_at } = await submit_question(problem);

    // console.log(id, created_at);

    const problem_response: MathProblemResponse = {
      problem: problem,
      session_id: id,
      created_at: created_at,
    };
    return new Response(JSON.stringify(problem_response), { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";

    return new Response(message, { status: 500 });
  }
}
