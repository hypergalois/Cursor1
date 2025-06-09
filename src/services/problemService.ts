import { Problem } from "../types/Problem";
import { mockProblems } from "../data/mockProblems";

export const problemService = {
  getProblems: async (): Promise<Problem[]> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockProblems;
  },

  getProblemById: async (id: string): Promise<Problem | undefined> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockProblems.find((problem) => problem.id === id);
  },

  getProblemsByLevel: async (level: number): Promise<Problem[]> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 400));
    return mockProblems.filter((problem) => problem.level === level);
  },

  getProblemsByCategory: async (category: string): Promise<Problem[]> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 400));
    return mockProblems.filter((problem) => problem.category === category);
  },
};
