import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import {
  colors,
  spacing,
  typography,
  shadows,
  borderRadius,
} from "../styles/theme";
import PerformanceAnalytics, {
  LearningInsight,
  PersonalizedMetrics,
  PerformanceTrend,
} from "../services/PerformanceAnalytics";
import StarSystem, { useStarSystem } from "./StarSystem";
import LevelProgression, { getLevelData } from "./LevelProgression";
import AchievementSystem from "./AchievementSystem";

interface UserProfileExpandedProps {
  userId: string;
  onClose?: () => void;
}

interface ProfileStats {
  totalProblems: number;
  accuracyRate: number;
  averageTime: number;
  currentStreak: number;
  totalStars: number;
  currentLevel: number;
  totalXP: number;
  daysActive: number;
  favoriteCategory: string;
  strongestSkill: string;
  learningStyle: string;
  optimalPlayTime: string;
}

const { width, height } = Dimensions.get("window");

export const UserProfileExpanded: React.FC<UserProfileExpandedProps> = ({
  userId,
  onClose,
}) => {
  const [analytics] = useState(() => PerformanceAnalytics.getInstance());
  const [insights, setInsights] = useState<LearningInsight[]>([]);
  const [personalizedMetrics, setPersonalizedMetrics] =
    useState<PersonalizedMetrics | null>(null);
  const [trends, setTrends] = useState<PerformanceTrend[]>([]);
  const [profileStats, setProfileStats] = useState<ProfileStats | null>(null);
  const [selectedTab, setSelectedTab] = useState<
    "overview" | "insights" | "progress" | "achievements"
  >("overview");
  const [isLoading, setIsLoading] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    initializeProfile();
  }, [userId]);

  useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const initializeProfile = async () => {
    try {
      setIsLoading(true);

      // Cargar datos en paralelo con fallbacks
      const [insightsData, metricsData, trendsData] = await Promise.all([
        analytics.generateInsights().catch(() => []),
        analytics.getPersonalizedMetrics().catch(() => null),
        analytics.getPerformanceTrends().catch(() => []),
      ]);

      // Datos de respaldo si no hay insights
      const fallbackInsights = [
        {
          type: "recommendation" as const,
          title: "¡Sigue practicando!",
          description:
            "Continúa resolviendo problemas para generar insights personalizados basados en tu rendimiento.",
          actionable: true,
          suggestedActions: [
            "Resuelve al menos 5 problemas",
            "Prueba diferentes categorías",
          ],
          confidence: 0.8,
          priority: "medium" as const,
        },
      ];

      setInsights(insightsData.length > 0 ? insightsData : fallbackInsights);
      setPersonalizedMetrics(metricsData);
      setTrends(trendsData);

      // Generar estadísticas del perfil
      const stats = await generateProfileStats(metricsData);
      setProfileStats(stats);
    } catch (error) {
      console.error("Error initializing profile:", error);
      // Establecer datos de respaldo en caso de error total
      setInsights([
        {
          type: "recommendation" as const,
          title: "Comienza tu aventura",
          description:
            "Resuelve algunos problemas para obtener insights personalizados sobre tu aprendizaje.",
          actionable: true,
          suggestedActions: [
            "Inicia con problemas básicos",
            "Explora diferentes temas",
          ],
          confidence: 1.0,
          priority: "high" as const,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateProfileStats = async (
    metrics: PersonalizedMetrics
  ): Promise<ProfileStats> => {
    // En una implementación real, esto vendría de múltiples fuentes
    return {
      totalProblems: 156,
      accuracyRate: 0.84,
      averageTime: 18.5,
      currentStreak: 7,
      totalStars: 342,
      currentLevel: 8,
      totalXP: 2450,
      daysActive: 23,
      favoriteCategory: metrics.strongestCategories[0] || "Aritmética",
      strongestSkill: metrics.strongestCategories[0] || "Suma",
      learningStyle: metrics.learningStyle,
      optimalPlayTime: metrics.optimalPlayTime,
    };
  };

  const renderTabButton = (tab: string, title: string, icon: string) => (
    <TouchableOpacity
      style={[styles.tabButton, selectedTab === tab && styles.activeTabButton]}
      onPress={() => setSelectedTab(tab as any)}
    >
      <Text style={styles.tabIcon}>{icon}</Text>
      <Text
        style={[styles.tabText, selectedTab === tab && styles.activeTabText]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderOverviewTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Header del perfil */}
      <Animated.View
        style={[
          styles.profileHeader,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarEmoji}>🧙‍♂️</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>
              Nv.{profileStats?.currentLevel}
            </Text>
          </View>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Mago Matemático</Text>
          <Text style={styles.profileTitle}>
            {getLevelData(profileStats?.currentLevel || 1).title}
          </Text>
          <Text style={styles.profileDescription}>
            {profileStats?.daysActive} días activo • Estilo:{" "}
            {profileStats?.learningStyle}
          </Text>
        </View>
      </Animated.View>

      {/* Estadísticas principales */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🎯</Text>
          <Text style={styles.statValue}>
            {(profileStats?.accuracyRate! * 100).toFixed(0)}%
          </Text>
          <Text style={styles.statLabel}>Precisión</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>⚡</Text>
          <Text style={styles.statValue}>
            {profileStats?.averageTime.toFixed(1)}s
          </Text>
          <Text style={styles.statLabel}>Tiempo Promedio</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🔥</Text>
          <Text style={styles.statValue}>{profileStats?.currentStreak}</Text>
          <Text style={styles.statLabel}>Racha Actual</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>⭐</Text>
          <Text style={styles.statValue}>{profileStats?.totalStars}</Text>
          <Text style={styles.statLabel}>Estrellas</Text>
        </View>
      </View>

      {/* Progreso de nivel */}
      {profileStats && (
        <View style={styles.levelProgressSection}>
          <LevelProgression
            currentXP={profileStats.totalXP % 100}
            level={profileStats.currentLevel}
            animated={true}
            showDetails={true}
          />
        </View>
      )}

      {/* Habilidades destacadas */}
      <View style={styles.skillsSection}>
        <Text style={styles.sectionTitle}>🎨 Tu Perfil de Aprendizaje</Text>

        <View style={styles.skillCard}>
          <View style={styles.skillHeader}>
            <Text style={styles.skillIcon}>🏆</Text>
            <Text style={styles.skillTitle}>Fortaleza Principal</Text>
          </View>
          <Text style={styles.skillValue}>{profileStats?.strongestSkill}</Text>
          <Text style={styles.skillDescription}>
            Tu área con mejor rendimiento
          </Text>
        </View>

        <View style={styles.skillCard}>
          <View style={styles.skillHeader}>
            <Text style={styles.skillIcon}>🧠</Text>
            <Text style={styles.skillTitle}>Estilo de Aprendizaje</Text>
          </View>
          <Text style={styles.skillValue}>{profileStats?.learningStyle}</Text>
          <Text style={styles.skillDescription}>
            Tu forma preferida de resolver problemas
          </Text>
        </View>

        <View style={styles.skillCard}>
          <View style={styles.skillHeader}>
            <Text style={styles.skillIcon}>⏰</Text>
            <Text style={styles.skillTitle}>Momento Óptimo</Text>
          </View>
          <Text style={styles.skillValue}>{profileStats?.optimalPlayTime}</Text>
          <Text style={styles.skillDescription}>Cuando rindes mejor</Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderInsightsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>🧭 Insights Personalizados</Text>

      {insights.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            📊 Resuelve más problemas para obtener insights personalizados
          </Text>
        </View>
      ) : (
        insights.map((insight, index) => (
          <View
            key={index}
            style={[
              styles.insightCard,
              insight.type === "strength" && styles.strengthCard,
              insight.type === "weakness" && styles.weaknessCard,
              insight.type === "recommendation" && styles.recommendationCard,
            ]}
          >
            <View style={styles.insightHeader}>
              <Text style={styles.insightIcon}>
                {insight.type === "strength"
                  ? "💪"
                  : insight.type === "weakness"
                  ? "🎯"
                  : insight.type === "pattern"
                  ? "📈"
                  : "💡"}
              </Text>
              <View style={styles.insightTitleContainer}>
                <Text style={styles.insightTitle}>{insight.title}</Text>
                <View
                  style={[
                    styles.priorityBadge,
                    insight.priority === "high" && styles.highPriority,
                    insight.priority === "medium" && styles.mediumPriority,
                    insight.priority === "low" && styles.lowPriority,
                  ]}
                >
                  <Text style={styles.priorityText}>
                    {insight.priority.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.insightDescription}>{insight.description}</Text>

            {insight.actionable && insight.suggestedActions.length > 0 && (
              <View style={styles.actionsSection}>
                <Text style={styles.actionsTitle}>💡 Acciones sugeridas:</Text>
                {insight.suggestedActions.map((action, actionIndex) => (
                  <Text key={actionIndex} style={styles.actionText}>
                    • {action}
                  </Text>
                ))}
              </View>
            )}

            <View style={styles.confidenceBar}>
              <Text style={styles.confidenceLabel}>
                Confianza: {Math.round(insight.confidence * 100)}%
              </Text>
              <View style={styles.confidenceBarContainer}>
                <View
                  style={[
                    styles.confidenceBarFill,
                    { width: `${insight.confidence * 100}%` },
                  ]}
                />
              </View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );

  const renderProgressTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>📈 Tendencias de Progreso</Text>

      {trends.map((trend, index) => (
        <View key={index} style={styles.trendCard}>
          <View style={styles.trendHeader}>
            <Text style={styles.trendMetric}>{trend.metric}</Text>
            <View
              style={[
                styles.trendDirection,
                trend.direction === "improving" && styles.improving,
                trend.direction === "declining" && styles.declining,
                trend.direction === "stable" && styles.stable,
              ]}
            >
              <Text style={styles.trendIcon}>
                {trend.direction === "improving"
                  ? "📈"
                  : trend.direction === "declining"
                  ? "📉"
                  : "➡️"}
              </Text>
              <Text style={styles.trendText}>
                {trend.direction === "improving"
                  ? "Mejorando"
                  : trend.direction === "declining"
                  ? "Bajando"
                  : "Estable"}
              </Text>
            </View>
          </View>

          <Text style={styles.trendChange}>
            {trend.changePercentage.toFixed(1)}% en la última semana
          </Text>

          <View style={styles.significanceIndicator}>
            <Text
              style={[
                styles.significanceText,
                trend.significance === "high" && styles.highSignificance,
                trend.significance === "medium" && styles.mediumSignificance,
                trend.significance === "low" && styles.lowSignificance,
              ]}
            >
              Cambio{" "}
              {trend.significance === "high"
                ? "significativo"
                : trend.significance === "medium"
                ? "moderado"
                : "leve"}
            </Text>
          </View>
        </View>
      ))}

      {/* Métricas personalizadas */}
      {personalizedMetrics && (
        <View style={styles.personalizedSection}>
          <Text style={styles.sectionTitle}>🎯 Métricas Personalizadas</Text>

          <View style={styles.metricCard}>
            <Text style={styles.metricTitle}>🔥 Riesgo de Burnout</Text>
            <View style={styles.burnoutIndicator}>
              <View
                style={[
                  styles.burnoutBar,
                  {
                    backgroundColor:
                      personalizedMetrics.burnoutRisk > 0.7
                        ? colors.error.main
                        : personalizedMetrics.burnoutRisk > 0.4
                        ? "#FFA500"
                        : colors.success.main,
                  },
                ]}
              >
                <View
                  style={[
                    styles.burnoutFill,
                    { width: `${personalizedMetrics.burnoutRisk * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.burnoutText}>
                {personalizedMetrics.burnoutRisk < 0.3
                  ? "Bajo"
                  : personalizedMetrics.burnoutRisk < 0.7
                  ? "Moderado"
                  : "Alto"}
              </Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricTitle}>💪 Nivel de Engagement</Text>
            <View style={styles.engagementIndicator}>
              <View style={styles.engagementBar}>
                <View
                  style={[
                    styles.engagementFill,
                    { width: `${personalizedMetrics.engagementLevel * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.engagementText}>
                {Math.round(personalizedMetrics.engagementLevel * 100)}%
              </Text>
            </View>
          </View>

          <View style={styles.categoriesSection}>
            <Text style={styles.metricTitle}>📊 Análisis por Categorías</Text>

            <View style={styles.categoryRow}>
              <Text style={styles.categoryLabel}>💪 Más Fuertes:</Text>
              <Text style={styles.categoryValue}>
                {personalizedMetrics.strongestCategories.join(", ") ||
                  "Ninguna aún"}
              </Text>
            </View>

            <View style={styles.categoryRow}>
              <Text style={styles.categoryLabel}>🎯 A Mejorar:</Text>
              <Text style={styles.categoryValue}>
                {personalizedMetrics.weakestCategories.join(", ") ||
                  "Ninguna identificada"}
              </Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );

  const renderAchievementsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>🏆 Logros y Reconocimientos</Text>

      <AchievementSystem
        achievements={[]} // Se cargarían los logros reales aquí
        showUnlockedOnly={false}
        compact={false}
      />
    </ScrollView>
  );

  const renderContent = () => {
    switch (selectedTab) {
      case "overview":
        return renderOverviewTab();
      case "insights":
        return renderInsightsTab();
      case "progress":
        return renderProgressTab();
      case "achievements":
        return renderAchievementsTab();
      default:
        return renderOverviewTab();
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>📊 Analizando tu progreso...</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        {onClose && (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {renderTabButton("overview", "General", "👤")}
        {renderTabButton("insights", "Insights", "🧭")}
        {renderTabButton("progress", "Progreso", "📈")}
        {renderTabButton("achievements", "Logros", "🏆")}
      </View>

      {/* Content */}
      {renderContent()}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.default,
  },
  loadingText: {
    ...typography.h2,
    color: colors.text.secondary,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: colors.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary.light + "20",
  },
  headerTitle: {
    ...typography.h1,
    color: colors.text.primary,
    fontWeight: "700",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.text.light + "20",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: colors.text.secondary,
    fontSize: 18,
    fontWeight: "bold",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: colors.background.paper,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary.light + "20",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTabButton: {
    borderBottomColor: colors.primary.main,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: spacing.xs,
  },
  tabText: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: "500",
  },
  activeTabText: {
    color: colors.primary.main,
    fontWeight: "600",
  },
  tabContent: {
    flex: 1,
    padding: spacing.lg,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.paper,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    ...shadows.medium,
  },
  avatarContainer: {
    position: "relative",
    marginRight: spacing.lg,
  },
  avatarEmoji: {
    fontSize: 60,
  },
  levelBadge: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  levelBadgeText: {
    ...typography.caption,
    color: colors.background.paper,
    fontWeight: "600",
    fontSize: 10,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...typography.h2,
    color: colors.text.primary,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  profileTitle: {
    ...typography.body,
    color: colors.primary.main,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  profileDescription: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginBottom: spacing.lg,
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
    ...typography.h2,
    color: colors.primary.main,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: "center",
  },
  levelProgressSection: {
    marginBottom: spacing.lg,
  },
  skillsSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text.primary,
    fontWeight: "600",
    marginBottom: spacing.lg,
  },
  skillCard: {
    backgroundColor: colors.background.paper,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  skillHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  skillIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  skillTitle: {
    ...typography.h3,
    color: colors.text.primary,
    fontWeight: "600",
  },
  skillValue: {
    ...typography.h3,
    color: colors.primary.main,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  skillDescription: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  emptyState: {
    backgroundColor: colors.background.paper,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    ...shadows.small,
  },
  emptyStateText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: "center",
  },
  insightCard: {
    backgroundColor: colors.background.paper,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  strengthCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.success.main,
  },
  weaknessCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  recommendationCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary.main,
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
  },
  insightIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  insightTitleContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  insightTitle: {
    ...typography.h3,
    color: colors.text.primary,
    fontWeight: "600",
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    marginLeft: spacing.sm,
  },
  highPriority: {
    backgroundColor: colors.error.main + "20",
  },
  mediumPriority: {
    backgroundColor: colors.accent + "20",
  },
  lowPriority: {
    backgroundColor: colors.success.main + "20",
  },
  priorityText: {
    ...typography.caption,
    fontWeight: "600",
    fontSize: 10,
  },
  insightDescription: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  actionsSection: {
    marginBottom: spacing.md,
  },
  actionsTitle: {
    ...typography.caption,
    color: colors.text.primary,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  actionText: {
    ...typography.caption,
    color: colors.text.secondary,
    lineHeight: 16,
    marginBottom: spacing.xs,
  },
  confidenceBar: {
    marginTop: spacing.sm,
  },
  confidenceLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  confidenceBarContainer: {
    height: 4,
    backgroundColor: colors.primary.light + "30",
    borderRadius: 2,
    overflow: "hidden",
  },
  confidenceBarFill: {
    height: "100%",
    backgroundColor: colors.primary.main,
    borderRadius: 2,
  },
  trendCard: {
    backgroundColor: colors.background.paper,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  trendHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  trendMetric: {
    ...typography.h3,
    color: colors.text.primary,
    fontWeight: "600",
  },
  trendDirection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  improving: {
    backgroundColor: colors.success.main + "20",
  },
  declining: {
    backgroundColor: colors.error.main + "20",
  },
  stable: {
    backgroundColor: colors.primary.light + "20",
  },
  trendIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  trendText: {
    ...typography.caption,
    fontWeight: "600",
  },
  trendChange: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  significanceIndicator: {
    alignSelf: "flex-start",
  },
  significanceText: {
    ...typography.caption,
    fontWeight: "500",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  highSignificance: {
    backgroundColor: colors.error.main + "20",
    color: colors.error.main,
  },
  mediumSignificance: {
    backgroundColor: colors.accent + "20",
    color: colors.accent,
  },
  lowSignificance: {
    backgroundColor: colors.success.main + "20",
    color: colors.success.main,
  },
  personalizedSection: {
    marginTop: spacing.lg,
  },
  metricCard: {
    backgroundColor: colors.background.paper,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  metricTitle: {
    ...typography.h3,
    color: colors.text.primary,
    fontWeight: "600",
    marginBottom: spacing.md,
  },
  burnoutIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  burnoutBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  burnoutFill: {
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  burnoutText: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: "600",
  },
  engagementIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  engagementBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.primary.light + "30",
    borderRadius: 4,
    overflow: "hidden",
  },
  engagementFill: {
    height: "100%",
    backgroundColor: colors.primary.main,
  },
  engagementText: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: "600",
  },
  categoriesSection: {
    marginTop: spacing.lg,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  categoryLabel: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: "500",
  },
  categoryValue: {
    ...typography.body,
    color: colors.text.secondary,
    flex: 1,
    textAlign: "right",
    marginLeft: spacing.md,
  },
});

export default UserProfileExpanded;
