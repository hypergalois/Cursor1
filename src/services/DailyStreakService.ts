// Sistema de Racha Diaria para Minotauro
// Trackea días consecutivos practicando, no solo problemas consecutivos

import AsyncStorage from "@react-native-async-storage/async-storage";

export interface DailyStreakData {
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate: string;
  streakStartDate: string;
  totalDaysPlayed: number;
  streakFreezeUsed: number; // Para futuras funcionalidades
}

class DailyStreakService {
  private readonly STORAGE_KEY = "minotauro_daily_streak";

  // Obtener datos de racha
  async getStreakData(): Promise<DailyStreakData> {
    try {
      const data = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.warn("Error loading streak data:", error);
    }

    // Datos por defecto
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastPlayedDate: "",
      streakStartDate: "",
      totalDaysPlayed: 0,
      streakFreezeUsed: 0,
    };
  }

  // Guardar datos de racha
  private async saveStreakData(data: DailyStreakData): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving streak data:", error);
    }
  }

  // Registrar actividad del día (llamar cuando el usuario practique)
  async recordDailyActivity(): Promise<DailyStreakData> {
    const today = this.getTodayString();
    const streakData = await this.getStreakData();

    // Si ya jugó hoy, no hacer nada
    if (streakData.lastPlayedDate === today) {
      return streakData;
    }

    const yesterday = this.getYesterdayString();
    let newStreakData: DailyStreakData;

    if (streakData.lastPlayedDate === yesterday) {
      // Continuó la racha
      newStreakData = {
        ...streakData,
        currentStreak: streakData.currentStreak + 1,
        longestStreak: Math.max(
          streakData.longestStreak,
          streakData.currentStreak + 1
        ),
        lastPlayedDate: today,
        totalDaysPlayed: streakData.totalDaysPlayed + 1,
      };
    } else if (streakData.lastPlayedDate === "") {
      // Primer día jugando
      newStreakData = {
        ...streakData,
        currentStreak: 1,
        longestStreak: Math.max(streakData.longestStreak, 1),
        lastPlayedDate: today,
        streakStartDate: today,
        totalDaysPlayed: 1,
      };
    } else {
      // Rompió la racha, empezar nueva
      newStreakData = {
        ...streakData,
        currentStreak: 1,
        lastPlayedDate: today,
        streakStartDate: today,
        totalDaysPlayed: streakData.totalDaysPlayed + 1,
      };
    }

    await this.saveStreakData(newStreakData);
    return newStreakData;
  }

  // Verificar si la racha sigue activa
  async checkStreakStatus(): Promise<{
    isActive: boolean;
    daysSinceLastPlay: number;
  }> {
    const streakData = await this.getStreakData();
    const today = this.getTodayString();
    const yesterday = this.getYesterdayString();

    if (
      streakData.lastPlayedDate === today ||
      streakData.lastPlayedDate === yesterday
    ) {
      return { isActive: true, daysSinceLastPlay: 0 };
    }

    const daysSince = this.daysBetween(streakData.lastPlayedDate, today);
    return { isActive: false, daysSinceLastPlay: daysSince };
  }

  // Obtener estado de la mascota basado en la racha
  async getMascotMoodForStreak(): Promise<
    "super_happy" | "happy" | "neutral" | "sad"
  > {
    const streakData = await this.getStreakData();
    const status = await this.checkStreakStatus();

    if (streakData.currentStreak >= 7) {
      return "super_happy"; // 7+ días consecutivos
    } else if (streakData.currentStreak >= 3) {
      return "happy"; // 3-6 días consecutivos
    } else if (status.isActive && streakData.currentStreak >= 1) {
      return "neutral"; // Racha activa pero corta
    } else {
      return "sad"; // Sin racha o rota
    }
  }

  // Obtener motivación/mensaje basado en racha
  async getStreakMessage(): Promise<string> {
    const streakData = await this.getStreakData();
    const status = await this.checkStreakStatus();

    if (streakData.currentStreak >= 30) {
      return "🏆 ¡Increíble! ¡30 días de racha!";
    } else if (streakData.currentStreak >= 14) {
      return "🔥 ¡Dos semanas seguidas! ¡Eres imparable!";
    } else if (streakData.currentStreak >= 7) {
      return "⚡ ¡Una semana completa! ¡Sigue así!";
    } else if (streakData.currentStreak >= 3) {
      return "💪 ¡Buena racha! ¡No la rompas!";
    } else if (streakData.currentStreak === 1) {
      return "🌟 ¡Buen comienzo! Vuelve mañana";
    } else if (!status.isActive && status.daysSinceLastPlay <= 2) {
      return "😔 ¡Te extrañamos! Vuelve a practicar";
    } else {
      return "🚀 ¡Empieza una nueva racha hoy!";
    }
  }

  // Utilidades privadas
  private getTodayString(): string {
    return new Date().toDateString();
  }

  private getYesterdayString(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toDateString();
  }

  private daysBetween(date1: string, date2: string): number {
    if (!date1 || !date2) return 0;

    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const timeDiff = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  }

  // Resetear racha (para testing/admin)
  async resetStreak(): Promise<void> {
    const defaultData: DailyStreakData = {
      currentStreak: 0,
      longestStreak: 0,
      lastPlayedDate: "",
      streakStartDate: "",
      totalDaysPlayed: 0,
      streakFreezeUsed: 0,
    };
    await this.saveStreakData(defaultData);
  }
}

export const dailyStreakService = new DailyStreakService();
