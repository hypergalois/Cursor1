import PerformanceAnalytics, {
  LearningInsight,
  PersonalizedMetrics,
} from "./PerformanceAnalytics";
import AdaptiveDifficulty from "../utils/AdaptiveDifficulty";

export interface AdaptiveProblem {
  id: string;
  type: string;
  category: string;
  difficulty: "easy" | "medium" | "hard" | "expert";
  operation: string;
  problem: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  hints: string[];
  timeEstimate: number;
  adaptiveFactors: {
    targetWeakness: boolean;
    reinforceStrength: boolean;
    optimalTiming: boolean;
    personalizedStyle: boolean;
  };
  metadata: {
    conceptsInvolved: string[];
    prerequisiteSkills: string[];
    learningObjectives: string[];
    cognitiveLoad: number;
  };
}

export interface ProblemGenerationRequest {
  userId: string;
  sessionContext: {
    currentStreak: number;
    recentPerformance: number;
    timeSpent: number;
    categoriesPlayed: string[];
  };
  preferences: {
    preferredCategories?: string[];
    avoidCategories?: string[];
    maxDifficulty?: string;
    learningStyle?: string;
  };
  adaptiveGoals: {
    targetWeaknesses: boolean;
    reinforceStrengths: boolean;
    maintainEngagement: boolean;
    preventBurnout: boolean;
  };
}

export interface ProblemTemplate {
  id: string;
  category: string;
  operation: string;
  template: string;
  variables: {
    [key: string]: {
      min: number;
      max: number;
      type: "integer" | "decimal" | "fraction";
    };
  };
  difficulty: {
    easy: { [key: string]: [number, number] };
    medium: { [key: string]: [number, number] };
    hard: { [key: string]: [number, number] };
    expert: { [key: string]: [number, number] };
  };
  concepts: string[];
  prerequisites: string[];
}

class AdaptiveProblemGenerator {
  private static instance: AdaptiveProblemGenerator;
  private analytics: PerformanceAnalytics;
  private adaptiveDifficulty: AdaptiveDifficulty;
  private problemTemplates: ProblemTemplate[] = [];

  static getInstance(): AdaptiveProblemGenerator {
    if (!AdaptiveProblemGenerator.instance) {
      AdaptiveProblemGenerator.instance = new AdaptiveProblemGenerator();
    }
    return AdaptiveProblemGenerator.instance;
  }

  constructor() {
    this.analytics = PerformanceAnalytics.getInstance();
    this.adaptiveDifficulty = AdaptiveDifficulty.getInstance();
    this.initializeProblemTemplates();
  }

  // Generar problema personalizado
  async generateAdaptiveProblem(
    request: ProblemGenerationRequest
  ): Promise<AdaptiveProblem> {
    // Obtener insights del usuario
    const insights = await this.analytics.generateInsights();
    const personalizedMetrics = await this.analytics.getPersonalizedMetrics();

    // Seleccionar estrategia de generación
    const strategy = await this.selectGenerationStrategy(
      request,
      insights,
      personalizedMetrics
    );

    // Seleccionar template apropiado
    const template = this.selectTemplate(strategy);

    // Personalizar dificultad
    const difficulty = this.calculateAdaptiveDifficulty(
      request,
      personalizedMetrics
    );

    // Generar problema
    const problem = await this.generateFromTemplate(
      template,
      difficulty,
      strategy
    );

    // Añadir elementos adaptativos
    const adaptiveProblem = await this.enhanceWithAdaptiveElements(
      problem,
      insights,
      personalizedMetrics
    );

    return adaptiveProblem;
  }

  // Generar secuencia de problemas para sesión completa
  async generateSessionSequence(
    request: ProblemGenerationRequest,
    count: number
  ): Promise<AdaptiveProblem[]> {
    const problems: AdaptiveProblem[] = [];
    const personalizedMetrics = await this.analytics.getPersonalizedMetrics();

    // Planificar secuencia adaptativa
    const sequence = this.planSessionSequence(
      request,
      personalizedMetrics,
      count
    );

    for (let i = 0; i < count; i++) {
      const stepRequest = {
        ...request,
        sessionContext: {
          ...request.sessionContext,
          currentStreak: problems.filter((p) => p.correctAnswer).length,
        },
      };

      const problem = await this.generateAdaptiveProblem(stepRequest);
      problems.push(problem);

      // Ajustar para siguiente problema basado en secuencia planificada
      if (sequence[i]) {
        problem.adaptiveFactors = {
          ...problem.adaptiveFactors,
          ...sequence[i],
        };
      }
    }

    return problems;
  }

  // Generar problema específico para debilidad detectada
  async generateTargetedProblem(
    weakness: LearningInsight
  ): Promise<AdaptiveProblem> {
    const templates = this.problemTemplates.filter(
      (t) =>
        weakness.description.toLowerCase().includes(t.category.toLowerCase()) ||
        weakness.description.toLowerCase().includes(t.operation.toLowerCase())
    );

    if (templates.length === 0) {
      throw new Error(
        `No templates found for weakness: ${weakness.description}`
      );
    }

    const template = templates[0];
    const difficulty = weakness.priority === "high" ? "easy" : "medium";

    const problem = await this.generateFromTemplate(template, difficulty, {
      type: "weakness_targeted",
      focus: weakness.description,
      supportLevel: "high",
    });

    // Añadir soporte adicional para debilidades
    problem.hints = this.generateSupportiveHints(template, weakness);
    problem.explanation = this.generateDetailedExplanation(template, weakness);

    return problem;
  }

  // Seleccionar estrategia de generación basada en datos del usuario
  private async selectGenerationStrategy(
    request: ProblemGenerationRequest,
    insights: LearningInsight[],
    metrics: PersonalizedMetrics
  ): Promise<any> {
    const strategy: any = {
      type: "balanced",
      focus: "general",
      supportLevel: "medium",
    };

    // Analizar estado de burnout
    if (metrics.burnoutRisk > 0.7) {
      strategy.type = "engagement_focused";
      strategy.supportLevel = "high";
      strategy.difficulty = "easy";
    }

    // Analizar engagement bajo
    if (metrics.engagementLevel < 0.4) {
      strategy.type = "motivation_focused";
      strategy.focus = "strengths";
      strategy.variety = "high";
    }

    // Priorizar debilidades identificadas
    const weaknesses = insights.filter(
      (i) => i.type === "weakness" && i.priority === "high"
    );
    if (weaknesses.length > 0 && request.adaptiveGoals.targetWeaknesses) {
      strategy.type = "weakness_targeted";
      strategy.focus = weaknesses[0].description;
      strategy.supportLevel = "high";
    }

    // Reforzar fortalezas para mantener confianza
    const strengths = insights.filter((i) => i.type === "strength");
    if (
      request.sessionContext.recentPerformance < 0.6 &&
      strengths.length > 0
    ) {
      strategy.type = "confidence_building";
      strategy.focus = strengths[0].description;
      strategy.difficulty = "easy";
    }

    return strategy;
  }

  // Seleccionar template apropiado
  private selectTemplate(strategy: any): ProblemTemplate {
    let candidateTemplates = this.problemTemplates;

    // Filtrar por enfoque estratégico
    if (strategy.focus !== "general") {
      candidateTemplates = candidateTemplates.filter(
        (t) =>
          t.category.toLowerCase().includes(strategy.focus.toLowerCase()) ||
          t.operation.toLowerCase().includes(strategy.focus.toLowerCase())
      );
    }

    // Si no hay templates específicos, usar cualquiera
    if (candidateTemplates.length === 0) {
      candidateTemplates = this.problemTemplates;
    }

    // Seleccionar aleatoriamente de los candidatos
    const randomIndex = Math.floor(Math.random() * candidateTemplates.length);
    return candidateTemplates[randomIndex];
  }

  // Calcular dificultad adaptativa
  private calculateAdaptiveDifficulty(
    request: ProblemGenerationRequest,
    metrics: PersonalizedMetrics
  ): "easy" | "medium" | "hard" | "expert" {
    const baseModifiers = this.adaptiveDifficulty.getDifficultyModifiers();

    // Ajustar basado en rendimiento reciente
    let targetDifficulty = "medium";

    if (request.sessionContext.recentPerformance > 0.8) {
      targetDifficulty = baseModifiers.complexityLevel >= 3 ? "hard" : "medium";
    } else if (request.sessionContext.recentPerformance < 0.5) {
      targetDifficulty = "easy";
    }

    // Considerar burnout risk
    if (metrics.burnoutRisk > 0.6) {
      targetDifficulty = "easy";
    }

    // Respetar preferencias máximas
    if (request.preferences.maxDifficulty) {
      const difficultyLevels = ["easy", "medium", "hard", "expert"];
      const maxIndex = difficultyLevels.indexOf(
        request.preferences.maxDifficulty
      );
      const currentIndex = difficultyLevels.indexOf(targetDifficulty);

      if (currentIndex > maxIndex) {
        targetDifficulty = request.preferences.maxDifficulty as any;
      }
    }

    return targetDifficulty as "easy" | "medium" | "hard" | "expert";
  }

  // Generar problema desde template
  private async generateFromTemplate(
    template: ProblemTemplate,
    difficulty: string,
    strategy: any
  ): Promise<AdaptiveProblem> {
    const variables: { [key: string]: number } = {};
    const difficultyRanges =
      template.difficulty[difficulty as keyof typeof template.difficulty];

    // Generar valores para variables
    Object.entries(template.variables).forEach(([varName, config]) => {
      const [min, max] = difficultyRanges[varName] || [config.min, config.max];

      if (config.type === "integer") {
        variables[varName] = Math.floor(Math.random() * (max - min + 1)) + min;
      } else if (config.type === "decimal") {
        variables[varName] =
          Math.round((Math.random() * (max - min) + min) * 100) / 100;
      }
    });

    // Generar problema usando template
    let problemText = template.template;
    Object.entries(variables).forEach(([varName, value]) => {
      problemText = problemText.replace(
        new RegExp(`{${varName}}`, "g"),
        value.toString()
      );
    });

    // Calcular respuesta correcta (simplificado)
    const correctAnswer = this.calculateCorrectAnswer(template, variables);

    // Generar opciones incorrectas
    const options = this.generateOptions(correctAnswer, template, difficulty);

    // Estimar tiempo basado en dificultad y template
    const timeEstimate = this.estimateTimeRequired(
      template,
      difficulty,
      strategy
    );

    return {
      id: `${template.id}_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 5)}`,
      type: template.operation,
      category: template.category,
      difficulty: difficulty as any,
      operation: template.operation,
      problem: problemText,
      options,
      correctAnswer,
      explanation: this.generateExplanation(template, variables, correctAnswer),
      hints: this.generateHints(template, variables, strategy),
      timeEstimate,
      adaptiveFactors: {
        targetWeakness: strategy.type === "weakness_targeted",
        reinforceStrength: strategy.type === "confidence_building",
        optimalTiming: true,
        personalizedStyle: true,
      },
      metadata: {
        conceptsInvolved: template.concepts,
        prerequisiteSkills: template.prerequisites,
        learningObjectives: [`Resolver problemas de ${template.category}`],
        cognitiveLoad: this.calculateCognitiveLoad(template, difficulty),
      },
    };
  }

  // Planificar secuencia de sesión
  private planSessionSequence(
    request: ProblemGenerationRequest,
    metrics: PersonalizedMetrics,
    count: number
  ): any[] {
    const sequence: any[] = [];

    // Patrón básico: empezar fácil, aumentar gradualmente, terminar en sweet spot
    for (let i = 0; i < count; i++) {
      const position = i / (count - 1); // 0 a 1

      let strategy: any = { targetWeakness: false, reinforceStrength: false };

      if (position < 0.3) {
        // Inicio: warm-up con fortalezas
        strategy.reinforceStrength = true;
      } else if (position < 0.7) {
        // Medio: trabajar debilidades
        strategy.targetWeakness = request.adaptiveGoals.targetWeaknesses;
      } else {
        // Final: balance y confianza
        strategy.reinforceStrength = true;
      }

      sequence.push(strategy);
    }

    return sequence;
  }

  // Métodos auxiliares
  private calculateCorrectAnswer(
    template: ProblemTemplate,
    variables: { [key: string]: number }
  ): string {
    // Implementación simplificada - en una app real esto sería más sofisticado
    if (template.operation === "addition") {
      return (variables.a + variables.b).toString();
    } else if (template.operation === "subtraction") {
      return (variables.a - variables.b).toString();
    } else if (template.operation === "multiplication") {
      return (variables.a * variables.b).toString();
    } else if (template.operation === "division") {
      return (Math.round((variables.a / variables.b) * 100) / 100).toString();
    }

    return "0";
  }

  private generateOptions(
    correctAnswer: string,
    template: ProblemTemplate,
    difficulty: string
  ): string[] {
    const correct = parseFloat(correctAnswer);
    const options = [correctAnswer];

    // Generar distractores inteligentes
    const variation =
      difficulty === "easy" ? 0.2 : difficulty === "medium" ? 0.5 : 0.8;

    for (let i = 0; i < 3; i++) {
      let distractor: number;

      if (Math.random() < 0.5) {
        // Error común: off-by-one, intercambiar operación, etc.
        distractor = this.generateCommonError(template, correct);
      } else {
        // Error aleatorio dentro del rango
        const range = correct * variation;
        distractor = correct + (Math.random() - 0.5) * range * 2;
      }

      // Formatear según tipo de respuesta
      const formatted =
        template.variables.a?.type === "integer"
          ? Math.round(distractor).toString()
          : (Math.round(distractor * 100) / 100).toString();

      if (!options.includes(formatted) && formatted !== correctAnswer) {
        options.push(formatted);
      }
    }

    // Asegurar 4 opciones únicas
    while (options.length < 4) {
      const randomDistractor = (
        correct +
        (Math.random() - 0.5) * correct
      ).toString();
      if (!options.includes(randomDistractor)) {
        options.push(randomDistractor);
      }
    }

    // Mezclar opciones
    return options.sort(() => Math.random() - 0.5);
  }

  private generateCommonError(
    template: ProblemTemplate,
    correct: number
  ): number {
    // Generar errores comunes basados en el tipo de operación
    if (template.operation === "addition") {
      return Math.random() < 0.5 ? correct - 1 : correct + 1;
    } else if (template.operation === "subtraction") {
      return Math.random() < 0.5 ? correct + 2 : correct - 2;
    } else if (template.operation === "multiplication") {
      return Math.random() < 0.5
        ? correct + correct * 0.1
        : correct - correct * 0.1;
    }

    return correct * (Math.random() + 0.5);
  }

  private generateExplanation(
    template: ProblemTemplate,
    variables: { [key: string]: number },
    correctAnswer: string
  ): string {
    const { a, b } = variables;

    if (template.operation === "addition") {
      return `Para sumar ${a} + ${b}, contamos desde ${a} y agregamos ${b} más. El resultado es ${correctAnswer}.`;
    } else if (template.operation === "subtraction") {
      return `Para restar ${a} - ${b}, comenzamos con ${a} y quitamos ${b}. El resultado es ${correctAnswer}.`;
    } else if (template.operation === "multiplication") {
      return `Para multiplicar ${a} × ${b}, sumamos ${a} un total de ${b} veces. El resultado es ${correctAnswer}.`;
    } else if (template.operation === "division") {
      return `Para dividir ${a} ÷ ${b}, vemos cuántas veces cabe ${b} en ${a}. El resultado es ${correctAnswer}.`;
    }

    return `El resultado de esta operación es ${correctAnswer}.`;
  }

  private generateHints(
    template: ProblemTemplate,
    variables: { [key: string]: number },
    strategy: any
  ): string[] {
    const hints: string[] = [];
    const { a, b } = variables;

    if (strategy.supportLevel === "high") {
      if (template.operation === "addition") {
        hints.push(`Pista 1: Puedes usar tus dedos para contar desde ${a}`);
        hints.push(`Pista 2: ${a} + ${b} es lo mismo que ${b} + ${a}`);
        hints.push(`Pista 3: Intenta contar: ${a}, ${a + 1}, ${a + 2}...`);
      } else if (template.operation === "subtraction") {
        hints.push(
          `Pista 1: Comienza con ${a} y cuenta hacia atrás ${b} veces`
        );
        hints.push(`Pista 2: Piensa en qué número + ${b} = ${a}`);
      }
    } else {
      // Pistas más sutiles para niveles normales
      if (template.operation === "addition") {
        hints.push("Pista: Recuerda que puedes sumar en cualquier orden");
      } else if (template.operation === "subtraction") {
        hints.push(
          "Pista: ¿Qué número necesitas agregar al resultado para obtener el primer número?"
        );
      }
    }

    return hints;
  }

  private generateSupportiveHints(
    template: ProblemTemplate,
    weakness: LearningInsight
  ): string[] {
    const hints: string[] = [];

    // Generar pistas específicas basadas en la debilidad identificada
    if (weakness.description.includes("velocidad")) {
      hints.push(
        "Tómate tu tiempo - la precisión es más importante que la velocidad"
      );
      hints.push("Intenta resolver paso a paso sin prisa");
    }

    if (weakness.description.includes("precisión")) {
      hints.push("Revisa tu respuesta antes de confirmar");
      hints.push("Piensa en si tu respuesta tiene sentido");
    }

    // Añadir pistas específicas del template
    hints.push(
      ...this.generateHints(template, { a: 0, b: 0 }, { supportLevel: "high" })
    );

    return hints;
  }

  private generateDetailedExplanation(
    template: ProblemTemplate,
    weakness: LearningInsight
  ): string {
    let explanation = this.generateExplanation(
      template,
      { a: 0, b: 0 },
      "resultado"
    );

    // Añadir explicación específica para la debilidad
    if (weakness.description.includes("conceptos básicos")) {
      explanation += "\n\nRecuerda: " + weakness.suggestedActions.join(", ");
    }

    return explanation;
  }

  private estimateTimeRequired(
    template: ProblemTemplate,
    difficulty: string,
    strategy: any
  ): number {
    let baseTime = 15; // segundos base

    // Ajustar por dificultad
    const difficultyMultipliers = {
      easy: 0.7,
      medium: 1.0,
      hard: 1.5,
      expert: 2.0,
    };
    baseTime *=
      difficultyMultipliers[difficulty as keyof typeof difficultyMultipliers];

    // Ajustar por complejidad del template
    baseTime *= template.concepts.length * 0.2 + 0.8;

    // Ajustar por estrategia
    if (strategy.supportLevel === "high") {
      baseTime *= 1.3; // Más tiempo para problemas de soporte
    }

    return Math.round(baseTime);
  }

  private calculateCognitiveLoad(
    template: ProblemTemplate,
    difficulty: string
  ): number {
    let load = 0.5; // Base

    // Incrementar por conceptos involucrados
    load += template.concepts.length * 0.1;

    // Incrementar por prerequisitos
    load += template.prerequisites.length * 0.05;

    // Ajustar por dificultad
    const difficultyLoads = { easy: 0.3, medium: 0.6, hard: 0.8, expert: 1.0 };
    load += difficultyLoads[difficulty as keyof typeof difficultyLoads];

    return Math.min(load, 1.0);
  }

  private async enhanceWithAdaptiveElements(
    problem: AdaptiveProblem,
    insights: LearningInsight[],
    metrics: PersonalizedMetrics
  ): Promise<AdaptiveProblem> {
    // Personalizar basado en estilo de aprendizaje
    if (metrics.learningStyle === "visual") {
      problem.explanation =
        "🎨 " +
        problem.explanation +
        "\n💡 Intenta visualizar los números o dibujar la operación.";
    } else if (metrics.learningStyle === "methodical") {
      problem.explanation =
        "📝 " + problem.explanation + "\n🔢 Sigue cada paso cuidadosamente.";
    }

    // Añadir motivación personalizada
    if (metrics.motivationalFactors.includes("Logros y progreso")) {
      problem.hints.push(
        "¡Resolver este problema te acercará a tu próximo logro!"
      );
    }

    return problem;
  }

  // Inicializar templates de problemas
  private initializeProblemTemplates(): void {
    this.problemTemplates = [
      {
        id: "addition_basic",
        category: "Aritmética",
        operation: "addition",
        template: "¿Cuánto es {a} + {b}?",
        variables: {
          a: { min: 1, max: 100, type: "integer" },
          b: { min: 1, max: 100, type: "integer" },
        },
        difficulty: {
          easy: { a: [1, 10], b: [1, 10] },
          medium: { a: [10, 50], b: [10, 50] },
          hard: { a: [50, 100], b: [50, 100] },
          expert: { a: [100, 500], b: [100, 500] },
        },
        concepts: ["suma", "números enteros"],
        prerequisites: ["contar"],
      },
      {
        id: "subtraction_basic",
        category: "Aritmética",
        operation: "subtraction",
        template: "¿Cuánto es {a} - {b}?",
        variables: {
          a: { min: 2, max: 100, type: "integer" },
          b: { min: 1, max: 50, type: "integer" },
        },
        difficulty: {
          easy: { a: [5, 20], b: [1, 10] },
          medium: { a: [20, 60], b: [10, 30] },
          hard: { a: [60, 100], b: [30, 60] },
          expert: { a: [100, 500], b: [50, 250] },
        },
        concepts: ["resta", "números enteros"],
        prerequisites: ["suma básica"],
      },
      {
        id: "multiplication_basic",
        category: "Aritmética",
        operation: "multiplication",
        template: "¿Cuánto es {a} × {b}?",
        variables: {
          a: { min: 1, max: 20, type: "integer" },
          b: { min: 1, max: 20, type: "integer" },
        },
        difficulty: {
          easy: { a: [1, 5], b: [1, 5] },
          medium: { a: [5, 10], b: [5, 10] },
          hard: { a: [10, 15], b: [10, 15] },
          expert: { a: [15, 20], b: [15, 20] },
        },
        concepts: ["multiplicación", "tablas"],
        prerequisites: ["suma repetida"],
      },
      // Añadir más templates según necesidad...
    ];
  }
}

export default AdaptiveProblemGenerator;
