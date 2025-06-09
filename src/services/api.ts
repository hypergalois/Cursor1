import { Problem } from "../types/Problem";
import { mockProblems } from "../data/mockProblems";

export const getProblem = async (problemId: string): Promise<Problem> => {
  try {
    const problem = mockProblems.find((p) => p.id === problemId);
    if (!problem) {
      throw new Error("Problem not found");
    }
    return problem;
  } catch (error) {
    console.error("Error fetching problem:", error);
    throw error;
  }
};

export const getRecommendedProblem = async (
  userId: string
): Promise<Problem> => {
  try {
    // For now, just return a random problem from mock data
    const randomIndex = Math.floor(Math.random() * mockProblems.length);
    return mockProblems[randomIndex];
  } catch (error) {
    console.error("Error getting recommended problem:", error);
    throw error;
  }
};

export const submitAnswer = async (
  problemId: string,
  answer: string,
  userId: string
): Promise<{ isCorrect: boolean; score: number }> => {
  try {
    const problem = mockProblems.find((p) => p.id === problemId);
    if (!problem) {
      throw new Error("Problem not found");
    }

    const isCorrect = problem.options[problem.correctAnswer] === answer;
    return {
      isCorrect,
      score: isCorrect ? problem.points : 0,
    };
  } catch (error) {
    console.error("Error submitting answer:", error);
    throw error;
  }
};

export const updateUserProgress = async (
  userId: string,
  progress: {
    problemsSolved: number;
    correctAnswers: number;
    totalStars: number;
    competences: { [key: string]: number };
  }
): Promise<void> => {
  try {
    await api.post(`/users/${userId}/progress`, progress);
  } catch (error) {
    console.error("Error updating user progress:", error);
    throw error;
  }
};
