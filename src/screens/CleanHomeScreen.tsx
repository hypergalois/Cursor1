// CleanHomeScreen - Pantalla principal minimalista tipo Duolingo
// Un gran botón para practicar + información esencial

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import MinoMascot from "../components/gamification/MinoMascot";

import { userProgressService, SimpleUserStats } from "../services/UserProgress";
import { useGameLoop } from "../hooks/useGameLoop";
import { dailyStreakService } from "../services/DailyStreakService";
import { onboardingService, UserProfile } from "../services/OnboardingService";
import { useMinoMood } from "../hooks/useMinoMood";
import MainBottomNavBar from "../components/MainBottomNavBar";

const { width, height } = Dimensions.get("window");

interface CleanHomeScreenProps {
  navigation: any;
  route?: {
    params?: {
      userName?: string;
      ageGroup?: "kids" | "teens" | "adults" | "seniors";
      largeText?: boolean;
    };
  };
}

const CleanHomeScreen: React.FC<CleanHomeScreenProps> = ({
  navigation,
  route,
}) => {
  const theme = useTheme();
  const [gameState, gameActions] = useGameLoop();
  const { mood } = useMinoMood("welcome");
  const [userStats, setUserStats] = useState<SimpleUserStats | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userName, setUserName] = useState("Usuario");
  const [ageGroup, setAgeGroup] = useState<
    "kids" | "teens" | "adults" | "seniors"
  >("adults");

  // Cargar datos del usuario
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const stats = await userProgressService.getUserStats();
      setUserStats(stats);

      // Cargar perfil del onboarding
      const profile = await onboardingService.getUserProfile();
      setUserProfile(profile);

      // Usar datos del perfil del onboarding si están disponibles
      if (profile?.name) {
        setUserName(profile.name);
      } else if (route?.params?.userName) {
        setUserName(route?.params.userName);
      }

      // Inferir grupo de edad basado en configuración de accesibilidad o params
      if (profile?.accessibility?.textSize === "large") {
        setAgeGroup("seniors");
      } else if (route?.params?.ageGroup) {
        setAgeGroup(route?.params.ageGroup);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  // Obtener saludo según la hora del día
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "¡Buenos días";
    if (hour < 18) return "¡Buenas tardes";
    return "¡Buenas noches";
  };

  // Obtener mensaje motivacional basado en racha diaria
  const getMotivationalMessage = () => {
    const dailyStreak = gameState.dailyStreak;

    if (dailyStreak >= 30) {
      return `¡${dailyStreak} días seguidos! ¡Increíble! 🏆`;
    }
    if (dailyStreak >= 14) {
      return `¡${dailyStreak} días seguidos! ¡Imparable! 🔥`;
    }
    if (dailyStreak >= 7) {
      return `¡${dailyStreak} días seguidos! ¡Una semana! ⚡`;
    }
    if (dailyStreak >= 3) {
      return `${dailyStreak} días de racha. ¡Sigue así! ⭐`;
    }
    if (dailyStreak >= 1) {
      return `Racha de ${dailyStreak} día${dailyStreak > 1 ? "s" : ""}`;
    }
    return "Empecemos una nueva racha";
  };

  // Navegar a problema
  const handleStartPractice = () => {
    navigation.navigate("FocusedProblem");
  };

  // Navegar al perfil
  const handleShowProfile = () => {
    navigation.navigate("ProfileScreen");
  };

  // Manejar navegación de la barra inferior
  const handleBottomNavigation = (route: string) => {
    navigation.navigate(route);
  };

  // Manejar reset de onboarding
  const handleResetOnboarding = () => {
    // Resetear navegación para volver al onboarding
    navigation.reset({
      index: 0,
      routes: [{ name: "WelcomeScreen" }],
    });
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.default },
      ]}
    >
      <StatusBar
        backgroundColor={theme.colors.background.default}
        barStyle="dark-content"
      />

      {/* Header con saludo y racha */}
      <View style={styles.header}>
        <View style={styles.greetingContainer}>
          <Text style={[styles.greeting, { color: theme.colors.text.primary }]}>
            {getGreeting()}, {userName}! 👋
          </Text>
          <Text style={[styles.streak, { color: theme.colors.text.secondary }]}>
            {getMotivationalMessage()}
          </Text>
        </View>

        {/* Botón de perfil - ahora abre bottom sheet */}
        <TouchableOpacity
          style={[
            styles.profileButton,
            { backgroundColor: theme.colors.background.paper },
          ]}
          onPress={handleShowProfile}
        >
          <Text style={styles.profileIcon}>
            {userProfile?.profilePicture === "mascot" ? "🤖" : "👤"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contenido central */}
      <View style={styles.centerContent}>
        {/* Mascota */}
        <View style={styles.mascotContainer}>
          <MinoMascot
            mood={mood}
            size={140}
            ageGroup={ageGroup}
            context="welcome"
            showThoughts={false}
          />
        </View>

        {/* Barra de progreso de nivel */}
        {userStats && (
          <View style={styles.levelContainer}>
            <Text
              style={[styles.levelText, { color: theme.colors.text.secondary }]}
            >
              Nivel {userStats.level}
            </Text>
            <View
              style={[
                styles.progressBar,
                { backgroundColor: theme.colors.border },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: theme.colors.primary.main,
                    width: `${((userStats.totalXP % 100) / 100) * 100}%`,
                  },
                ]}
              />
            </View>
            <Text
              style={[styles.xpText, { color: theme.colors.text.secondary }]}
            >
              {userStats.totalXP % 100}/100 XP
            </Text>
          </View>
        )}

        {/* Gran botón principal */}
        <TouchableOpacity
          style={[
            styles.practiceButton,
            { backgroundColor: theme.colors.primary.main },
          ]}
          onPress={handleStartPractice}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.practiceButtonText,
              { color: theme.colors.primary.contrastText },
            ]}
          >
            Practicar Matemáticas
          </Text>
          <Text
            style={[
              styles.practiceButtonSubtext,
              { color: theme.colors.primary.contrastText },
            ]}
          >
            ¡Resuelve problemas y gana XP! 🚀
          </Text>
        </TouchableOpacity>

        {/* Objetivo de aprendizaje del usuario */}
        {userProfile?.learningGoal && (
          <View
            style={[
              styles.goalCard,
              { backgroundColor: theme.colors.primary.light },
            ]}
          >
            <Text
              style={[styles.goalText, { color: theme.colors.primary.dark }]}
            >
              {userProfile.learningGoal === "academic" &&
                "🎓 Objetivo: Éxito Académico"}
              {userProfile.learningGoal === "hobby" &&
                "❤️ Objetivo: Interés Personal"}
              {userProfile.learningGoal === "career" &&
                "💼 Objetivo: Desarrollo Profesional"}
            </Text>
          </View>
        )}

        {/* Estadísticas rápidas */}
        {userStats && userStats.totalProblems > 0 && (
          <View style={styles.quickStats}>
            <View
              style={[
                styles.statCard,
                { backgroundColor: theme.colors.background.paper },
              ]}
            >
              <Text
                style={[
                  styles.statNumber,
                  { color: theme.colors.primary.main },
                ]}
              >
                {userStats.totalProblems}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.text.secondary },
                ]}
              >
                Problemas
              </Text>
            </View>

            <View
              style={[
                styles.statCard,
                { backgroundColor: theme.colors.background.paper },
              ]}
            >
              <Text
                style={[
                  styles.statNumber,
                  { color: theme.colors.success.main },
                ]}
              >
                {Math.round(userStats.accuracy)}%
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.text.secondary },
                ]}
              >
                Precisión
              </Text>
            </View>

            <View
              style={[
                styles.statCard,
                { backgroundColor: theme.colors.background.paper },
              ]}
            >
              <Text
                style={[
                  styles.statNumber,
                  { color: theme.colors.warning.main },
                ]}
              >
                {gameState.longestStreak}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.text.secondary },
                ]}
              >
                Mejor racha
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Footer minimalista - ahora abre bottom sheet */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={handleShowProfile}
        >
          <Text
            style={[
              styles.footerButtonText,
              { color: theme.colors.text.secondary },
            ]}
          >
            Ver perfil completo
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <MainBottomNavBar
        currentScreen="home"
        onNavigate={handleBottomNavigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  streak: {
    fontSize: 16,
    opacity: 0.8,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
  },
  profileIcon: {
    fontSize: 20,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  mascotContainer: {
    marginBottom: 32,
  },
  levelContainer: {
    width: "80%",
    alignItems: "center",
    marginBottom: 40,
  },
  levelText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  progressBar: {
    width: "100%",
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressFill: {
    height: "100%",
    borderRadius: 6,
  },
  xpText: {
    fontSize: 14,
    opacity: 0.8,
  },
  practiceButton: {
    width: "90%",
    paddingVertical: 24,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  practiceButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  practiceButtonSubtext: {
    fontSize: 16,
    opacity: 0.9,
  },
  quickStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 16,
  },
  statCard: {
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 80,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  footerButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  footerButtonText: {
    fontSize: 16,
    textDecorationLine: "underline",
  },
  goalCard: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  goalText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default CleanHomeScreen;
