import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  colors,
  spacing,
  typography,
  shadows,
  borderRadius,
} from "../styles/theme";
import { BottomNavBar } from "../components/BottomNavBar";
import MinoMascot from "../components/MinoMascot";
import { UserProfileExpanded } from "../components/UserProfileExpanded";
import { LearningInsights } from "../components/LearningInsights";
import StarSystem from "../components/StarSystem";
import LevelProgression, {
  getLevelData,
  useLevelProgression,
} from "../components/LevelProgression";
import AchievementSystem, {
  generateDefaultAchievements,
} from "../components/AchievementSystem";
import UserProgressService from "../services/UserProgress";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [userProgress, setUserProgress] = useState<any>(null);
  const [showExpandedProfile, setShowExpandedProfile] = useState(false);
  const [achievements, setAchievements] = useState(() =>
    generateDefaultAchievements()
  );
  const [isLoading, setIsLoading] = useState(true);
  // ✅ NUEVO: Estado para perfil de usuario y insights
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showInsights, setShowInsights] = useState(false);

  // Sistema de progresión de nivel
  const { totalXP, currentLevel, getLevelProgress } = useLevelProgression(
    userProgress?.totalXP || 0
  );

  useEffect(() => {
    loadUserProgress();
    loadUserProfile();
  }, []);

  // ✅ NUEVO: Cargar perfil de usuario para LearningInsights
  const loadUserProfile = async () => {
    try {
      const profileData = await AsyncStorage.getItem("userProfile");
      if (profileData) {
        const profile = JSON.parse(profileData);
        setUserProfile(profile);
        console.log("📊 Perfil cargado para insights:", profile.ageGroup);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  const loadUserProgress = async () => {
    try {
      setIsLoading(true);
      const progressService = UserProgressService.getInstance();
      const stats = await progressService.getUserStats();

      if (stats) {
        // Convertir UserStats a formato compatible
        const progress = {
          totalXP: stats.totalXp,
          totalStars: Math.floor(stats.totalXp / 10), // Estimación de estrellas
          currentLevel: stats.currentLevel,
          problemsSolved: stats.totalProblems,
          accuracyRate:
            stats.totalProblems > 0
              ? stats.totalCorrect / stats.totalProblems
              : 0,
          currentStreak: stats.streak,
        };
        setUserProgress(progress);
      } else {
        // Crear progreso inicial básico
        const initialProgress = {
          totalXP: 0,
          totalStars: 0,
          currentLevel: 1,
          problemsSolved: 0,
          accuracyRate: 0,
          currentStreak: 0,
        };
        setUserProgress(initialProgress);
      }
    } catch (error) {
      console.error("Error loading user progress:", error);
      // Fallback en caso de error
      const fallbackProgress = {
        totalXP: 0,
        totalStars: 0,
        currentLevel: 1,
        problemsSolved: 0,
        accuracyRate: 0,
        currentStreak: 0,
      };
      setUserProgress(fallbackProgress);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (screen: string) => {
    switch (screen) {
      case "home":
        navigation.navigate("Welcome");
        break;
      case "progress":
        navigation.navigate("Progress");
        break;
      case "profile":
        // Ya estamos en profile
        break;
    }
  };

  const handleBackToHome = () => {
    navigation.navigate("Welcome");
  };

  const levelProgress = getLevelProgress();
  const levelData = getLevelData(currentLevel);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <MinoMascot mood="neutral" size={100} />
          <Text style={styles.loadingText}>Cargando tu perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.background.default}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <View style={styles.content}>
          {/* Header con avatar y información básica */}
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <MinoMascot mood="happy" size={120} />
              <View style={styles.levelBadge}>
                <Text style={styles.levelBadgeText}>Nv.{currentLevel}</Text>
              </View>
            </View>

            <View style={styles.basicInfo}>
              <Text style={styles.name}>Aventurero Matemático</Text>
              <Text style={styles.levelTitle}>{levelData.title}</Text>
              <Text style={styles.subtitle}>
                {userProgress?.problemsSolved || 0} problemas resueltos
              </Text>
            </View>
          </View>

          {/* Progresión de nivel integrada */}
          <View style={styles.levelSection}>
            <LevelProgression
              currentXP={levelProgress.currentXP}
              level={currentLevel}
              animated={true}
              showDetails={false}
            />
          </View>

          {/* Estadísticas rápidas */}
          <View style={styles.quickStatsSection}>
            <Text style={styles.sectionTitle}>🎯 Resumen Rápido</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>🏆</Text>
                <Text style={styles.statNumber}>
                  {userProgress?.problemsSolved || 0}
                </Text>
                <Text style={styles.statLabel}>Problemas{"\n"}Resueltos</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>🎯</Text>
                <Text style={styles.statNumber}>
                  {Math.round((userProgress?.accuracyRate || 0) * 100)}%
                </Text>
                <Text style={styles.statLabel}>Precisión{"\n"}Global</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>⭐</Text>
                <Text style={styles.statNumber}>
                  {userProgress?.totalStars || 0}
                </Text>
                <Text style={styles.statLabel}>Estrellas{"\n"}Ganadas</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>🔥</Text>
                <Text style={styles.statNumber}>
                  {userProgress?.currentStreak || 0}
                </Text>
                <Text style={styles.statLabel}>Racha{"\n"}Actual</Text>
              </View>
            </View>
          </View>

          {/* ✅ NUEVO: Sección de Learning Insights */}
          {userProfile && (
            <View style={styles.insightsPreview}>
              <View style={styles.achievementsHeader}>
                <Text style={styles.sectionTitle}>🧠 Insights de IA</Text>
                <TouchableOpacity onPress={() => setShowInsights(true)}>
                  <Text style={styles.viewAllText}>Ver análisis →</Text>
                </TouchableOpacity>
              </View>
              <LearningInsights
                userId="current_user"
                userProfile={userProfile}
                compact={true}
              />
            </View>
          )}

          {/* Logros recientes - Vista compacta */}
          <View style={styles.achievementsPreview}>
            <View style={styles.achievementsHeader}>
              <Text style={styles.sectionTitle}>🏆 Logros</Text>
              <TouchableOpacity onPress={() => setShowExpandedProfile(true)}>
                <Text style={styles.viewAllText}>Ver todos →</Text>
              </TouchableOpacity>
            </View>
            <AchievementSystem
              achievements={achievements.slice(0, 4)}
              compact={true}
              showUnlockedOnly={false}
            />
          </View>

          {/* Botones de acción */}
          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={styles.expandedProfileButton}
              onPress={() => setShowExpandedProfile(true)}
            >
              <Text style={styles.expandedProfileButtonText}>
                📊 Ver Perfil Completo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleBackToHome}
            >
              <Text style={styles.primaryButtonText}>🏠 Volver al Inicio</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>⚙️ Configuración</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modal de perfil expandido */}
      <Modal
        visible={showExpandedProfile}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowExpandedProfile(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>📊 Perfil Completo</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowExpandedProfile(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <UserProfileExpanded
            userId="current_user"
            onClose={() => setShowExpandedProfile(false)}
          />
        </SafeAreaView>
      </Modal>

      {/* ✅ NUEVO: Modal de Learning Insights completo */}
      <Modal
        visible={showInsights}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowInsights(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>🧠 Análisis de IA Completo</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowInsights(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {userProfile && (
            <LearningInsights
              userId="current_user"
              userProfile={userProfile}
              compact={false}
            />
          )}
        </SafeAreaView>
      </Modal>

      <BottomNavBar currentScreen="profile" onNavigate={handleNavigate} />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: spacing.lg,
  },
  levelBadge: {
    position: "absolute",
    bottom: -spacing.xs,
    right: -spacing.xs,
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    borderWidth: 2,
    borderColor: colors.background.paper,
  },
  levelBadgeText: {
    ...typography.caption,
    color: colors.background.paper,
    fontWeight: "700",
    fontSize: 12,
  },
  basicInfo: {
    alignItems: "center",
  },
  name: {
    ...typography.h1,
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  levelTitle: {
    ...typography.h3,
    color: colors.primary.main,
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: "center",
  },
  levelSection: {
    marginBottom: spacing.xl,
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.small,
  },
  quickStatsSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: colors.background.paper,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    ...shadows.medium,
    borderWidth: 1,
    borderColor: colors.primary.light,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  statNumber: {
    ...typography.h1,
    color: colors.primary.main,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: "center",
    fontWeight: "500",
  },
  // ✅ NUEVO: Estilo para insights preview
  insightsPreview: {
    marginBottom: spacing.xl,
    backgroundColor: colors.background.paper,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.small,
  },
  achievementsPreview: {
    marginBottom: spacing.xl,
    backgroundColor: colors.background.paper,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.small,
  },
  achievementsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  viewAllText: {
    ...typography.body,
    color: colors.primary.main,
    fontWeight: "600",
  },
  actionsSection: {
    gap: spacing.md,
  },
  expandedProfileButton: {
    backgroundColor: colors.text.accent + "20",
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    borderColor: colors.text.accent,
    ...shadows.small,
  },
  expandedProfileButtonText: {
    ...typography.h3,
    color: colors.text.accent,
    textAlign: "center",
    fontWeight: "600",
  },
  primaryButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
    ...shadows.medium,
  },
  primaryButtonText: {
    ...typography.h3,
    color: colors.background.paper,
    textAlign: "center",
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: colors.background.paper,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.primary.light,
    ...shadows.small,
  },
  secondaryButtonText: {
    ...typography.body,
    color: colors.primary.main,
    textAlign: "center",
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: colors.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary.light + "30",
    ...shadows.small,
  },
  modalTitle: {
    ...typography.h2,
    color: colors.text.primary,
    fontWeight: "600",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.text.light + "20",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    ...typography.h3,
    color: colors.text.secondary,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
