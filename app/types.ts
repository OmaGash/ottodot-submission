export type Difficulty = "easy" | "medium" | "hard";

export interface MathProblem {
  problem_text: string;
  final_answer: number;
}

export interface MathProblemResponse {
  problem: MathProblem;
  session_id: string;
  created_at: string;
}

export interface MathProblemOptions {
  difficulty?: Difficulty;
}

export interface MathAnswer {
  session_id: string;
  answer_text: number;
}

export interface MathAnswerResponse {
  answer: MathAnswer;
  correct: boolean;
  feedback: string;
}

export interface MathSubmission {
  session_id: string;
  user_answer: number;
  is_correct: boolean;
  feedback_text: string;
}
