import AsyncStorage from "@react-native-async-storage/async-storage";
import { Problem } from "../types/Problem";
import { GameState } from "../context/GameStateProvider";

const STORAGE_KEYS = {
  PROBLEMS: "@math_game/problems",
  GAME_STATE: "@math_game/game_state",
  LAST_SYNC: "@math_game/last_sync",
  OFFLINE_PROGRESS: "@math_game/offline_progress",
};

export interface OfflineProgress {
  timestamp: number;
  score: number;
  completedProblems: string[];
  experience: number;
}

class StorageService {
  // Cache problems locally
  async cacheProblems(problems: Problem[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.PROBLEMS,
        JSON.stringify(problems)
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.LAST_SYNC,
        new Date().toISOString()
      );
    } catch (error) {
      console.error("Error caching problems:", error);
      throw error;
    }
  }

  // Get cached problems
  async getCachedProblems(): Promise<Problem[]> {
    try {
      const problemsJson = await AsyncStorage.getItem(STORAGE_KEYS.PROBLEMS);
      return problemsJson ? JSON.parse(problemsJson) : [];
    } catch (error) {
      console.error("Error getting cached problems:", error);
      return [];
    }
  }

  // Save game state
  async saveGameState(gameState: GameState): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.GAME_STATE,
        JSON.stringify(gameState)
      );
    } catch (error) {
      console.error("Error saving game state:", error);
      throw error;
    }
  }

  // Get saved game state
  async getGameState(): Promise<GameState | null> {
    try {
      const gameStateJson = await AsyncStorage.getItem(STORAGE_KEYS.GAME_STATE);
      return gameStateJson ? JSON.parse(gameStateJson) : null;
    } catch (error) {
      console.error("Error getting game state:", error);
      return null;
    }
  }

  // Save offline progress
  async saveOfflineProgress(progress: OfflineProgress): Promise<void> {
    try {
      const existingProgress = await this.getOfflineProgress();
      const updatedProgress = {
        ...existingProgress,
        ...progress,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(
        STORAGE_KEYS.OFFLINE_PROGRESS,
        JSON.stringify(updatedProgress)
      );
    } catch (error) {
      console.error("Error saving offline progress:", error);
      throw error;
    }
  }

  // Get offline progress
  async getOfflineProgress(): Promise<OfflineProgress | null> {
    try {
      const progressJson = await AsyncStorage.getItem(
        STORAGE_KEYS.OFFLINE_PROGRESS
      );
      return progressJson ? JSON.parse(progressJson) : null;
    } catch (error) {
      console.error("Error getting offline progress:", error);
      return null;
    }
  }

  // Clear offline progress after successful sync
  async clearOfflineProgress(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.OFFLINE_PROGRESS);
    } catch (error) {
      console.error("Error clearing offline progress:", error);
      throw error;
    }
  }

  // Get last sync timestamp
  async getLastSync(): Promise<Date | null> {
    try {
      const lastSync = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
      return lastSync ? new Date(lastSync) : null;
    } catch (error) {
      console.error("Error getting last sync:", error);
      return null;
    }
  }

  // Check if data needs sync (e.g., if last sync was more than 24 hours ago)
  async needsSync(): Promise<boolean> {
    try {
      const lastSync = await this.getLastSync();
      if (!lastSync) return true;

      const ONE_DAY = 24 * 60 * 60 * 1000;
      return Date.now() - lastSync.getTime() > ONE_DAY;
    } catch (error) {
      console.error("Error checking sync status:", error);
      return true;
    }
  }

  // Get problems (alias for getCachedProblems)
  async getProblems(): Promise<Problem[]> {
    return this.getCachedProblems();
  }

  // Save problems (alias for cacheProblems)
  async saveProblems(problems: Problem[]): Promise<void> {
    return this.cacheProblems(problems);
  }

  // Get local progress (alias for getOfflineProgress)
  async getLocalProgress(): Promise<OfflineProgress | null> {
    return this.getOfflineProgress();
  }

  // Save local progress (alias for saveOfflineProgress)
  async saveLocalProgress(progress: OfflineProgress): Promise<void> {
    return this.saveOfflineProgress(progress);
  }

  // Clear local progress (alias for clearOfflineProgress)
  async clearLocalProgress(): Promise<void> {
    return this.clearOfflineProgress();
  }
}

export const storageService = new StorageService();
