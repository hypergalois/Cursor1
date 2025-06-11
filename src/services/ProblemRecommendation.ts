// 🧠 IA DE RECOMENDACIÓN INTELIGENTE PARA MINOTAURO
// Sistema adaptativo que aprende del usuario y recomienda problemas personalizados

export interface MathProblem {
  id: string;
  type: "addition" | "subtraction" | "multiplication" | "division";
  difficulty: 1 | 2 | 3 | 4 | 5; // 1=fácil, 5=difícil
  question: string;
  answer: number;
  options?: number[];
  timeLimit?: number; // en segundos
  expectedTime?: number; // tiempo esperado para resolver
}

export interface UserData {
  accuracy: number; // 0-100%
  averageTime: number; // en segundos
  currentDifficulty: number; // 1-5
  problemHistory: ProblemAttempt[];
  typePreferences: TypePerformance; // rendimiento por tipo
  consecutiveCorrect: number;
  consecutiveWrong: number;
  totalProblems: number;
}

export interface ProblemAttempt {
  type: MathProblem["type"];
  difficulty: number;
  timeMs: number;
  isCorrect: boolean;
  timestamp: number;
}

export interface TypePerformance {
  addition: { accuracy: number; avgTime: number; count: number };
  subtraction: { accuracy: number; avgTime: number; count: number };
  multiplication: { accuracy: number; avgTime: number; count: number };
  division: { accuracy: number; avgTime: number; count: number };
}

// Interfaz principal del motor de recomendación
export interface RecommendationEngine {
  getNextProblem(userData: UserData): MathProblem;
  updatePerformance(isCorrect: boolean, timeMs: number): void;
  getUserData(): UserData;
  resetUserData(): void;
}

export class SmartProblemRecommendationEngine implements RecommendationEngine {
  private userData: UserData;
  private lastProblemType: MathProblem["type"] | null = null;
  private typeRotationIndex: number = 0;

  constructor() {
    this.userData = this.initializeUserData();
  }

  private initializeUserData(): UserData {
    return {
      accuracy: 50, // Empezar neutral
      averageTime: 25, // 25 segundos promedio inicial
      currentDifficulty: 2, // Empezar en dificultad media-baja
      problemHistory: [],
      typePreferences: {
        addition: { accuracy: 50, avgTime: 20, count: 0 },
        subtraction: { accuracy: 50, avgTime: 25, count: 0 },
        multiplication: { accuracy: 50, avgTime: 30, count: 0 },
        division: { accuracy: 50, avgTime: 35, count: 0 },
      },
      consecutiveCorrect: 0,
      consecutiveWrong: 0,
      totalProblems: 0,
    };
  }

  // 🎯 ALGORITMO PRINCIPAL: Obtener siguiente problema recomendado
  getNextProblem(userData?: UserData): MathProblem {
    if (userData) {
      this.userData = userData;
    }

    // 1. Calcular dificultad óptima según precisión
    const difficulty = this.calculateOptimalDifficulty();

    // 2. Seleccionar tipo de operación con rotación inteligente
    const type = this.selectOptimalProblemType();

    // 3. Generar problema personalizado
    const problem = this.generateProblem(type, difficulty);

    // 4. Almacenar que tipo se generó para rotación
    this.lastProblemType = type;

    return problem;
  }

  // 📊 REGLAS DE DIFICULTAD INTELIGENTE
  private calculateOptimalDifficulty(): 1 | 2 | 3 | 4 | 5 {
    const {
      accuracy,
      consecutiveCorrect,
      consecutiveWrong,
      currentDifficulty,
    } = this.userData;

    // REGLA 1: Si precisión > 80% → SUBIR dificultad
    if (accuracy > 80 && consecutiveCorrect >= 2) {
      const newDifficulty = Math.min(5, currentDifficulty + 1);
      this.userData.currentDifficulty = newDifficulty;
      return newDifficulty as 1 | 2 | 3 | 4 | 5;
    }

    // REGLA 2: Si precisión < 60% → BAJAR dificultad
    if (accuracy < 60 || consecutiveWrong >= 2) {
      const newDifficulty = Math.max(1, currentDifficulty - 1);
      this.userData.currentDifficulty = newDifficulty;
      return newDifficulty as 1 | 2 | 3 | 4 | 5;
    }

    // REGLA 3: Si tiempo > promedio → mantener dificultad similar
    const recentAvgTime = this.getRecentAverageTime();
    if (recentAvgTime > this.userData.averageTime * 1.3) {
      // Tiempo muy por encima del promedio, mantener nivel actual
      return currentDifficulty as 1 | 2 | 3 | 4 | 5;
    }

    // REGLA 4: Micro-ajustes basados en racha
    if (consecutiveCorrect >= 5) {
      // Racha muy buena, subir gradualmente
      const newDifficulty = Math.min(5, currentDifficulty + 0.5);
      this.userData.currentDifficulty = Math.ceil(newDifficulty);
      return Math.ceil(newDifficulty) as 1 | 2 | 3 | 4 | 5;
    }

    return currentDifficulty as 1 | 2 | 3 | 4 | 5;
  }

  // 🔄 ROTACIÓN INTELIGENTE DE TIPOS DE OPERACIONES
  private selectOptimalProblemType(): MathProblem["type"] {
    const types: MathProblem["type"][] = [
      "addition",
      "subtraction",
      "multiplication",
      "division",
    ];

    // Si es el primer problema o muy pocos problemas, usar rotación simple
    if (this.userData.totalProblems < 4) {
      const type = types[this.typeRotationIndex % types.length];
      this.typeRotationIndex++;
      return type;
    }

    // Análisis de rendimiento por tipo
    const typePerformances = Object.entries(this.userData.typePreferences).map(
      ([type, perf]) => ({
        type: type as MathProblem["type"],
        accuracy: perf.accuracy,
        count: perf.count,
        needsPractice: perf.accuracy < 70, // Tipos que necesitan práctica
        recentlyUsed: this.lastProblemType === type,
      })
    );

    // PRIORIDAD 1: Practicar tipos con baja precisión
    const needsPractice = typePerformances.filter(
      (t) => t.needsPractice && !t.recentlyUsed
    );
    if (needsPractice.length > 0) {
      const worstType = needsPractice.sort(
        (a, b) => a.accuracy - b.accuracy
      )[0];
      return worstType.type;
    }

    // PRIORIDAD 2: Rotar tipos evitando repetir el último
    const availableTypes = typePerformances.filter((t) => !t.recentlyUsed);
    if (availableTypes.length > 0) {
      // Seleccionar tipo con menos práctica reciente
      const leastPracticed = availableTypes.sort(
        (a, b) => a.count - b.count
      )[0];
      return leastPracticed.type;
    }

    // FALLBACK: Rotación simple
    this.typeRotationIndex++;
    return types[this.typeRotationIndex % types.length];
  }

  // 🏗️ GENERADOR INTELIGENTE DE PROBLEMAS
  private generateProblem(
    type: MathProblem["type"],
    difficulty: 1 | 2 | 3 | 4 | 5
  ): MathProblem {
    // Rangos adaptativos por dificultad
    const ranges = {
      1: { min: 1, max: 10, timeLimit: 45 }, // Muy fácil
      2: { min: 2, max: 20, timeLimit: 40 }, // Fácil
      3: { min: 5, max: 50, timeLimit: 35 }, // Medio
      4: { min: 10, max: 100, timeLimit: 30 }, // Difícil
      5: { min: 20, max: 200, timeLimit: 25 }, // Muy difícil
    };

    const range = ranges[difficulty];
    let a = Math.floor(Math.random() * (range.max - range.min)) + range.min;
    let b = Math.floor(Math.random() * (range.max - range.min)) + range.min;

    let question: string;
    let answer: number;
    let expectedTime: number;

    switch (type) {
      case "addition":
        question = `${a} + ${b}`;
        answer = a + b;
        expectedTime = range.timeLimit * 0.6; // Suma es más rápida
        break;

      case "subtraction":
        // Asegurar resultado positivo
        if (a < b) [a, b] = [b, a];
        question = `${a} - ${b}`;
        answer = a - b;
        expectedTime = range.timeLimit * 0.7;
        break;

      case "multiplication":
        // Números más pequeños para multiplicación
        a = Math.max(1, Math.floor(a / (difficulty + 1)));
        b = Math.max(1, Math.floor(b / (difficulty + 1)));
        question = `${a} × ${b}`;
        answer = a * b;
        expectedTime = range.timeLimit * 0.8;
        break;

      case "division":
        // Generar división exacta
        b = Math.max(1, Math.floor(b / difficulty));
        const product = a * b;
        question = `${product} ÷ ${b}`;
        answer = a;
        expectedTime = range.timeLimit; // División es más lenta
        break;
    }

    // Generar opciones múltiples para dificultades bajas
    const options =
      difficulty <= 2
        ? this.generateSmartOptions(answer, type, difficulty)
        : undefined;

    return {
      id: `smart_${type}_${difficulty}_${Date.now()}`,
      type,
      difficulty,
      question: `${question} = ?`,
      answer,
      options,
      timeLimit: range.timeLimit,
      expectedTime,
    };
  }

  // 🎲 GENERADOR INTELIGENTE DE OPCIONES MÚLTIPLES
  private generateSmartOptions(
    correctAnswer: number,
    type: MathProblem["type"],
    difficulty: number
  ): number[] {
    const options = [correctAnswer];

    // Generar opciones incorrectas inteligentes
    const variations = this.getTypicalMistakes(correctAnswer, type, difficulty);

    for (const variation of variations) {
      if (options.length >= 4) break;
      if (variation > 0 && !options.includes(variation)) {
        options.push(variation);
      }
    }

    // Completar con opciones aleatorias si no hay suficientes
    while (options.length < 4) {
      const offset = Math.floor(Math.random() * 20) - 10;
      const wrongAnswer = Math.max(1, correctAnswer + offset);
      if (!options.includes(wrongAnswer)) {
        options.push(wrongAnswer);
      }
    }

    // Mezclar opciones aleatoriamente
    return this.shuffleArray(options);
  }

  // 🧠 ERRORES TÍPICOS POR TIPO DE OPERACIÓN
  private getTypicalMistakes(
    correct: number,
    type: MathProblem["type"],
    difficulty: number
  ): number[] {
    const mistakes: number[] = [];

    switch (type) {
      case "addition":
        mistakes.push(correct - 1, correct + 1); // Errores de cálculo
        break;
      case "subtraction":
        mistakes.push(correct + 1, correct - 1); // Confundir suma/resta
        break;
      case "multiplication":
        mistakes.push(correct + 10, correct - 10); // Errores en tablas
        break;
      case "division":
        mistakes.push(correct * 2, Math.floor(correct / 2)); // Confundir operación
        break;
    }

    return mistakes;
  }

  // 📈 ACTUALIZACIÓN INTELIGENTE DEL RENDIMIENTO
  updatePerformance(isCorrect: boolean, timeMs: number): void {
    const timeSeconds = timeMs / 1000;

    // Crear registro del intento
    const attempt: ProblemAttempt = {
      type: this.lastProblemType || "addition",
      difficulty: this.userData.currentDifficulty,
      timeMs,
      isCorrect,
      timestamp: Date.now(),
    };

    // Agregar a historial (mantener últimos 50)
    this.userData.problemHistory.push(attempt);
    if (this.userData.problemHistory.length > 50) {
      this.userData.problemHistory.shift();
    }

    // Actualizar contadores generales
    this.userData.totalProblems++;

    if (isCorrect) {
      this.userData.consecutiveCorrect++;
      this.userData.consecutiveWrong = 0;
    } else {
      this.userData.consecutiveWrong++;
      this.userData.consecutiveCorrect = 0;
    }

    // Actualizar precisión general (weighted average)
    const weight = Math.min(20, this.userData.totalProblems); // Máximo peso 20
    this.userData.accuracy =
      (this.userData.accuracy * (weight - 1) + (isCorrect ? 100 : 0)) / weight;

    // Actualizar tiempo promedio
    this.userData.averageTime =
      (this.userData.averageTime * (this.userData.totalProblems - 1) +
        timeSeconds) /
      this.userData.totalProblems;

    // Actualizar rendimiento por tipo
    if (this.lastProblemType) {
      this.updateTypePerformance(this.lastProblemType, isCorrect, timeSeconds);
    }
  }

  // 📊 ACTUALIZAR RENDIMIENTO POR TIPO DE OPERACIÓN
  private updateTypePerformance(
    type: MathProblem["type"],
    isCorrect: boolean,
    timeSeconds: number
  ): void {
    const typePerf = this.userData.typePreferences[type];

    typePerf.count++;

    // Actualizar precisión del tipo
    typePerf.accuracy =
      (typePerf.accuracy * (typePerf.count - 1) + (isCorrect ? 100 : 0)) /
      typePerf.count;

    // Actualizar tiempo promedio del tipo
    typePerf.avgTime =
      (typePerf.avgTime * (typePerf.count - 1) + timeSeconds) / typePerf.count;
  }

  // 📈 OBTENER TIEMPO PROMEDIO RECIENTE
  private getRecentAverageTime(): number {
    const recentAttempts = this.userData.problemHistory.slice(-5); // Últimos 5 problemas
    if (recentAttempts.length === 0) return this.userData.averageTime;

    const totalTime = recentAttempts.reduce(
      (sum, attempt) => sum + attempt.timeMs / 1000,
      0
    );
    return totalTime / recentAttempts.length;
  }

  // 🔀 MEZCLAR ARRAY (Fisher-Yates shuffle)
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // 📊 MÉTODOS DE ACCESO A DATOS
  getUserData(): UserData {
    return { ...this.userData };
  }

  resetUserData(): void {
    this.userData = this.initializeUserData();
    this.lastProblemType = null;
    this.typeRotationIndex = 0;
  }

  // 📈 OBTENER ANÁLISIS DE RENDIMIENTO
  getPerformanceAnalysis(): {
    strongestType: MathProblem["type"];
    weakestType: MathProblem["type"];
    recommendedFocus: MathProblem["type"];
    overallTrend: "improving" | "stable" | "declining";
  } {
    const typePerfs = Object.entries(this.userData.typePreferences) as [
      MathProblem["type"],
      TypePerformance[keyof TypePerformance]
    ][];

    // Encontrar tipo más fuerte y más débil
    const sortedByAccuracy = typePerfs
      .filter(([_, perf]) => perf.count > 0)
      .sort((a, b) => b[1].accuracy - a[1].accuracy);

    const strongestType = sortedByAccuracy[0]?.[0] || "addition";
    const weakestType =
      sortedByAccuracy[sortedByAccuracy.length - 1]?.[0] || "addition";

    // Recomendar enfoque (tipo con peor rendimiento)
    const recommendedFocus =
      typePerfs
        .filter(([_, perf]) => perf.accuracy < 70)
        .sort((a, b) => a[1].accuracy - b[1].accuracy)[0]?.[0] || weakestType;

    // Analizar tendencia general
    const recentAccuracy = this.getRecentAccuracy();
    let overallTrend: "improving" | "stable" | "declining" = "stable";

    if (recentAccuracy > this.userData.accuracy + 5) {
      overallTrend = "improving";
    } else if (recentAccuracy < this.userData.accuracy - 5) {
      overallTrend = "declining";
    }

    return {
      strongestType,
      weakestType,
      recommendedFocus,
      overallTrend,
    };
  }

  private getRecentAccuracy(): number {
    const recentAttempts = this.userData.problemHistory.slice(-10);
    if (recentAttempts.length === 0) return this.userData.accuracy;

    const correctCount = recentAttempts.filter(
      (attempt) => attempt.isCorrect
    ).length;
    return (correctCount / recentAttempts.length) * 100;
  }
}

// 🎯 INSTANCIA SINGLETON DEL MOTOR DE IA
export const smartProblemRecommendation =
  new SmartProblemRecommendationEngine();

// Mantener compatibilidad con la interfaz anterior
export const problemRecommendation = smartProblemRecommendation;
