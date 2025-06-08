import axios from "axios";
import { Problem } from "../data/mockProblems";

const API_BASE_URL = "https://api.minotauro.com"; // Replace with actual API URL

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getProblem = async (problemId: string): Promise<Problem> => {
  try {
    const response = await api.get(`/problems/${problemId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching problem:", error);
    throw error;
  }
};

export const getRecommendedProblem = async (
  userId: string
): Promise<Problem> => {
  try {
    const response = await api.get(`/recommend?user_id=${userId}`);
    return response.data;
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
    const response = await api.post("/submit-answer", {
      problemId,
      answer,
      userId,
    });
    return response.data;
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
