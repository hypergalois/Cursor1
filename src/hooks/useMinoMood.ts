// Hook para determinar el estado emocional de Mino basado en el contexto del juego
// Mino reacciona a todo lo que hace el usuario

import { useGame } from "../contexts/GameContext";

type MinoMood =
  | "happy"
  | "neutral"
  | "sad"
  | "excited"
  | "thinking"
  | "celebrating"
  | "sleepy"
  | "surprised"
  | "focused"
  | "proud"
  | "frustrated"
  | "confused"
  | "motivated"
  | "tired"
  | "amazed"
  | "determined"
  | "relaxed"
  | "worried"
  | "confident";

export const useMinoMood = (
  context:
    | "welcome"
    | "problem"
    | "result"
    | "profile"
    | "achievement"
    | "streak"
    | "failure"
) => {
  const { gameState } = useGame();

  const getMoodForContext = (): MinoMood => {
    switch (context) {
      case "welcome":
        return getWelcomeMood();
      case "problem":
        return getProblemMood();
      case "result":
        return getResultMood();
      case "profile":
        return getProfileMood();
      case "achievement":
        return "celebrating";
      case "streak":
        return getStreakMood();
      case "failure":
        return getFailureMood();
      default:
        return "neutral";
    }
  };

  const getWelcomeMood = (): MinoMood => {
    const { dailyStreak, accuracy, totalXP } = gameState;

    // Super feliz por racha larga
    if (dailyStreak >= 14) return "celebrating";

    // Motivado si tiene buena racha
    if (dailyStreak >= 7) return "motivated";

    // Orgulloso si tiene buen XP
    if (totalXP >= 500) return "proud";

    // Confiado si tiene buena precisión
    if (accuracy >= 80) return "confident";

    // Feliz por defecto en welcome
    if (dailyStreak >= 1) return "happy";

    // Neutral si recién empieza
    return "neutral";
  };

  const getProblemMood = (): MinoMood => {
    const { currentDifficulty, streak, accuracy } = gameState;

    // Concentrado en problemas difíciles
    if (currentDifficulty >= 4) return "focused";

    // Determinado si viene con buena racha
    if (streak >= 5) return "determined";

    // Confiado si tiene buena precisión
    if (accuracy >= 85) return "confident";

    // Pensativo durante problemas normales
    if (currentDifficulty >= 2) return "thinking";

    // Relajado en problemas fáciles
    return "relaxed";
  };

  const getResultMood = (): MinoMood => {
    const { isCorrect, xpGained, streak, accuracy } = gameState;

    if (isCorrect) {
      // Super celebración por racha larga
      if (streak >= 10) return "celebrating";

      // Asombrado por XP alto (problema difícil)
      if (xpGained >= 10 && streak >= 5) return "amazed";

      // Orgulloso por buena precisión
      if (accuracy >= 90) return "proud";

      // Emocionado por racha media
      if (streak >= 5) return "excited";

      // Confiado por respuesta correcta
      if (streak >= 3) return "confident";

      // Feliz por respuesta correcta
      return "happy";
    } else {
      // Muy frustrado por muchas fallas seguidas
      if (gameState.streak === 0 && accuracy < 50) return "frustrated";

      // Confundido por falla inesperada
      if (accuracy >= 80) return "confused";

      // Preocupado por precisión baja
      if (accuracy < 60) return "worried";

      // Triste por respuesta incorrecta
      return "sad";
    }
  };

  const getProfileMood = (): MinoMood => {
    const { level, accuracy, totalXP, dailyStreak } = gameState;

    // Celebrando si es nivel alto
    if (level >= 10) return "celebrating";

    // Orgulloso por buen progreso
    if (totalXP >= 1000) return "proud";

    // Confiado por buena precisión
    if (accuracy >= 85) return "confident";

    // Motivado por racha consistente
    if (dailyStreak >= 7) return "motivated";

    // Feliz por progreso general
    if (totalXP >= 200) return "happy";

    // Neutral para perfiles nuevos
    return "neutral";
  };

  const getStreakMood = (): MinoMood => {
    const { dailyStreak, streak } = gameState;

    // Celebración por rachas épicas
    if (dailyStreak >= 30) return "celebrating";

    // Asombrado por rachas largas
    if (dailyStreak >= 14) return "amazed";

    // Muy motivado por una semana
    if (dailyStreak >= 7) return "motivated";

    // Orgulloso por racha corta
    if (dailyStreak >= 3) return "proud";

    // Determinado por racha de problemas
    if (streak >= 5) return "determined";

    return "happy";
  };

  const getFailureMood = (): MinoMood => {
    const { accuracy, streak, totalXP } = gameState;

    // Muy frustrado si normalmente es bueno
    if (accuracy >= 80 && streak === 0) return "frustrated";

    // Confundido por fallas inesperadas
    if (totalXP >= 500 && accuracy < 60) return "confused";

    // Preocupado por tendencia negativa
    if (accuracy < 50) return "worried";

    // Motivado para seguir intentando
    if (totalXP >= 100) return "motivated";

    // Triste por falla
    return "sad";
  };

  // Función para detectar transiciones especiales
  const getSpecialReaction = (previousMood: MinoMood): MinoMood | null => {
    const currentMood = getMoodForContext();

    // Sorprendido si pasó de muy mal a muy bien
    if (previousMood === "frustrated" && currentMood === "happy") {
      return "surprised";
    }

    // Asombrado por mejora dramática
    if (
      previousMood === "sad" &&
      (currentMood === "excited" || currentMood === "celebrating")
    ) {
      return "amazed";
    }

    // Cansado después de mucha actividad
    if (gameState.totalXP > 0 && gameState.totalXP % 200 === 0) {
      return "tired";
    }

    return null;
  };

  return {
    mood: getMoodForContext(),
    getSpecialReaction,
    // Helpers para contextos específicos
    getWelcomeMood,
    getProblemMood,
    getResultMood,
    getProfileMood,
    getStreakMood,
    getFailureMood,
  };
};
