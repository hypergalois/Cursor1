export interface Problem {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct answer in options array
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  points: number;
  level: number;
  hint: string;
}
