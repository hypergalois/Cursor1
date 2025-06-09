import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ProblemResult {
  userId: string;
  problemId: string;
  sessionId: string;
  correct: boolean;
  timeTaken: number; // en segundos
  difficulty: "easy" | "medium" | "hard";
  category: string; // scene type
  problemType: "suma" | "resta" | "multiplicacion" | "division";
  xpEarned: number;
  hintsUsed: number;
  timestamp: number;
  currentLevel: number;
  streakBefore: number;
  streakAfter: number;
  sceneId?: string; // ID de la escena específica
  missionProgress?: { [missionId: string]: number }; // Progreso de misiones
  achievementsUnlocked?: string[]; // Logros desbloqueados
  gemsEarned?: number; // Gemas ganadas
  starRating?: number; // 1-3 estrellas
}

export interface UserSession {
  sessionId: string;
  startTime: number;
  endTime?: number;
  totalProblems: number;
  correctAnswers: number;
  totalXp: number;
  maxStreak: number;
  averageTime: number;
  scenesVisited: string[];
  achievements: string[];
  gemsEarned: number;
  starsEarned: number;
  missionsProgress: { [missionId: string]: number };
  perfectProblems: number; // Problemas con 3 estrellas
  comboMultiplier: number; // Multiplicador máximo alcanzado
}

export interface StreakInfo {
  current: number;
  longest: number;
  lastActiveDate: Date | null;
  freezeAvailable: number;
  doubleXPActive: boolean;
  lastBreakDate?: Date;
  recoveredCount: number; // Veces que se ha recuperado la racha
}

export interface DailyMissionProgress {
  missionId: string;
  type: string;
  progress: number;
  target: number;
  completed: boolean;
  date: string; // Fecha de la misión
}

export interface SceneProgress {
  sceneId: string;
  problemsSolved: number;
  perfectSolutions: number;
  averageTime: number;
  accuracy: number;
  achievements: string[];
  firstCompletionDate?: Date;
  bestStreak: number;
  totalXP: number;
  gemsEarned: number;
  starsEarned: number;
}

export interface UserStats {
  totalProblems: number;
  totalCorrect: number;
  totalXp: number;
  currentLevel: number;
  maxStreak: number;
  averageTime: number;
  favoriteCategory: string;
  weakestCategory: string;
  streak: number;
  lives: number;
  lastSession: string;
  achievements: string[];
  dailyStats: {
    date: string;
    problems: number;
    xp: number;
    accuracy: number;
  }[];
  totalGems: number;
  totalStars: number;
  perfectProblems: number;
  missionsCompleted: number;
  ageGroup: "kids" | "teens" | "adults" | "seniors";
  streakInfo: StreakInfo;
  sceneProgress: { [sceneId: string]: SceneProgress };
  dailyMissions: DailyMissionProgress[];
  weeklyStats: {
    week: string;
    problems: number;
    xp: number;
    missions: number;
    achievements: number;
  }[];
  monthlyStats: {
    month: string;
    totalXP: number;
    streakDays: number;
    perfectDays: number;
    achievements: number;
  }[];
}

class UserProgressService {
  private static instance: UserProgressService;
  private currentSession: UserSession | null = null;
  private userId: string = "default_user"; // En una app real sería dinámico

  static getInstance(): UserProgressService {
    if (!UserProgressService.instance) {
      UserProgressService.instance = new UserProgressService();
    }
    return UserProgressService.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async startSession(): Promise<string> {
    const sessionId = this.generateSessionId();
    this.currentSession = {
      sessionId,
      startTime: Date.now(),
      totalProblems: 0,
      correctAnswers: 0,
      totalXp: 0,
      maxStreak: 0,
      averageTime: 0,
      scenesVisited: [],
      achievements: [],
      gemsEarned: 0,
      starsEarned: 0,
      missionsProgress: {},
      perfectProblems: 0,
      comboMultiplier: 1,
    };

    try {
      await AsyncStorage.setItem(
        `session_${sessionId}`,
        JSON.stringify(this.currentSession)
      );

      await this.updateDailyStreak();
    } catch (error) {
      console.error("Error saving session:", error);
    }

    return sessionId;
  }

  getCurrentSession(): UserSession | null {
    return this.currentSession;
  }

  async updateDailyStreak(): Promise<StreakInfo> {
    try {
      const stats = await this.getUserStats();
      if (!stats) {
        return this.initializeStreakInfo();
      }

      // Verificar y inicializar streakInfo si no existe
      if (!stats.streakInfo) {
        stats.streakInfo = this.initializeStreakInfo();
        await AsyncStorage.setItem("user_stats", JSON.stringify(stats));
      }

      const today = new Date();
      const todayString = today.toDateString();

      // Convertir lastActiveDate de string a Date si es necesario
      let lastActiveDate = stats.streakInfo.lastActiveDate;
      if (lastActiveDate && typeof lastActiveDate === "string") {
        lastActiveDate = new Date(lastActiveDate);
      }

      const lastActiveString = lastActiveDate?.toDateString();

      let updatedStreakInfo = { ...stats.streakInfo };

      if (lastActiveString !== todayString) {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toDateString();

        if (lastActiveString === yesterdayString) {
          updatedStreakInfo.current += 1;
          updatedStreakInfo.longest = Math.max(
            updatedStreakInfo.longest,
            updatedStreakInfo.current
          );
        } else if (lastActiveString) {
          updatedStreakInfo.lastBreakDate = new Date();
          updatedStreakInfo.current = 1;
        } else {
          updatedStreakInfo.current = 1;
        }

        updatedStreakInfo.lastActiveDate = today;

        updatedStreakInfo.doubleXPActive = updatedStreakInfo.current % 7 === 0;

        stats.streakInfo = updatedStreakInfo;
        await AsyncStorage.setItem("user_stats", JSON.stringify(stats));
      }

      return updatedStreakInfo;
    } catch (error) {
      console.error("Error updating daily streak:", error);
      return this.initializeStreakInfo();
    }
  }

  private initializeStreakInfo(): StreakInfo {
    return {
      current: 0,
      longest: 0,
      lastActiveDate: null,
      freezeAvailable: 2,
      doubleXPActive: false,
      recoveredCount: 0,
    };
  }

  async useStreakFreeze(): Promise<boolean> {
    try {
      const stats = await this.getUserStats();
      if (!stats || stats.streakInfo.freezeAvailable <= 0) {
        return false;
      }

      stats.streakInfo.freezeAvailable -= 1;
      await AsyncStorage.setItem("user_stats", JSON.stringify(stats));
      return true;
    } catch (error) {
      console.error("Error using streak freeze:", error);
      return false;
    }
  }

  async updateMissionProgress(
    missionType: string,
    amount: number = 1
  ): Promise<void> {
    try {
      const stats = await this.getUserStats();
      if (!stats) return;

      // Inicializar dailyMissions si no existe
      if (!stats.dailyMissions) {
        stats.dailyMissions = [];
      }

      const today = new Date().toDateString();
      let todayMissions = stats.dailyMissions.filter((m) => m.date === today);

      todayMissions.forEach((mission) => {
        if (mission.type === missionType && !mission.completed) {
          mission.progress = Math.min(
            mission.progress + amount,
            mission.target
          );
          mission.completed = mission.progress >= mission.target;

          if (mission.completed) {
            stats.missionsCompleted += 1;
          }
        }
      });

      if (this.currentSession) {
        if (!this.currentSession.missionsProgress[missionType]) {
          this.currentSession.missionsProgress[missionType] = 0;
        }
        this.currentSession.missionsProgress[missionType] += amount;
      }

      await AsyncStorage.setItem("user_stats", JSON.stringify(stats));
    } catch (error) {
      console.error("Error updating mission progress:", error);
    }
  }

  async updateSceneProgress(
    sceneId: string,
    result: ProblemResult
  ): Promise<void> {
    try {
      const stats = await this.getUserStats();
      if (!stats) return;

      if (!stats.sceneProgress[sceneId]) {
        stats.sceneProgress[sceneId] = {
          sceneId,
          problemsSolved: 0,
          perfectSolutions: 0,
          averageTime: 0,
          accuracy: 0,
          achievements: [],
          bestStreak: 0,
          totalXP: 0,
          gemsEarned: 0,
          starsEarned: 0,
        };
      }

      const sceneProgress = stats.sceneProgress[sceneId];
      const oldProblems = sceneProgress.problemsSolved;

      sceneProgress.problemsSolved += 1;
      if (result.correct) {
        const oldCorrect = sceneProgress.accuracy * oldProblems;
        sceneProgress.accuracy =
          (oldCorrect + 1) / sceneProgress.problemsSolved;
      } else {
        const oldCorrect = sceneProgress.accuracy * oldProblems;
        sceneProgress.accuracy = oldCorrect / sceneProgress.problemsSolved;
      }

      const totalTime =
        sceneProgress.averageTime * oldProblems + result.timeTaken;
      sceneProgress.averageTime = totalTime / sceneProgress.problemsSolved;

      if (result.starRating === 3) {
        sceneProgress.perfectSolutions += 1;
      }
      sceneProgress.bestStreak = Math.max(
        sceneProgress.bestStreak,
        result.streakAfter
      );
      sceneProgress.totalXP += result.xpEarned;
      sceneProgress.gemsEarned += result.gemsEarned || 0;
      sceneProgress.starsEarned += result.starRating || 0;

      if (!sceneProgress.firstCompletionDate && result.correct) {
        sceneProgress.firstCompletionDate = new Date();
      }

      await AsyncStorage.setItem("user_stats", JSON.stringify(stats));
    } catch (error) {
      console.error("Error updating scene progress:", error);
    }
  }

  async recordProblemResult(
    result: Omit<ProblemResult, "userId" | "sessionId">
  ): Promise<void> {
    const problemResult: ProblemResult = {
      ...result,
      userId: this.userId,
      sessionId: this.currentSession?.sessionId || (await this.startSession()),
    };

    try {
      const resultKey = `result_${problemResult.problemId}_${problemResult.timestamp}`;
      await AsyncStorage.setItem(resultKey, JSON.stringify(problemResult));

      if (this.currentSession) {
        this.currentSession.totalProblems++;
        if (result.correct) this.currentSession.correctAnswers++;
        this.currentSession.totalXp += result.xpEarned;
        this.currentSession.gemsEarned += result.gemsEarned || 0;
        this.currentSession.starsEarned += result.starRating || 0;
        this.currentSession.maxStreak = Math.max(
          this.currentSession.maxStreak,
          result.streakAfter
        );

        if (result.starRating === 3) {
          this.currentSession.perfectProblems++;
        }

        const totalTime =
          this.currentSession.averageTime *
            (this.currentSession.totalProblems - 1) +
          result.timeTaken;
        this.currentSession.averageTime =
          totalTime / this.currentSession.totalProblems;

        if (!this.currentSession.scenesVisited.includes(result.category)) {
          this.currentSession.scenesVisited.push(result.category);
        }

        await AsyncStorage.setItem(
          `session_${this.currentSession.sessionId}`,
          JSON.stringify(this.currentSession)
        );
      }

      await this.updateUserStats(problemResult);

      if (result.sceneId) {
        await this.updateSceneProgress(result.sceneId, problemResult);
      }

      await this.updateMissionProgress("problems", 1);
      if (result.correct) {
        await this.updateMissionProgress("accuracy", 1);
      }
      if (result.timeTaken < 10) {
        await this.updateMissionProgress("speed", 1);
      }
      if (result.starRating === 3) {
        await this.updateMissionProgress("mastery", 1);
      }

      await this.updateDailyStats(problemResult);
      await this.updateWeeklyStats(problemResult);
      await this.updateMonthlyStats(problemResult);
    } catch (error) {
      console.error("Error recording problem result:", error);
    }
  }

  private async updateUserStats(result: ProblemResult): Promise<void> {
    try {
      const statsString = await AsyncStorage.getItem("user_stats");
      let stats: UserStats = statsString
        ? JSON.parse(statsString)
        : {
            totalProblems: 0,
            totalCorrect: 0,
            totalXp: 0,
            currentLevel: 1,
            maxStreak: 0,
            averageTime: 0,
            favoriteCategory: "entrance",
            weakestCategory: "entrance",
            streak: 0,
            lives: 3,
            lastSession: "",
            achievements: [],
            dailyStats: [],
            totalGems: 0,
            totalStars: 0,
            perfectProblems: 0,
            missionsCompleted: 0,
            ageGroup: "adults",
            streakInfo: this.initializeStreakInfo(),
            sceneProgress: {},
            dailyMissions: [],
            weeklyStats: [],
            monthlyStats: [],
          };

      stats.totalProblems++;
      if (result.correct) stats.totalCorrect++;
      stats.totalXp += result.xpEarned;
      stats.totalGems += result.gemsEarned || 0;
      stats.totalStars += result.starRating || 0;
      if (result.starRating === 3) stats.perfectProblems++;

      stats.currentLevel = result.currentLevel;
      stats.maxStreak = Math.max(stats.maxStreak, result.streakAfter);
      stats.streak = result.streakAfter;
      stats.lastSession = result.sessionId;

      const totalTime =
        stats.averageTime * (stats.totalProblems - 1) + result.timeTaken;
      stats.averageTime = totalTime / stats.totalProblems;

      await this.updateCategoryStats(stats, result);

      if (result.achievementsUnlocked) {
        result.achievementsUnlocked.forEach((achievement) => {
          if (!stats.achievements.includes(achievement)) {
            stats.achievements.push(achievement);
          }
        });
      }

      await AsyncStorage.setItem("user_stats", JSON.stringify(stats));
    } catch (error) {
      console.error("Error updating user stats:", error);
    }
  }

  private async updateCategoryStats(
    stats: UserStats,
    result: ProblemResult
  ): Promise<void> {
    try {
      const categoryStatsString = await AsyncStorage.getItem("category_stats");
      const categoryStats = categoryStatsString
        ? JSON.parse(categoryStatsString)
        : {};

      if (!categoryStats[result.category]) {
        categoryStats[result.category] = {
          total: 0,
          correct: 0,
          averageTime: 0,
        };
      }

      const catStat = categoryStats[result.category];
      const oldTotal = catStat.total;
      catStat.total++;
      if (result.correct) catStat.correct++;

      const totalTime = catStat.averageTime * oldTotal + result.timeTaken;
      catStat.averageTime = totalTime / catStat.total;

      let bestCategory = "entrance";
      let bestAccuracy = 0;
      let worstCategory = "entrance";
      let worstAccuracy = 1;

      Object.entries(categoryStats).forEach(
        ([category, stat]: [string, any]) => {
          const accuracy = stat.correct / stat.total;
          if (accuracy > bestAccuracy) {
            bestAccuracy = accuracy;
            bestCategory = category;
          }
          if (accuracy < worstAccuracy) {
            worstAccuracy = accuracy;
            worstCategory = category;
          }
        }
      );

      stats.favoriteCategory = bestCategory;
      stats.weakestCategory = worstCategory;

      await AsyncStorage.setItem(
        "category_stats",
        JSON.stringify(categoryStats)
      );
    } catch (error) {
      console.error("Error updating category stats:", error);
    }
  }

  private async updateDailyStats(result: ProblemResult): Promise<void> {
    try {
      const today = new Date().toISOString().split("T")[0];
      const statsString = await AsyncStorage.getItem("user_stats");
      const stats: UserStats = statsString
        ? JSON.parse(statsString)
        : { dailyStats: [] };

      let todayStats = stats.dailyStats.find((day) => day.date === today);
      if (!todayStats) {
        todayStats = { date: today, problems: 0, xp: 0, accuracy: 0 };
        stats.dailyStats.push(todayStats);
      }

      const oldProblems = todayStats.problems;
      const oldCorrect = todayStats.accuracy * oldProblems;

      todayStats.problems++;
      todayStats.xp += result.xpEarned;
      todayStats.accuracy =
        (oldCorrect + (result.correct ? 1 : 0)) / todayStats.problems;

      stats.dailyStats = stats.dailyStats.slice(-30);

      await AsyncStorage.setItem("user_stats", JSON.stringify(stats));
    } catch (error) {
      console.error("Error updating daily stats:", error);
    }
  }

  private async updateWeeklyStats(result: ProblemResult): Promise<void> {
    try {
      const stats = await this.getUserStats();
      if (!stats) return;

      // Inicializar weeklyStats si no existe
      if (!stats.weeklyStats) {
        stats.weeklyStats = [];
      }

      const now = new Date();
      const weekYear = now.getFullYear();
      const weekNumber = this.getWeekNumber(now);
      const weekKey = `${weekYear}-W${weekNumber}`;

      let weekStats = stats.weeklyStats.find((w) => w.week === weekKey);
      if (!weekStats) {
        weekStats = {
          week: weekKey,
          problems: 0,
          xp: 0,
          missions: 0,
          achievements: 0,
        };
        stats.weeklyStats.push(weekStats);
      }

      weekStats.problems++;
      weekStats.xp += result.xpEarned;
      if (result.achievementsUnlocked) {
        weekStats.achievements += result.achievementsUnlocked.length;
      }

      stats.weeklyStats = stats.weeklyStats.slice(-12);

      await AsyncStorage.setItem("user_stats", JSON.stringify(stats));
    } catch (error) {
      console.error("Error updating weekly stats:", error);
    }
  }

  private async updateMonthlyStats(result: ProblemResult): Promise<void> {
    try {
      const stats = await this.getUserStats();
      if (!stats) return;

      // Inicializar monthlyStats si no existe
      if (!stats.monthlyStats) {
        stats.monthlyStats = [];
      }

      const now = new Date();
      const monthKey = `${now.getFullYear()}-${(now.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;

      let monthStats = stats.monthlyStats.find((m) => m.month === monthKey);
      if (!monthStats) {
        monthStats = {
          month: monthKey,
          totalXP: 0,
          streakDays: 0,
          perfectDays: 0,
          achievements: 0,
        };
        stats.monthlyStats.push(monthStats);
      }

      monthStats.totalXP += result.xpEarned;
      monthStats.streakDays = stats.streakInfo.current;
      if (result.starRating === 3) {
        monthStats.perfectDays++;
      }
      if (result.achievementsUnlocked) {
        monthStats.achievements += result.achievementsUnlocked.length;
      }

      stats.monthlyStats = stats.monthlyStats.slice(-12);

      await AsyncStorage.setItem("user_stats", JSON.stringify(stats));
    } catch (error) {
      console.error("Error updating monthly stats:", error);
    }
  }

  private getWeekNumber(date: Date): number {
    const d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }

  async getTodayMissions(): Promise<DailyMissionProgress[]> {
    try {
      const stats = await this.getUserStats();
      if (!stats) return [];

      const today = new Date().toDateString();
      return stats.dailyMissions.filter((mission) => mission.date === today);
    } catch (error) {
      console.error("Error getting today missions:", error);
      return [];
    }
  }

  // Obtener estadísticas del usuario
  async getUserStats(): Promise<UserStats | null> {
    try {
      const statsString = await AsyncStorage.getItem("user_stats");
      if (statsString) {
        const stats = JSON.parse(statsString);
        // Verificar y corregir streakInfo si no existe o está mal formado
        if (
          !stats.streakInfo ||
          typeof stats.streakInfo.current === "undefined"
        ) {
          stats.streakInfo = this.initializeStreakInfo();
          await AsyncStorage.setItem("user_stats", JSON.stringify(stats));
        }
        return stats;
      }
      return null;
    } catch (error) {
      console.error("Error getting user stats:", error);
      return null;
    }
  }

  // Obtener resultados de una sesión específica
  async getSessionResults(sessionId: string): Promise<ProblemResult[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const resultKeys = keys.filter(
        (key) => key.startsWith("result_") && key.includes(sessionId)
      );
      const results = await AsyncStorage.multiGet(resultKeys);

      return results
        .filter(([_, value]) => value !== null)
        .map(([_, value]) => JSON.parse(value!))
        .sort((a, b) => a.timestamp - b.timestamp);
    } catch (error) {
      console.error("Error getting session results:", error);
      return [];
    }
  }

  // Obtener estadísticas por categoría
  async getCategoryStats(): Promise<Record<string, any>> {
    try {
      const statsString = await AsyncStorage.getItem("category_stats");
      return statsString ? JSON.parse(statsString) : {};
    } catch (error) {
      console.error("Error getting category stats:", error);
      return {};
    }
  }

  // Limpiar datos (para testing o reset)
  async clearAllData(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const userKeys = keys.filter(
        (key) =>
          key.startsWith("user_") ||
          key.startsWith("session_") ||
          key.startsWith("result_") ||
          key.startsWith("category_")
      );
      await AsyncStorage.multiRemove(userKeys);
      this.currentSession = null;
    } catch (error) {
      console.error("Error clearing user data:", error);
    }
  }

  // Obtener recomendaciones basadas en el rendimiento
  async getPersonalizedRecommendations(): Promise<string[]> {
    const stats = await this.getUserStats();
    const categoryStats = await this.getCategoryStats();
    const recommendations: string[] = [];

    if (!stats) return ["¡Comienza resolviendo algunos problemas!"];

    const accuracy = stats.totalCorrect / stats.totalProblems;

    // Recomendaciones basadas en precisión
    if (accuracy < 0.6) {
      recommendations.push(
        "Practica más problemas básicos para mejorar tu precisión"
      );
    } else if (accuracy > 0.9) {
      recommendations.push(
        "¡Excelente precisión! Intenta problemas más desafiantes"
      );
    }

    // Recomendaciones basadas en velocidad
    if (stats.averageTime > 30) {
      recommendations.push(
        "Intenta resolver los problemas más rápido para ganar bonus de velocidad"
      );
    } else if (stats.averageTime < 10) {
      recommendations.push("¡Velocidad increíble! Eres un verdadero maestro");
    }

    // Recomendaciones basadas en categorías débiles
    if (stats.weakestCategory !== stats.favoriteCategory) {
      recommendations.push(
        `Practica más problemas de ${stats.weakestCategory} para equilibrar tus habilidades`
      );
    }

    // Recomendaciones basadas en racha
    if (stats.maxStreak < 3) {
      recommendations.push(
        "Enfócate en mantener rachas más largas para ganar más XP"
      );
    }

    return recommendations.length > 0
      ? recommendations
      : ["¡Sigue así! Tu rendimiento es excelente"];
  }
}

export default UserProgressService;
