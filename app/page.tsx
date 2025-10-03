"use client";

import { useState } from "react";
import {
  ArithmeticType,
  Difficulty,
  MathAnswerResponse,
  MathProblem,
  MathProblemOptions,
  MathProblemResponse,
} from "./types";
import MathOption from "./components/MathOption";

export default function Home() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [problemType, setProblemType] = useState<ArithmeticType>("any");
  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const generateProblem = async (
    options: MathProblemOptions = { difficulty: "easy", type: "any" }
  ) => {
    // TODO: Implement problem generation logic
    // This should call your API route to generate a new problem
    // and save it to the database
    setIsLoading(true);
    const response = await fetch("/api/math-problem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    });
    const parsedResponse: MathProblemResponse = await response.json();
    setProblem(parsedResponse.problem);
    setSessionId(parsedResponse.session_id);
    // console.log(sessionId);
    setIsLoading(false);
  };

  const submitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement answer submission logic
    // This should call your API route to check the answer,
    // save the submission, and generate feedback
    setIsLoading(true);
    const response = await fetch("/api/math-problem/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ session_id: sessionId, answer_text: userAnswer }),
    });
    const parsedResponse: MathAnswerResponse = await response.json();
    setIsCorrect(parsedResponse.correct);
    setFeedback(parsedResponse.feedback);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Math Problem Generator
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <MathOption
            propValue={difficulty}
            propSetter={setDifficulty}
            title="difficulty"
            isLoading={isLoading}
            options={[
              { value: "easy", label: "Easy" },
              { value: "medium", label: "Medium" },
              { value: "hard", label: "Hard" },
            ]}
          />
          <MathOption
            propValue={problemType}
            propSetter={setProblemType}
            title="arithmetic operation"
            isLoading={isLoading}
            options={[
              { value: "any", label: "Any" },
              { value: "addition", label: "Addition" },
              { value: "subtraction", label: "Subtraction" },
              { value: "multiplication", label: "Multiplication" },
              { value: "division", label: "Division" },
            ]}
          />
          <button
            onClick={() =>
              generateProblem({
                difficulty: difficulty,
                type: problemType,
              })
            }
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
          >
            {isLoading ? "Generating..." : "Generate New Problem"}
          </button>
        </div>

        {problem && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Problem:
            </h2>
            <p className="text-lg text-gray-800 leading-relaxed mb-6">
              {problem.problem_text}
            </p>

            <form onSubmit={submitAnswer} className="space-y-4">
              <div>
                <label
                  htmlFor="answer"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Your Answer:
                </label>
                <input
                  type="number"
                  id="answer"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your answer"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!userAnswer || isLoading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
              >
                Submit Answer
              </button>
            </form>
          </div>
        )}

        {feedback && (
          <div
            className={`rounded-lg shadow-lg p-6 ${
              isCorrect
                ? "bg-green-50 border-2 border-green-200"
                : "bg-yellow-50 border-2 border-yellow-200"
            }`}
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              {isCorrect ? "✅ Correct!" : "❌ Not quite right"}
            </h2>
            <p className="text-gray-800 leading-relaxed">{feedback}</p>
          </div>
        )}
      </main>
    </div>
  );
}
