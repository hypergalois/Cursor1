// MINOTAURO - Sistema Simplificado de Progreso de Usuario
// Solo las métricas esenciales: nivel, XP, racha, precisión

import AsyncStorage from "@react-native-async-storage/async-storage";

// Interfaces simplificadas
export interface SimpleUserStats {
  // Métricas básicas
  level: number;
  totalXP: number;
  streak: number; // días consecutivos

  // Estadísticas de rendimiento
  totalProblems: number;
  correctAnswers: number;
  accuracy: number; // 0-100%
  averageTimeSeconds: number;

  // Fechas importantes
  lastPlayedDate: string;
  createdDate: string;

  // Gamificación simple
  achievements: string[];
  currentStreak: number;
  longestStreak: number;
}

export interface ProblemAttempt {
  isCorrect: boolean;
  timeMs: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  problemType: string;
  xpEarned: number;
  timestamp: number;
}

class SimpleUserProgressService {
  private static instance: SimpleUserProgressService;
  private userId: string = "default_user";

  static getInstance(): SimpleUserProgressService {
    if (!SimpleUserProgressService.instance) {
      SimpleUserProgressService.instance = new SimpleUserProgressService();
    }
    return SimpleUserProgressService.instance;
  }

  // Inicializar stats por defecto
  private getDefaultStats(): SimpleUserStats {
    return {
      level: 1,
      totalXP: 0,
      streak: 0,
      totalProblems: 0,
      correctAnswers: 0,
      accuracy: 0,
      averageTimeSeconds: 0,
      lastPlayedDate: new Date().toISOString(),
      createdDate: new Date().toISOString(),
      achievements: [],
      currentStreak: 0,
      longestStreak: 0,
    };
  }

  // Obtener estadísticas del usuario
  async getUserStats(): Promise<SimpleUserStats> {
    try {
      const stored = await AsyncStorage.getItem("user_stats_simple");
      if (stored) {
        return JSON.parse(stored);
      }

      // Si no existe, crear stats por defecto
      const defaultStats = this.getDefaultStats();
      await this.saveUserStats(defaultStats);
      return defaultStats;
    } catch (error) {
      console.error("Error loading user stats:", error);
      return this.getDefaultStats();
    }
  }

  // Guardar estadísticas
  private async saveUserStats(stats: SimpleUserStats): Promise<void> {
    try {
      await AsyncStorage.setItem("user_stats_simple", JSON.stringify(stats));
    } catch (error) {
      console.error("Error saving user stats:", error);
    }
  }

  // Registrar intento de problema
  async recordProblemAttempt(
    attempt: ProblemAttempt
  ): Promise<SimpleUserStats> {
    const stats = await this.getUserStats();

    // Actualizar estadísticas básicas
    stats.totalProblems++;
    stats.totalXP += attempt.xpEarned;

    if (attempt.isCorrect) {
      stats.correctAnswers++;
    }

    // Calcular nueva precisión
    stats.accuracy = (stats.correctAnswers / stats.totalProblems) * 100;

    // Actualizar tiempo promedio
    const timeSeconds = attempt.timeMs / 1000;
    stats.averageTimeSeconds =
      (stats.averageTimeSeconds * (stats.totalProblems - 1) + timeSeconds) /
      stats.totalProblems;

    // Calcular nuevo nivel (cada 100 XP = 1 nivel)
    stats.level = Math.floor(stats.totalXP / 100) + 1;

    // Actualizar racha diaria
    const today = new Date().toDateString();
    const lastPlayed = new Date(stats.lastPlayedDate).toDateString();

    if (today !== lastPlayed) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastPlayed === yesterday.toDateString()) {
        // Día consecutivo - mantener racha
        stats.currentStreak++;
      } else {
        // Se rompió la racha
        stats.currentStreak = 1;
      }

      stats.longestStreak = Math.max(stats.longestStreak, stats.currentStreak);
      stats.lastPlayedDate = new Date().toISOString();
    }

    stats.streak = stats.currentStreak;

    // Verificar logros simples
    await this.checkSimpleAchievements(stats);

    // Guardar y retornar
    await this.saveUserStats(stats);
    return stats;
  }

  // Sistema de logros simplificado
  private async checkSimpleAchievements(stats: SimpleUserStats): Promise<void> {
    const newAchievements: string[] = [];

    // Logros por problemas resueltos
    if (stats.totalProblems >= 10 && !stats.achievements.includes("first_10")) {
      newAchievements.push("first_10");
    }
    if (
      stats.totalProblems >= 50 &&
      !stats.achievements.includes("half_century")
    ) {
      newAchievements.push("half_century");
    }
    if (stats.totalProblems >= 100 && !stats.achievements.includes("century")) {
      newAchievements.push("century");
    }

    // Logros por precisión
    if (
      stats.accuracy >= 90 &&
      stats.totalProblems >= 20 &&
      !stats.achievements.includes("perfectionist")
    ) {
      newAchievements.push("perfectionist");
    }

    // Logros por racha
    if (
      stats.currentStreak >= 7 &&
      !stats.achievements.includes("week_warrior")
    ) {
      newAchievements.push("week_warrior");
    }
    if (
      stats.currentStreak >= 30 &&
      !stats.achievements.includes("month_master")
    ) {
      newAchievements.push("month_master");
    }

    // Logros por nivel
    if (stats.level >= 10 && !stats.achievements.includes("level_10")) {
      newAchievements.push("level_10");
    }

    // Añadir nuevos logros
    stats.achievements.push(...newAchievements);
  }

  // Obtener logros desbloqueables
  getAchievementInfo(achievementId: string): {
    title: string;
    description: string;
  } {
    const achievements: Record<string, { title: string; description: string }> =
      {
        first_10: {
          title: "¡Empezando!",
          description: "Resuelve 10 problemas",
        },
        half_century: {
          title: "Medio Siglo",
          description: "Resuelve 50 problemas",
        },
        century: {
          title: "¡Centenario!",
          description: "Resuelve 100 problemas",
        },
        perfectionist: {
          title: "Perfeccionista",
          description: "Mantén 90% de precisión con 20+ problemas",
        },
        week_warrior: {
          title: "Guerrero Semanal",
          description: "Practica 7 días seguidos",
        },
        month_master: {
          title: "Maestro del Mes",
          description: "Practica 30 días seguidos",
        },
        level_10: { title: "Nivel 10", description: "Alcanza el nivel 10" },
      };

    return (
      achievements[achievementId] || {
        title: "Logro",
        description: "Logro desbloqueado",
      }
    );
  }

  // Resetear progreso (para nuevo usuario)
  async resetProgress(): Promise<void> {
    try {
      await AsyncStorage.removeItem("user_stats_simple");
    } catch (error) {
      console.error("Error resetting progress:", error);
    }
  }

  // Obtener solo las métricas más importantes para mostrar
  async getDisplayStats(): Promise<{
    level: number;
    xp: number;
    streak: number;
    accuracy: number;
  }> {
    const stats = await this.getUserStats();
    return {
      level: stats.level,
      xp: stats.totalXP,
      streak: stats.currentStreak,
      accuracy: Math.round(stats.accuracy),
    };
  }

  // Verificar si hay racha activa hoy
  async hasPlayedToday(): Promise<boolean> {
    const stats = await this.getUserStats();
    const today = new Date().toDateString();
    const lastPlayed = new Date(stats.lastPlayedDate).toDateString();
    return today === lastPlayed;
  }
}

// Exportar instancia singleton
export const userProgressService = SimpleUserProgressService.getInstance();
