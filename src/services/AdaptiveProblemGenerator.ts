import PerformanceAnalytics, {
  LearningInsight,
  PersonalizedMetrics,
} from "./PerformanceAnalytics";
import AdaptiveDifficulty from "../utils/AdaptiveDifficulty";
import { getThemeForAge } from "../styles/theme";

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
    ageAppropriate: boolean;
    cognitiveLoad: "low" | "medium" | "high";
    contextualRelevance: boolean;
  };
  metadata: {
    conceptsInvolved: string[];
    prerequisiteSkills: string[];
    learningObjectives: string[];
    cognitiveLoad: number;
    ageGroup: "kids" | "teens" | "adults" | "seniors";
    realWorldContext?: string;
    visualSupport: boolean;
    gamificationElements: string[];
  };
}

export interface ProblemGenerationRequest {
  userId: string;
  userProfile: {
    ageGroup: "kids" | "teens" | "adults" | "seniors";
    name: string;
    preferences: {
      highContrast: boolean;
      largeText: boolean;
      soundEnabled: boolean;
      hapticsEnabled: boolean;
    };
  };
  sessionContext: {
    currentStreak: number;
    recentPerformance: number;
    timeSpent: number;
    categoriesPlayed: string[];
    currentScene?: string;
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
    developConfidence: boolean;
    encourageExploration: boolean;
    buildFundamentalSkills: boolean;
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
  ageConfigurations: {
    kids: {
      contextualThemes: string[];
      maxCognitiveLoad: number;
      visualElements: boolean;
      gamificationLevel: "high" | "medium" | "low";
      encouragementStyle: "enthusiastic" | "supportive" | "calm";
    };
    teens: {
      contextualThemes: string[];
      maxCognitiveLoad: number;
      coolFactor: boolean;
      competitiveElements: boolean;
      encouragementStyle: "achievement" | "challenge" | "peer";
    };
    adults: {
      contextualThemes: string[];
      maxCognitiveLoad: number;
      practicalApplications: boolean;
      efficiency: boolean;
      encouragementStyle: "professional" | "growth" | "practical";
    };
    seniors: {
      contextualThemes: string[];
      maxCognitiveLoad: number;
      nostalgicElements: boolean;
      clearInstructions: boolean;
      encouragementStyle: "respectful" | "gentle" | "wise";
    };
  };
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

  async generateAgeAdaptiveProblem(
    request: ProblemGenerationRequest
  ): Promise<AdaptiveProblem> {
    const insights = await this.analytics.generateInsights();
    const personalizedMetrics = await this.analytics.getPersonalizedMetrics();

    const strategy = await this.selectAgeAwareGenerationStrategy(
      request,
      insights,
      personalizedMetrics
    );

    const template = this.selectAgeAppropriateTemplate(
      strategy,
      request.userProfile.ageGroup
    );

    const difficulty = this.calculateAgeAdaptiveDifficulty(
      request,
      personalizedMetrics
    );

    const problem = await this.generateFromTemplate(
      template,
      difficulty,
      strategy
    );

    const adaptiveProblem = await this.enhanceWithAgeSpecificElements(
      problem,
      insights,
      personalizedMetrics,
      request.userProfile
    );

    return adaptiveProblem;
  }

  async generateAgeAwareSessionSequence(
    request: ProblemGenerationRequest,
    count: number
  ): Promise<AdaptiveProblem[]> {
    const problems: AdaptiveProblem[] = [];
    const personalizedMetrics = await this.analytics.getPersonalizedMetrics();

    const sequence = this.planAgeAwareSessionSequence(
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

      const problem = await this.generateAgeAdaptiveProblem(stepRequest);
      problems.push(problem);

      if (sequence[i]) {
        problem.adaptiveFactors = {
          ...problem.adaptiveFactors,
          ...sequence[i],
        };
      }
    }

    return problems;
  }

  async generateAdaptiveProblem(
    request: ProblemGenerationRequest
  ): Promise<AdaptiveProblem> {
    return this.generateAgeAdaptiveProblem(request);
  }

  async generateSessionSequence(
    request: ProblemGenerationRequest,
    count: number
  ): Promise<AdaptiveProblem[]> {
    return this.generateAgeAwareSessionSequence(request, count);
  }

  private async selectAgeAwareGenerationStrategy(
    request: ProblemGenerationRequest,
    insights: LearningInsight[],
    metrics: PersonalizedMetrics
  ): Promise<any> {
    const baseStrategy = await this.selectGenerationStrategy(
      request,
      insights,
      metrics
    );
    const ageGroup = request.userProfile.ageGroup;

    switch (ageGroup) {
      case "kids":
        return {
          ...baseStrategy,
          playfulness: "high",
          encouragement: "frequent",
          visualSupport: true,
          gameElements: ["rewards", "characters", "stories"],
          attentionSpan: "short",
          cognitiveLoadLimit: "low",
        };

      case "teens":
        return {
          ...baseStrategy,
          coolFactor: "high",
          competitiveElements: true,
          achievementFocus: true,
          socialRelevance: true,
          attentionSpan: "medium",
          cognitiveLoadLimit: "medium",
        };

      case "adults":
        return {
          ...baseStrategy,
          efficiency: "high",
          practicalApplications: true,
          goalOriented: true,
          timeOptimization: true,
          attentionSpan: "flexible",
          cognitiveLoadLimit: "high",
        };

      case "seniors":
        return {
          ...baseStrategy,
          clarity: "maximum",
          patience: "high",
          respectful: true,
          nostalgicElements: true,
          attentionSpan: "flexible",
          cognitiveLoadLimit: "medium",
        };

      default:
        return baseStrategy;
    }
  }

  private selectAgeAppropriateTemplate(
    strategy: any,
    ageGroup: string
  ): ProblemTemplate {
    let candidateTemplates = this.problemTemplates.filter((template) => {
      const ageConfig =
        template.ageConfigurations[
          ageGroup as keyof typeof template.ageConfigurations
        ];
      if (!ageConfig) return true;

      const templateCognitiveLoad =
        this.estimateTemplateCognitiveLoad(template);
      if (templateCognitiveLoad > ageConfig.maxCognitiveLoad) return false;

      return true;
    });

    if (strategy.focus !== "general") {
      candidateTemplates = candidateTemplates.filter(
        (t) =>
          t.category.toLowerCase().includes(strategy.focus.toLowerCase()) ||
          t.operation.toLowerCase().includes(strategy.focus.toLowerCase())
      );
    }

    if (candidateTemplates.length === 0) {
      candidateTemplates = this.problemTemplates;
    }

    const randomIndex = Math.floor(Math.random() * candidateTemplates.length);
    return candidateTemplates[randomIndex];
  }

  private calculateAgeAdaptiveDifficulty(
    request: ProblemGenerationRequest,
    metrics: PersonalizedMetrics
  ): "easy" | "medium" | "hard" | "expert" {
    const baseDifficulty = this.calculateAdaptiveDifficulty(request, metrics);
    const ageGroup = request.userProfile.ageGroup;

    const difficultyLevels = ["easy", "medium", "hard", "expert"];
    const currentIndex = difficultyLevels.indexOf(baseDifficulty);

    switch (ageGroup) {
      case "kids":
        if (currentIndex > 1) return "medium";
        return baseDifficulty;

      case "teens":
        if (currentIndex > 2) return "hard";
        return baseDifficulty;

      case "adults":
        return baseDifficulty;

      case "seniors":
        if (metrics.burnoutRisk > 0.5 && currentIndex > 1) {
          return difficultyLevels[Math.max(0, currentIndex - 1)] as any;
        }
        return baseDifficulty;

      default:
        return baseDifficulty;
    }
  }

  private async enhanceWithAgeSpecificElements(
    problem: AdaptiveProblem,
    insights: LearningInsight[],
    metrics: PersonalizedMetrics,
    userProfile: any
  ): Promise<AdaptiveProblem> {
    const enhancedProblem = await this.enhanceWithAdaptiveElements(
      problem,
      insights,
      metrics
    );

    switch (userProfile.ageGroup) {
      case "kids":
        return this.enhanceForKids(enhancedProblem, userProfile);

      case "teens":
        return this.enhanceForTeens(enhancedProblem, userProfile);

      case "adults":
        return this.enhanceForAdults(enhancedProblem, userProfile);

      case "seniors":
        return this.enhanceForSeniors(enhancedProblem, userProfile);

      default:
        return enhancedProblem;
    }
  }

  private enhanceForKids(
    problem: AdaptiveProblem,
    userProfile: any
  ): AdaptiveProblem {
    return {
      ...problem,
      problem: this.addPlayfulContext(problem.problem),
      explanation: this.makeExplanationFriendly(problem.explanation, "kids"),
      hints: problem.hints.map((hint) => `🎈 ${hint} ¡Tú puedes!`),
      adaptiveFactors: {
        ...problem.adaptiveFactors,
        ageAppropriate: true,
        cognitiveLoad: "low",
        contextualRelevance: true,
      },
      metadata: {
        ...problem.metadata,
        ageGroup: "kids",
        visualSupport: true,
        gamificationElements: [
          "stickers",
          "animations",
          "rewards",
          "characters",
        ],
        realWorldContext: this.getKidsContext(problem.category),
      },
    };
  }

  private enhanceForTeens(
    problem: AdaptiveProblem,
    userProfile: any
  ): AdaptiveProblem {
    return {
      ...problem,
      problem: this.addCoolContext(problem.problem),
      explanation: this.makeExplanationCool(problem.explanation),
      hints: problem.hints.map((hint) => `💡 Pro tip: ${hint}`),
      adaptiveFactors: {
        ...problem.adaptiveFactors,
        ageAppropriate: true,
        cognitiveLoad: "medium",
        contextualRelevance: true,
      },
      metadata: {
        ...problem.metadata,
        ageGroup: "teens",
        visualSupport: true,
        gamificationElements: [
          "achievements",
          "leaderboards",
          "challenges",
          "streaks",
        ],
        realWorldContext: this.getTeenContext(problem.category),
      },
    };
  }

  private enhanceForAdults(
    problem: AdaptiveProblem,
    userProfile: any
  ): AdaptiveProblem {
    return {
      ...problem,
      problem: this.addPracticalContext(problem.problem),
      explanation: this.makeExplanationPractical(problem.explanation),
      hints: problem.hints.map((hint) => `💼 Estrategia: ${hint}`),
      adaptiveFactors: {
        ...problem.adaptiveFactors,
        ageAppropriate: true,
        cognitiveLoad: "high",
        contextualRelevance: true,
      },
      metadata: {
        ...problem.metadata,
        ageGroup: "adults",
        visualSupport: false,
        gamificationElements: ["progress", "efficiency", "mastery", "insights"],
        realWorldContext: this.getAdultContext(problem.category),
      },
    };
  }

  private enhanceForSeniors(
    problem: AdaptiveProblem,
    userProfile: any
  ): AdaptiveProblem {
    return {
      ...problem,
      problem: this.addWiseContext(problem.problem),
      explanation: this.makeExplanationClear(problem.explanation),
      hints: problem.hints.map((hint) => `🌟 Consejo: ${hint}`),
      timeEstimate: problem.timeEstimate * 1.3,
      adaptiveFactors: {
        ...problem.adaptiveFactors,
        ageAppropriate: true,
        cognitiveLoad: "low",
        contextualRelevance: true,
      },
      metadata: {
        ...problem.metadata,
        ageGroup: "seniors",
        visualSupport: true,
        gamificationElements: ["wisdom", "reflection", "mastery", "teaching"],
        realWorldContext: this.getSeniorContext(problem.category),
      },
    };
  }

  // Planificar secuencia de sesión (método original mantenido)
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

  private planAgeAwareSessionSequence(
    request: ProblemGenerationRequest,
    metrics: PersonalizedMetrics,
    count: number
  ): any[] {
    const baseSequence = this.planSessionSequence(request, metrics, count);
    const ageGroup = request.userProfile.ageGroup;

    return baseSequence.map((step: any, index: number) => {
      const position = index / (count - 1);

      switch (ageGroup) {
        case "kids":
          return {
            ...step,
            encouragementLevel: position < 0.3 ? "high" : "medium",
            playfulElements: true,
            breakSuggestion: index % 3 === 2,
          };

        case "teens":
          return {
            ...step,
            competitiveElement: index % 2 === 0,
            achievementMilestone: position === 0.5 || position === 1.0,
            socialSharing: position === 1.0,
          };

        case "adults":
          return {
            ...step,
            efficiencyFocus: true,
            progressUpdate: index % 4 === 3,
            practicalApplication: position > 0.3,
          };

        case "seniors":
          return {
            ...step,
            extraClarity: true,
            patientPacing: true,
            wisdomConnection: position > 0.5,
          };

        default:
          return step;
      }
    });
  }

  private addPlayfulContext(problem: string): string {
    const playfulPhrases = [
      "🎈 Vamos a resolver este divertido problema:",
      "🌟 ¡Hora de brillar! ",
      "🎪 En el circo de las matemáticas:",
      "🦄 ¡Problema mágico!",
    ];
    const prefix =
      playfulPhrases[Math.floor(Math.random() * playfulPhrases.length)];
    return `${prefix} ${problem}`;
  }

  private addCoolContext(problem: string): string {
    const coolPhrases = [
      "🔥 Challenge time:",
      "⚡ Power problem:",
      "🎯 Mission:",
      "🚀 Level up:",
    ];
    const prefix = coolPhrases[Math.floor(Math.random() * coolPhrases.length)];
    return `${prefix} ${problem}`;
  }

  private addPracticalContext(problem: string): string {
    const practicalPhrases = [
      "💼 Situación práctica:",
      "🎯 Problema del mundo real:",
      "📊 Análisis requerido:",
      "⚙️ Desafío aplicado:",
    ];
    const prefix =
      practicalPhrases[Math.floor(Math.random() * practicalPhrases.length)];
    return `${prefix} ${problem}`;
  }

  private addWiseContext(problem: string): string {
    const wisePhrases = [
      "🌟 Reflexionemos sobre:",
      "🧠 Pensemos juntos:",
      "💭 Consideremos:",
      "⭐ Exploremos:",
    ];
    const prefix = wisePhrases[Math.floor(Math.random() * wisePhrases.length)];
    return `${prefix} ${problem}`;
  }

  private makeExplanationFriendly(
    explanation: string,
    ageGroup: string
  ): string {
    return `¡Muy bien! 🎉 ${explanation} ¡Sabía que podías hacerlo!`;
  }

  private makeExplanationCool(explanation: string): string {
    return `🔥 Awesome! ${explanation} You nailed it! 💪`;
  }

  private makeExplanationPractical(explanation: string): string {
    return `✅ Correcto. ${explanation} Esta habilidad es útil en situaciones reales.`;
  }

  private makeExplanationClear(explanation: string): string {
    return `🌟 Excelente trabajo. ${explanation} Su experiencia le ha servido bien.`;
  }

  private getKidsContext(category: string): string {
    const contexts = {
      suma: "Contando juguetes en la juguetería",
      resta: "Compartiendo caramelos con amigos",
      multiplicacion: "Grupos de animales en el zoológico",
      division: "Repartiendo pizza en la fiesta",
    };
    return contexts[category as keyof typeof contexts] || "Aventura matemática";
  }

  private getTeenContext(category: string): string {
    const contexts = {
      suma: "Calculando puntos en videojuegos",
      resta: "Gestionando dinero para compras",
      multiplicacion: "Planificando eventos escolares",
      division: "Dividiendo gastos entre amigos",
    };
    return contexts[category as keyof typeof contexts] || "Desafío matemático";
  }

  private getAdultContext(category: string): string {
    const contexts = {
      suma: "Planificación de presupuestos",
      resta: "Análisis de gastos",
      multiplicacion: "Cálculos de productividad",
      division: "Distribución de recursos",
    };
    return contexts[category as keyof typeof contexts] || "Aplicación práctica";
  }

  private getSeniorContext(category: string): string {
    const contexts = {
      suma: "Administrando gastos familiares",
      resta: "Calculando ahorros",
      multiplicacion: "Planificando para nietos",
      division: "Distribuyendo herencias",
    };
    return contexts[category as keyof typeof contexts] || "Sabiduría aplicada";
  }

  private estimateTemplateCognitiveLoad(template: ProblemTemplate): number {
    let load = 1;

    if (template.concepts.length > 2) load += 0.5;
    if (template.prerequisites.length > 1) load += 0.3;
    if (
      template.operation.includes("division") ||
      template.operation.includes("fraction")
    )
      load += 0.7;

    return Math.min(3, load);
  }

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

    problem.hints = this.generateSupportiveHints(template, weakness);
    problem.explanation = this.generateDetailedExplanation(template, weakness);

    return problem;
  }

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

    if (metrics.burnoutRisk > 0.7) {
      strategy.type = "engagement_focused";
      strategy.supportLevel = "high";
      strategy.difficulty = "easy";
    }

    if (metrics.engagementLevel < 0.4) {
      strategy.type = "motivation_focused";
      strategy.focus = "strengths";
      strategy.variety = "high";
    }

    const weaknesses = insights.filter(
      (i) => i.type === "weakness" && i.priority === "high"
    );
    if (weaknesses.length > 0 && request.adaptiveGoals.targetWeaknesses) {
      strategy.type = "weakness_targeted";
      strategy.focus = weaknesses[0].description;
      strategy.supportLevel = "high";
    }

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

  private selectTemplate(strategy: any): ProblemTemplate {
    return this.selectAgeAppropriateTemplate(strategy, "adults");
  }

  private calculateAdaptiveDifficulty(
    request: ProblemGenerationRequest,
    metrics: PersonalizedMetrics
  ): "easy" | "medium" | "hard" | "expert" {
    const baseModifiers = this.adaptiveDifficulty.getDifficultyModifiers();

    let targetDifficulty = "medium";

    if (request.sessionContext.recentPerformance > 0.8) {
      targetDifficulty = baseModifiers.complexityLevel >= 3 ? "hard" : "medium";
    } else if (request.sessionContext.recentPerformance < 0.5) {
      targetDifficulty = "easy";
    }

    if (metrics.burnoutRisk > 0.6) {
      targetDifficulty = "easy";
    }

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

  private async generateFromTemplate(
    template: ProblemTemplate,
    difficulty: string,
    strategy: any
  ): Promise<AdaptiveProblem> {
    const variables: { [key: string]: number } = {};
    const difficultyRanges =
      template.difficulty[difficulty as keyof typeof template.difficulty];

    Object.entries(template.variables).forEach(([varName, config]) => {
      const [min, max] = difficultyRanges[varName] || [config.min, config.max];

      if (config.type === "integer") {
        variables[varName] = Math.floor(Math.random() * (max - min + 1)) + min;
      } else if (config.type === "decimal") {
        variables[varName] =
          Math.round((Math.random() * (max - min) + min) * 100) / 100;
      }
    });

    let problemText = template.template;
    Object.entries(variables).forEach(([varName, value]) => {
      problemText = problemText.replace(
        new RegExp(`{${varName}}`, "g"),
        value.toString()
      );
    });

    const correctAnswer = this.calculateCorrectAnswer(template, variables);

    const options = this.generateOptions(correctAnswer, template, difficulty);

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
        ageAppropriate: false,
        cognitiveLoad: "medium",
        contextualRelevance: false,
      },
      metadata: {
        conceptsInvolved: template.concepts,
        prerequisiteSkills: template.prerequisites,
        learningObjectives: [`Resolver problemas de ${template.category}`],
        cognitiveLoad: this.calculateCognitiveLoad(template, difficulty),
        ageGroup: "adults",
        visualSupport: false,
        gamificationElements: [],
      },
    };
  }

  private calculateCorrectAnswer(
    template: ProblemTemplate,
    variables: { [key: string]: number }
  ): string {
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

    const variation =
      difficulty === "easy" ? 0.2 : difficulty === "medium" ? 0.5 : 0.8;

    for (let i = 0; i < 3; i++) {
      let distractor: number;

      if (Math.random() < 0.5) {
        distractor = this.generateCommonError(template, correct);
      } else {
        const range = correct * variation;
        distractor = correct + (Math.random() - 0.5) * range * 2;
      }

      const formatted =
        template.variables.a?.type === "integer"
          ? Math.round(distractor).toString()
          : (Math.round(distractor * 100) / 100).toString();

      if (!options.includes(formatted) && formatted !== correctAnswer) {
        options.push(formatted);
      }
    }

    while (options.length < 4) {
      const randomDistractor = (
        correct +
        (Math.random() - 0.5) * correct
      ).toString();
      if (!options.includes(randomDistractor)) {
        options.push(randomDistractor);
      }
    }

    return options.sort(() => Math.random() - 0.5);
  }

  private generateCommonError(
    template: ProblemTemplate,
    correct: number
  ): number {
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
    let baseTime = 15;

    const difficultyMultipliers = {
      easy: 0.7,
      medium: 1.0,
      hard: 1.5,
      expert: 2.0,
    };
    baseTime *=
      difficultyMultipliers[difficulty as keyof typeof difficultyMultipliers];

    baseTime *= template.concepts.length * 0.2 + 0.8;

    if (strategy.supportLevel === "high") {
      baseTime *= 1.3;
    }

    return Math.round(baseTime);
  }

  private calculateCognitiveLoad(
    template: ProblemTemplate,
    difficulty: string
  ): number {
    let load = 0.5;

    load += template.concepts.length * 0.1;

    load += template.prerequisites.length * 0.05;

    const difficultyLoads = { easy: 0.3, medium: 0.6, hard: 0.8, expert: 1.0 };
    load += difficultyLoads[difficulty as keyof typeof difficultyLoads];

    return Math.min(load, 1.0);
  }

  private async enhanceWithAdaptiveElements(
    problem: AdaptiveProblem,
    insights: LearningInsight[],
    metrics: PersonalizedMetrics
  ): Promise<AdaptiveProblem> {
    if (metrics.learningStyle === "visual") {
      problem.explanation =
        "🎨 " +
        problem.explanation +
        "\n💡 Intenta visualizar los números o dibujar la operación.";
    } else if (metrics.learningStyle === "methodical") {
      problem.explanation =
        "📝 " + problem.explanation + "\n🔢 Sigue cada paso cuidadosamente.";
    }

    if (metrics.motivationalFactors.includes("Logros y progreso")) {
      problem.hints.push(
        "¡Resolver este problema te acercará a tu próximo logro!"
      );
    }

    return problem;
  }

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
        ageConfigurations: {
          kids: {
            contextualThemes: ["juguetes", "juguetería"],
            maxCognitiveLoad: 1.5,
            visualElements: true,
            gamificationLevel: "low",
            encouragementStyle: "calm",
          },
          teens: {
            contextualThemes: ["videojuegos", "competitivo"],
            maxCognitiveLoad: 2.0,
            coolFactor: true,
            competitiveElements: true,
            encouragementStyle: "achievement",
          },
          adults: {
            contextualThemes: ["presupuestos", "productividad"],
            maxCognitiveLoad: 3.0,
            practicalApplications: true,
            efficiency: true,
            encouragementStyle: "professional",
          },
          seniors: {
            contextualThemes: ["ahorros", "herencias"],
            maxCognitiveLoad: 1.5,
            nostalgicElements: true,
            clearInstructions: true,
            encouragementStyle: "respectful",
          },
        },
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
        ageConfigurations: {
          kids: {
            contextualThemes: ["caramelos", "amigos"],
            maxCognitiveLoad: 1.0,
            visualElements: true,
            gamificationLevel: "low",
            encouragementStyle: "calm",
          },
          teens: {
            contextualThemes: ["dinero", "compras"],
            maxCognitiveLoad: 1.5,
            coolFactor: true,
            competitiveElements: true,
            encouragementStyle: "achievement",
          },
          adults: {
            contextualThemes: ["gastos", "presupuestos"],
            maxCognitiveLoad: 2.0,
            practicalApplications: true,
            efficiency: true,
            encouragementStyle: "professional",
          },
          seniors: {
            contextualThemes: ["ahorros", "herencias"],
            maxCognitiveLoad: 1.0,
            nostalgicElements: true,
            clearInstructions: true,
            encouragementStyle: "respectful",
          },
        },
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
        ageConfigurations: {
          kids: {
            contextualThemes: ["juguetes", "animales"],
            maxCognitiveLoad: 1.0,
            visualElements: true,
            gamificationLevel: "low",
            encouragementStyle: "calm",
          },
          teens: {
            contextualThemes: ["puntos", "videojuegos"],
            maxCognitiveLoad: 1.5,
            coolFactor: true,
            competitiveElements: true,
            encouragementStyle: "achievement",
          },
          adults: {
            contextualThemes: ["productividad", "cálculos"],
            maxCognitiveLoad: 2.0,
            practicalApplications: true,
            efficiency: true,
            encouragementStyle: "professional",
          },
          seniors: {
            contextualThemes: ["nietos", "planificación"],
            maxCognitiveLoad: 1.0,
            nostalgicElements: true,
            clearInstructions: true,
            encouragementStyle: "respectful",
          },
        },
      },
    ];
  }
}

export default AdaptiveProblemGenerator;
