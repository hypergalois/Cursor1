import PerformanceAnalytics, {
  SessionMetrics,
  PersonalizedMetrics,
} from "./PerformanceAnalytics";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface AgeDetectionResult {
  predictedAgeGroup: "kids" | "teens" | "adults" | "seniors";
  confidence: number;
  reasoning: string[];
  behavioralIndicators: {
    attentionSpan: number;
    responseSpeed: number;
    errorPatterns: string[];
    navigationStyle: "direct" | "explorative" | "systematic";
    helpSeekingBehavior: "frequent" | "moderate" | "minimal";
    sessionLength: "short" | "medium" | "long";
  };
}

export interface PersonalizedRecommendation {
  id: string;
  type: "difficulty" | "timing" | "content" | "ui" | "motivation";
  title: string;
  description: string;
  actionable: string;
  expectedImpact: string;
  priority: "low" | "medium" | "high";
  ageGroup: "kids" | "teens" | "adults" | "seniors";
  implementationComplexity: "easy" | "medium" | "hard";
}

class AgeDetectionService {
  private static instance: AgeDetectionService;
  private analytics: PerformanceAnalytics;

  static getInstance(): AgeDetectionService {
    if (!AgeDetectionService.instance) {
      AgeDetectionService.instance = new AgeDetectionService();
    }
    return AgeDetectionService.instance;
  }

  constructor() {
    this.analytics = PerformanceAnalytics.getInstance();
  }

  // ✅ DETECTAR EDAD AUTOMÁTICAMENTE BASÁNDOSE EN PATRONES DE USO
  async detectAgeGroup(): Promise<AgeDetectionResult> {
    try {
      const sessions = await this.analytics.getRecentSessions(30);
      const personalizedMetrics = await this.analytics.getPersonalizedMetrics();

      if (sessions.length < 3) {
        // No hay suficientes datos, usar detección básica
        return this.getDefaultAgeDetection();
      }

      const behavioralIndicators = this.analyzeBehavioralPatterns(
        sessions,
        personalizedMetrics
      );
      const ageScores = this.calculateAgeGroupScores(behavioralIndicators);
      const prediction = this.selectBestAgeGroup(ageScores);

      console.log("🎯 Detección de edad completada:", {
        prediction: prediction.predictedAgeGroup,
        confidence: prediction.confidence,
        indicators: behavioralIndicators,
      });

      return prediction;
    } catch (error) {
      console.error("Error en detección de edad:", error);
      return this.getDefaultAgeDetection();
    }
  }

  // ✅ GENERAR RECOMENDACIONES PERSONALIZADAS BASADAS EN IA
  async generatePersonalizedRecommendations(
    ageGroup: "kids" | "teens" | "adults" | "seniors"
  ): Promise<PersonalizedRecommendation[]> {
    try {
      const personalizedMetrics = await this.analytics.getPersonalizedMetrics();
      const insights = await this.analytics.generateAgeAwareInsights(ageGroup);

      const recommendations: PersonalizedRecommendation[] = [];

      // Recomendaciones basadas en métricas de rendimiento
      recommendations.push(
        ...this.generatePerformanceRecommendations(
          personalizedMetrics,
          ageGroup
        )
      );

      // Recomendaciones basadas en patrones de tiempo
      recommendations.push(
        ...this.generateTimingRecommendations(personalizedMetrics, ageGroup)
      );

      // Recomendaciones basadas en engagement
      recommendations.push(
        ...this.generateEngagementRecommendations(personalizedMetrics, ageGroup)
      );

      // Recomendaciones específicas por edad
      recommendations.push(
        ...this.generateAgeSpecificRecommendations(ageGroup)
      );

      return recommendations
        .sort((a, b) => {
          const priorityWeight = { high: 3, medium: 2, low: 1 };
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        })
        .slice(0, 8); // Limitar a 8 recomendaciones principales
    } catch (error) {
      console.error("Error generando recomendaciones:", error);
      return this.getDefaultRecommendations(ageGroup);
    }
  }

  // ✅ ANALIZAR PATRONES COMPORTAMENTALES
  private analyzeBehavioralPatterns(
    sessions: SessionMetrics[],
    metrics: PersonalizedMetrics
  ): AgeDetectionResult["behavioralIndicators"] {
    const avgSessionLength =
      sessions.reduce(
        (sum, session) =>
          sum +
          (session.endTime.getTime() - session.startTime.getTime()) / 1000 / 60,
        0
      ) / sessions.length;

    const avgResponseTime =
      sessions.reduce((sum, session) => sum + session.averageResponseTime, 0) /
      sessions.length;

    const attentionSpan = this.calculateAttentionSpan(sessions);
    const errorPatterns = this.analyzeErrorPatterns(sessions);
    const navigationStyle = this.analyzeNavigationStyle(sessions, metrics);
    const helpSeeking = this.analyzeHelpSeekingBehavior(sessions);

    return {
      attentionSpan,
      responseSpeed: avgResponseTime,
      errorPatterns,
      navigationStyle,
      helpSeekingBehavior: helpSeeking,
      sessionLength:
        avgSessionLength < 10
          ? "short"
          : avgSessionLength < 25
          ? "medium"
          : "long",
    };
  }

  // ✅ CALCULAR SCORES PARA CADA GRUPO DE EDAD
  private calculateAgeGroupScores(
    indicators: AgeDetectionResult["behavioralIndicators"]
  ): Record<string, number> {
    const scores = {
      kids: 0,
      teens: 0,
      adults: 0,
      seniors: 0,
    };

    // Análisis de attention span
    if (indicators.attentionSpan < 0.3) {
      scores.kids += 0.8;
      scores.teens += 0.3;
    } else if (indicators.attentionSpan < 0.6) {
      scores.kids += 0.4;
      scores.teens += 0.7;
      scores.adults += 0.5;
    } else {
      scores.adults += 0.8;
      scores.seniors += 0.6;
    }

    // Análisis de velocidad de respuesta
    if (indicators.responseSpeed > 30) {
      scores.kids += 0.6;
      scores.seniors += 0.7;
    } else if (indicators.responseSpeed > 15) {
      scores.teens += 0.4;
      scores.adults += 0.6;
      scores.seniors += 0.3;
    } else {
      scores.teens += 0.8;
      scores.adults += 0.7;
    }

    // Análisis de duración de sesión
    if (indicators.sessionLength === "short") {
      scores.kids += 0.7;
      scores.seniors += 0.4;
    } else if (indicators.sessionLength === "medium") {
      scores.teens += 0.6;
      scores.adults += 0.8;
    } else {
      scores.adults += 0.6;
      scores.teens += 0.3;
    }

    // Análisis de estilo de navegación
    if (indicators.navigationStyle === "explorative") {
      scores.kids += 0.8;
      scores.teens += 0.4;
    } else if (indicators.navigationStyle === "systematic") {
      scores.adults += 0.7;
      scores.seniors += 0.6;
    } else {
      scores.teens += 0.5;
      scores.adults += 0.5;
    }

    // Análisis de búsqueda de ayuda
    if (indicators.helpSeekingBehavior === "frequent") {
      scores.kids += 0.6;
      scores.seniors += 0.4;
    } else if (indicators.helpSeekingBehavior === "minimal") {
      scores.teens += 0.7;
      scores.adults += 0.5;
    }

    return scores;
  }

  // ✅ SELECCIONAR MEJOR GRUPO DE EDAD
  private selectBestAgeGroup(
    scores: Record<string, number>
  ): AgeDetectionResult {
    const sortedScores = Object.entries(scores).sort(([, a], [, b]) => b - a);
    const [bestAgeGroup, bestScore] = sortedScores[0];
    const [secondBest, secondScore] = sortedScores[1];

    const confidence = Math.min(0.95, bestScore / (bestScore + secondScore));
    const reasoning = this.generateReasoning(bestAgeGroup as any, scores);

    return {
      predictedAgeGroup: bestAgeGroup as any,
      confidence,
      reasoning,
      behavioralIndicators: {} as any, // Se completará en el contexto de llamada
    };
  }

  // ✅ GENERAR RECOMENDACIONES DE RENDIMIENTO
  private generatePerformanceRecommendations(
    metrics: PersonalizedMetrics,
    ageGroup: string
  ): PersonalizedRecommendation[] {
    const recommendations: PersonalizedRecommendation[] = [];

    if (metrics.burnoutRisk > 0.6) {
      recommendations.push({
        id: "reduce_burnout",
        type: "timing",
        title: "Prevenir Fatiga Cognitiva",
        description: `Detectamos señales de fatiga. Para ${ageGroup}, recomendamos sesiones más cortas y descansos frecuentes.`,
        actionable: "Reducir sesiones a 15 minutos con descansos de 5 minutos",
        expectedImpact: "Mejora del 30% en retención y motivación",
        priority: "high",
        ageGroup: ageGroup as any,
        implementationComplexity: "easy",
      });
    }

    if (metrics.engagementLevel < 0.5) {
      const ageStrategies = {
        kids: "elementos más lúdicos y visuales",
        teens: "desafíos competitivos y logros",
        adults: "aplicaciones prácticas y eficiencia",
        seniors: "progreso claro y reconocimiento",
      };

      recommendations.push({
        id: "boost_engagement",
        type: "motivation",
        title: "Revitalizar Motivación",
        description: `Tu engagement está bajo. Integraremos ${
          ageStrategies[ageGroup as keyof typeof ageStrategies]
        }.`,
        actionable: "Activar modo de gamificación adaptado a tu edad",
        expectedImpact: "Incremento del 40% en tiempo de práctica",
        priority: "high",
        ageGroup: ageGroup as any,
        implementationComplexity: "medium",
      });
    }

    return recommendations;
  }

  // ✅ RECOMENDACIONES DE TIMING
  private generateTimingRecommendations(
    metrics: PersonalizedMetrics,
    ageGroup: string
  ): PersonalizedRecommendation[] {
    const recommendations: PersonalizedRecommendation[] = [];

    const optimalTimes = {
      kids: "por la mañana o después de merendar",
      teens: "por la tarde o noche",
      adults: "durante descansos del trabajo",
      seniors: "por la mañana cuando estás más descansado",
    };

    if (metrics.optimalPlayTime !== "morning") {
      recommendations.push({
        id: "optimize_timing",
        type: "timing",
        title: "Optimizar Horario de Estudio",
        description: `Para tu grupo de edad (${ageGroup}), el mejor momento es ${
          optimalTimes[ageGroup as keyof typeof optimalTimes]
        }.`,
        actionable: `Programar recordatorios para estudiar ${
          optimalTimes[ageGroup as keyof typeof optimalTimes]
        }`,
        expectedImpact: "Mejora del 25% en rendimiento y retención",
        priority: "medium",
        ageGroup: ageGroup as any,
        implementationComplexity: "easy",
      });
    }

    return recommendations;
  }

  // ✅ RECOMENDACIONES DE ENGAGEMENT
  private generateEngagementRecommendations(
    metrics: PersonalizedMetrics,
    ageGroup: string
  ): PersonalizedRecommendation[] {
    const recommendations: PersonalizedRecommendation[] = [];

    const engagementStrategies = {
      kids: {
        title: "Aventuras Matemáticas Divertidas",
        strategy: "historias, personajes y recompensas visuales",
        implementation: "Activar modo historia con MinoMascot",
      },
      teens: {
        title: "Desafíos y Competencia",
        strategy: "logros, tablas de liderazgo y desafíos entre amigos",
        implementation: "Habilitar modo competitivo y achievements",
      },
      adults: {
        title: "Eficiencia y Aplicación Práctica",
        strategy: "problemas del mundo real y progreso medible",
        implementation: "Enfocar en aplicaciones prácticas de matemáticas",
      },
      seniors: {
        title: "Aprendizaje Reflexivo y Cuidadoso",
        strategy: "explicaciones detalladas y progreso respetado",
        implementation: "Modo tutorial extendido con explicaciones profundas",
      },
    };

    const strategy =
      engagementStrategies[ageGroup as keyof typeof engagementStrategies];

    recommendations.push({
      id: "age_specific_engagement",
      type: "content",
      title: strategy.title,
      description: `Optimizado para ${ageGroup}: ${strategy.strategy}`,
      actionable: strategy.implementation,
      expectedImpact: "Incremento del 35% en tiempo de uso y satisfacción",
      priority: "medium",
      ageGroup: ageGroup as any,
      implementationComplexity: "medium",
    });

    return recommendations;
  }

  // ✅ RECOMENDACIONES ESPECÍFICAS POR EDAD
  private generateAgeSpecificRecommendations(
    ageGroup: string
  ): PersonalizedRecommendation[] {
    const recommendations: PersonalizedRecommendation[] = [];

    switch (ageGroup) {
      case "kids":
        recommendations.push({
          id: "kids_special",
          type: "ui",
          title: "Interfaz Extra Amigable para Niños",
          description:
            "Botones más grandes, colores brillantes y animaciones divertidas",
          actionable: "Activar modo infantil en configuración",
          expectedImpact: "Reducción del 50% en errores de navegación",
          priority: "high",
          ageGroup: "kids",
          implementationComplexity: "easy",
        });
        break;

      case "teens":
        recommendations.push({
          id: "teens_special",
          type: "motivation",
          title: "Sistema de Logros Sociales",
          description: "Compartir progreso y competir con amigos",
          actionable: "Conectar con redes sociales y crear perfil público",
          expectedImpact: "Incremento del 60% en engagement social",
          priority: "medium",
          ageGroup: "teens",
          implementationComplexity: "hard",
        });
        break;

      case "adults":
        recommendations.push({
          id: "adults_special",
          type: "content",
          title: "Aplicaciones Matemáticas Profesionales",
          description:
            "Problemas relacionados con finanzas, negocios y vida diaria",
          actionable: "Activar módulos de matemáticas aplicadas",
          expectedImpact: "Mayor relevancia y retención del 40%",
          priority: "medium",
          ageGroup: "adults",
          implementationComplexity: "medium",
        });
        break;

      case "seniors":
        recommendations.push({
          id: "seniors_special",
          type: "ui",
          title: "Accesibilidad Mejorada",
          description:
            "Texto más grande, mayor contraste y navegación simplificada",
          actionable: "Activar modo de accesibilidad completa",
          expectedImpact: "Mejora del 70% en usabilidad y confort",
          priority: "high",
          ageGroup: "seniors",
          implementationComplexity: "easy",
        });
        break;
    }

    return recommendations;
  }

  // ✅ MÉTODOS AUXILIARES
  private calculateAttentionSpan(sessions: SessionMetrics[]): number {
    if (sessions.length === 0) return 0.5;

    const avgFocusScore =
      sessions.reduce((sum, session) => sum + session.focusScore, 0) /
      sessions.length;

    return Math.min(1, Math.max(0, avgFocusScore));
  }

  private analyzeErrorPatterns(sessions: SessionMetrics[]): string[] {
    const patterns: string[] = [];

    sessions.forEach((session) => {
      session.mistakePatterns.forEach((mistake) => {
        if (mistake.frequency > 2 && !patterns.includes(mistake.category)) {
          patterns.push(mistake.category);
        }
      });
    });

    return patterns;
  }

  private analyzeNavigationStyle(
    sessions: SessionMetrics[],
    metrics: PersonalizedMetrics
  ): "direct" | "explorative" | "systematic" {
    if (metrics.averageSessionLength < 15) return "direct";
    if (sessions.some((s) => s.categoriesPlayed.length > 3))
      return "explorative";
    return "systematic";
  }

  private analyzeHelpSeekingBehavior(
    sessions: SessionMetrics[]
  ): "frequent" | "moderate" | "minimal" {
    const avgProblemsPerSession =
      sessions.reduce((sum, session) => sum + session.totalProblems, 0) /
      sessions.length;

    if (avgProblemsPerSession < 5) return "frequent";
    if (avgProblemsPerSession < 15) return "moderate";
    return "minimal";
  }

  private generateReasoning(
    ageGroup: string,
    scores: Record<string, number>
  ): string[] {
    const reasoning: string[] = [];

    switch (ageGroup) {
      case "kids":
        reasoning.push("Sesiones cortas y comportamiento explorativo");
        reasoning.push("Búsqueda frecuente de ayuda y pistas");
        reasoning.push("Patrones de atención variables");
        break;
      case "teens":
        reasoning.push("Velocidad de respuesta rápida");
        reasoning.push("Preferencia por desafíos");
        reasoning.push("Sesiones de duración media");
        break;
      case "adults":
        reasoning.push("Enfoque sistemático y eficiente");
        reasoning.push("Sesiones más largas y consistentes");
        reasoning.push("Búsqueda moderada de ayuda");
        break;
      case "seniors":
        reasoning.push("Enfoque cuidadoso y reflexivo");
        reasoning.push("Velocidad de respuesta más pausada");
        reasoning.push("Preferencia por explicaciones claras");
        break;
    }

    return reasoning;
  }

  private getDefaultAgeDetection(): AgeDetectionResult {
    return {
      predictedAgeGroup: "adults",
      confidence: 0.5,
      reasoning: ["Insuficientes datos para detección precisa"],
      behavioralIndicators: {
        attentionSpan: 0.5,
        responseSpeed: 20,
        errorPatterns: [],
        navigationStyle: "systematic",
        helpSeekingBehavior: "moderate",
        sessionLength: "medium",
      },
    };
  }

  private getDefaultRecommendations(
    ageGroup: string
  ): PersonalizedRecommendation[] {
    return [
      {
        id: "default_rec",
        type: "content",
        title: "Comenzar con lo Básico",
        description:
          "Recomendamos empezar con problemas básicos para establecer una línea base",
        actionable:
          "Completar al menos 5 problemas para recibir recomendaciones personalizadas",
        expectedImpact: "Establecer base para futuras recomendaciones",
        priority: "medium",
        ageGroup: ageGroup as any,
        implementationComplexity: "easy",
      },
    ];
  }

  // ✅ GUARDAR DETECCIÓN DE EDAD
  async saveAgeDetection(result: AgeDetectionResult): Promise<void> {
    try {
      const detectionData = {
        ...result,
        timestamp: Date.now(),
        version: "1.0",
      };

      await AsyncStorage.setItem(
        "ageDetectionResult",
        JSON.stringify(detectionData)
      );

      console.log("💾 Detección de edad guardada:", result.predictedAgeGroup);
    } catch (error) {
      console.error("Error saving age detection:", error);
    }
  }

  // ✅ CARGAR DETECCIÓN DE EDAD PREVIA
  async loadPreviousAgeDetection(): Promise<AgeDetectionResult | null> {
    try {
      const detectionData = await AsyncStorage.getItem("ageDetectionResult");
      if (detectionData) {
        const result = JSON.parse(detectionData);
        console.log("📖 Detección de edad cargada:", result.predictedAgeGroup);
        return result;
      }
      return null;
    } catch (error) {
      console.error("Error loading age detection:", error);
      return null;
    }
  }
}

export default AgeDetectionService;
