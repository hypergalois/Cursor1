import AsyncStorage from "@react-native-async-storage/async-storage";

export interface SessionMetrics {
  sessionId: string;
  startTime: Date;
  endTime: Date;
  problemsSolved: number;
  totalProblems: number;
  averageResponseTime: number;
  fastestResponse: number;
  slowestResponse: number;
  accuracyRate: number;
  difficultyProgression: string[];
  categoriesPlayed: string[];
  mistakePatterns: MistakePattern[];
  learningVelocity: number;
  focusScore: number;
  consistencyScore: number;
}

export interface MistakePattern {
  category: string;
  operation: string;
  frequency: number;
  averageTime: number;
  lastOccurrence: Date;
  improvementTrend: "improving" | "stable" | "declining";
}

export interface LearningInsight {
  type: "strength" | "weakness" | "pattern" | "recommendation";
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  suggestedActions: string[];
  priority: "low" | "medium" | "high";
}

export interface PerformanceTrend {
  metric: string;
  timeframe: "daily" | "weekly" | "monthly";
  direction: "improving" | "stable" | "declining";
  changePercentage: number;
  significance: "low" | "medium" | "high";
}

export interface PersonalizedMetrics {
  optimalPlayTime: string; // "morning" | "afternoon" | "evening"
  averageSessionLength: number;
  preferredDifficulty: string;
  strongestCategories: string[];
  weakestCategories: string[];
  learningStyle: "visual" | "analytical" | "intuitive" | "methodical";
  motivationalFactors: string[];
  burnoutRisk: number; // 0-1
  engagementLevel: number; // 0-1
  // ✅ NUEVO: Métricas específicas por edad
  ageGroup: "kids" | "teens" | "adults" | "seniors";
  ageSpecificFactors: {
    attentionSpanOptimal: number; // minutos
    encouragementFrequency: "high" | "medium" | "low";
    gamificationPreference: string[];
    cognitiveLoadTolerance: "low" | "medium" | "high";
    feedbackStyle: string;
  };
}

class PerformanceAnalytics {
  private static instance: PerformanceAnalytics;
  private currentSession: SessionMetrics | null = null;
  private userId: string = "default_user";

  static getInstance(): PerformanceAnalytics {
    if (!PerformanceAnalytics.instance) {
      PerformanceAnalytics.instance = new PerformanceAnalytics();
    }
    return PerformanceAnalytics.instance;
  }

  // Iniciar nueva sesión de análisis
  async startSession(): Promise<string> {
    const sessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    this.currentSession = {
      sessionId,
      startTime: new Date(),
      endTime: new Date(),
      problemsSolved: 0,
      totalProblems: 0,
      averageResponseTime: 0,
      fastestResponse: Infinity,
      slowestResponse: 0,
      accuracyRate: 0,
      difficultyProgression: [],
      categoriesPlayed: [],
      mistakePatterns: [],
      learningVelocity: 0,
      focusScore: 0,
      consistencyScore: 0,
    };

    return sessionId;
  }

  // Registrar respuesta a problema
  async recordProblemResponse(data: {
    correct: boolean;
    responseTime: number;
    difficulty: string;
    category: string;
    operation: string;
    hintsUsed: number;
    retries: number;
  }): Promise<void> {
    if (!this.currentSession) return;

    const session = this.currentSession;
    session.totalProblems++;

    if (data.correct) {
      session.problemsSolved++;
    }

    // Actualizar métricas de tiempo
    session.fastestResponse = Math.min(
      session.fastestResponse,
      data.responseTime
    );
    session.slowestResponse = Math.max(
      session.slowestResponse,
      data.responseTime
    );

    const totalTime =
      session.averageResponseTime * (session.totalProblems - 1) +
      data.responseTime;
    session.averageResponseTime = totalTime / session.totalProblems;

    // Actualizar precisión
    session.accuracyRate = session.problemsSolved / session.totalProblems;

    // Registrar progresión de dificultad
    if (!session.difficultyProgression.includes(data.difficulty)) {
      session.difficultyProgression.push(data.difficulty);
    }

    // Registrar categorías jugadas
    if (!session.categoriesPlayed.includes(data.category)) {
      session.categoriesPlayed.push(data.category);
    }

    // Analizar patrones de errores
    if (!data.correct) {
      await this.recordMistakePattern(
        data.category,
        data.operation,
        data.responseTime
      );
    }

    // Calcular velocidad de aprendizaje
    session.learningVelocity = this.calculateLearningVelocity();

    // Calcular score de concentración
    session.focusScore = this.calculateFocusScore();

    // Calcular consistencia
    session.consistencyScore = this.calculateConsistencyScore();
  }

  // Finalizar sesión
  async endSession(): Promise<SessionMetrics> {
    if (!this.currentSession) {
      throw new Error("No active session to end");
    }

    this.currentSession.endTime = new Date();

    // Guardar sesión
    await this.saveSession(this.currentSession);

    const session = this.currentSession;
    this.currentSession = null;

    return session;
  }

  // ✅ NUEVO: Generar insights personalizados por edad
  async generateAgeAwareInsights(
    ageGroup: "kids" | "teens" | "adults" | "seniors"
  ): Promise<LearningInsight[]> {
    const sessions = await this.getRecentSessions(30);
    const insights: LearningInsight[] = [];

    // Insights base
    const baseInsights = await this.generateInsights();

    // Adaptarlos por edad
    const ageAdaptedInsights = baseInsights.map((insight) =>
      this.adaptInsightForAge(insight, ageGroup)
    );
    insights.push(...ageAdaptedInsights);

    // Generar insights específicos por edad
    const ageSpecificInsights = await this.generateAgeSpecificInsights(
      sessions,
      ageGroup
    );
    insights.push(...ageSpecificInsights);

    return insights.sort((a, b) => b.confidence - a.confidence);
  }

  // Generar insights personalizados (método original mantenido)
  async generateInsights(): Promise<LearningInsight[]> {
    const sessions = await this.getRecentSessions(30); // Últimos 30 días
    const insights: LearningInsight[] = [];

    // Analizar fortalezas
    const strengths = await this.analyzeStrengths(sessions);
    insights.push(...strengths);

    // Analizar debilidades
    const weaknesses = await this.analyzeWeaknesses(sessions);
    insights.push(...weaknesses);

    // Analizar patrones
    const patterns = await this.analyzePatterns(sessions);
    insights.push(...patterns);

    // Generar recomendaciones
    const recommendations = await this.generateRecommendations(sessions);
    insights.push(...recommendations);

    return insights.sort((a, b) => b.confidence - a.confidence);
  }

  // Obtener tendencias de rendimiento
  async getPerformanceTrends(): Promise<PerformanceTrend[]> {
    const sessions = await this.getRecentSessions(90);
    const trends: PerformanceTrend[] = [];

    // Analizar precisión
    const accuracyTrend = this.calculateTrend(sessions, "accuracyRate");
    trends.push({
      metric: "Precisión",
      timeframe: "weekly",
      direction: accuracyTrend.direction,
      changePercentage: accuracyTrend.change,
      significance: accuracyTrend.significance,
    });

    // Analizar velocidad
    const speedTrend = this.calculateTrend(
      sessions,
      "averageResponseTime",
      true
    );
    trends.push({
      metric: "Velocidad",
      timeframe: "weekly",
      direction: speedTrend.direction,
      changePercentage: speedTrend.change,
      significance: speedTrend.significance,
    });

    // Analizar consistencia
    const consistencyTrend = this.calculateTrend(sessions, "consistencyScore");
    trends.push({
      metric: "Consistencia",
      timeframe: "weekly",
      direction: consistencyTrend.direction,
      changePercentage: consistencyTrend.change,
      significance: consistencyTrend.significance,
    });

    return trends;
  }

  // ✅ NUEVO: Obtener métricas personalizadas por edad
  async getAgeAwarePersonalizedMetrics(
    ageGroup: "kids" | "teens" | "adults" | "seniors"
  ): Promise<PersonalizedMetrics> {
    const sessions = await this.getRecentSessions(60);
    const baseMetrics = await this.getPersonalizedMetrics();

    return {
      ...baseMetrics,
      ageGroup,
      ageSpecificFactors: this.calculateAgeSpecificFactors(sessions, ageGroup),
    };
  }

  // Obtener métricas personalizadas (método original mantenido)
  async getPersonalizedMetrics(): Promise<PersonalizedMetrics> {
    const sessions = await this.getRecentSessions(60);

    return {
      optimalPlayTime: this.findOptimalPlayTime(sessions),
      averageSessionLength: this.calculateAverageSessionLength(sessions),
      preferredDifficulty: this.findPreferredDifficulty(sessions),
      strongestCategories: this.findStrongestCategories(sessions),
      weakestCategories: this.findWeakestCategories(sessions),
      learningStyle: this.determineLearningStyle(sessions),
      motivationalFactors: this.identifyMotivationalFactors(sessions),
      burnoutRisk: this.calculateBurnoutRisk(sessions),
      engagementLevel: this.calculateEngagementLevel(sessions),
      // ✅ Valores por defecto para compatibilidad
      ageGroup: "adults",
      ageSpecificFactors: {
        attentionSpanOptimal: 20,
        encouragementFrequency: "medium",
        gamificationPreference: ["progress", "efficiency"],
        cognitiveLoadTolerance: "high",
        feedbackStyle: "professional",
      },
    };
  }

  // Métodos privados de análisis
  private async recordMistakePattern(
    category: string,
    operation: string,
    responseTime: number
  ): Promise<void> {
    if (!this.currentSession) return;

    const existing = this.currentSession.mistakePatterns.find(
      (p) => p.category === category && p.operation === operation
    );

    if (existing) {
      existing.frequency++;
      existing.averageTime = (existing.averageTime + responseTime) / 2;
      existing.lastOccurrence = new Date();
    } else {
      this.currentSession.mistakePatterns.push({
        category,
        operation,
        frequency: 1,
        averageTime: responseTime,
        lastOccurrence: new Date(),
        improvementTrend: "stable",
      });
    }
  }

  private calculateLearningVelocity(): number {
    if (!this.currentSession || this.currentSession.totalProblems < 3) return 0;

    // Calcular mejora en los últimos problemas vs primeros problemas
    const totalProblems = this.currentSession.totalProblems;
    const firstHalf = Math.floor(totalProblems / 2);
    const recentCorrect = this.currentSession.problemsSolved - firstHalf;
    const recentTotal = totalProblems - firstHalf;

    if (recentTotal === 0) return 0;

    const recentAccuracy = recentCorrect / recentTotal;
    const overallAccuracy = this.currentSession.accuracyRate;

    return Math.max(0, (recentAccuracy - overallAccuracy) * 10);
  }

  private calculateFocusScore(): number {
    if (!this.currentSession || this.currentSession.totalProblems < 3) return 1;

    // Calcular basado en variabilidad de tiempos de respuesta
    const avgTime = this.currentSession.averageResponseTime;
    const fastestTime = this.currentSession.fastestResponse;
    const slowestTime = this.currentSession.slowestResponse;

    const variability = (slowestTime - fastestTime) / avgTime;

    // Score más alto = menos variabilidad = más concentración
    return Math.max(0, Math.min(1, 1 - variability / 3));
  }

  private calculateConsistencyScore(): number {
    if (!this.currentSession || this.currentSession.totalProblems < 5) return 1;

    // Calcular basado en patrones de aciertos/errores
    const accuracy = this.currentSession.accuracyRate;
    const problemCount = this.currentSession.totalProblems;

    // Penalizar variaciones extremas en rendimiento
    const expectedVariation = Math.sqrt(
      problemCount * accuracy * (1 - accuracy)
    );
    const actualCorrect = this.currentSession.problemsSolved;
    const variation = Math.abs(actualCorrect - problemCount * accuracy);

    return Math.max(0, Math.min(1, 1 - variation / expectedVariation));
  }

  private async analyzeStrengths(
    sessions: SessionMetrics[]
  ): Promise<LearningInsight[]> {
    const insights: LearningInsight[] = [];

    // Analizar categorías fuertes
    const categoryAccuracy = this.calculateCategoryAccuracy(sessions);
    const strongCategories = Object.entries(categoryAccuracy)
      .filter(([_, accuracy]) => accuracy > 0.8)
      .map(([category, _]) => category);

    if (strongCategories.length > 0) {
      insights.push({
        type: "strength",
        title: "Categorías Dominadas",
        description: `Excelente rendimiento en: ${strongCategories.join(", ")}`,
        confidence: 0.9,
        actionable: true,
        suggestedActions: ["Intentar problemas más complejos en estas áreas"],
        priority: "medium",
      });
    }

    return insights;
  }

  private async analyzeWeaknesses(
    sessions: SessionMetrics[]
  ): Promise<LearningInsight[]> {
    const insights: LearningInsight[] = [];

    // Analizar categorías débiles
    const categoryAccuracy = this.calculateCategoryAccuracy(sessions);
    const weakCategories = Object.entries(categoryAccuracy)
      .filter(([_, accuracy]) => accuracy < 0.6)
      .map(([category, _]) => category);

    if (weakCategories.length > 0) {
      insights.push({
        type: "weakness",
        title: "Áreas de Mejora",
        description: `Oportunidades de crecimiento en: ${weakCategories.join(
          ", "
        )}`,
        confidence: 0.8,
        actionable: true,
        suggestedActions: [
          "Practicar problemas básicos en estas áreas",
          "Usar pistas para entender los conceptos",
          "Tomar descansos entre intentos",
        ],
        priority: "high",
      });
    }

    return insights;
  }

  private async analyzePatterns(
    sessions: SessionMetrics[]
  ): Promise<LearningInsight[]> {
    const insights: LearningInsight[] = [];

    // Analizar patrón de tiempo óptimo
    const timePerformance = this.analyzeTimePatterns(sessions);
    if (timePerformance.confidence > 0.7) {
      insights.push({
        type: "pattern",
        title: "Momento Óptimo de Estudio",
        description: `Mejor rendimiento durante: ${timePerformance.optimalTime}`,
        confidence: timePerformance.confidence,
        actionable: true,
        suggestedActions: [
          `Programar sesiones durante ${timePerformance.optimalTime}`,
        ],
        priority: "medium",
      });
    }

    return insights;
  }

  private async generateRecommendations(
    sessions: SessionMetrics[]
  ): Promise<LearningInsight[]> {
    const insights: LearningInsight[] = [];

    // Recomendar duración de sesión óptima
    const avgLength = this.calculateAverageSessionLength(sessions);
    if (avgLength > 30) {
      insights.push({
        type: "recommendation",
        title: "Optimizar Duración de Sesión",
        description: "Sesiones más cortas podrían mejorar la concentración",
        confidence: 0.7,
        actionable: true,
        suggestedActions: [
          "Intentar sesiones de 15-20 minutos",
          "Tomar descansos frecuentes",
        ],
        priority: "medium",
      });
    }

    return insights;
  }

  // Métodos auxiliares
  private calculateCategoryAccuracy(sessions: SessionMetrics[]): {
    [category: string]: number;
  } {
    const categoryStats: {
      [category: string]: { correct: number; total: number };
    } = {};

    sessions.forEach((session) => {
      session.categoriesPlayed.forEach((category) => {
        if (!categoryStats[category]) {
          categoryStats[category] = { correct: 0, total: 0 };
        }
        categoryStats[category].total += session.totalProblems;
        categoryStats[category].correct += session.problemsSolved;
      });
    });

    const accuracy: { [category: string]: number } = {};
    Object.entries(categoryStats).forEach(([category, stats]) => {
      accuracy[category] = stats.total > 0 ? stats.correct / stats.total : 0;
    });

    return accuracy;
  }

  private analyzeTimePatterns(sessions: SessionMetrics[]): {
    optimalTime: string;
    confidence: number;
  } {
    // Análisis simplificado - en una implementación real usaríamos ML
    const timeAccuracy: { [time: string]: number[] } = {};

    sessions.forEach((session) => {
      const hour = session.startTime.getHours();
      let timeOfDay: string;

      if (hour < 12) timeOfDay = "mañana";
      else if (hour < 18) timeOfDay = "tarde";
      else timeOfDay = "noche";

      if (!timeAccuracy[timeOfDay]) timeAccuracy[timeOfDay] = [];
      timeAccuracy[timeOfDay].push(session.accuracyRate);
    });

    let bestTime = "mañana";
    let bestAccuracy = 0;

    Object.entries(timeAccuracy).forEach(([time, accuracies]) => {
      const avgAccuracy =
        accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
      if (avgAccuracy > bestAccuracy) {
        bestAccuracy = avgAccuracy;
        bestTime = time;
      }
    });

    return {
      optimalTime: bestTime,
      confidence: Math.min(bestAccuracy, 0.9),
    };
  }

  private calculateTrend(
    sessions: SessionMetrics[],
    metric: keyof SessionMetrics,
    inverted = false
  ): {
    direction: "improving" | "stable" | "declining";
    change: number;
    significance: "low" | "medium" | "high";
  } {
    if (sessions.length < 2) {
      return { direction: "stable", change: 0, significance: "low" };
    }

    const recent = sessions.slice(-7); // Últimos 7 días
    const older = sessions.slice(-14, -7); // 7 días anteriores

    const recentAvg =
      recent.reduce((sum, s) => sum + (s[metric] as number), 0) / recent.length;
    const olderAvg =
      older.reduce((sum, s) => sum + (s[metric] as number), 0) / older.length;

    let change = ((recentAvg - olderAvg) / olderAvg) * 100;
    if (inverted) change = -change; // Para métricas donde menor es mejor (tiempo)

    let direction: "improving" | "stable" | "declining";
    if (Math.abs(change) < 5) direction = "stable";
    else if (change > 0) direction = "improving";
    else direction = "declining";

    let significance: "low" | "medium" | "high";
    if (Math.abs(change) < 10) significance = "low";
    else if (Math.abs(change) < 25) significance = "medium";
    else significance = "high";

    return { direction, change: Math.abs(change), significance };
  }

  // Métodos auxiliares para métricas personalizadas
  private findOptimalPlayTime(sessions: SessionMetrics[]): string {
    return this.analyzeTimePatterns(sessions).optimalTime;
  }

  private calculateAverageSessionLength(sessions: SessionMetrics[]): number {
    if (sessions.length === 0) return 0;
    const totalMinutes = sessions.reduce((sum, session) => {
      const duration = session.endTime.getTime() - session.startTime.getTime();
      return sum + duration / (1000 * 60); // Convertir a minutos
    }, 0);
    return totalMinutes / sessions.length;
  }

  private findPreferredDifficulty(sessions: SessionMetrics[]): string {
    const difficultyCount: { [key: string]: number } = {};
    sessions.forEach((session) => {
      session.difficultyProgression.forEach((difficulty) => {
        difficultyCount[difficulty] = (difficultyCount[difficulty] || 0) + 1;
      });
    });

    return (
      Object.entries(difficultyCount).sort(([, a], [, b]) => b - a)[0]?.[0] ||
      "medium"
    );
  }

  private findStrongestCategories(sessions: SessionMetrics[]): string[] {
    const categoryAccuracy = this.calculateCategoryAccuracy(sessions);
    return Object.entries(categoryAccuracy)
      .filter(([, accuracy]) => accuracy > 0.8)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);
  }

  private findWeakestCategories(sessions: SessionMetrics[]): string[] {
    const categoryAccuracy = this.calculateCategoryAccuracy(sessions);
    return Object.entries(categoryAccuracy)
      .filter(([, accuracy]) => accuracy < 0.6)
      .sort(([, a], [, b]) => a - b)
      .slice(0, 3)
      .map(([category]) => category);
  }

  private determineLearningStyle(
    sessions: SessionMetrics[]
  ): "visual" | "analytical" | "intuitive" | "methodical" {
    // Análisis simplificado basado en patrones de respuesta
    const avgResponseTime =
      sessions.reduce((sum, s) => sum + s.averageResponseTime, 0) /
      sessions.length;
    const avgConsistency =
      sessions.reduce((sum, s) => sum + s.consistencyScore, 0) /
      sessions.length;

    if (avgResponseTime < 15 && avgConsistency > 0.8) return "intuitive";
    if (avgResponseTime > 25 && avgConsistency > 0.7) return "methodical";
    if (avgConsistency > 0.6) return "analytical";
    return "visual";
  }

  private identifyMotivationalFactors(sessions: SessionMetrics[]): string[] {
    const factors: string[] = [];

    const avgAccuracy =
      sessions.reduce((sum, s) => sum + s.accuracyRate, 0) / sessions.length;
    if (avgAccuracy > 0.8) factors.push("Logros y progreso");

    const avgSessionLength = this.calculateAverageSessionLength(sessions);
    if (avgSessionLength < 20) factors.push("Sesiones cortas e intensas");

    const categoriesVariety = new Set(
      sessions.flatMap((s) => s.categoriesPlayed)
    ).size;
    if (categoriesVariety > 3) factors.push("Variedad de contenido");

    return factors;
  }

  private calculateBurnoutRisk(sessions: SessionMetrics[]): number {
    if (sessions.length < 7) return 0;

    const recentSessions = sessions.slice(-7);
    const declineInAccuracy =
      this.calculateTrend(recentSessions, "accuracyRate").direction ===
      "declining";
    const declineInFocus =
      this.calculateTrend(recentSessions, "focusScore").direction ===
      "declining";
    const longSessions = recentSessions.filter(
      (s) => s.endTime.getTime() - s.startTime.getTime() > 30 * 60 * 1000
    ).length;

    let riskScore = 0;
    if (declineInAccuracy) riskScore += 0.3;
    if (declineInFocus) riskScore += 0.3;
    if (longSessions > 3) riskScore += 0.4;

    return Math.min(riskScore, 1);
  }

  private calculateEngagementLevel(sessions: SessionMetrics[]): number {
    if (sessions.length === 0) return 0;

    const recentSessions = sessions.slice(-14); // Últimas 2 semanas
    const sessionFrequency = recentSessions.length / 14;
    const avgAccuracy =
      recentSessions.reduce((sum, s) => sum + s.accuracyRate, 0) /
      recentSessions.length;
    const avgFocus =
      recentSessions.reduce((sum, s) => sum + s.focusScore, 0) /
      recentSessions.length;

    return Math.min((sessionFrequency + avgAccuracy + avgFocus) / 3, 1);
  }

  // ✅ NUEVO: Calcular factores específicos por edad
  private calculateAgeSpecificFactors(
    sessions: SessionMetrics[],
    ageGroup: "kids" | "teens" | "adults" | "seniors"
  ): any {
    const avgSessionLength = this.calculateAverageSessionLength(sessions);
    const engagementLevel = this.calculateEngagementLevel(sessions);

    switch (ageGroup) {
      case "kids":
        return {
          attentionSpanOptimal: Math.min(15, avgSessionLength * 0.8), // Máximo 15 minutos
          encouragementFrequency: engagementLevel < 0.6 ? "high" : "medium",
          gamificationPreference: [
            "stickers",
            "animations",
            "rewards",
            "characters",
          ],
          cognitiveLoadTolerance: "low",
          feedbackStyle: "enthusiastic",
        };

      case "teens":
        return {
          attentionSpanOptimal: Math.min(25, avgSessionLength * 0.9), // Máximo 25 minutos
          encouragementFrequency: engagementLevel < 0.5 ? "medium" : "low",
          gamificationPreference: [
            "achievements",
            "leaderboards",
            "challenges",
            "streaks",
          ],
          cognitiveLoadTolerance: "medium",
          feedbackStyle: "cool",
        };

      case "adults":
        return {
          attentionSpanOptimal: Math.min(30, avgSessionLength), // Hasta 30 minutos
          encouragementFrequency: "low",
          gamificationPreference: [
            "progress",
            "efficiency",
            "mastery",
            "insights",
          ],
          cognitiveLoadTolerance: "high",
          feedbackStyle: "professional",
        };

      case "seniors":
        return {
          attentionSpanOptimal: Math.min(20, avgSessionLength * 1.2), // Más flexible
          encouragementFrequency: "medium",
          gamificationPreference: [
            "wisdom",
            "reflection",
            "mastery",
            "teaching",
          ],
          cognitiveLoadTolerance: "medium",
          feedbackStyle: "respectful",
        };

      default:
        return {
          attentionSpanOptimal: 20,
          encouragementFrequency: "medium",
          gamificationPreference: ["progress"],
          cognitiveLoadTolerance: "medium",
          feedbackStyle: "neutral",
        };
    }
  }

  // ✅ NUEVO: Adaptar insight existente para edad específica
  private adaptInsightForAge(
    insight: LearningInsight,
    ageGroup: "kids" | "teens" | "adults" | "seniors"
  ): LearningInsight {
    const adaptations = {
      kids: {
        titlePrefix: "🌟 ",
        descriptionStyle: "¡",
        actionStyle: "Vamos a ",
        encouragement: " ¡Tú puedes hacerlo!",
      },
      teens: {
        titlePrefix: "🔥 ",
        descriptionStyle: "",
        actionStyle: "Challenge: ",
        encouragement: " You got this! 💪",
      },
      adults: {
        titlePrefix: "",
        descriptionStyle: "",
        actionStyle: "Estrategia: ",
        encouragement: "",
      },
      seniors: {
        titlePrefix: "🌟 ",
        descriptionStyle: "",
        actionStyle: "Consejo: ",
        encouragement: " Su experiencia es valiosa.",
      },
    };

    const style = adaptations[ageGroup];

    return {
      ...insight,
      title: style.titlePrefix + insight.title,
      description:
        style.descriptionStyle + insight.description + style.encouragement,
      suggestedActions: insight.suggestedActions.map(
        (action) => style.actionStyle + action
      ),
    };
  }

  // ✅ NUEVO: Generar insights específicos por edad
  private async generateAgeSpecificInsights(
    sessions: SessionMetrics[],
    ageGroup: "kids" | "teens" | "adults" | "seniors"
  ): Promise<LearningInsight[]> {
    const insights: LearningInsight[] = [];
    const avgSessionLength = this.calculateAverageSessionLength(sessions);
    const engagementLevel = this.calculateEngagementLevel(sessions);

    switch (ageGroup) {
      case "kids":
        if (avgSessionLength > 15) {
          insights.push({
            type: "recommendation",
            title: "Sesiones más cortitas",
            description: "¡Las sesiones más cortas son más divertidas para ti!",
            confidence: 0.8,
            actionable: true,
            suggestedActions: [
              "Jugar 10-15 minutos cada vez",
              "Tomar descansos con juegos",
            ],
            priority: "medium",
          });
        }
        break;

      case "teens":
        if (engagementLevel < 0.5) {
          insights.push({
            type: "recommendation",
            title: "Desafíos más geniales",
            description:
              "Te gustan los retos que ponen a prueba tus habilidades",
            confidence: 0.7,
            actionable: true,
            suggestedActions: [
              "Intentar problemas más difíciles",
              "Competir con amigos",
            ],
            priority: "high",
          });
        }
        break;

      case "adults":
        if (avgSessionLength > 30) {
          insights.push({
            type: "recommendation",
            title: "Optimización de tiempo",
            description: "Sesiones más cortas pueden ser más efectivas",
            confidence: 0.9,
            actionable: true,
            suggestedActions: [
              "Sesiones de 20-25 minutos",
              "Enfoque en calidad sobre cantidad",
            ],
            priority: "medium",
          });
        }
        break;

      case "seniors":
        insights.push({
          type: "strength",
          title: "Sabiduría y paciencia",
          description: "Su enfoque reflexivo es una gran fortaleza",
          confidence: 0.9,
          actionable: true,
          suggestedActions: [
            "Aprovechar su experiencia",
            "Tomar el tiempo necesario",
          ],
          priority: "low",
        });
        break;
    }

    return insights;
  }

  // Métodos de persistencia
  private async saveSession(session: SessionMetrics): Promise<void> {
    try {
      const sessions = await this.getAllSessions();
      sessions.push(session);

      // Mantener solo las últimas 100 sesiones
      const recentSessions = sessions.slice(-100);

      await AsyncStorage.setItem(
        `performance_sessions_${this.userId}`,
        JSON.stringify(recentSessions)
      );
    } catch (error) {
      console.error("Error saving session:", error);
    }
  }

  private async getAllSessions(): Promise<SessionMetrics[]> {
    try {
      const sessionsString = await AsyncStorage.getItem(
        `performance_sessions_${this.userId}`
      );
      if (!sessionsString) return [];

      const sessions = JSON.parse(sessionsString);
      return sessions.map((s: any) => ({
        ...s,
        startTime: new Date(s.startTime),
        endTime: new Date(s.endTime),
        mistakePatterns: s.mistakePatterns.map((p: any) => ({
          ...p,
          lastOccurrence: new Date(p.lastOccurrence),
        })),
      }));
    } catch (error) {
      console.error("Error loading sessions:", error);
      return [];
    }
  }

  private async getRecentSessions(days: number): Promise<SessionMetrics[]> {
    const allSessions = await this.getAllSessions();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return allSessions.filter((session) => session.startTime >= cutoffDate);
  }

  // Limpiar datos antiguos
  async cleanupOldData(): Promise<void> {
    try {
      const sessions = await this.getAllSessions();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 180); // Mantener 6 meses

      const recentSessions = sessions.filter(
        (session) => session.startTime >= cutoffDate
      );

      await AsyncStorage.setItem(
        `performance_sessions_${this.userId}`,
        JSON.stringify(recentSessions)
      );
    } catch (error) {
      console.error("Error cleaning up old data:", error);
    }
  }
}

export default PerformanceAnalytics;
