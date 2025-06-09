export interface PlayerPerformance {
  streak: number;
  correctAnswers: number;
  totalAnswers: number;
  averageTime: number;
  lastFiveResults: boolean[];
  currentLevel: number;
}

export interface DifficultyModifiers {
  rangeMultiplier: number;
  complexityLevel: number;
  hintAvailability: boolean;
  timeBonus: boolean;
}

export class AdaptiveDifficulty {
  private static instance: AdaptiveDifficulty;
  private performanceHistory: PlayerPerformance = {
    streak: 0,
    correctAnswers: 0,
    totalAnswers: 0,
    averageTime: 0,
    lastFiveResults: [],
    currentLevel: 1,
  };

  static getInstance(): AdaptiveDifficulty {
    if (!AdaptiveDifficulty.instance) {
      AdaptiveDifficulty.instance = new AdaptiveDifficulty();
    }
    return AdaptiveDifficulty.instance;
  }

  updatePerformance(
    isCorrect: boolean,
    timeSpent: number,
    currentLevel: number
  ): void {
    this.performanceHistory.totalAnswers++;
    this.performanceHistory.currentLevel = currentLevel;

    if (isCorrect) {
      this.performanceHistory.correctAnswers++;
      this.performanceHistory.streak++;
    } else {
      this.performanceHistory.streak = 0;
    }

    // Actualizar últimos 5 resultados
    this.performanceHistory.lastFiveResults.push(isCorrect);
    if (this.performanceHistory.lastFiveResults.length > 5) {
      this.performanceHistory.lastFiveResults.shift();
    }

    // Actualizar tiempo promedio
    const totalTime =
      this.performanceHistory.averageTime *
        (this.performanceHistory.totalAnswers - 1) +
      timeSpent;
    this.performanceHistory.averageTime =
      totalTime / this.performanceHistory.totalAnswers;
  }

  getDifficultyModifiers(): DifficultyModifiers {
    const successRate = this.getSuccessRate();
    const recentPerformance = this.getRecentPerformance();

    return {
      rangeMultiplier: this.calculateRangeMultiplier(
        successRate,
        recentPerformance
      ),
      complexityLevel: this.calculateComplexityLevel(successRate),
      hintAvailability: this.shouldShowHints(successRate),
      timeBonus: this.shouldGiveTimeBonus(),
    };
  }

  private getSuccessRate(): number {
    if (this.performanceHistory.totalAnswers === 0) return 0.5;
    return (
      this.performanceHistory.correctAnswers /
      this.performanceHistory.totalAnswers
    );
  }

  private getRecentPerformance(): number {
    if (this.performanceHistory.lastFiveResults.length === 0) return 0.5;
    const recentCorrect = this.performanceHistory.lastFiveResults.filter(
      (result) => result
    ).length;
    return recentCorrect / this.performanceHistory.lastFiveResults.length;
  }

  private calculateRangeMultiplier(
    successRate: number,
    recentPerformance: number
  ): number {
    const baseMultiplier = 1.0;

    // Si el jugador está teniendo mucho éxito, incrementar dificultad
    if (
      successRate > 0.8 &&
      recentPerformance > 0.8 &&
      this.performanceHistory.streak > 3
    ) {
      return baseMultiplier * 1.5; // Números más grandes
    }

    // Si el jugador está luchando, reducir dificultad
    if (successRate < 0.4 && recentPerformance < 0.4) {
      return baseMultiplier * 0.7; // Números más pequeños
    }

    // Ajuste gradual según racha
    if (this.performanceHistory.streak > 5) {
      return baseMultiplier * 1.3;
    } else if (
      this.performanceHistory.streak < 2 &&
      this.performanceHistory.totalAnswers > 3
    ) {
      return baseMultiplier * 0.8;
    }

    return baseMultiplier;
  }

  private calculateComplexityLevel(successRate: number): number {
    // 0 = muy fácil, 1 = fácil, 2 = normal, 3 = difícil, 4 = muy difícil

    if (successRate > 0.9 && this.performanceHistory.streak > 5) {
      return 4; // Muy difícil: problemas con múltiples pasos
    } else if (successRate > 0.8 && this.performanceHistory.streak > 3) {
      return 3; // Difícil: problemas con números grandes
    } else if (successRate > 0.6) {
      return 2; // Normal: problemas estándar
    } else if (successRate > 0.3) {
      return 1; // Fácil: problemas simplificados
    } else {
      return 0; // Muy fácil: problemas básicos
    }
  }

  private shouldShowHints(successRate: number): boolean {
    // Mostrar pistas si el jugador está luchando
    return successRate < 0.6 || this.performanceHistory.streak < 2;
  }

  private shouldGiveTimeBonus(): boolean {
    // Dar bonus de tiempo si el jugador responde rápido consistentemente
    return (
      this.performanceHistory.averageTime < 15 && this.getSuccessRate() > 0.7
    );
  }

  getEncouragementMessage(): string {
    const successRate = this.getSuccessRate();
    const streak = this.performanceHistory.streak;

    if (streak > 5) {
      return "¡Increíble racha! ¡Eres imparable! 🔥";
    } else if (streak > 3) {
      return "¡Excelente trabajo! ¡Sigue así! ⭐";
    } else if (successRate > 0.8) {
      return "¡Lo estás haciendo genial! 💪";
    } else if (successRate > 0.6) {
      return "¡Buen trabajo! ¡Puedes hacerlo! 👍";
    } else if (successRate > 0.4) {
      return "¡No te rindas! ¡Estás mejorando! 💪";
    } else {
      return "¡Tómate tu tiempo! ¡Puedes lograrlo! 🌟";
    }
  }

  getDifficultyDescription(): string {
    const modifiers = this.getDifficultyModifiers();

    if (modifiers.complexityLevel >= 4) {
      return "Maestro Matemático";
    } else if (modifiers.complexityLevel >= 3) {
      return "Aventurero Experto";
    } else if (modifiers.complexityLevel >= 2) {
      return "Explorador Capaz";
    } else if (modifiers.complexityLevel >= 1) {
      return "Aprendiz Valiente";
    } else {
      return "Nuevo Aventurero";
    }
  }

  getPerformanceStats() {
    return {
      ...this.performanceHistory,
      successRate: this.getSuccessRate(),
      recentPerformance: this.getRecentPerformance(),
      difficultyLevel: this.getDifficultyDescription(),
    };
  }

  reset(): void {
    this.performanceHistory = {
      streak: 0,
      correctAnswers: 0,
      totalAnswers: 0,
      averageTime: 0,
      lastFiveResults: [],
      currentLevel: 1,
    };
  }
}

export default AdaptiveDifficulty;
