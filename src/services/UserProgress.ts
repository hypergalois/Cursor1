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

  // Generar ID único para la sesión
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Iniciar nueva sesión
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
    };

    try {
      await AsyncStorage.setItem(
        `session_${sessionId}`,
        JSON.stringify(this.currentSession)
      );
    } catch (error) {
      console.error("Error saving session:", error);
    }

    return sessionId;
  }

  // Registrar resultado de problema
  async recordProblemResult(
    result: Omit<ProblemResult, "userId" | "sessionId">
  ): Promise<void> {
    const problemResult: ProblemResult = {
      ...result,
      userId: this.userId,
      sessionId: this.currentSession?.sessionId || (await this.startSession()),
    };

    try {
      // Guardar resultado individual
      const resultKey = `result_${problemResult.problemId}_${problemResult.timestamp}`;
      await AsyncStorage.setItem(resultKey, JSON.stringify(problemResult));

      // Actualizar sesión actual
      if (this.currentSession) {
        this.currentSession.totalProblems++;
        if (result.correct) this.currentSession.correctAnswers++;
        this.currentSession.totalXp += result.xpEarned;
        this.currentSession.maxStreak = Math.max(
          this.currentSession.maxStreak,
          result.streakAfter
        );

        // Calcular tiempo promedio
        const totalTime =
          this.currentSession.averageTime *
            (this.currentSession.totalProblems - 1) +
          result.timeTaken;
        this.currentSession.averageTime =
          totalTime / this.currentSession.totalProblems;

        // Agregar escena si no está ya
        if (!this.currentSession.scenesVisited.includes(result.category)) {
          this.currentSession.scenesVisited.push(result.category);
        }

        await AsyncStorage.setItem(
          `session_${this.currentSession.sessionId}`,
          JSON.stringify(this.currentSession)
        );
      }

      // Actualizar estadísticas globales del usuario
      await this.updateUserStats(problemResult);

      // Actualizar estadísticas diarias
      await this.updateDailyStats(problemResult);
    } catch (error) {
      console.error("Error recording problem result:", error);
    }
  }

  // Actualizar estadísticas globales del usuario
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
          };

      // Actualizar estadísticas
      stats.totalProblems++;
      if (result.correct) stats.totalCorrect++;
      stats.totalXp += result.xpEarned;
      stats.currentLevel = result.currentLevel;
      stats.maxStreak = Math.max(stats.maxStreak, result.streakAfter);
      stats.streak = result.streakAfter;
      stats.lastSession = result.sessionId;

      // Calcular tiempo promedio global
      const totalTime =
        stats.averageTime * (stats.totalProblems - 1) + result.timeTaken;
      stats.averageTime = totalTime / stats.totalProblems;

      // Actualizar categorías favoritas y débiles
      await this.updateCategoryStats(stats, result);

      await AsyncStorage.setItem("user_stats", JSON.stringify(stats));
    } catch (error) {
      console.error("Error updating user stats:", error);
    }
  }

  // Actualizar estadísticas de categorías
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

      // Actualizar tiempo promedio de la categoría
      const totalTime = catStat.averageTime * oldTotal + result.timeTaken;
      catStat.averageTime = totalTime / catStat.total;

      // Determinar categoría favorita (mejor accuracy)
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

  // Actualizar estadísticas diarias
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

      // Mantener solo los últimos 30 días
      stats.dailyStats = stats.dailyStats.slice(-30);

      await AsyncStorage.setItem("user_stats", JSON.stringify(stats));
    } catch (error) {
      console.error("Error updating daily stats:", error);
    }
  }

  // Finalizar sesión actual
  async endSession(): Promise<UserSession | null> {
    if (!this.currentSession) return null;

    this.currentSession.endTime = Date.now();

    try {
      await AsyncStorage.setItem(
        `session_${this.currentSession.sessionId}`,
        JSON.stringify(this.currentSession)
      );
      const session = this.currentSession;
      this.currentSession = null;
      return session;
    } catch (error) {
      console.error("Error ending session:", error);
      return null;
    }
  }

  // Obtener sesión actual
  getCurrentSession(): UserSession | null {
    return this.currentSession;
  }

  // Obtener estadísticas del usuario
  async getUserStats(): Promise<UserStats | null> {
    try {
      const statsString = await AsyncStorage.getItem("user_stats");
      return statsString ? JSON.parse(statsString) : null;
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
