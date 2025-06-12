import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MainBottomNavBar from "../components/MainBottomNavBar";
import { onboardingService } from "../services/OnboardingService";

const { width } = Dimensions.get("window");

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState("overview");

  // Datos estáticos para mostrar
  const userProgress = {
    problemsSolved: 156,
    accuracyRate: 0.84,
    totalStars: 342,
    currentStreak: 7,
  };
  const currentLevel = 8;
  const levelData = { title: "Mago Matemático" };

  // Manejar navegación de la barra inferior
  const handleBottomNavigation = (route: string) => {
    navigation.navigate(route);
  };

  // Manejar cierre de sesión
  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión y volver al inicio? Se perderán todos tus datos de progreso.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sí, cerrar sesión",
          style: "destructive",
          onPress: async () => {
            try {
              await onboardingService.resetOnboarding();
              // Resetear navegación para volver al onboarding
              navigation.reset({
                index: 0,
                routes: [{ name: "WelcomeScreen" }],
              });
            } catch (error) {
              Alert.alert("Error", "No se pudo cerrar la sesión");
            }
          },
        },
      ]
    );
  };

  const renderTabButton = (tab: string, title: string, icon: string) => (
    <TouchableOpacity
      style={[styles.tabButton, selectedTab === tab && styles.activeTabButton]}
      onPress={() => setSelectedTab(tab)}
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
      {/* Estadísticas principales */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🎯</Text>
          <Text style={styles.statValue}>
            {Math.round(userProgress.accuracyRate * 100)}%
          </Text>
          <Text style={styles.statLabel}>Precisión</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>⚡</Text>
          <Text style={styles.statValue}>18.5s</Text>
          <Text style={styles.statLabel}>Tiempo Promedio</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🔥</Text>
          <Text style={styles.statValue}>{userProgress.currentStreak}</Text>
          <Text style={styles.statLabel}>Racha Actual</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>⭐</Text>
          <Text style={styles.statValue}>{userProgress.totalStars}</Text>
          <Text style={styles.statLabel}>Estrellas</Text>
        </View>
      </View>

      {/* Progreso de nivel */}
      <View style={styles.levelProgressSection}>
        <Text style={styles.sectionTitle}>Progreso de Nivel</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "65%" }]} />
          </View>
          <Text style={styles.progressText}>650 / 1000 XP</Text>
        </View>
      </View>

      {/* Habilidades destacadas */}
      <View style={styles.skillsSection}>
        <Text style={styles.sectionTitle}>🎨 Tu Perfil de Aprendizaje</Text>

        <View style={styles.skillCard}>
          <View style={styles.skillHeader}>
            <Text style={styles.skillIcon}>🏆</Text>
            <Text style={styles.skillTitle}>Fortaleza Principal</Text>
          </View>
          <Text style={styles.skillValue}>Aritmética</Text>
          <Text style={styles.skillDescription}>
            Tu área con mejor rendimiento
          </Text>
        </View>

        <View style={styles.skillCard}>
          <View style={styles.skillHeader}>
            <Text style={styles.skillIcon}>🧠</Text>
            <Text style={styles.skillTitle}>Estilo de Aprendizaje</Text>
          </View>
          <Text style={styles.skillValue}>Visual</Text>
          <Text style={styles.skillDescription}>
            Tu forma preferida de resolver problemas
          </Text>
        </View>

        <View style={styles.skillCard}>
          <View style={styles.skillHeader}>
            <Text style={styles.skillIcon}>⏰</Text>
            <Text style={styles.skillTitle}>Momento Óptimo</Text>
          </View>
          <Text style={styles.skillValue}>Mañana</Text>
          <Text style={styles.skillDescription}>Cuando rindes mejor</Text>
        </View>

        {/* Sección de configuración */}
        <View style={styles.configSection}>
          <Text style={styles.sectionTitle}>⚙️ Configuración</Text>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutIcon}>🚪</Text>
            <View style={styles.logoutContent}>
              <Text style={styles.logoutTitle}>Cerrar Sesión</Text>
              <Text style={styles.logoutDescription}>
                Volver al onboarding inicial
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  const renderInsightsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>🧭 Insights Personalizados</Text>

      <View style={styles.insightCard}>
        <View style={styles.insightHeader}>
          <Text style={styles.insightIcon}>💪</Text>
          <View style={styles.insightTitleContainer}>
            <Text style={styles.insightTitle}>Fortaleza Identificada</Text>
            <View style={styles.priorityBadge}>
              <Text style={styles.priorityText}>ALTO</Text>
            </View>
          </View>
        </View>
        <Text style={styles.insightDescription}>
          Excelente desempeño en problemas de suma y resta. Tu velocidad ha
          mejorado 23% esta semana.
        </Text>
        <View style={styles.actionsSection}>
          <Text style={styles.actionsTitle}>💡 Acciones sugeridas:</Text>
          <Text style={styles.actionText}>
            • Intenta problemas más complejos
          </Text>
          <Text style={styles.actionText}>• Prueba multiplicaciones</Text>
        </View>
      </View>

      <View style={styles.insightCard}>
        <View style={styles.insightHeader}>
          <Text style={styles.insightIcon}>🎯</Text>
          <View style={styles.insightTitleContainer}>
            <Text style={styles.insightTitle}>Área de Mejora</Text>
            <View style={[styles.priorityBadge, styles.mediumPriority]}>
              <Text style={styles.priorityText}>MEDIO</Text>
            </View>
          </View>
        </View>
        <Text style={styles.insightDescription}>
          Los problemas de división requieren más tiempo. Considera practicar
          las tablas básicas.
        </Text>
      </View>

      <View style={styles.insightCard}>
        <View style={styles.insightHeader}>
          <Text style={styles.insightIcon}>💡</Text>
          <View style={styles.insightTitleContainer}>
            <Text style={styles.insightTitle}>Recomendación</Text>
            <View style={[styles.priorityBadge, styles.lowPriority]}>
              <Text style={styles.priorityText}>BAJO</Text>
            </View>
          </View>
        </View>
        <Text style={styles.insightDescription}>
          Intenta resolver problemas en diferentes momentos del día para
          encontrar tu horario optimal.
        </Text>
      </View>
    </ScrollView>
  );

  const renderProgressTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>📈 Tendencias de Progreso</Text>

      <View style={styles.trendCard}>
        <View style={styles.trendHeader}>
          <Text style={styles.trendMetric}>Precisión</Text>
          <View style={[styles.trendDirection, styles.improving]}>
            <Text style={styles.trendIcon}>📈</Text>
            <Text style={styles.trendText}>Mejorando</Text>
          </View>
        </View>
        <Text style={styles.trendChange}>+12.5% en la última semana</Text>
      </View>

      <View style={styles.trendCard}>
        <View style={styles.trendHeader}>
          <Text style={styles.trendMetric}>Velocidad</Text>
          <View style={[styles.trendDirection, styles.stable]}>
            <Text style={styles.trendIcon}>➡️</Text>
            <Text style={styles.trendText}>Estable</Text>
          </View>
        </View>
        <Text style={styles.trendChange}>-1.2% en la última semana</Text>
      </View>

      <View style={styles.trendCard}>
        <View style={styles.trendHeader}>
          <Text style={styles.trendMetric}>Consistencia</Text>
          <View style={[styles.trendDirection, styles.improving]}>
            <Text style={styles.trendIcon}>📈</Text>
            <Text style={styles.trendText}>Mejorando</Text>
          </View>
        </View>
        <Text style={styles.trendChange}>+8.3% en la última semana</Text>
      </View>

      {/* Métricas adicionales */}
      <View style={styles.personalizedSection}>
        <Text style={styles.sectionTitle}>🎯 Métricas Personalizadas</Text>

        <View style={styles.metricCard}>
          <Text style={styles.metricTitle}>💪 Nivel de Engagement</Text>
          <View style={styles.engagementIndicator}>
            <View style={styles.engagementBar}>
              <View style={[styles.engagementFill, { width: "78%" }]} />
            </View>
            <Text style={styles.engagementText}>78%</Text>
          </View>
        </View>

        <View style={styles.categoriesSection}>
          <Text style={styles.metricTitle}>📊 Análisis por Categorías</Text>

          <View style={styles.categoryRow}>
            <Text style={styles.categoryLabel}>💪 Más Fuertes:</Text>
            <Text style={styles.categoryValue}>Suma, Resta</Text>
          </View>

          <View style={styles.categoryRow}>
            <Text style={styles.categoryLabel}>🎯 A Mejorar:</Text>
            <Text style={styles.categoryValue}>División, Fracciones</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderAchievementsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>🏆 Logros y Reconocimientos</Text>

      <View style={styles.achievementsGrid}>
        <View style={styles.achievementCardLarge}>
          <Text style={styles.achievementIconLarge}>🎯</Text>
          <Text style={styles.achievementNameLarge}>Precisión Perfecta</Text>
          <Text style={styles.achievementDescLarge}>
            100% en 5 problemas seguidos
          </Text>
        </View>

        <View style={styles.achievementCardLarge}>
          <Text style={styles.achievementIconLarge}>⚡</Text>
          <Text style={styles.achievementNameLarge}>Velocidad Relámpago</Text>
          <Text style={styles.achievementDescLarge}>
            Resolver en menos de 10s
          </Text>
        </View>

        <View style={styles.achievementCardLarge}>
          <Text style={styles.achievementIconLarge}>🔥</Text>
          <Text style={styles.achievementNameLarge}>Racha Semanal</Text>
          <Text style={styles.achievementDescLarge}>7 días consecutivos</Text>
        </View>

        <View style={[styles.achievementCardLarge, styles.achievementLocked]}>
          <Text style={styles.achievementIconLarge}>🔒</Text>
          <Text style={styles.achievementNameLarge}>Racha Legendaria</Text>
          <Text style={styles.achievementDescLarge}>
            Mantener 30 días seguidos
          </Text>
        </View>

        <View style={[styles.achievementCardLarge, styles.achievementLocked]}>
          <Text style={styles.achievementIconLarge}>🔒</Text>
          <Text style={styles.achievementNameLarge}>Maestro Matemático</Text>
          <Text style={styles.achievementDescLarge}>
            Completar 1000 problemas
          </Text>
        </View>
      </View>
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      <View style={styles.container}>
        {/* Header con avatar y información básica */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>🧙‍♂️</Text>
            </View>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>Nv.{currentLevel}</Text>
            </View>
          </View>

          <View style={styles.basicInfo}>
            <Text style={styles.name}>Aventurero Matemático</Text>
            <Text style={styles.levelTitle}>{levelData.title}</Text>
            <Text style={styles.subtitle}>
              {userProgress.problemsSolved} problemas resueltos
            </Text>
          </View>
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

        {/* Bottom Navigation */}
        <MainBottomNavBar
          currentScreen="profile"
          onNavigate={handleBottomNavigation}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 40,
  },
  levelBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: "#007AFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  levelBadgeText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12,
  },
  basicInfo: {
    alignItems: "center",
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1D1D1F",
    textAlign: "center",
    marginBottom: 4,
  },
  levelTitle: {
    fontSize: 16,
    color: "#007AFF",
    textAlign: "center",
    marginBottom: 4,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTabButton: {
    borderBottomColor: "#007AFF",
  },
  tabIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  tabText: {
    fontSize: 11,
    color: "#8E8E93",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    width: (width - 44) / 2,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#007AFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#8E8E93",
    textAlign: "center",
  },
  levelProgressSection: {
    marginBottom: 16,
  },
  progressContainer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E5E5EA",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#8E8E93",
    textAlign: "center",
  },
  skillsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 16,
  },
  skillCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  skillHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  skillIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  skillTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D1D1F",
  },
  skillValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
    marginBottom: 4,
  },
  skillDescription: {
    fontSize: 12,
    color: "#8E8E93",
  },
  insightCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#34C759",
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  insightIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  insightTitleContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D1D1F",
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    marginLeft: 8,
    backgroundColor: "#FF3B30",
  },
  mediumPriority: {
    backgroundColor: "#FF9500",
  },
  lowPriority: {
    backgroundColor: "#34C759",
  },
  priorityText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  insightDescription: {
    fontSize: 14,
    color: "#8E8E93",
    lineHeight: 20,
    marginBottom: 12,
  },
  actionsSection: {
    marginBottom: 8,
  },
  actionsTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: "#8E8E93",
    lineHeight: 16,
    marginBottom: 4,
  },
  trendCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  trendHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  trendMetric: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D1D1F",
  },
  trendDirection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  improving: {
    backgroundColor: "#34C759",
  },
  stable: {
    backgroundColor: "#8E8E93",
  },
  trendIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  trendChange: {
    fontSize: 14,
    color: "#8E8E93",
  },
  personalizedSection: {
    marginTop: 16,
  },
  metricCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  metricTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 12,
  },
  engagementIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  engagementBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#E5E5EA",
    borderRadius: 4,
    overflow: "hidden",
  },
  engagementFill: {
    height: "100%",
    backgroundColor: "#007AFF",
  },
  engagementText: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "600",
  },
  categoriesSection: {
    marginTop: 8,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  categoryLabel: {
    fontSize: 14,
    color: "#1D1D1F",
    fontWeight: "500",
  },
  categoryValue: {
    fontSize: 14,
    color: "#8E8E93",
    flex: 1,
    textAlign: "right",
  },
  achievementsGrid: {
    gap: 12,
  },
  achievementCardLarge: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  achievementLocked: {
    opacity: 0.5,
  },
  achievementIconLarge: {
    fontSize: 36,
    marginBottom: 8,
  },
  achievementNameLarge: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 4,
    textAlign: "center",
  },
  achievementDescLarge: {
    fontSize: 12,
    color: "#8E8E93",
    textAlign: "center",
  },
  navigationSection: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  primaryButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
  configSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  logoutButton: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#FF3B30",
  },
  logoutIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  logoutContent: {
    flex: 1,
  },
  logoutTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 4,
  },
  logoutDescription: {
    fontSize: 12,
    color: "#8E8E93",
  },
});

export default ProfileScreen;
