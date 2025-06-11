// Hook principal del game loop simplificado con IA inteligente
// Maneja el flujo: problema → feedback → siguiente problema

import { useState, useCallback, useEffect } from "react";
import {
  smartProblemRecommendation,
  MathProblem,
  UserData,
} from "../services/ProblemRecommendation";
import {
  dailyStreakService,
  DailyStreakData,
} from "../services/DailyStreakService";

export interface GameState {
  currentProblem: MathProblem | null;
  lastAnsweredProblem: MathProblem | null; // Problema que se acaba de responder (para feedback)
  userAnswer: string;
  isCorrect: boolean | null;
  showFeedback: boolean;
  startTime: number | null;
  xpGained: number;
  level: number;
  streak: number; // problemas consecutivos
  totalXP: number;
  // Nuevas métricas de IA
  accuracy: number;
  currentDifficulty: number;
  strongestType: MathProblem["type"] | null;
  weakestType: MathProblem["type"] | null;
  recommendedFocus: MathProblem["type"] | null;
  // Sistema de racha diaria y gamificación
  dailyStreak: number;
  longestStreak: number;
  dailyStreakData: DailyStreakData | null;
  mascotMood: "happy" | "neutral" | "sad" | "super_happy";
  showParticles: boolean;
  // Estado de navegación para prevenir race conditions
  isProcessing: boolean;
}

export interface GameActions {
  // Acciones principales
  startNewProblem: () => void;
  submitAnswer: (
    answer: string | number
  ) => Promise<{ isCorrect: boolean; xpGained: number } | undefined>;
  continueToNext: () => void;

  // Utilidades
  resetGame: () => void;
  getUserData: () => UserData;
  getPerformanceAnalysis: () => {
    strongestType: MathProblem["type"];
    weakestType: MathProblem["type"];
    recommendedFocus: MathProblem["type"];
    overallTrend: "improving" | "stable" | "declining";
  };
  // Gamificación
  hideParticles: () => void;
  getMascotMoodForCurrentState: () =>
    | "happy"
    | "neutral"
    | "sad"
    | "super_happy";
  // Estado de feedback
  getFeedbackState: () => {
    isCorrect: boolean | null;
    xpGained: number;
    showFeedback: boolean;
    lastAnsweredProblem: MathProblem | null;
    userAnswer: string;
  };
}

export function useGameLoop(): [GameState, GameActions] {
  // Estado principal del juego
  const [gameState, setGameState] = useState<GameState>({
    currentProblem: null,
    lastAnsweredProblem: null,
    userAnswer: "",
    isCorrect: null,
    showFeedback: false,
    startTime: null,
    xpGained: 0,
    level: 1,
    streak: 0,
    totalXP: 0,
    accuracy: 50,
    currentDifficulty: 2,
    strongestType: null,
    weakestType: null,
    recommendedFocus: null,
    // Sistema de racha diaria y gamificación
    dailyStreak: 0,
    longestStreak: 0,
    dailyStreakData: null,
    mascotMood: "neutral",
    showParticles: false,
    // Estado de navegación para prevenir race conditions
    isProcessing: false,
  });

  // Inicializar primer problema y cargar racha diaria
  useEffect(() => {
    if (!gameState.currentProblem) {
      startNewProblem();
    }
    loadDailyStreakData();
  }, []);

  // Cargar datos de racha diaria
  const loadDailyStreakData = useCallback(async () => {
    try {
      const streakData = await dailyStreakService.getStreakData();
      const mascotMood = await dailyStreakService.getMascotMoodForStreak();

      setGameState((prev) => ({
        ...prev,
        dailyStreak: streakData.currentStreak,
        longestStreak: streakData.longestStreak,
        dailyStreakData: streakData,
        mascotMood,
      }));
    } catch (error) {
      console.warn("Error loading daily streak data:", error);
    }
  }, []);

  // Actualizar métricas de IA cuando cambie el motor
  useEffect(() => {
    updateAIMetrics();
  }, [gameState.totalXP]); // Actualizar cuando haya cambios

  // Generar nuevo problema usando la IA
  const startNewProblem = useCallback(() => {
    console.log("Starting new problem...");
    console.log("Current state before new problem:", {
      showFeedback: gameState.showFeedback,
      currentProblem: gameState.currentProblem?.id,
      userAnswer: gameState.userAnswer,
    });

    try {
      // Obtener problema recomendado por la IA
      const problem = smartProblemRecommendation.getNextProblem();

      console.log("Generated new problem:", {
        id: problem.id,
        question: problem.question,
        answer: problem.answer,
        type: problem.type,
        difficulty: problem.difficulty,
        options: problem.options,
      });

      setGameState((prev) => ({
        ...prev,
        currentProblem: problem,
        userAnswer: "",
        isCorrect: null,
        showFeedback: false,
        startTime: Date.now(),
        xpGained: 0,
        showParticles: false,
        lastAnsweredProblem: null, // Limpiar problema anterior
        isProcessing: false,
      }));

      console.log("New problem state set successfully");
    } catch (error) {
      console.error("Error generating problem:", error);
      // Fallback: generar problema básico
      const fallbackProblem: MathProblem = {
        id: `fallback_${Date.now()}`,
        type: "addition",
        difficulty: 2,
        question: "5 + 3 = ?",
        answer: 8,
        options: [6, 7, 8, 9],
        timeLimit: 30,
      };

      console.log("Using fallback problem:", fallbackProblem);

      setGameState((prev) => ({
        ...prev,
        currentProblem: fallbackProblem,
        userAnswer: "",
        isCorrect: null,
        showFeedback: false,
        startTime: Date.now(),
        xpGained: 0,
        showParticles: false,
        lastAnsweredProblem: null,
        isProcessing: false,
      }));
    }
  }, []);

  // Verificar respuesta del usuario con IA
  const submitAnswer = useCallback(
    async (answer: string | number) => {
      if (!gameState.currentProblem || !gameState.startTime) {
        console.warn("submitAnswer called without currentProblem or startTime");
        return;
      }

      // Prevenir múltiples llamadas
      if (gameState.isProcessing) {
        console.warn("Already processing submission, ignoring");
        return;
      }

      // Marcar como procesando
      setGameState((prev) => ({
        ...prev,
        isProcessing: true,
      }));

      // Guardar referencia al problema actual para evitar race conditions
      const currentProblem = gameState.currentProblem;
      const startTime = gameState.startTime;

      console.log("Validating answer:", {
        rawAnswer: answer,
        problemQuestion: currentProblem.question,
        correctAnswer: currentProblem.answer,
        problemType: currentProblem.type,
      });

      // Convertir respuesta a número con validaciones
      let numericAnswer: number;
      if (typeof answer === "string") {
        // Remover espacios y caracteres no numéricos comunes
        const cleanAnswer = answer.trim().replace(/[^\d.-]/g, "");
        numericAnswer = parseFloat(cleanAnswer);
      } else {
        numericAnswer = answer;
      }

      // Validar que la conversión fue exitosa
      if (isNaN(numericAnswer)) {
        console.warn("Invalid numeric answer:", answer);
        numericAnswer = 0; // Tratar como respuesta incorrecta
      }

      // Hacer validación con tolerancia muy pequeña para evitar problemas de punto flotante
      const isCorrect = Math.abs(numericAnswer - currentProblem.answer) < 0.001;
      const timeMs = Date.now() - startTime;

      console.log("Answer validation result:", {
        userAnswer: numericAnswer,
        correctAnswer: currentProblem.answer,
        difference: Math.abs(numericAnswer - currentProblem.answer),
        isCorrect,
      });

      // Actualizar motor de IA con rendimiento
      smartProblemRecommendation.updatePerformance(isCorrect, timeMs);

      // Calcular XP ganado inteligentemente
      const xpGained = calculateSmartXP(
        isCorrect,
        timeMs,
        currentProblem,
        numericAnswer
      );

      // Obtener datos actualizados de la IA
      const aiData = smartProblemRecommendation.getUserData();

      // Calcular nuevo nivel (cada 100 XP)
      const newTotalXP = gameState.totalXP + xpGained;
      const newLevel = Math.floor(newTotalXP / 100) + 1;

      // Actualizar racha (basada en problemas consecutivos correctos)
      const newStreak = isCorrect ? gameState.streak + 1 : 0;

      // Registrar actividad diaria si es correcto
      let updatedDailyStreakData = gameState.dailyStreakData;
      let newMascotMood = gameState.mascotMood;

      if (isCorrect) {
        try {
          updatedDailyStreakData =
            await dailyStreakService.recordDailyActivity();
          newMascotMood = await dailyStreakService.getMascotMoodForStreak();
        } catch (error) {
          console.warn("Error updating daily streak:", error);
        }
      }

      // Determinar mood basado en resultado del problema
      const problemMood = isCorrect
        ? xpGained >= 10 && newStreak >= 3
          ? "super_happy"
          : "happy"
        : "sad";

      // Usar el mood más positivo entre racha diaria y resultado del problema
      const finalMood: "happy" | "neutral" | "sad" | "super_happy" =
        newMascotMood === "super_happy" || problemMood === "super_happy"
          ? "super_happy"
          : problemMood === "happy" && newMascotMood !== "sad"
          ? "happy"
          : newMascotMood;

      // Actualizar estado de manera síncrona COMPLETA
      setGameState((prev) => {
        const newState = {
          ...prev,
          lastAnsweredProblem: currentProblem, // Usar la referencia guardada
          userAnswer: answer.toString(),
          isCorrect,
          showFeedback: true,
          xpGained,
          level: newLevel,
          streak: Math.max(newStreak, aiData.consecutiveCorrect), // Usar el mejor de ambos
          totalXP: newTotalXP,
          accuracy: aiData.accuracy,
          currentDifficulty: aiData.currentDifficulty,
          // Actualizar datos de racha diaria y gamificación
          dailyStreak:
            updatedDailyStreakData?.currentStreak || prev.dailyStreak,
          longestStreak:
            updatedDailyStreakData?.longestStreak || prev.longestStreak,
          dailyStreakData: updatedDailyStreakData,
          mascotMood: finalMood,
          showParticles: isCorrect, // Mostrar partículas solo si es correcto
          isProcessing: false, // Terminar procesamiento
        };

        console.log("FINAL STATE UPDATE:", {
          isCorrect: newState.isCorrect,
          xpGained: newState.xpGained,
          showFeedback: newState.showFeedback,
          lastAnsweredProblem: newState.lastAnsweredProblem?.question,
          userAnswer: newState.userAnswer,
        });

        return newState;
      });

      // Actualizar métricas de análisis
      updateAIMetrics();

      console.log("State updated with:", {
        isCorrect,
        xpGained,
        newLevel,
        newStreak,
        finalMood,
      });

      // Retornar el resultado para que el caller pueda actuar en consecuencia
      return { isCorrect, xpGained };
    },
    [
      gameState.currentProblem,
      gameState.startTime,
      gameState.totalXP,
      gameState.streak,
      gameState.dailyStreakData,
      gameState.mascotMood,
      gameState.isProcessing,
    ]
  );

  // Calcular XP según especificación: +10 correcto, +5 incorrecto pero cerca
  const calculateSmartXP = useCallback(
    (
      isCorrect: boolean,
      timeMs: number,
      problem: MathProblem,
      userAnswerValue: number
    ): number => {
      if (isCorrect) {
        return 10; // +10 por respuesta correcta
      } else {
        // +5 si está "cerca" (dentro del 20% de la respuesta correcta)
        const correctAnswer = problem.answer;
        const tolerance = Math.abs(correctAnswer * 0.2); // 20% de tolerancia

        if (Math.abs(userAnswerValue - correctAnswer) <= tolerance) {
          return 5; // +5 por estar cerca
        }

        return 0; // Sin XP si está lejos
      }
    },
    []
  );

  // Actualizar métricas de análisis de la IA
  const updateAIMetrics = useCallback(() => {
    try {
      const analysis = smartProblemRecommendation.getPerformanceAnalysis();

      setGameState((prev) => ({
        ...prev,
        strongestType: analysis.strongestType,
        weakestType: analysis.weakestType,
        recommendedFocus: analysis.recommendedFocus,
      }));
    } catch (error) {
      console.warn("Error updating AI metrics:", error);
    }
  }, []);

  // Continuar al siguiente problema
  const continueToNext = useCallback(() => {
    console.log("Continue to next called...");

    // Resetear completamente el estado en una sola operación
    setGameState((prev) => {
      console.log("Resetting state completely for new problem...");
      return {
        ...prev,
        // Limpiar estado de feedback
        showFeedback: false,
        userAnswer: "",
        isCorrect: null,
        xpGained: 0,
        showParticles: false,
        lastAnsweredProblem: null,
        isProcessing: false,
        // Limpiar problema actual para forzar regeneración
        currentProblem: null,
        startTime: null,
      };
    });

    // Generar nuevo problema inmediatamente
    setTimeout(() => {
      console.log("Calling startNewProblem after reset...");
      startNewProblem();
    }, 10);
  }, [startNewProblem]);

  // Reiniciar juego y datos de IA
  const resetGame = useCallback(() => {
    smartProblemRecommendation.resetUserData();
    setGameState({
      currentProblem: null,
      lastAnsweredProblem: null,
      userAnswer: "",
      isCorrect: null,
      showFeedback: false,
      startTime: null,
      xpGained: 0,
      level: 1,
      streak: 0,
      totalXP: 0,
      accuracy: 50,
      currentDifficulty: 2,
      strongestType: null,
      weakestType: null,
      recommendedFocus: null,
      // Sistema de racha diaria y gamificación
      dailyStreak: 0,
      longestStreak: 0,
      dailyStreakData: null,
      mascotMood: "neutral",
      showParticles: false,
      // Estado de navegación para prevenir race conditions
      isProcessing: false,
    });
  }, []);

  // Obtener datos del usuario de la IA
  const getUserData = useCallback(() => {
    return smartProblemRecommendation.getUserData();
  }, []);

  // Obtener análisis de rendimiento
  const getPerformanceAnalysis = useCallback(() => {
    return smartProblemRecommendation.getPerformanceAnalysis();
  }, []);

  // Ocultar partículas
  const hideParticles = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      showParticles: false,
    }));
  }, []);

  // Obtener mood de mascota para estado actual
  const getMascotMoodForCurrentState = useCallback(():
    | "happy"
    | "neutral"
    | "sad"
    | "super_happy" => {
    return gameState.mascotMood;
  }, [gameState.mascotMood]);

  // Acciones agrupadas
  const actions: GameActions = {
    startNewProblem,
    submitAnswer,
    continueToNext,
    resetGame,
    getUserData,
    getPerformanceAnalysis,
    hideParticles,
    getMascotMoodForCurrentState,
    getFeedbackState: () => ({
      isCorrect: gameState.isCorrect,
      xpGained: gameState.xpGained,
      showFeedback: gameState.showFeedback,
      lastAnsweredProblem: gameState.lastAnsweredProblem,
      userAnswer: gameState.userAnswer,
    }),
  };

  return [gameState, actions];
}

// Hook para persistir progreso (mejorado para IA)
export function useGamePersistence() {
  const saveProgress = useCallback((gameState: GameState) => {
    try {
      const progressData = {
        level: gameState.level,
        totalXP: gameState.totalXP,
        streak: gameState.streak,
        accuracy: gameState.accuracy,
        currentDifficulty: gameState.currentDifficulty,
        lastPlayed: new Date().toISOString(),
        // Guardar también datos de la IA
        aiUserData: smartProblemRecommendation.getUserData(),
      };

      localStorage.setItem(
        "minotauro_progress_ai",
        JSON.stringify(progressData)
      );
    } catch (error) {
      console.warn("Error saving progress:", error);
    }
  }, []);

  const loadProgress = useCallback(() => {
    try {
      const saved = localStorage.getItem("minotauro_progress_ai");
      if (saved) {
        const data = JSON.parse(saved);

        // Restaurar datos de la IA si existen
        if (data.aiUserData) {
          // Aquí podrías implementar un método para restaurar el estado de la IA
          // smartProblemRecommendation.restoreUserData(data.aiUserData);
        }

        return data;
      }
      return null;
    } catch (error) {
      console.warn("Error loading progress:", error);
      return null;
    }
  }, []);

  return { saveProgress, loadProgress };
}

// Hook para obtener recomendaciones de la IA
export function useAIRecommendations() {
  const getRecommendations = useCallback(() => {
    const analysis = smartProblemRecommendation.getPerformanceAnalysis();
    const userData = smartProblemRecommendation.getUserData();

    const recommendations: string[] = [];

    // Recomendaciones basadas en precisión
    if (userData.accuracy < 60) {
      recommendations.push(
        `Practica más problemas de ${analysis.recommendedFocus} para mejorar tu precisión`
      );
    } else if (userData.accuracy > 85) {
      recommendations.push(
        "¡Excelente precisión! Intenta problemas más desafiantes"
      );
    }

    // Recomendaciones basadas en tipos de operaciones
    if (analysis.weakestType !== analysis.strongestType) {
      recommendations.push(
        `Tu tipo más fuerte es ${analysis.strongestType}, practica más ${analysis.weakestType}`
      );
    }

    // Recomendaciones basadas en tendencia
    switch (analysis.overallTrend) {
      case "improving":
        recommendations.push("¡Vas mejorando! Mantén el ritmo de práctica");
        break;
      case "declining":
        recommendations.push(
          "Parece que necesitas un descanso. Prueba problemas más fáciles"
        );
        break;
      case "stable":
        recommendations.push(
          "Rendimiento estable. Intenta variar los tipos de problemas"
        );
        break;
    }

    return recommendations.length > 0
      ? recommendations
      : ["¡Sigue practicando para obtener recomendaciones personalizadas!"];
  }, []);

  return { getRecommendations };
}
