import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
  ScrollView,
  BackHandler,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import {
  colors,
  spacing,
  typography,
  shadows,
  borderRadius,
  animations,
} from "../styles/theme";
import MinoMascot from "../components/MinoMascot";
import SceneAssets from "../components/SceneAssets";
import AdaptiveDifficulty from "../utils/AdaptiveDifficulty";
import StarSystem, {
  calculateStars,
  StarBreakdown,
} from "../components/StarSystem";
import LevelProgression from "../components/LevelProgression";
import AchievementSystem, {
  generateDefaultAchievements,
  useAchievements,
} from "../components/AchievementSystem";
import ProgressTrackingService from "../services/ProgressTrackingService";

interface ResultScreenProps {
  navigation: any;
  route: any;
}

interface SessionStats {
  totalProblems: number;
  correctAnswers: number;
  totalXP: number;
  averageTime: number;
  maxStreak: number;
  improvementAreas: string[];
  achievements: string[];
}

const { width } = Dimensions.get("window");

export const ResultScreen: React.FC<ResultScreenProps> = ({
  navigation,
  route,
}) => {
  const {
    isCorrect = true,
    xpGained = 10,
    timeSpent = 15,
    streak = 1,
    currentScene = "entrance",
    nextScene,
    currentLevel = 1,
    sessionType = "single", // "single" | "session_complete" | "game_over"
    problemsInSession = 1,
  } = route?.params || {};

  // 🐛 DEBUG: Log de parámetros recibidos
  console.log("🔍 ResultScreen initialized with params:", {
    isCorrect,
    xpGained,
    timeSpent,
    streak,
    currentScene,
    nextScene,
    currentLevel,
    sessionType,
    problemsInSession,
    hasNavigation: !!navigation,
    routeParams: route?.params,
  });

  const [adaptiveDifficulty] = useState(() => AdaptiveDifficulty.getInstance());
  const [sessionStats, setSessionStats] = useState<SessionStats | null>(null);
  const [starCalculation, setStarCalculation] = useState<any>(null);
  const [showStarBreakdown, setShowStarBreakdown] = useState(false);
  const [progressService] = useState(() =>
    ProgressTrackingService.getInstance()
  );
  const [currentProgress, setCurrentProgress] = useState<any>(null);
  const [levelUpData, setLevelUpData] = useState<any>(null);

  // ✅ NUEVO: Sistema de achievements integrado
  const [achievements, setAchievements] = useState(() =>
    generateDefaultAchievements()
  );
  const [newAchievements, setNewAchievements] = useState<any[]>([]);
  const [showAchievementModal, setShowAchievementModal] = useState(false);

  // ✅ DESHABILITAR NAVEGACIÓN HACIA ATRÁS
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        console.log("🚫 Navegación hacia atrás bloqueada en ResultScreen");
        return true; // Bloquea el gesto de volver
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription?.remove();
    }, [])
  );

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // ✅ FUNCIÓN: Detectar achievements desbloqueados
  const checkAchievements = (
    progress: any,
    achievementsList: any[],
    unlockedList: any[]
  ) => {
    achievementsList.forEach((achievement, index) => {
      if (!achievement.unlocked) {
        let shouldUnlock = false;

        // Detectar diferentes tipos de achievements
        switch (achievement.requirements.type) {
          case "problems_solved":
            if (progress.problemsSolved >= achievement.requirements.value) {
              shouldUnlock = true;
            }
            break;
          case "speed_record":
            if (timeSpent <= achievement.requirements.value) {
              shouldUnlock = true;
            }
            break;
          case "perfect_streak":
            if (streak >= achievement.requirements.value && isCorrect) {
              shouldUnlock = true;
            }
            break;
          case "daily_streak":
            // Por ahora simulamos - en implementación real sería más complejo
            if (progress.currentStreak >= achievement.requirements.value) {
              shouldUnlock = true;
            }
            break;
        }

        if (shouldUnlock) {
          achievementsList[index] = {
            ...achievement,
            unlocked: true,
            unlockedAt: new Date(),
          };
          unlockedList.push(achievementsList[index]);
        }
      }
    });
  };

  useEffect(() => {
    const initializeProgress = async () => {
      // Obtener estadísticas del sistema adaptativo
      const stats = adaptiveDifficulty.getPerformanceStats();

      // Calcular estrellas ganadas
      const difficulty = "medium"; // Por ahora usamos medium como default
      const hintsUsed = 0; // TODO: Integrar sistema de pistas
      const starCalc = calculateStars(
        isCorrect,
        timeSpent,
        difficulty,
        streak,
        hintsUsed
      );
      setStarCalculation(starCalc);

      // Obtener progreso actual
      const progress = await progressService.getProgress();

      // ✅ NUEVO: Detectar achievements desbloqueados
      const updatedAchievements = [...achievements];
      const unlockedAchievements: any[] = [];

      // Si hay progreso, actualizarlo con los nuevos datos
      if (progress && isCorrect) {
        const newTotalXP = progress.totalXP + xpGained;
        const newTotalStars = progress.totalStars + starCalc.stars;
        const newProblemsCount = progress.problemsSolved + 1;

        // Calcular nuevo nivel basado en XP
        const newLevel = Math.floor(newTotalXP / 100) + 1; // Fórmula simple
        const leveledUp = newLevel > progress.currentLevel;

        if (leveledUp) {
          setLevelUpData({ oldLevel: progress.currentLevel, newLevel });
        }

        await progressService.updateProgress({
          totalXP: newTotalXP,
          totalStars: newTotalStars,
          currentLevel: newLevel,
          problemsSolved: newProblemsCount,
          accuracyRate: newProblemsCount > 0 ? 1.0 : 0, // Si llegamos aquí es porque isCorrect=true
          currentStreak: streak,
        });

        // Obtener progreso actualizado
        const updatedProgress = await progressService.getProgress();
        setCurrentProgress(updatedProgress);

        // ✅ Detectar achievements basados en progreso actualizado
        checkAchievements(
          updatedProgress,
          updatedAchievements,
          unlockedAchievements
        );
      } else if (!progress) {
        // Crear progreso inicial
        await progressService.updateProgress({
          totalXP: xpGained,
          totalStars: starCalc.stars,
          currentLevel: 1,
          problemsSolved: isCorrect ? 1 : 0,
          accuracyRate: isCorrect ? 1 : 0,
          currentStreak: isCorrect ? streak : 0,
        });

        const newProgress = await progressService.getProgress();
        setCurrentProgress(newProgress);

        // ✅ Detectar achievements para usuario nuevo
        checkAchievements(
          newProgress,
          updatedAchievements,
          unlockedAchievements
        );
      }

      // ✅ Actualizar achievements y mostrar nuevos
      if (unlockedAchievements.length > 0) {
        setAchievements(updatedAchievements);
        setNewAchievements(unlockedAchievements);
        setShowAchievementModal(true);
      }

      // Generar análisis de la sesión
      const sessionAnalysis: SessionStats = {
        totalProblems: stats.totalAnswers,
        correctAnswers: stats.correctAnswers,
        totalXP: stats.correctAnswers * 10,
        averageTime: stats.averageTime,
        maxStreak: Math.max(
          stats.streak,
          ...stats.lastFiveResults.reduce(
            (acc, curr, index) => {
              if (curr) acc[acc.length - 1] = (acc[acc.length - 1] || 0) + 1;
              else acc.push(0);
              return acc;
            },
            [0]
          )
        ),
        improvementAreas: generateImprovementAreas(stats),
        achievements: generateAchievements(stats),
      };

      setSessionStats(sessionAnalysis);
    };

    initializeProgress();

    // Iniciar animaciones
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        ...animations.spring,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: isCorrect ? 1 : 0.5, // Usar valor basado en respuesta actual
        duration: 1500,
        delay: 600,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const generateImprovementAreas = (stats: any): string[] => {
    const areas: string[] = [];

    if (stats.successRate < 0.7) {
      areas.push("Precisión en las respuestas");
    }

    if (stats.averageTime > 30) {
      areas.push("Velocidad de resolución");
    }

    if (stats.recentPerformance < stats.successRate) {
      areas.push("Consistencia reciente");
    }

    return areas.length > 0
      ? areas
      : ["¡Sigue así! Tu rendimiento es excelente"];
  };

  const generateAchievements = (stats: any): string[] => {
    const achievements: string[] = [];

    if (stats.streak >= 5) {
      achievements.push("🔥 Racha Increíble");
    }

    if (stats.successRate >= 0.9) {
      achievements.push("🎯 Precisión Perfecta");
    }

    if (stats.averageTime < 15) {
      achievements.push("⚡ Velocidad Relámpago");
    }

    if (stats.totalAnswers >= 10) {
      achievements.push("📚 Estudiante Dedicado");
    }

    if (stats.difficultyLevel === "Maestro Matemático") {
      achievements.push("👑 Maestro Supremo");
    }

    return achievements;
  };

  const handleContinue = () => {
    console.log("🚀 ResultScreen - Continue pressed:", {
      sessionType,
      isCorrect,
      nextScene,
      currentLevel,
      problemsInSession,
    });

    try {
      // ✅ LÓGICA DE FINALIZACIÓN MEJORADA
      if (sessionType === "session_complete" || sessionType === "game_over") {
        // Sesión completada o game over - siempre volver a mazmorra
        console.log("🏠 Navigating to Dungeon (session complete/game over)");
        navigation.navigate("Dungeon");
        return;
      }

      // Para problema individual
      if (isCorrect && nextScene) {
        // ✅ CONDICIÓN DE FINALIZACIÓN: Después de 5 problemas correctos, terminar sesión
        if (problemsInSession >= 5) {
          console.log("🎉 Sesión completada - 5 problemas resueltos");
          navigation.navigate("Result", {
            isCorrect: true,
            xpGained: xpGained * problemsInSession,
            timeSpent,
            streak,
            currentScene,
            currentLevel,
            sessionType: "session_complete",
            problemsInSession,
          });
          return;
        }

        // ✅ CONDICIÓN DE FINALIZACIÓN: Boss derrotado, terminar aventura
        if (currentScene === "boss_room" && isCorrect) {
          console.log("👑 ¡Jefe final derrotado! Aventura completada");
          navigation.navigate("Result", {
            isCorrect: true,
            xpGained: xpGained * 2, // Bonus por jefe final
            timeSpent,
            streak,
            currentScene,
            currentLevel,
            sessionType: "session_complete",
            problemsInSession,
          });
          return;
        }

        // Continuar con siguiente problema
        console.log("➡️ Continuing to next Choice screen");
        navigation.replace("Choice", {
          currentLevel: currentLevel + 1,
          currentScene: nextScene,
          problemsInSession: problemsInSession + 1,
        });
      } else {
        // Respuesta incorrecta o sin siguiente escena - volver a mazmorra
        console.log(
          "🏠 Navigating to Dungeon (incorrect answer or no next scene)"
        );
        navigation.navigate("Dungeon");
      }
    } catch (error) {
      console.error("❌ Error in handleContinue:", error);
      // Fallback: siempre navegar a Dungeon si hay error
      navigation.navigate("Dungeon");
    }
  };

  const handleReviewMistakes = () => {
    // Aquí se podría implementar una revisión de errores
    navigation.navigate("Problem", {
      reviewMode: true,
      problemType: "mixed",
      difficulty: "easy",
      currentScene,
    });
  };

  const getMascotMood = () => {
    if (!sessionStats) return "neutral";

    const successRate =
      sessionStats.correctAnswers / sessionStats.totalProblems;
    if (successRate >= 0.8) return "happy";
    if (successRate >= 0.6) return "neutral";
    return "sad";
  };

  const getOverallRating = () => {
    // ✅ RATING DIFERENTE SEGÚN TIPO DE SESIÓN
    if (sessionType === "single") {
      // Para problema individual - rating simple
      if (isCorrect) {
        return { emoji: "✅", title: "¡Perfecto!", color: colors.success.main };
      } else {
        return {
          emoji: "❌",
          title: "Inténtalo de nuevo",
          color: colors.error.main,
        };
      }
    }

    if (sessionType === "session_complete") {
      return { emoji: "🎉", title: "¡Sesión Completada!", color: colors.gold };
    }

    if (sessionType === "game_over") {
      return { emoji: "💀", title: "Game Over", color: colors.error.main };
    }

    // Rating basado en estadísticas (para versión completa)
    if (!sessionStats)
      return { emoji: "📚", title: "Aprendiendo", color: colors.primary.main };

    const successRate =
      sessionStats.correctAnswers / sessionStats.totalProblems;

    if (successRate >= 0.9) {
      return { emoji: "🌟", title: "Excelente", color: colors.gold };
    } else if (successRate >= 0.8) {
      return { emoji: "🎯", title: "Muy Bien", color: colors.success.main };
    } else if (successRate >= 0.6) {
      return { emoji: "👍", title: "Bien", color: colors.primary.main };
    } else if (successRate >= 0.4) {
      return { emoji: "💪", title: "Mejorando", color: colors.accent };
    } else {
      return {
        emoji: "📚",
        title: "Practicando",
        color: colors.text.secondary,
      };
    }
  };

  if (!sessionStats) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <MinoMascot mood="neutral" size={100} />
          <Text style={styles.loadingText}>Analizando tu rendimiento...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const rating = getOverallRating();
  const successRate = sessionStats
    ? sessionStats.correctAnswers / sessionStats.totalProblems
    : isCorrect
    ? 1
    : 0;

  // ✅ RENDERIZADO CONDICIONAL SEGÚN TIPO DE SESIÓN
  const renderSimpleResult = () => (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.background.default}
      />

      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <ScrollView
          style={styles.simpleScrollView}
          contentContainerStyle={styles.simpleContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header simple */}
          <Animated.View
            style={[
              styles.simpleHeader,
              {
                transform: [{ translateY: slideUpAnim }, { scale: scaleAnim }],
              },
            ]}
          >
            <SceneAssets sceneType={currentScene} size="large" />
            <Text style={[styles.simpleEmoji, { color: rating.color }]}>
              {rating.emoji}
            </Text>
            <Text style={[styles.simpleTitle, { color: rating.color }]}>
              {rating.title}
            </Text>
            <Text style={styles.simpleSubtitle}>
              +{xpGained} XP ganados • Tiempo: {Math.round(timeSpent)}s
            </Text>

            {/* Sistema de estrellas */}
            {starCalculation && (
              <View style={styles.starSection}>
                <StarSystem
                  starsEarned={starCalculation.stars}
                  size="large"
                  animated={true}
                />
                <TouchableOpacity
                  style={styles.starDetailsButton}
                  onPress={() => {
                    console.log("🌟 Star details button pressed");
                    setShowStarBreakdown(!showStarBreakdown);
                  }}
                >
                  <Text style={styles.starDetailsText}>Ver detalles ⭐</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Sistema de achievements - Mostrar logros recientes */}
            {newAchievements.length > 0 && (
              <View style={styles.achievementSection}>
                <Text style={styles.achievementTitle}>
                  🏆 ¡Logro Desbloqueado!
                </Text>
                <AchievementSystem
                  achievements={newAchievements}
                  compact={true}
                  showUnlockedOnly={true}
                />
              </View>
            )}

            {/* Progreso de nivel - Version compacta */}
            {currentProgress && (
              <View style={styles.levelSection}>
                <View style={styles.levelCompactContainer}>
                  <Text style={styles.levelCompactTitle}>
                    🎯 Nivel {currentProgress.currentLevel}
                  </Text>
                  <Text style={styles.levelCompactXP}>
                    {currentProgress.totalXP} XP total
                  </Text>
                  <View style={styles.levelCompactBar}>
                    <View
                      style={[
                        styles.levelCompactFill,
                        {
                          width: `${Math.min(
                            Math.max(currentProgress.totalXP % 100, 0),
                            100
                          )}%`,
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
            )}
          </Animated.View>

          {/* Mascota simple */}
          <View style={styles.simpleMascotSection}>
            <MinoMascot mood={isCorrect ? "happy" : "sad"} size={120} />
            <View style={styles.simpleSpeechBubble}>
              <Text style={styles.simpleSpeechText}>
                {isCorrect
                  ? adaptiveDifficulty.getEncouragementMessage()
                  : "¡No te rindas! Inténtalo de nuevo 💪"}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Botón fijo en la parte inferior */}
        <View style={styles.simpleBottomContainer}>
          {/* 🚨 BOTÓN DE EMERGENCIA TEMPORAL */}
          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={() => {
              console.log(
                "🚨 EMERGENCY BUTTON PRESSED - Force navigate to Dungeon"
              );
              navigation.navigate("Dungeon");
            }}
          >
            <Text style={styles.emergencyButtonText}>
              🚨 EMERGENCIA: Ir a Mazmorra
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.simpleContinueButton,
              { backgroundColor: rating.color },
            ]}
            onPress={() => {
              console.log("🚀 Continue button pressed - Simple version");
              handleContinue();
            }}
          >
            <Text style={styles.simpleContinueText}>
              {isCorrect && nextScene && problemsInSession < 5
                ? "Continuar Aventura"
                : "Volver a la Mazmorra"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Desglose de estrellas */}
        {starCalculation && (
          <StarBreakdown
            calculation={starCalculation}
            visible={showStarBreakdown}
            onClose={() => {
              console.log("🌟 Star breakdown closed");
              setShowStarBreakdown(false);
            }}
          />
        )}
      </Animated.View>
    </SafeAreaView>
  );

  // ✅ RENDERIZADO COMPLETO PARA SESIONES
  if (sessionType === "single") {
    return renderSimpleResult();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.background.default}
      />

      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header del resultado */}
          <Animated.View
            style={[
              styles.resultHeader,
              {
                transform: [{ translateY: slideUpAnim }, { scale: scaleAnim }],
              },
            ]}
          >
            <SceneAssets sceneType={currentScene} size="medium" />
            <Text style={[styles.ratingEmoji, { color: rating.color }]}>
              {rating.emoji}
            </Text>
            <Text style={[styles.ratingTitle, { color: rating.color }]}>
              {rating.title}
            </Text>
            <Text style={styles.resultSubtitle}>
              {sessionType === "session_complete"
                ? `¡${problemsInSession} problemas completados!`
                : `Sesión completada en ${currentScene.replace("_", " ")}`}
            </Text>
          </Animated.View>

          {/* Mascota con reacción */}
          <View style={styles.mascotSection}>
            <MinoMascot mood={getMascotMood()} size={120} />
            <View style={styles.speechBubble}>
              <Text style={styles.speechText}>
                {adaptiveDifficulty.getEncouragementMessage()}
              </Text>
            </View>
          </View>

          {/* Estadísticas principales */}
          <Animated.View
            style={[
              styles.statsGrid,
              { transform: [{ translateY: slideUpAnim }] },
            ]}
          >
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🎯</Text>
              <Text style={styles.statValue}>
                {Math.round(successRate * 100)}%
              </Text>
              <Text style={styles.statLabel}>Precisión</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statIcon}>⚡</Text>
              <Text style={styles.statValue}>
                {Math.round(sessionStats.averageTime)}s
              </Text>
              <Text style={styles.statLabel}>Tiempo Promedio</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🔥</Text>
              <Text style={styles.statValue}>{sessionStats.maxStreak}</Text>
              <Text style={styles.statLabel}>Mejor Racha</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statIcon}>⭐</Text>
              <Text style={styles.statValue}>{xpGained}</Text>
              <Text style={styles.statLabel}>XP Ganada</Text>
            </View>
          </Animated.View>

          {/* Barra de progreso */}
          <View style={styles.progressSection}>
            <Text style={styles.progressTitle}>Progreso General</Text>
            <View style={styles.progressBarContainer}>
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {sessionStats.correctAnswers} de {sessionStats.totalProblems}{" "}
              respuestas correctas
            </Text>
          </View>

          {/* Logros */}
          {sessionStats.achievements.length > 0 && (
            <View style={styles.achievementsSection}>
              <Text style={styles.sectionTitle}>🏆 Logros Desbloqueados</Text>
              <View style={styles.achievementsList}>
                {sessionStats.achievements.map((achievement, index) => (
                  <View key={index} style={styles.achievementChip}>
                    <Text style={styles.achievementText}>{achievement}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Áreas de mejora */}
          <View style={styles.improvementSection}>
            <Text style={styles.sectionTitle}>📈 Recomendaciones</Text>
            {sessionStats.improvementAreas.map((area, index) => (
              <View key={index} style={styles.improvementItem}>
                <Text style={styles.improvementIcon}>💡</Text>
                <Text style={styles.improvementText}>{area}</Text>
              </View>
            ))}
          </View>

          {/* Información del sistema adaptativo */}
          <View style={styles.adaptiveSection}>
            <Text style={styles.sectionTitle}>🎮 Tu Nivel Actual</Text>
            <View style={styles.difficultyCard}>
              <Text style={styles.difficultyTitle}>
                {adaptiveDifficulty.getDifficultyDescription()}
              </Text>
              <Text style={styles.difficultyDescription}>
                El sistema se está adaptando a tu rendimiento para ofrecerte
                desafíos perfectos
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Botones de acción */}
        <View style={styles.actionsContainer}>
          {sessionStats.correctAnswers < sessionStats.totalProblems && (
            <TouchableOpacity
              style={styles.reviewButton}
              onPress={handleReviewMistakes}
            >
              <Text style={styles.reviewButtonText}>📝 Repasar Errores</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.continueButton, { backgroundColor: rating.color }]}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>
              {isCorrect && nextScene
                ? "Continuar Aventura"
                : "Volver a la Mazmorra"}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
  },
  loadingText: {
    ...typography.h2,
    color: colors.text.secondary,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  resultHeader: {
    alignItems: "center",
    marginBottom: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
  },
  ratingEmoji: {
    fontSize: 64,
    marginVertical: spacing.md,
  },
  ratingTitle: {
    ...typography.h1,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  resultSubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: "center",
  },
  mascotSection: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  speechBubble: {
    backgroundColor: colors.background.paper,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginTop: spacing.md,
    maxWidth: width * 0.8,
    ...shadows.small,
  },
  speechText: {
    ...typography.body,
    color: colors.text.primary,
    textAlign: "center",
    lineHeight: 22,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    width: (width - spacing.lg * 2 - spacing.md) / 2,
    backgroundColor: colors.background.paper,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: "center",
    ...shadows.small,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  statValue: {
    ...typography.h1,
    color: colors.primary.main,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: "center",
  },
  progressSection: {
    backgroundColor: colors.background.paper,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
    ...shadows.small,
  },
  progressTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.primary.light + "30",
    borderRadius: borderRadius.round,
    marginBottom: spacing.sm,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: colors.success.main,
    borderRadius: borderRadius.round,
  },
  progressText: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: "center",
  },
  achievementsSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  achievementsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  achievementChip: {
    backgroundColor: colors.gold + "20",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  achievementText: {
    ...typography.caption,
    color: colors.gold,
    fontWeight: "600",
  },
  improvementSection: {
    marginBottom: spacing.xl,
  },
  improvementItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.paper,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    ...shadows.small,
  },
  improvementIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  improvementText: {
    ...typography.body,
    color: colors.text.primary,
    flex: 1,
  },
  adaptiveSection: {
    marginBottom: spacing.lg,
  },
  difficultyCard: {
    backgroundColor: colors.primary.light + "20",
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.primary.light,
  },
  difficultyTitle: {
    ...typography.h2,
    color: colors.primary.main,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  difficultyDescription: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 22,
  },
  actionsContainer: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  reviewButton: {
    backgroundColor: colors.accent + "20",
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  reviewButtonText: {
    ...typography.body,
    color: colors.accent,
    textAlign: "center",
    fontWeight: "600",
  },
  continueButton: {
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    ...shadows.medium,
  },
  continueButtonText: {
    ...typography.h3,
    color: colors.background.paper,
    textAlign: "center",
    fontWeight: "600",
  },
  // ✅ ESTILOS PARA VERSIÓN SIMPLE
  simpleScrollView: {
    flex: 1,
  },
  simpleContainer: {
    flexGrow: 1,
    alignItems: "center",
    padding: spacing.lg,
    paddingBottom: spacing.sm, // Menos padding abajo porque tenemos botón fijo
  },
  simpleHeader: {
    alignItems: "center",
    marginBottom: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
    width: "100%",
  },
  simpleEmoji: {
    fontSize: 60, // Reducido de 80 para ahorrar espacio
    marginVertical: spacing.md,
  },
  simpleTitle: {
    ...typography.h1,
    fontWeight: "700",
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  simpleSubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  simpleMascotSection: {
    alignItems: "center",
    marginBottom: spacing.md, // Reducido para ahorrar espacio
  },
  simpleSpeechBubble: {
    backgroundColor: colors.background.paper,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginTop: spacing.md,
    maxWidth: width * 0.8,
    ...shadows.small,
  },
  simpleSpeechText: {
    ...typography.body, // Cambiado de h3 a body para ahorrar espacio
    color: colors.text.primary,
    textAlign: "center",
    lineHeight: 20,
    fontWeight: "500",
  },
  simpleBottomContainer: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: colors.background.default,
    borderTopWidth: 1,
    borderTopColor: colors.primary.light + "20",
  },
  simpleContinueButton: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    ...shadows.medium,
    minWidth: width * 0.8,
    alignItems: "center",
  },
  simpleContinueText: {
    ...typography.h3,
    color: colors.background.paper,
    textAlign: "center",
    fontWeight: "600",
  },
  // ✅ ESTILOS PARA SISTEMAS DE GAMIFICACIÓN
  starSection: {
    alignItems: "center",
    marginVertical: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.gold + "10",
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gold + "30",
  },
  starDetailsButton: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.gold + "20",
    borderRadius: borderRadius.round,
  },
  starDetailsText: {
    ...typography.caption,
    color: colors.gold,
    fontWeight: "600",
  },
  levelSection: {
    marginVertical: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.primary.light + "10",
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary.light + "30",
  },
  levelCompactContainer: {
    alignItems: "center",
    gap: spacing.sm,
  },
  levelCompactTitle: {
    ...typography.h3,
    color: colors.primary.main,
    fontWeight: "600",
  },
  levelCompactXP: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  levelCompactBar: {
    width: "100%",
    height: 8,
    backgroundColor: colors.primary.light + "30",
    borderRadius: borderRadius.round,
    overflow: "hidden",
  },
  levelCompactFill: {
    height: "100%",
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.round,
  },
  emergencyButton: {
    backgroundColor: colors.error.main + "20",
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.error.main,
  },
  emergencyButtonText: {
    ...typography.body,
    color: colors.error.main,
    textAlign: "center",
    fontWeight: "600",
  },
  // ✅ NUEVOS ESTILOS PARA ACHIEVEMENTS
  achievementSection: {
    alignItems: "center",
    marginVertical: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.gold + "10",
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.gold + "30",
    ...shadows.medium,
  },
  achievementTitle: {
    ...typography.h2,
    color: colors.gold,
    fontWeight: "700",
    marginBottom: spacing.md,
    textAlign: "center",
  },
});

export default ResultScreen;
