import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ProgressData {
  userId: string;
  totalXP: number;
  totalStars: number;
  currentLevel: number;
  problemsSolved: number;
  accuracyRate: number;
  currentStreak: number;
  achievements: string[];
  lastSessionDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

class ProgressTrackingService {
  private static instance: ProgressTrackingService;
  private userId: string = "default_user";

  static getInstance(): ProgressTrackingService {
    if (!ProgressTrackingService.instance) {
      ProgressTrackingService.instance = new ProgressTrackingService();
    }
    return ProgressTrackingService.instance;
  }

  async getProgress(): Promise<ProgressData | null> {
    try {
      const progressString = await AsyncStorage.getItem(
        `progress_${this.userId}`
      );
      if (!progressString) return null;

      const progress = JSON.parse(progressString);
      progress.lastSessionDate = new Date(progress.lastSessionDate);
      progress.createdAt = new Date(progress.createdAt);
      progress.updatedAt = new Date(progress.updatedAt);

      return progress;
    } catch (error) {
      console.error("Error getting progress:", error);
      return null;
    }
  }

  async updateProgress(updates: Partial<ProgressData>): Promise<void> {
    try {
      const currentProgress =
        (await this.getProgress()) || this.createInitialProgress();

      const updatedProgress: ProgressData = {
        ...currentProgress,
        ...updates,
        updatedAt: new Date(),
      };

      await AsyncStorage.setItem(
        `progress_${this.userId}`,
        JSON.stringify(updatedProgress)
      );
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  }

  private createInitialProgress(): ProgressData {
    return {
      userId: this.userId,
      totalXP: 0,
      totalStars: 0,
      currentLevel: 1,
      problemsSolved: 0,
      accuracyRate: 0,
      currentStreak: 0,
      achievements: [],
      lastSessionDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}

export default ProgressTrackingService;
