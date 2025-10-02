export type Difficulty = "easy" | "medium" | "hard";

export interface MathProblem {
  problem_text: string;
  final_answer: number;
}

export interface MathProblemOptions {
  difficulty?: Difficulty;
}
