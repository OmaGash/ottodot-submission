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
