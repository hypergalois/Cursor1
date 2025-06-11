// FocusedProblemScreen - Pantalla de problemas sin distracciones con IA inteligente
// Solo el problema matemático + input + botón comprobar + feedback de IA

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
} from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import { useGame } from "../contexts/GameContext";
import { userProgressService } from "../services/UserProgress";

const { width, height } = Dimensions.get("window");

interface FocusedProblemScreenProps {
  navigation: any;
}

const FocusedProblemScreen: React.FC<FocusedProblemScreenProps> = ({
  navigation,
}) => {
  const theme = useTheme();
  const { gameState, gameActions } = useGame();
  const [userAnswer, setUserAnswer] = useState("");
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Limpiar respuesta cuando cambie el problema
  useEffect(() => {
    if (gameState.currentProblem) {
      console.log("Problem changed, resetting answer:", {
        problemId: gameState.currentProblem.id,
        question: gameState.currentProblem.question,
      });
      setUserAnswer("");
      setShowHint(false);
      setIsSubmitting(false);
    }
  }, [gameState.currentProblem?.id]);

  // Timer para el problema - Arreglado para evitar múltiples timers
  useEffect(() => {
    if (gameState.currentProblem?.timeLimit && !gameState.showFeedback) {
      setTimeRemaining(gameState.currentProblem.timeLimit);

      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            // Limpiar timer antes de mostrar alerta
            clearInterval(timer);
            handleTimeUp();
            return null;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }

    // Limpiar timer si ya no hay problema o si está mostrando feedback
    if (!gameState.currentProblem || gameState.showFeedback) {
      setTimeRemaining(null);
    }
  }, [gameState.currentProblem, gameState.showFeedback]);

  // Mostrar hint automáticamente si el usuario tarda mucho
  useEffect(() => {
    if (gameState.currentProblem?.expectedTime) {
      const hintTimer = setTimeout(() => {
        if (!userAnswer && !gameState.showFeedback) {
          setShowHint(true);
        }
      }, gameState.currentProblem.expectedTime * 1500); // 1.5x el tiempo esperado

      return () => clearTimeout(hintTimer);
    }
  }, [gameState.currentProblem, userAnswer, gameState.showFeedback]);

  // Tiempo agotado - Mejorado para evitar múltiples alertas
  const handleTimeUp = async () => {
    if (!isSubmitting && !gameState.showFeedback) {
      setIsSubmitting(true); // Prevenir múltiples llamadas

      try {
        // Marcar como tiempo agotado y esperar a que termine
        await gameActions.submitAnswer(""); // Respuesta vacía por tiempo agotado
        navigation.navigate("InstantFeedback");
      } catch (error) {
        console.error("Error handling time up:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Verificar respuesta
  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim() || !gameState.currentProblem || isSubmitting) return;

    // Prevenir múltiples llamadas
    if (gameState.showFeedback || gameState.isProcessing) {
      console.log(
        "Already showing feedback or processing, ignoring submission"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Submitting answer:", {
        userAnswer,
        currentProblem: gameState.currentProblem,
        expectedAnswer: gameState.currentProblem?.answer,
      });

      // Verificar respuesta usando el hook actualizado - AWAIT para completar
      const result = await gameActions.submitAnswer(userAnswer);

      console.log("Submit result:", result);

      if (result) {
        // Registrar también en el sistema de progreso simplificado
        await userProgressService.recordProblemAttempt({
          isCorrect: result.isCorrect,
          timeMs: gameState.startTime
            ? Date.now() - gameState.startTime
            : 30000,
          difficulty: gameState.currentProblem.difficulty,
          problemType: gameState.currentProblem.type,
          xpEarned: result.xpGained,
          timestamp: Date.now(),
        });

        // Navegar inmediatamente después de procesar
        console.log("Navigating to InstantFeedback immediately");
        navigation.navigate("InstantFeedback");
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      Alert.alert("Error", "Hubo un problema. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Obtener sugerencia inteligente de la IA
  const getSmartHint = () => {
    if (!gameState.currentProblem) return "";

    const { type, difficulty } = gameState.currentProblem;

    // Hints adaptativos según el tipo de problema y IA
    switch (type) {
      case "addition":
        if (difficulty <= 2) {
          return "💡 Consejo: Puedes contar con los dedos o sumar de uno en uno";
        }
        return "💡 Consejo: Descompón los números en decenas y unidades";

      case "subtraction":
        if (difficulty <= 2) {
          return "💡 Consejo: Cuenta hacia atrás desde el número mayor";
        }
        return "💡 Consejo: Piensa en cuánto necesitas sumar al segundo número para llegar al primero";

      case "multiplication":
        if (difficulty <= 2) {
          return "💡 Consejo: Recuerda las tablas de multiplicar o suma el primer número varias veces";
        }
        return "💡 Consejo: Usa la propiedad distributiva: divide y multiplica por partes";

      case "division":
        if (difficulty <= 2) {
          return "💡 Consejo: ¿Cuántas veces cabe el segundo número en el primero?";
        }
        return "💡 Consejo: Piensa en qué número multiplicado por el divisor da el dividendo";

      default:
        return "💡 Tómate tu tiempo y piensa paso a paso";
    }
  };

  // Renderizar opciones múltiples con feedback visual
  const renderMultipleChoice = () => {
    if (!gameState.currentProblem?.options) return null;

    return (
      <View style={styles.optionsContainer}>
        <Text
          style={[styles.optionsTitle, { color: theme.colors.text.secondary }]}
        >
          Selecciona la respuesta correcta:
        </Text>
        {gameState.currentProblem.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              {
                backgroundColor:
                  userAnswer === option.toString()
                    ? theme.colors.primary.main
                    : theme.colors.background.paper,
                borderColor:
                  userAnswer === option.toString()
                    ? theme.colors.primary.main
                    : theme.colors.border,
                // Sombra para opción seleccionada
                shadowColor:
                  userAnswer === option.toString()
                    ? theme.colors.primary.main
                    : "transparent",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: userAnswer === option.toString() ? 0.3 : 0,
                shadowRadius: 4,
                elevation: userAnswer === option.toString() ? 4 : 0,
              },
            ]}
            onPress={() => {
              const selectedAnswer = option.toString();
              console.log("Option selected:", {
                option,
                selectedAnswer,
                problemQuestion: gameState.currentProblem?.question,
                correctAnswer: gameState.currentProblem?.answer,
              });
              setUserAnswer(selectedAnswer);
            }}
          >
            <Text
              style={[
                styles.optionText,
                {
                  color:
                    userAnswer === option.toString()
                      ? theme.colors.primary.contrastText
                      : theme.colors.text.primary,
                },
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Renderizar input libre con validación
  const renderFreeInput = () => {
    if (gameState.currentProblem?.options) return null;

    return (
      <View style={styles.inputContainer}>
        <Text
          style={[styles.inputLabel, { color: theme.colors.text.secondary }]}
        >
          Tu respuesta:
        </Text>
        <TextInput
          style={[
            styles.answerInput,
            {
              backgroundColor: theme.colors.background.paper,
              borderColor: userAnswer
                ? theme.colors.primary.main
                : theme.colors.border,
              color: theme.colors.text.primary,
            },
          ]}
          value={userAnswer}
          onChangeText={setUserAnswer}
          placeholder="Escribe tu respuesta"
          placeholderTextColor={theme.colors.text.secondary}
          keyboardType="numeric"
          autoFocus
          maxLength={10}
        />
      </View>
    );
  };

  if (!gameState.currentProblem) {
    return (
      <View
        style={[
          styles.container,
          styles.centerContainer,
          { backgroundColor: theme.colors.background.default },
        ]}
      >
        <Text
          style={[styles.loadingText, { color: theme.colors.text.primary }]}
        >
          Preparando problema inteligente...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.default },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header con métricas de IA */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.exitButton,
            { backgroundColor: theme.colors.background.paper },
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text
            style={[
              styles.exitButtonText,
              { color: theme.colors.text.secondary },
            ]}
          >
            ← Salir
          </Text>
        </TouchableOpacity>

        <View style={styles.headerStats}>
          <Text
            style={[styles.levelText, { color: theme.colors.text.secondary }]}
          >
            Nivel {gameState.level}
          </Text>
          <Text style={[styles.xpText, { color: theme.colors.primary.main }]}>
            {gameState.totalXP} XP
          </Text>
          <Text
            style={[styles.accuracyText, { color: theme.colors.success.main }]}
          >
            {Math.round(gameState.accuracy)}% precisión
          </Text>
        </View>

        {timeRemaining !== null && (
          <View
            style={[
              styles.timerContainer,
              {
                backgroundColor:
                  timeRemaining <= 10
                    ? theme.colors.error.light
                    : theme.colors.warning.light,
              },
            ]}
          >
            <Text
              style={[
                styles.timerText,
                {
                  color:
                    timeRemaining <= 10
                      ? theme.colors.error.dark
                      : theme.colors.warning.dark,
                },
              ]}
            >
              ⏱️ {timeRemaining}s
            </Text>
          </View>
        )}
      </View>

      {/* Contenido principal */}
      <View style={styles.content}>
        {/* Información del problema con IA */}
        <View style={styles.problemInfoContainer}>
          <View style={styles.difficultyContainer}>
            <Text
              style={[
                styles.difficultyText,
                { color: theme.colors.text.secondary },
              ]}
            >
              Dificultad: {gameState.currentProblem.difficulty}/5
            </Text>
            <View style={styles.difficultyDots}>
              {[1, 2, 3, 4, 5].map((level) => (
                <View
                  key={level}
                  style={[
                    styles.difficultyDot,
                    {
                      backgroundColor:
                        level <= gameState.currentProblem!.difficulty
                          ? theme.colors.primary.main
                          : theme.colors.border,
                    },
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Tipo de operación recomendado */}
          {gameState.recommendedFocus &&
            gameState.recommendedFocus === gameState.currentProblem.type && (
              <View
                style={[
                  styles.aiRecommendation,
                  { backgroundColor: theme.colors.success.light },
                ]}
              >
                <Text
                  style={[
                    styles.aiRecommendationText,
                    { color: theme.colors.success.dark },
                  ]}
                >
                  🎯 Practicando tu tipo recomendado:{" "}
                  {gameState.currentProblem.type}
                </Text>
              </View>
            )}
        </View>

        {/* Problema matemático */}
        <View style={styles.problemContainer}>
          <Text
            style={[styles.problemText, { color: theme.colors.text.primary }]}
          >
            {gameState.currentProblem.question}
          </Text>
        </View>

        {/* Hint inteligente */}
        {showHint && (
          <View
            style={[
              styles.hintContainer,
              { backgroundColor: theme.colors.warning.light },
            ]}
          >
            <Text
              style={[styles.hintText, { color: theme.colors.warning.dark }]}
            >
              {getSmartHint()}
            </Text>
          </View>
        )}

        {/* Input o opciones */}
        {renderMultipleChoice()}
        {renderFreeInput()}

        {/* Botón comprobar mejorado */}
        <TouchableOpacity
          style={[
            styles.checkButton,
            {
              backgroundColor: userAnswer.trim()
                ? theme.colors.success.main
                : theme.colors.border,
            },
          ]}
          onPress={handleSubmitAnswer}
          disabled={!userAnswer.trim() || isSubmitting}
        >
          <Text
            style={[
              styles.checkButtonText,
              {
                color: userAnswer.trim()
                  ? "#FFFFFF"
                  : theme.colors.text.secondary,
              },
            ]}
          >
            {isSubmitting ? "Verificando..." : "✓ Comprobar"}
          </Text>
        </TouchableOpacity>

        {/* Botón de pista */}
        {!showHint && !gameState.currentProblem?.options && (
          <TouchableOpacity
            style={[
              styles.hintButton,
              { backgroundColor: theme.colors.background.paper },
            ]}
            onPress={() => setShowHint(true)}
          >
            <Text
              style={[
                styles.hintButtonText,
                { color: theme.colors.primary.main },
              ]}
            >
              💡 Mostrar pista
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "500",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  exitButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  exitButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  headerStats: {
    alignItems: "center",
  },
  levelText: {
    fontSize: 14,
    fontWeight: "500",
  },
  xpText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  accuracyText: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
  timerContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  timerText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  problemInfoContainer: {
    marginBottom: 20,
  },
  difficultyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: "500",
  },
  difficultyDots: {
    flexDirection: "row",
    gap: 6,
  },
  difficultyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  aiRecommendation: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  aiRecommendationText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  problemContainer: {
    alignItems: "center",
    marginBottom: 40,
    paddingVertical: 40,
  },
  problemText: {
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 52,
  },
  hintContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  hintText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 18,
  },
  optionsContainer: {
    marginBottom: 40,
  },
  optionsTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 20,
    textAlign: "center",
  },
  optionButton: {
    height: 56,
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  optionText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  inputContainer: {
    marginBottom: 40,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
    textAlign: "center",
  },
  answerInput: {
    height: 64,
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  checkButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  checkButtonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  hintButton: {
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  hintButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default FocusedProblemScreen;
