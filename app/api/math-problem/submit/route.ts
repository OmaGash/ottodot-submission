import { GoogleGenAI } from "@google/genai";
import { supabase } from "../../../../lib/supabaseClient";
import { MathAnswer, MathAnswerResponse } from "../../../types";

async function checkAnswer({ answer_text: answer, session_id }: MathAnswer) {
  try {
    let { data, error } = await supabase
      .from("math_problem_sessions")
      .select("*")
      .eq("id", session_id)
      .single();
    const result: boolean = data.correct_answer.toString() === answer;
    // console.log(data.correct_answer, answer, result);
    return new Response(result.toString(), { status: 200 });
  } catch (err) {
    return err;
  }
}

export async function POST(Req: Request) {
  try {
    const body: MathAnswer = await Req.json();

    //     const system_prompt = `

    // `;

    // const ai = new GoogleGenAI({});
    // const problem_raw = await ai.models.generateContent({
    //   model: "gemini-2.5-flash",
    //   contents: system_prompt,
    // });

    const result = await checkAnswer(body).then((res) => res.text());
    const response: MathAnswerResponse = {
      answer: body,
      correct: eval(result),
      feedback: "test feedback",
    };

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";

    return new Response(message, { status: 500 });
  }
}
