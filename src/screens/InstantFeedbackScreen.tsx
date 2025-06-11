// InstantFeedbackScreen - Feedback inmediato con análisis de IA
// Animaciones claras + XP ganado + análisis inteligente + recomendaciones

import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import { useGame } from "../contexts/GameContext";
import { useAIRecommendations } from "../hooks/useGameLoop";
import MinoMascot from "../components/gamification/MinoMascot";
import SimpleParticles from "../components/gamification/SimpleParticles";
import { useMinoMood } from "../hooks/useMinoMood";

const { width, height } = Dimensions.get("window");

interface InstantFeedbackScreenProps {
  navigation: any;
}

const InstantFeedbackScreen: React.FC<InstantFeedbackScreenProps> = ({
  navigation,
}) => {
  const theme = useTheme();
  const { gameState, gameActions } = useGame();
  const { getRecommendations } = useAIRecommendations();
  const { mood } = useMinoMood("result");

  // Estado para evitar flash visual durante transición
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [lastValidState, setLastValidState] = useState<{
    isCorrect: boolean | null;
    xpGained: number;
    lastAnsweredProblem: any;
    userAnswer: string;
  } | null>(null);

  // Capturar último estado válido cuando llega
  useEffect(() => {
    if (
      gameState.isCorrect !== null &&
      gameState.showFeedback &&
      gameState.lastAnsweredProblem
    ) {
      setLastValidState({
        isCorrect: gameState.isCorrect,
        xpGained: gameState.xpGained,
        lastAnsweredProblem: gameState.lastAnsweredProblem,
        userAnswer: gameState.userAnswer,
      });
      setIsTransitioning(false);
    }
  }, [
    gameState.isCorrect,
    gameState.showFeedback,
    gameState.lastAnsweredProblem,
  ]);

  // Debug: Log state when component mounts/updates
  useEffect(() => {
    console.log("=== INSTANT FEEDBACK SCREEN MOUNT/UPDATE ===");
    const feedbackState = gameActions.getFeedbackState();
    console.log("Direct gameState:", {
      isCorrect: gameState.isCorrect,
      xpGained: gameState.xpGained,
      showFeedback: gameState.showFeedback,
      lastAnsweredProblem: gameState.lastAnsweredProblem?.question,
      userAnswer: gameState.userAnswer,
    });
    console.log("Via getFeedbackState:", feedbackState);
    console.log("isTransitioning:", isTransitioning);
    console.log("lastValidState:", lastValidState);

    // Fallback: Si el estado no es válido, navegar de vuelta y generar nuevo problema
    if (
      gameState.isCorrect === null &&
      !gameState.showFeedback &&
      !gameState.lastAnsweredProblem &&
      !isTransitioning
    ) {
      console.log(
        "⚠️ INVALID STATE DETECTED - Navigating back and generating new problem"
      );
      gameActions.continueToNext();
      setTimeout(() => {
        navigation.navigate("FocusedProblem");
      }, 100);
      return;
    }

    console.log("=== END FEEDBACK DEBUG ===");
  }, [
    gameState.isCorrect,
    gameState.showFeedback,
    gameState.lastAnsweredProblem,
    isTransitioning,
  ]);

  // Animaciones
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const xpCountAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    startAnimations();
  }, []);

  const startAnimations = () => {
    // Animación de entrada del resultado
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Animación del contador de XP
    if (gameState.xpGained > 0) {
      setTimeout(() => {
        Animated.timing(xpCountAnim, {
          toValue: gameState.xpGained,
          duration: 1000,
          useNativeDriver: false,
        }).start();
      }, 600);
    }

    // Bouncing para correcto
    if (gameState.isCorrect) {
      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(bounceAnim, {
              toValue: -10,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(bounceAnim, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
          { iterations: 3 }
        ).start();
      }, 800);
    }
  };

  // Continuar al siguiente problema
  const handleContinue = () => {
    console.log("Continuing to next problem...");
    console.log("Current state before continue:", {
      showFeedback: gameState.showFeedback,
      currentProblem: gameState.currentProblem?.id,
      lastAnsweredProblem: gameState.lastAnsweredProblem?.id,
      isCorrect: gameState.isCorrect,
    });

    // Marcar como en transición para evitar flash visual
    setIsTransitioning(true);

    // Limpiar estado y generar nuevo problema
    gameActions.continueToNext();

    // Navegar con pequeño delay para asegurar que el estado se actualice
    setTimeout(() => {
      navigation.navigate("FocusedProblem");
    }, 50);
  };

  // Volver al home
  const handleGoHome = () => {
    navigation.navigate("CleanHome");
  };

  // Mapear estados de mascota: 4 estados exactos como pidió el usuario
  const mapMascotMood = (mood: "happy" | "neutral" | "sad" | "super_happy") => {
    const moodMap = {
      happy: "happy" as const, // feliz
      neutral: "neutral" as const, // neutral
      sad: "sad" as const, // triste
      super_happy: "celebrating" as const, // súper feliz
    };
    return moodMap[mood];
  };

  // Obtener datos según el resultado
  const getFeedbackData = () => {
    const currentMood = gameActions.getMascotMoodForCurrentState();
    const mappedMood = mapMascotMood(currentMood);

    // Durante transición, usar último estado válido para evitar flash
    const stateToUse =
      isTransitioning && lastValidState ? lastValidState : gameState;

    console.log("=== FEEDBACK DATA DECISION ===");
    console.log("gameState.isCorrect:", gameState.isCorrect);
    console.log("isTransitioning:", isTransitioning);
    console.log("stateToUse.isCorrect:", stateToUse.isCorrect);
    console.log("currentMood:", currentMood);
    console.log("mappedMood:", mappedMood);

    if (stateToUse.isCorrect) {
      console.log("Decision: CORRECT feedback");
      return {
        icon: "✅",
        title: "¡Correcto!",
        message: "Excelente trabajo. ¡Sigue así!",
        color: theme.colors.success.main,
        mascotMood: mappedMood,
        buttonText: "Siguiente problema",
        buttonColor: theme.colors.success.main,
      };
    } else {
      console.log("Decision: INCORRECT feedback");
      return {
        icon: "❌",
        title: "Incorrecto",
        message: "No te preocupes, puedes intentar con otro problema.",
        color: theme.colors.error.main,
        mascotMood: mappedMood,
        buttonText: "Intentar otro",
        buttonColor: theme.colors.primary.main,
      };
    }
  };

  // Obtener análisis inteligente del rendimiento
  const getPerformanceAnalysis = () => {
    const analysis = gameActions.getPerformanceAnalysis();
    const userData = gameActions.getUserData();

    const insights: string[] = [];

    // Análisis de precisión
    if (userData.accuracy >= 85) {
      insights.push("🎯 Tu precisión es excelente");
    } else if (userData.accuracy >= 70) {
      insights.push("👍 Tu precisión es buena");
    } else if (userData.accuracy >= 50) {
      insights.push("📈 Tu precisión está mejorando");
    } else {
      insights.push("💪 Sigue practicando para mejorar");
    }

    // Análisis de dificultad
    if (gameState.currentDifficulty >= 4) {
      insights.push("🔥 Estás en nivel avanzado");
    } else if (gameState.currentDifficulty >= 3) {
      insights.push("⭐ Estás en nivel intermedio");
    }

    // Análisis de tendencia
    if (analysis.overallTrend === "improving") {
      insights.push("📈 Estás mejorando constantemente");
    } else if (analysis.overallTrend === "declining") {
      insights.push("🎯 Necesitas más práctica");
    }

    return insights;
  };

  // Obtener recomendación específica
  const getSpecificRecommendation = () => {
    const analysis = gameActions.getPerformanceAnalysis();
    const userData = gameActions.getUserData();

    // Usar estado estable durante transición
    const stateToUse =
      isTransitioning && lastValidState ? lastValidState : gameState;

    if (!stateToUse.isCorrect) {
      // Recomendaciones para respuestas incorrectas
      if (stateToUse.lastAnsweredProblem?.type === analysis.weakestType) {
        return `💡 Sugerencia: ${stateToUse.lastAnsweredProblem.type} es tu tipo más débil. Practica más estos problemas.`;
      }

      if (userData.consecutiveWrong >= 2) {
        return "🎯 Sugerencia: Intenta problemas más fáciles para recuperar confianza.";
      }

      return "💪 Sugerencia: Tómate más tiempo para pensar antes de responder.";
    } else {
      // Recomendaciones para respuestas correctas
      if (userData.consecutiveCorrect >= 3) {
        return "🚀 ¡Vas genial! Podríamos subir la dificultad en el próximo problema.";
      }

      if (stateToUse.lastAnsweredProblem?.type === analysis.strongestType) {
        return `⭐ ¡Excelente! ${stateToUse.lastAnsweredProblem.type} es tu tipo más fuerte.`;
      }

      return "👍 ¡Bien hecho! Mantén este ritmo.";
    }
  };

  const feedbackData = getFeedbackData();
  const performanceInsights = getPerformanceAnalysis();
  const specificRecommendation = getSpecificRecommendation();

  // Usar estado estable durante transición
  const stableState =
    isTransitioning && lastValidState ? lastValidState : gameState;

  // Contador animado de XP
  const animatedXP = xpCountAnim.interpolate({
    inputRange: [0, stableState.xpGained || 1],
    outputRange: [0, stableState.xpGained || 1],
    extrapolate: "clamp",
  });

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.default },
      ]}
    >
      {/* Partículas simples para respuestas correctas */}
      <SimpleParticles
        show={gameState.showParticles && !isTransitioning}
        color={
          stableState.isCorrect
            ? theme.colors.success.main
            : theme.colors.primary.main
        }
        intensity={stableState.isCorrect ? "high" : "low"}
        onComplete={() => gameActions.hideParticles()}
      />

      {/* Resultado principal */}
      <View style={styles.centerContent}>
        <Animated.View
          style={[
            styles.resultContainer,
            {
              transform: [{ scale: scaleAnim }, { translateY: bounceAnim }],
            },
          ]}
        >
          <Text style={styles.resultIcon}>{feedbackData.icon}</Text>
          <Text style={[styles.resultTitle, { color: feedbackData.color }]}>
            {feedbackData.title}
          </Text>
          <Text
            style={[
              styles.resultMessage,
              { color: theme.colors.text.secondary },
            ]}
          >
            {feedbackData.message}
          </Text>
        </Animated.View>

        {/* XP ganado con animación mejorada */}
        {stableState.xpGained > 0 && (
          <Animated.View
            style={[
              styles.xpContainer,
              {
                opacity: fadeAnim,
                backgroundColor: theme.colors.warning.light,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.xpIcon}>⭐</Text>
            <Animated.Text
              style={[styles.xpText, { color: theme.colors.warning.dark }]}
            >
              +{Math.round(Number(animatedXP.toString()))} XP
            </Animated.Text>
          </Animated.View>
        )}

        {/* Información del problema */}
        {stableState.lastAnsweredProblem && (
          <Animated.View
            style={[
              styles.problemInfo,
              {
                opacity: fadeAnim,
                backgroundColor: theme.colors.background.paper,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text
              style={[
                styles.problemQuestion,
                { color: theme.colors.text.primary },
              ]}
            >
              {stableState.lastAnsweredProblem.question}
            </Text>
            <Text
              style={[
                styles.correctAnswer,
                { color: theme.colors.success.main },
              ]}
            >
              Respuesta correcta: {stableState.lastAnsweredProblem.answer}
            </Text>
            {stableState.userAnswer && (
              <Text
                style={[
                  styles.userAnswer,
                  { color: theme.colors.text.secondary },
                ]}
              >
                Tu respuesta: {stableState.userAnswer}
              </Text>
            )}
          </Animated.View>
        )}

        {/* Análisis inteligente de la IA */}
        <Animated.View
          style={[
            styles.aiAnalysisContainer,
            {
              opacity: fadeAnim,
              backgroundColor: theme.colors.primary.light,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text
            style={[
              styles.aiAnalysisTitle,
              { color: theme.colors.primary.dark },
            ]}
          >
            🧠 Análisis Inteligente
          </Text>
          {performanceInsights.map((insight, index) => (
            <Text
              key={index}
              style={[styles.aiInsight, { color: theme.colors.primary.dark }]}
            >
              {insight}
            </Text>
          ))}
        </Animated.View>

        {/* Recomendación específica */}
        <Animated.View
          style={[
            styles.recommendationContainer,
            {
              opacity: fadeAnim,
              backgroundColor: stableState.isCorrect
                ? theme.colors.success.light
                : theme.colors.warning.light,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text
            style={[
              styles.recommendationText,
              {
                color: stableState.isCorrect
                  ? theme.colors.success.dark
                  : theme.colors.warning.dark,
              },
            ]}
          >
            {specificRecommendation}
          </Text>
        </Animated.View>

        {/* Mascota con feedback */}
        <Animated.View style={[styles.mascotContainer, { opacity: fadeAnim }]}>
          <MinoMascot
            mood={mood}
            size={100}
            ageGroup="adults"
            context="result"
            showThoughts={false}
          />
        </Animated.View>

        {/* Progreso actualizado con métricas de IA */}
        <Animated.View
          style={[
            styles.progressContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.progressRow}>
            <Text
              style={[
                styles.progressLabel,
                { color: theme.colors.text.secondary },
              ]}
            >
              Nivel
            </Text>
            <Text
              style={[
                styles.progressValue,
                { color: theme.colors.primary.main },
              ]}
            >
              {gameState.level}
            </Text>
          </View>

          <View style={styles.progressRow}>
            <Text
              style={[
                styles.progressLabel,
                { color: theme.colors.text.secondary },
              ]}
            >
              Precisión
            </Text>
            <Text
              style={[
                styles.progressValue,
                { color: theme.colors.success.main },
              ]}
            >
              {Math.round(gameState.accuracy)}%
            </Text>
          </View>

          <View style={styles.progressRow}>
            <Text
              style={[
                styles.progressLabel,
                { color: theme.colors.text.secondary },
              ]}
            >
              Dificultad
            </Text>
            <Text
              style={[
                styles.progressValue,
                { color: theme.colors.warning.main },
              ]}
            >
              {gameState.currentDifficulty}/5
            </Text>
          </View>

          <View style={styles.progressRow}>
            <Text
              style={[
                styles.progressLabel,
                { color: theme.colors.text.secondary },
              ]}
            >
              Racha
            </Text>
            <Text
              style={[styles.progressValue, { color: theme.colors.error.main }]}
            >
              {gameState.streak}
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Botones de acción */}
      <Animated.View style={[styles.buttonsContainer, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            { backgroundColor: feedbackData.buttonColor },
          ]}
          onPress={handleContinue}
        >
          <Text style={[styles.continueButtonText, { color: "#FFFFFF" }]}>
            {feedbackData.buttonText} 🚀
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.homeButton,
            { backgroundColor: theme.colors.background.paper },
          ]}
          onPress={handleGoHome}
        >
          <Text
            style={[
              styles.homeButtonText,
              { color: theme.colors.text.secondary },
            ]}
          >
            Volver al inicio
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  resultContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  resultIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 8,
  },
  resultMessage: {
    fontSize: 18,
    textAlign: "center",
    lineHeight: 24,
  },
  xpContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 20,
  },
  xpIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  xpText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  problemInfo: {
    width: "100%",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  problemQuestion: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  correctAnswer: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  userAnswer: {
    fontSize: 16,
    fontStyle: "italic",
  },
  aiAnalysisContainer: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  aiAnalysisTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  aiInsight: {
    fontSize: 14,
    marginBottom: 4,
    textAlign: "center",
  },
  recommendationContainer: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  recommendationText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 18,
  },
  mascotContainer: {
    marginBottom: 20,
  },
  progressContainer: {
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  progressValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonsContainer: {
    paddingBottom: 40,
  },
  continueButton: {
    width: "100%",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  homeButton: {
    width: "100%",
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default InstantFeedbackScreen;
