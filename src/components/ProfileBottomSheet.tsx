import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import { useGame } from "../contexts/GameContext";
import { useAIRecommendations } from "../hooks/useGameLoop";
import { userProgressService, SimpleUserStats } from "../services/UserProgress";
import { onboardingService } from "../services/OnboardingService";
import MinoMascot from "../components/gamification/MinoMascot";
import { useMinoMood } from "../hooks/useMinoMood";

const { width, height } = Dimensions.get("window");

interface ProfileBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onResetOnboarding: () => void;
}

const ProfileBottomSheet: React.FC<ProfileBottomSheetProps> = ({
  visible,
  onClose,
  onResetOnboarding,
}) => {
  const theme = useTheme();
  const { gameState, gameActions } = useGame();
  const { getRecommendations } = useAIRecommendations();
  const [userStats, setUserStats] = useState<SimpleUserStats | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { mood } = useMinoMood("profile");

  // Animaciones
  const slideAnim = React.useRef(new Animated.Value(height)).current;
  const backdropAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      loadUserData();
      // Animación de entrada
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
      ]).start();
    } else {
      // Animación de salida
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const [stats, profile] = await Promise.all([
        userProgressService.getUserStats(),
        onboardingService.getUserProfile(),
      ]);
      setUserStats(stats);
      setUserProfile(profile);
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const handleResetOnboarding = () => {
    Alert.alert(
      "Reiniciar Onboarding",
      "¿Estás seguro de que quieres cerrar sesión y volver al inicio? Se perderán todos tus datos.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sí, reiniciar",
          style: "destructive",
          onPress: async () => {
            try {
              await onboardingService.resetOnboarding();
              handleClose();
              setTimeout(() => {
                onResetOnboarding();
              }, 300);
            } catch (error) {
              Alert.alert("Error", "No se pudo reiniciar la sesión");
            }
          },
        },
      ]
    );
  };

  const getMascotMood = () => {
    const currentMood = gameActions.getMascotMoodForCurrentState();
    const moodMap = {
      happy: "happy" as const,
      neutral: "neutral" as const,
      sad: "sad" as const,
      super_happy: "celebrating" as const,
    };
    return moodMap[currentMood];
  };

  const getIntelligentMessage = () => {
    if (!gameState.accuracy || gameState.totalXP < 50) {
      return "¡Resuelve más problemas para obtener análisis personalizado! 🚀";
    }

    if (gameState.accuracy >= 90) {
      return "¡Eres un maestro de las matemáticas! 🏆";
    }
    if (gameState.accuracy >= 75) {
      return "Excelente precisión. ¡Sigue así! 🎯";
    }
    if (gameState.streak >= 7) {
      return `¡${gameState.streak} problemas consecutivos! 🔥`;
    }
    return "¡Sigue practicando para mejorar! 💪";
  };

  const renderStatCard = (
    title: string,
    value: string | number,
    subtitle?: string
  ) => (
    <View
      style={[
        styles.statCard,
        { backgroundColor: theme.colors.background.paper },
      ]}
    >
      <Text style={[styles.statTitle, { color: theme.colors.text.secondary }]}>
        {title}
      </Text>
      <Text style={[styles.statValue, { color: theme.colors.primary.main }]}>
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

  const renderQuickAnalysis = () => {
    const analysis = gameActions.getPerformanceAnalysis();
    const userData = gameActions.getUserData();

    if (userData.totalProblems < 5) {
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
            🔍 Análisis
          </Text>
          <Text
            style={[styles.noDataText, { color: theme.colors.text.secondary }]}
          >
            Resuelve más problemas para ver tu análisis
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
          🔍 Análisis Rápido
        </Text>
        <View style={styles.analysisRow}>
          <View
            style={[
              styles.strengthItem,
              { backgroundColor: theme.colors.success.light },
            ]}
          >
            <Text
              style={[
                styles.analysisLabel,
                { color: theme.colors.success.dark },
              ]}
            >
              💪 Fortaleza
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
              styles.strengthItem,
              { backgroundColor: theme.colors.warning.light },
            ]}
          >
            <Text
              style={[
                styles.analysisLabel,
                { color: theme.colors.warning.dark },
              ]}
            >
              🎯 Mejorar
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
      </View>
    );
  };

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} onRequestClose={handleClose}>
      {/* Backdrop */}
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: backdropAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backdropTouchable}
          activeOpacity={1}
          onPress={handleClose}
        />
      </Animated.View>

      {/* Bottom Sheet */}
      <Animated.View
        style={[
          styles.bottomSheet,
          {
            backgroundColor: theme.colors.background.default,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Handle */}
        <View style={styles.handle}>
          <View
            style={[styles.handleBar, { backgroundColor: theme.colors.border }]}
          />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <MinoMascot
              mood={mood}
              size={50}
              ageGroup="adults"
              context="profile"
              showThoughts={false}
            />
            <View style={styles.userText}>
              <Text
                style={[styles.userName, { color: theme.colors.text.primary }]}
              >
                {userProfile?.name || "Usuario"}
              </Text>
              <Text
                style={[
                  styles.userMessage,
                  { color: theme.colors.text.secondary },
                ]}
              >
                {getIntelligentMessage()}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text
              style={[
                styles.closeButtonText,
                { color: theme.colors.text.secondary },
              ]}
            >
              ✕
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {loading ? (
            <Text
              style={[
                styles.loadingText,
                { color: theme.colors.text.secondary },
              ]}
            >
              Cargando datos...
            </Text>
          ) : (
            <>
              {/* Stats Grid */}
              <View style={styles.statsGrid}>
                {renderStatCard("Nivel", gameState.level)}
                {renderStatCard(
                  "Precisión",
                  `${Math.round(gameState.accuracy)}%`
                )}
                {renderStatCard("XP Total", gameState.totalXP)}
                {renderStatCard(
                  "Racha",
                  `${gameState.streak} días`,
                  "consecutivos"
                )}
              </View>

              {/* Quick Analysis */}
              {renderQuickAnalysis()}

              {/* Recent Recommendations */}
              <View
                style={[
                  styles.recommendationsCard,
                  { backgroundColor: theme.colors.background.paper },
                ]}
              >
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  🤖 Recomendaciones
                </Text>
                {getRecommendations()
                  .slice(0, 2)
                  .map((recommendation, index) => (
                    <Text
                      key={index}
                      style={[
                        styles.recommendationText,
                        { color: theme.colors.text.primary },
                      ]}
                    >
                      • {recommendation}
                    </Text>
                  ))}
              </View>

              {/* Logout/Reset Button */}
              <TouchableOpacity
                style={[
                  styles.resetButton,
                  { backgroundColor: theme.colors.error.light },
                ]}
                onPress={handleResetOnboarding}
              >
                <Text
                  style={[
                    styles.resetButtonText,
                    { color: theme.colors.error.dark },
                  ]}
                >
                  🔄 Cerrar Sesión y Reiniciar
                </Text>
                <Text
                  style={[
                    styles.resetButtonSubtext,
                    { color: theme.colors.error.dark },
                  ]}
                >
                  Volver al onboarding inicial
                </Text>
              </TouchableOpacity>

              {/* Bottom Padding */}
              <View style={styles.bottomPadding} />
            </>
          )}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backdropTouchable: {
    flex: 1,
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
  },
  handle: {
    alignItems: "center",
    paddingVertical: 8,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  userText: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  userMessage: {
    fontSize: 14,
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 40,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    width: (width - 60) / 2,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statSubtitle: {
    fontSize: 10,
    marginTop: 2,
  },
  analysisCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  noDataText: {
    fontSize: 14,
    textAlign: "center",
  },
  analysisRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  strengthItem: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  analysisLabel: {
    fontSize: 10,
    fontWeight: "500",
    marginBottom: 4,
  },
  analysisValue: {
    fontSize: 12,
    fontWeight: "bold",
  },
  recommendationsCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  recommendationText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 18,
  },
  resetButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  resetButtonSubtext: {
    fontSize: 12,
    marginTop: 4,
  },
  bottomPadding: {
    height: 40,
  },
});

export default ProfileBottomSheet;
