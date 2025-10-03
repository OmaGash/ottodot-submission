import { GoogleGenAI } from "@google/genai";
import { supabase } from "../../../../lib/supabaseClient";
import { MathAnswer, MathAnswerResponse, MathSubmission } from "../../../types";

// interface MathSubmission {
//   session_id: string;
//   user_answer: number;
//   is_correct: boolean;
//   feedback_text: string;
// }

async function submit_answer({
  session_id,
  user_answer,
  is_correct,
  feedback_text,
}: MathSubmission) {
  try {
    const { data, error } = await supabase
      .from("math_problem_submissions")
      .insert([
        {
          session_id: session_id,
          user_answer: user_answer,
          is_correct: is_correct,
          feedback_text: feedback_text,
        },
      ])
      .select();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch ({ message }) {
    return new Response(message, { status: 500 });
  }
}

async function checkAnswer({ answer_text: answer, session_id }: MathAnswer) {
  try {
    let { data, error } = await supabase
      .from("math_problem_sessions")
      .select("*")
      .eq("id", session_id)
      .single();
    const result: boolean = data.correct_answer.toString() === answer;
    const response = { problem: data.problem_text, correct: result };
    // console.log(data.correct_answer, answer, result);
    return new Response(JSON.stringify(response), { status: 200 });
  } catch ({ message }) {
    return new Response(message, { status: 500 });
  }
}

async function getFeedback({ answer_text, problem_text }) {
  try {
    const system_prompt = `
      You are an intelligent math tutor. Your task is to generate personalized feedback for a student based on their answer to a problem. 
      
      You will receive the following information:
      - The original problem
      - The user's submitted answer
      
      Your feedback should be:
      1. Friendly and encouraging.
      2. Clear and concise.
      3. Highlight what the student did well if correct.
      4. If incorrect, gently explain the mistake and guide them toward the correct solution.
      5. Avoid being overly negative or judgmental.
      
      Format your response as a short paragraph suitable to display to the student.
      Output format must always be valid JSON with the following structure: 
        { "feedback": "Almost there! You answered 54, but the correct answer is 56. It looks like you made a small calculation error with multiplication. Try multiplying 7 by 8 again step by step—you’re really close, and with a little care, you’ll get it right next time!" } 

        Guidelines:
        - Only return the JSON object, nothing else. 
        - Do not include Markdown formatting.
      
      Here's the question and answer:
      Q: ${problem_text}
      A: ${answer_text}
          `;

    const ai = new GoogleGenAI({});
    const problem_raw = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: system_prompt,
    });

    return new Response(problem_raw.text, { status: 200 });
  } catch (err) {}
}

export async function POST(Req: Request) {
  try {
    const body: MathAnswer = await Req.json();

    const result = await checkAnswer(body).then((res) => res.json());

    const { feedback } = await getFeedback({
      answer_text: body.answer_text,
      problem_text: result.problem,
    }).then((res) => res.json());

    const response: MathAnswerResponse = {
      answer: body,
      correct: result.correct,
      feedback: feedback,
    };

    // console.log(
    await submit_answer({
      session_id: body.session_id,
      user_answer: body.answer_text,
      is_correct: result.correct,
      feedback_text: feedback,
    }).then((res) => res.json());
    // );

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";

    return new Response(message, { status: 500 });
  }
}
