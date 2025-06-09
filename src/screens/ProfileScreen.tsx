import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
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

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  // Mock user data
  const user = {
    name: "Aventurero Matemático",
    level: 2,
    experienceToNext: 150,
    currentExperience: 75,
    achievements: [
      {
        id: 1,
        title: "Primer Problema",
        description: "Resolviste tu primer problema matemático",
        icon: "🎯",
        earned: true,
      },
      {
        id: 2,
        title: "Racha de Éxitos",
        description: "5 respuestas correctas seguidas",
        icon: "🔥",
        earned: true,
      },
      {
        id: 3,
        title: "Maestro Sumador",
        description: "Resuelve 20 problemas de suma",
        icon: "➕",
        earned: false,
      },
      {
        id: 4,
        title: "Explorador Experto",
        description: "Visita todas las áreas de la mazmorra",
        icon: "🗺️",
        earned: false,
      },
    ],
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

  const progressPercentage =
    (user.currentExperience / user.experienceToNext) * 100;

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
          {/* Header con avatar */}
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <MinoMascot mood="happy" size={120} />
            </View>
            <Text style={styles.name}>{user.name}</Text>
            <View style={styles.levelContainer}>
              <Text style={styles.level}>Nivel {user.level}</Text>
              <View style={styles.experienceBar}>
                <View
                  style={[
                    styles.experienceProgress,
                    { width: `${progressPercentage}%` },
                  ]}
                />
              </View>
              <Text style={styles.experienceText}>
                {user.currentExperience} / {user.experienceToNext} XP
              </Text>
            </View>
          </View>

          {/* Estadísticas */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Tus Estadísticas</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>🏆</Text>
                <Text style={styles.statNumber}>15</Text>
                <Text style={styles.statLabel}>Problemas{"\n"}Resueltos</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>🎯</Text>
                <Text style={styles.statNumber}>80%</Text>
                <Text style={styles.statLabel}>Precisión{"\n"}Global</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>⭐</Text>
                <Text style={styles.statNumber}>36</Text>
                <Text style={styles.statLabel}>Estrellas{"\n"}Ganadas</Text>
              </View>
            </View>
          </View>

          {/* Logros */}
          <View style={styles.achievementsSection}>
            <Text style={styles.sectionTitle}>Logros Desbloqueados</Text>
            <View style={styles.achievementsGrid}>
              {user.achievements.map((achievement) => (
                <View
                  key={achievement.id}
                  style={[
                    styles.achievementCard,
                    !achievement.earned && styles.lockedAchievement,
                  ]}
                >
                  <Text
                    style={[
                      styles.achievementIcon,
                      !achievement.earned && styles.lockedIcon,
                    ]}
                  >
                    {achievement.earned ? achievement.icon : "🔒"}
                  </Text>
                  <Text
                    style={[
                      styles.achievementTitle,
                      !achievement.earned && styles.lockedText,
                    ]}
                  >
                    {achievement.title}
                  </Text>
                  <Text
                    style={[
                      styles.achievementDescription,
                      !achievement.earned && styles.lockedText,
                    ]}
                    numberOfLines={2}
                  >
                    {achievement.description}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Botones de acción */}
          <View style={styles.actionsSection}>
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

      <BottomNavBar currentScreen="profile" onNavigate={handleNavigate} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.default,
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
  },
  avatarContainer: {
    marginBottom: spacing.lg,
  },
  name: {
    ...typography.h1,
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  levelContainer: {
    alignItems: "center",
    width: "100%",
  },
  level: {
    ...typography.h2,
    color: colors.primary.main,
    marginBottom: spacing.sm,
  },
  experienceBar: {
    width: "80%",
    height: 8,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
    overflow: "hidden",
  },
  experienceProgress: {
    height: "100%",
    backgroundColor: colors.success.main,
    borderRadius: borderRadius.sm,
  },
  experienceText: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: "500",
  },
  statsSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  statsGrid: {
    flexDirection: "row",
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
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
  achievementsSection: {
    marginBottom: spacing.xl,
  },
  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  achievementCard: {
    width: "47%",
    backgroundColor: colors.background.paper,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    ...shadows.small,
    borderWidth: 2,
    borderColor: colors.success.light,
  },
  lockedAchievement: {
    backgroundColor: colors.background.secondary,
    borderColor: colors.text.light,
    opacity: 0.6,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  lockedIcon: {
    opacity: 0.5,
  },
  achievementTitle: {
    ...typography.h3,
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  achievementDescription: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 18,
  },
  lockedText: {
    color: colors.text.light,
  },
  actionsSection: {
    gap: spacing.md,
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
});

export default ProfileScreen;
