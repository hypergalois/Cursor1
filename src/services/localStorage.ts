import AsyncStorage from "@react-native-async-storage/async-storage";
import { Problem } from "../data/mockProblems";

const STORAGE_KEYS = {
  USER_PROGRESS: "@minotauro:userProgress",
  SOLVED_PROBLEMS: "@minotauro:solvedProblems",
  USER_STATS: "@minotauro:userStats",
};

interface UserProgress {
  problemsSolved: number;
  correctAnswers: number;
  totalStars: number;
  competences: { [key: string]: number };
}

interface UserStats {
  name: string;
  level: number;
  lastActive: string;
}

export const saveUserProgress = async (
  progress: UserProgress
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_PROGRESS,
      JSON.stringify(progress)
    );
  } catch (error) {
    console.error("Error saving user progress:", error);
    throw error;
  }
};

export const getUserProgress = async (): Promise<UserProgress | null> => {
  try {
    const progress = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
    return progress ? JSON.parse(progress) : null;
  } catch (error) {
    console.error("Error getting user progress:", error);
    throw error;
  }
};

export const saveSolvedProblem = async (problem: Problem): Promise<void> => {
  try {
    const solvedProblems = await getSolvedProblems();
    solvedProblems.push(problem);
    await AsyncStorage.setItem(
      STORAGE_KEYS.SOLVED_PROBLEMS,
      JSON.stringify(solvedProblems)
    );
  } catch (error) {
    console.error("Error saving solved problem:", error);
    throw error;
  }
};

export const getSolvedProblems = async (): Promise<Problem[]> => {
  try {
    const problems = await AsyncStorage.getItem(STORAGE_KEYS.SOLVED_PROBLEMS);
    return problems ? JSON.parse(problems) : [];
  } catch (error) {
    console.error("Error getting solved problems:", error);
    throw error;
  }
};

export const saveUserStats = async (stats: UserStats): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
  } catch (error) {
    console.error("Error saving user stats:", error);
    throw error;
  }
};

export const getUserStats = async (): Promise<UserStats | null> => {
  try {
    const stats = await AsyncStorage.getItem(STORAGE_KEYS.USER_STATS);
    return stats ? JSON.parse(stats) : null;
  } catch (error) {
    console.error("Error getting user stats:", error);
    throw error;
  }
};

export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER_PROGRESS,
      STORAGE_KEYS.SOLVED_PROBLEMS,
      STORAGE_KEYS.USER_STATS,
    ]);
  } catch (error) {
    console.error("Error clearing data:", error);
    throw error;
  }
};
