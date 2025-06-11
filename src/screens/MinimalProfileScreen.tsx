// MinimalProfileScreen - Perfil limpio con análisis inteligente de IA
// Cards con métricas + análisis de IA + recomendaciones personalizadas

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import { userProgressService, SimpleUserStats } from "../services/UserProgress";
import { useGameLoop, useAIRecommendations } from "../hooks/useGameLoop";
import MinoMascot from "../components/gamification/MinoMascot";

const { width, height } = Dimensions.get("window");

interface MinimalProfileScreenProps {
  navigation: any;
}

const MinimalProfileScreen: React.FC<MinimalProfileScreenProps> = ({
  navigation,
}) => {
  const theme = useTheme();
  const [gameState, gameActions] = useGameLoop();
  const { getRecommendations } = useAIRecommendations();
  const [userStats, setUserStats] = useState<SimpleUserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      const stats = await userProgressService.getUserStats();
      setUserStats(stats);
    } catch (error) {
      console.error("Error loading user stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Obtener estado de la mascota basado en racha diaria (4 estados exactos)
  const getMascotMood = () => {
    const currentMood = gameActions.getMascotMoodForCurrentState();
    // Mapear a los moods que entiende MinoMascot
    const moodMap = {
      happy: "happy" as const, // feliz
      neutral: "neutral" as const, // neutral
      sad: "sad" as const, // triste
      super_happy: "celebrating" as const, // súper feliz
    };
    return moodMap[currentMood];
  };

  // Obtener mensaje motivacional inteligente
  const getIntelligentMessage = () => {
    const analysis = gameActions.getPerformanceAnalysis();
    const userData = gameActions.getUserData();

    if (userData.totalProblems < 5) {
      return "Resuelve más problemas para obtener análisis personalizado 🚀";
    }

    // Mensajes basados en tendencia
    if (analysis.overallTrend === "improving") {
      return `¡Estás mejorando constantemente! Tu ${analysis.strongestType} es excelente 📈`;
    }

    if (analysis.overallTrend === "declining") {
      return `Considera practicar más ${analysis.weakestType} para recuperar tu forma 💪`;
    }

    // Mensajes basados en precisión
    if (gameState.accuracy >= 90) {
      return "¡Eres un maestro de las matemáticas! Precisión increíble 🏆";
    }

    if (gameState.accuracy >= 75) {
      return "Excelente precisión. ¡Sigue así! 🎯";
    }

    // Mensajes basados en racha
    if (gameState.streak >= 14) {
      return `¡${gameState.streak} días seguidos! Eres imparable 🔥`;
    }

    if (gameState.streak >= 7) {
      return "Una semana completa practicando. ¡Increíble dedicación! ⭐";
    }

    // Mensaje por defecto personalizado
    return `Fortaleza: ${analysis.strongestType} | Enfócate en: ${analysis.recommendedFocus} 🎯`;
  };

  // Renderizar tarjeta de estadística mejorada
  const renderStatCard = (
    title: string,
    value: string | number,
    subtitle?: string,
    color?: string,
    trend?: "up" | "down" | "stable"
  ) => (
    <View
      style={[
        styles.statCard,
        { backgroundColor: theme.colors.background.paper },
      ]}
    >
      <View style={styles.statHeader}>
        <Text
          style={[styles.statTitle, { color: theme.colors.text.secondary }]}
        >
          {title}
        </Text>
        {trend && (
          <Text style={styles.trendIcon}>
            {trend === "up" ? "📈" : trend === "down" ? "📉" : "➡️"}
          </Text>
        )}
      </View>
      <Text
        style={[
          styles.statValue,
          { color: color || theme.colors.primary.main },
        ]}
      >
        {value}
      </Text>
      {subtitle && (
        <Text
          style={[styles.statSubtitle, { color: theme.colors.text.secondary }]}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );

  // Renderizar análisis de fortalezas y debilidades
  const renderStrengthsWeaknesses = () => {
    const analysis = gameActions.getPerformanceAnalysis();
    const userData = gameActions.getUserData();

    if (userData.totalProblems < 10) {
      return (
        <View
          style={[
            styles.analysisCard,
            { backgroundColor: theme.colors.background.paper },
          ]}
        >
          <Text
            style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
          >
            🔍 Análisis de rendimiento
          </Text>
          <Text
            style={[styles.noDataText, { color: theme.colors.text.secondary }]}
          >
            Resuelve al menos 10 problemas para ver tu análisis personalizado
          </Text>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.analysisCard,
          { backgroundColor: theme.colors.background.paper },
        ]}
      >
        <Text
          style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
        >
          🔍 Análisis Inteligente
        </Text>

        <View style={styles.analysisRow}>
          <View
            style={[
              styles.strengthCard,
              { backgroundColor: theme.colors.success.light },
            ]}
          >
            <Text
              style={[
                styles.analysisLabel,
                { color: theme.colors.success.dark },
              ]}
            >
              💪 Tu fortaleza
            </Text>
            <Text
              style={[
                styles.analysisValue,
                { color: theme.colors.success.dark },
              ]}
            >
              {analysis.strongestType}
            </Text>
          </View>

          <View
            style={[
              styles.weaknessCard,
              { backgroundColor: theme.colors.warning.light },
            ]}
          >
            <Text
              style={[
                styles.analysisLabel,
                { color: theme.colors.warning.dark },
              ]}
            >
              🎯 Para mejorar
            </Text>
            <Text
              style={[
                styles.analysisValue,
                { color: theme.colors.warning.dark },
              ]}
            >
              {analysis.recommendedFocus}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.trendContainer,
            { backgroundColor: getTrendColor(analysis.overallTrend) },
          ]}
        >
          <Text
            style={[
              styles.trendText,
              { color: getTrendTextColor(analysis.overallTrend) },
            ]}
          >
            {getTrendIcon(analysis.overallTrend)} Tendencia:{" "}
            {getTrendText(analysis.overallTrend)}
          </Text>
        </View>
      </View>
    );
  };

  // Helpers para tendencias
  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "improving":
        return theme.colors.success.light;
      case "declining":
        return theme.colors.error.light;
      default:
        return theme.colors.primary.light;
    }
  };

  const getTrendTextColor = (trend: string) => {
    switch (trend) {
      case "improving":
        return theme.colors.success.dark;
      case "declining":
        return theme.colors.error.dark;
      default:
        return theme.colors.primary.dark;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return "📈";
      case "declining":
        return "📉";
      default:
        return "➡️";
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case "improving":
        return "Mejorando";
      case "declining":
        return "Necesita práctica";
      default:
        return "Estable";
    }
  };

  // Renderizar recomendaciones de la IA
  const renderAIRecommendations = () => {
    const recommendations = getRecommendations();

    return (
      <View
        style={[
          styles.recommendationsCard,
          { backgroundColor: theme.colors.background.paper },
        ]}
      >
        <Text
          style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
        >
          🤖 Recomendaciones IA
        </Text>
        {recommendations.slice(0, 3).map((recommendation, index) => (
          <View key={index} style={styles.recommendationItem}>
            <Text
              style={[
                styles.recommendationDot,
                { color: theme.colors.primary.main },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.recommendationText,
                { color: theme.colors.text.primary },
              ]}
            >
              {recommendation}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  // Renderizar distribución de tipos de problemas
  const renderTypeDistribution = () => {
    const userData = gameActions.getUserData();

    if (userData.totalProblems < 5) return null;

    const types = Object.entries(userData.typePreferences)
      .filter(([_, perf]) => perf.count > 0)
      .sort((a, b) => b[1].accuracy - a[1].accuracy);

    return (
      <View
        style={[
          styles.distributionCard,
          { backgroundColor: theme.colors.background.paper },
        ]}
      >
        <Text
          style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
        >
          📊 Rendimiento por tipo
        </Text>
        {types.map(([type, perf], index) => (
          <View key={type} style={styles.typeRow}>
            <Text
              style={[styles.typeName, { color: theme.colors.text.primary }]}
            >
              {type}
            </Text>
            <View style={styles.typeStats}>
              <Text
                style={[
                  styles.typeAccuracy,
                  { color: getAccuracyColor(perf.accuracy) },
                ]}
              >
                {Math.round(perf.accuracy)}%
              </Text>
              <Text
                style={[
                  styles.typeCount,
                  { color: theme.colors.text.secondary },
                ]}
              >
                ({perf.count})
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return theme.colors.success.main;
    if (accuracy >= 60) return theme.colors.warning.main;
    return theme.colors.error.main;
  };

  // Renderizar logros simplificados
  const renderAchievements = () => {
    if (!userStats || userStats.achievements.length === 0) {
      return (
        <View
          style={[
            styles.achievementsCard,
            { backgroundColor: theme.colors.background.paper },
          ]}
        >
          <Text
            style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
          >
            🏆 Logros
          </Text>
          <Text
            style={[
              styles.noAchievements,
              { color: theme.colors.text.secondary },
            ]}
          >
            Resuelve problemas para ganar logros
          </Text>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.achievementsCard,
          { backgroundColor: theme.colors.background.paper },
        ]}
      >
        <Text
          style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
        >
          🏆 Logros ({userStats.achievements.length})
        </Text>
        <View style={styles.achievementsList}>
          {userStats.achievements.slice(0, 4).map((achievementId, index) => {
            const achievement =
              userProgressService.getAchievementInfo(achievementId);
            return (
              <View key={index} style={styles.achievementItem}>
                <Text
                  style={[
                    styles.achievementTitle,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  ✨ {achievement.title}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  if (loading) {
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
          Analizando tu progreso...
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.default },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.backButton,
            { backgroundColor: theme.colors.background.paper },
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text
            style={[
              styles.backButtonText,
              { color: theme.colors.text.secondary },
            ]}
          >
            ← Volver
          </Text>
        </TouchableOpacity>
        <Text
          style={[styles.headerTitle, { color: theme.colors.text.primary }]}
        >
          Mi Perfil
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mascota y mensaje inteligente */}
        <View style={styles.heroSection}>
          <MinoMascot
            mood={getMascotMood()}
            size={140}
            ageGroup="adults"
            context="profile"
            showThoughts={false}
          />
          <Text
            style={[
              styles.motivationalMessage,
              { color: theme.colors.text.primary },
            ]}
          >
            {getIntelligentMessage()}
          </Text>
        </View>

        {/* Estadísticas principales con tendencias */}
        <View style={styles.statsGrid}>
          {renderStatCard(
            "Nivel",
            gameState.level,
            `${gameState.totalXP % 100}/100 XP`,
            theme.colors.primary.main,
            "up"
          )}
          {renderStatCard(
            "Precisión",
            `${Math.round(gameState.accuracy)}%`,
            userStats ? `de ${userStats.totalProblems} problemas` : undefined,
            theme.colors.success.main,
            gameState.accuracy >= 75
              ? "up"
              : gameState.accuracy >= 50
              ? "stable"
              : "down"
          )}
          {renderStatCard(
            "Dificultad",
            `${gameState.currentDifficulty}/5`,
            "Nivel actual",
            theme.colors.warning.main,
            "stable"
          )}
          {renderStatCard(
            "Racha",
            gameState.streak,
            `Mejor: ${userStats?.longestStreak || 0} días`,
            theme.colors.error.main,
            gameState.streak >= 3 ? "up" : "stable"
          )}
        </View>

        {/* Análisis de fortalezas y debilidades */}
        {renderStrengthsWeaknesses()}

        {/* Distribución por tipos */}
        {renderTypeDistribution()}

        {/* Recomendaciones de IA */}
        {renderAIRecommendations()}

        {/* Logros */}
        {renderAchievements()}

        {/* Botón de práctica */}
        <TouchableOpacity
          style={[
            styles.practiceButton,
            { backgroundColor: theme.colors.primary.main },
          ]}
          onPress={() => navigation.navigate("FocusedProblem")}
        >
          <Text
            style={[
              styles.practiceButtonText,
              { color: theme.colors.primary.contrastText },
            ]}
          >
            Continuar practicando 🚀
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
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
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  headerSpacer: {
    width: 80,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  motivationalMessage: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 22,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    width: "48%",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  trendIcon: {
    fontSize: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    textAlign: "left",
  },
  analysisCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  noDataText: {
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
  },
  analysisRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  strengthCard: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },
  weaknessCard: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: "center",
  },
  analysisLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  analysisValue: {
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  trendContainer: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  trendText: {
    fontSize: 14,
    fontWeight: "600",
  },
  distributionCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  typeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  typeName: {
    fontSize: 16,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  typeStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  typeAccuracy: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  typeCount: {
    fontSize: 14,
  },
  recommendationsCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  recommendationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  recommendationDot: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  achievementsCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  noAchievements: {
    fontSize: 16,
    textAlign: "center",
    fontStyle: "italic",
  },
  achievementsList: {
    gap: 8,
  },
  achievementItem: {
    paddingVertical: 6,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  practiceButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  practiceButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default MinimalProfileScreen;
