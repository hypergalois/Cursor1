import problemsData from "../data/problems.json";
import { Problem } from "../types/Problem";
import { UserStats } from "../context/UserContext";

const problems: Problem[] = problemsData as unknown as Problem[];

export const selectNextProblem = (stats: UserStats): Problem => {
  // Regla muy simple: dificultad según nivel
  let difficulty: "easy" | "medium" | "hard" = "easy";
  if (stats.level >= 3) difficulty = "hard";
  else if (stats.level >= 2) difficulty = "medium";

  const pool = problems.filter((p) => p.difficulty === difficulty);
  if (pool.length === 0)
    return problems[Math.floor(Math.random() * problems.length)];
  return pool[Math.floor(Math.random() * pool.length)];
};
