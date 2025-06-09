import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  colors,
  spacing,
  typography,
  shadows,
  borderRadius,
  animations,
  accessibility,
  getThemeForAge,
} from "../styles/theme";
import MinoMascot from "../components/MinoMascot";
import StarSystem from "../components/StarSystem";
import useAgeDetection from "../hooks/useAgeDetection";

interface WelcomeScreenProps {
  navigation: any;
  route?: any;
}

interface UserProfile {
  name: string;
  ageGroup: "kids" | "teens" | "adults" | "seniors";
  minoName: string;
  preferences: {
    highContrast: boolean;
    largeText: boolean;
    soundEnabled: boolean;
    hapticsEnabled: boolean;
  };
}

const { width, height } = Dimensions.get("window");

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  navigation,
  route,
}) => {
  // Obtener perfil del usuario del onboarding (si existe)
  const userProfile: UserProfile = route?.params?.userProfile || {
    name: "Aventurero",
    ageGroup: "adults",
    minoName: "Mino",
    preferences: {
      highContrast: false,
      largeText: false,
      soundEnabled: true,
      hapticsEnabled: true,
    },
  };

  const theme = getThemeForAge(userProfile.ageGroup);
  const [currentTime, setCurrentTime] = useState(new Date());

  // ✅ NUEVO: Hook de detección de edad y recomendaciones IA
  const {
    isDetecting,
    detectionResult,
    recommendations,
    isFirstTime,
    confidence,
    suggestedActions,
    detectAge,
  } = useAgeDetection();

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const buttonsAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación de entrada suave y natural
    Animated.stagger(200, [
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: animations.slow,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(slideUpAnim, {
          toValue: 0,
          duration: animations.normal,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          ...animations.spring.gentle,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(buttonsAnim, {
        toValue: 1,
        duration: animations.normal,
        useNativeDriver: true,
      }),
    ]).start();

    // Animación de sparkles continua
    const sparkleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    sparkleLoop.start();

    return () => sparkleLoop.stop();
  }, []);

  // ✅ EFECTO PARA DETECCIÓN AUTOMÁTICA DE EDAD
  useEffect(() => {
    const performAgeDetection = async () => {
      // Solo detectar si es primera vez o si la confianza es baja
      if (isFirstTime || (detectionResult && confidence < 0.7)) {
        console.log("🎯 Iniciando detección de edad en background...");

        // Esperar un poco para que el usuario vea la interfaz primero
        setTimeout(() => {
          detectAge();
        }, 3000);
      }
    };

    performAgeDetection();
  }, [isFirstTime, confidence, detectAge, detectionResult]);

  // ✅ MOSTRAR FEEDBACK SUTIL DE IA CUANDO ESTÁ DISPONIBLE
  const getAIEnhancedMessage = () => {
    if (detectionResult && confidence > 0.7) {
      const ageMessages = {
        kids: "¡He ajustado todo especialmente para ti! 🎨",
        teens: "Sistema optimizado para tu estilo de aprendizaje 🚀",
        adults: "IA adaptada a tu perfil de aprendizaje profesional 💼",
        seniors: "Interfaz personalizada para tu comodidad 🌟",
      };
      return ageMessages[detectionResult.predictedAgeGroup];
    }

    if (isDetecting) {
      return "Personalizando tu experiencia... 🧠";
    }

    return getMotivationalMessage();
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    const name = userProfile.name || "Aventurero";

    if (hour < 12) return `¡Buenos días, ${name}!`;
    if (hour < 18) return `¡Buenas tardes, ${name}!`;
    return `¡Buenas noches, ${name}!`;
  };

  const getMotivationalMessage = () => {
    const messages = {
      kids: [
        "¡Vamos a aprender jugando!",
        "¡Las matemáticas son súper divertidas!",
        "¡Cada problema es una nueva aventura!",
        "¡Eres increíble resolviendo problemas!",
      ],
      teens: [
        "¡Demuestra de qué estás hecho!",
        "¡Cada desafío te hace más fuerte!",
        "¡Conquista las matemáticas!",
        "¡Tu mente es poderosa!",
      ],
      adults: [
        "¡Mantén tu mente activa!",
        "¡Cada día es una oportunidad de aprender!",
        "¡Desafía tu cerebro!",
        "¡El aprendizaje nunca termina!",
      ],
      seniors: [
        "¡La experiencia es tu mayor ventaja!",
        "¡Tu sabiduría te guiará!",
        "¡Mantén tu mente ágil!",
        "¡Cada día trae nuevas posibilidades!",
      ],
    };

    const ageMessages = messages[userProfile.ageGroup];
    return ageMessages[Math.floor(Math.random() * ageMessages.length)];
  };

  const handleButtonPress = (buttonName: string, action: () => void) => {
    // Feedback háptico si está habilitado
    if (userProfile.preferences.hapticsEnabled) {
      // Aquí iría el feedback háptico: Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Animación de presión simple sin hooks
    const buttonScale = new Animated.Value(1);

    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: animations.button.duration,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: animations.button.duration,
        useNativeDriver: true,
      }),
    ]).start(() => {
      action();
    });
  };

  const handleStartAdventure = () => {
    handleButtonPress("start", () => {
      navigation.navigate("Dungeon", { userProfile });
    });
  };

  const handleContinueLearning = () => {
    handleButtonPress("continue", () => {
      navigation.navigate("Problem", {
        userProfile,
        currentScene: "entrance",
        difficulty: "easy",
        problemType: "suma",
      });
    });
  };

  const handleViewProgress = () => {
    handleButtonPress("progress", () => {
      navigation.navigate("Progress", { userProfile });
    });
  };

  const handleProfile = () => {
    handleButtonPress("profile", () => {
      navigation.navigate("Profile", { userProfile });
    });
  };

  const getButttonStyle = (primary = false) => [
    primary ? styles.primaryButton : styles.secondaryButton,
    {
      backgroundColor: primary
        ? theme.colors.primary.main
        : colors.background.paper,
      borderColor: theme.colors.primary.main,
      minHeight:
        userProfile.ageGroup === "seniors"
          ? accessibility.touchTargets.comfortable
          : accessibility.touchTargets.minimum,
    },
    userProfile.preferences.highContrast && {
      borderWidth: 3,
      borderColor: primary
        ? theme.colors.primary.dark
        : theme.colors.primary.main,
    },
  ];

  const getTextStyle = (primary = false) => [
    primary ? styles.primaryButtonText : styles.secondaryButtonText,
    {
      color: primary ? colors.text.white : theme.colors.primary.main,
      fontSize: userProfile.preferences.largeText
        ? theme.typography.buttonLarge.fontSize
        : theme.typography.button.fontSize,
      fontWeight: userProfile.preferences.largeText
        ? "700"
        : theme.typography.button.fontWeight,
    },
  ];

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: theme.colors.primary.background },
      ]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.primary.background}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Fondo decorativo suave */}
        <View
          style={[
            styles.backgroundDecoration,
            { backgroundColor: theme.colors.primary.main + "10" },
          ]}
        />

        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            },
          ]}
        >
          {/* Header personalizado */}
          <View style={styles.header}>
            <Animated.Text
              style={[
                styles.greeting,
                {
                  color: theme.colors.text.primary,
                  fontSize: userProfile.preferences.largeText
                    ? theme.typography.h1.fontSize + 4
                    : theme.typography.h2.fontSize,
                },
              ]}
            >
              {getGreeting()}
            </Animated.Text>

            <Text
              style={[
                styles.motivationalMessage,
                { color: theme.colors.text.secondary },
                isDetecting && { fontStyle: "italic" },
              ]}
            >
              {getAIEnhancedMessage()}
            </Text>

            {/* ✅ INDICADOR SUTIL DE IA TRABAJANDO */}
            {isDetecting && (
              <View style={styles.aiIndicator}>
                <Text style={styles.aiIndicatorText}>
                  🧠 IA Adaptativa Activada
                </Text>
              </View>
            )}

            {/* ✅ MOSTRAR CONFIANZA DE DETECCIÓN SI ESTÁ DISPONIBLE */}
            {detectionResult && confidence > 0.8 && (
              <View style={styles.confidenceIndicator}>
                <Text style={styles.confidenceText}>
                  ✨ Optimizado para{" "}
                  {detectionResult.predictedAgeGroup === "kids"
                    ? "niños"
                    : detectionResult.predictedAgeGroup === "teens"
                    ? "adolescentes"
                    : detectionResult.predictedAgeGroup === "adults"
                    ? "adultos"
                    : "mayores"}
                </Text>
              </View>
            )}
          </View>

          {/* Mascota con animación de sparkles */}
          <Animated.View
            style={[
              styles.mascotContainer,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.mascotWrapper}>
              <MinoMascot
                mood="happy"
                size={userProfile.ageGroup === "kids" ? 160 : 140}
              />

              {/* Sparkles animados */}
              <Animated.View
                style={[
                  styles.sparkle,
                  styles.sparkle1,
                  { opacity: sparkleAnim },
                ]}
              >
                <Text style={styles.sparkleText}>✨</Text>
              </Animated.View>
              <Animated.View
                style={[
                  styles.sparkle,
                  styles.sparkle2,
                  { opacity: sparkleAnim },
                ]}
              >
                <Text style={styles.sparkleText}>⭐</Text>
              </Animated.View>
              <Animated.View
                style={[
                  styles.sparkle,
                  styles.sparkle3,
                  { opacity: sparkleAnim },
                ]}
              >
                <Text style={styles.sparkleText}>💫</Text>
              </Animated.View>
            </View>

            {/* Mensaje de Mino personalizado */}
            <View
              style={[
                styles.speechBubble,
                { borderColor: theme.colors.primary.main + "30" },
              ]}
            >
              <Text
                style={[
                  styles.speechText,
                  {
                    color: theme.colors.text.primary,
                    fontSize: userProfile.preferences.largeText
                      ? theme.typography.bodyLarge.fontSize
                      : theme.typography.body.fontSize,
                  },
                ]}
              >
                ¡Hola {userProfile.name}! Soy {userProfile.minoName}.
                {userProfile.ageGroup === "kids" &&
                  " ¡Vamos a divertirnos con las matemáticas! 🎉"}
                {userProfile.ageGroup === "teens" &&
                  " ¿Listo para conquistar algunos desafíos? 🚀"}
                {userProfile.ageGroup === "adults" &&
                  " ¡Mantengamos tu mente activa con matemáticas! 🧠"}
                {userProfile.ageGroup === "seniors" &&
                  " ¡Tu sabiduría será tu guía en esta aventura! 🌟"}
              </Text>
            </View>
          </Animated.View>

          {/* Progreso rápido */}
          <View style={styles.quickStatsContainer}>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatNumber}>5</Text>
              <Text
                style={[
                  styles.quickStatLabel,
                  { color: theme.colors.text.secondary },
                ]}
              >
                Problemas{"\n"}Resueltos
              </Text>
            </View>
            <View style={styles.quickStat}>
              <StarSystem
                starsEarned={3}
                size="small"
                animated={false}
                showCount={false}
              />
              <Text
                style={[
                  styles.quickStatLabel,
                  { color: theme.colors.text.secondary },
                ]}
              >
                Última{"\n"}Puntuación
              </Text>
            </View>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatNumber}>2</Text>
              <Text
                style={[
                  styles.quickStatLabel,
                  { color: theme.colors.text.secondary },
                ]}
              >
                Días{"\n"}Seguidos
              </Text>
            </View>
          </View>

          {/* Botones principales - Accesibles y grandes */}
          <Animated.View
            style={[styles.buttonsContainer, { opacity: buttonsAnim }]}
          >
            {/* Botón principal - Continuar aprendiendo */}
            <Pressable
              style={getButttonStyle(true)}
              onPress={handleContinueLearning}
              android_ripple={{ color: theme.colors.primary.light }}
            >
              <Text style={getTextStyle(true)}>
                {userProfile.ageGroup === "kids"
                  ? "🎮 ¡A Jugar!"
                  : userProfile.ageGroup === "teens"
                  ? "🚀 ¡Vamos!"
                  : userProfile.ageGroup === "adults"
                  ? "📚 Continuar Aprendiendo"
                  : "🧠 Ejercitar Mente"}
              </Text>
            </Pressable>

            {/* Botones secundarios en fila */}
            <View style={styles.secondaryButtonsRow}>
              <Pressable
                style={[getButttonStyle(false), styles.halfButton]}
                onPress={handleStartAdventure}
                android_ripple={{ color: theme.colors.primary.light }}
              >
                <Text style={getTextStyle(false)}>🗺️ Explorar</Text>
              </Pressable>

              <Pressable
                style={[getButttonStyle(false), styles.halfButton]}
                onPress={handleViewProgress}
                android_ripple={{ color: theme.colors.primary.light }}
              >
                <Text style={getTextStyle(false)}>📊 Progreso</Text>
              </Pressable>
            </View>

            {/* Botón de perfil más pequeño */}
            <Pressable
              style={[
                styles.profileButton,
                { borderColor: theme.colors.text.light },
              ]}
              onPress={handleProfile}
              android_ripple={{ color: colors.text.light }}
            >
              <Text
                style={[
                  styles.profileButtonText,
                  { color: theme.colors.text.secondary },
                ]}
              >
                👤 Mi Perfil
              </Text>
            </Pressable>
          </Animated.View>

          {/* Características - Solo para adultos y seniors */}
          {(userProfile.ageGroup === "adults" ||
            userProfile.ageGroup === "seniors") && (
            <View style={styles.featuresContainer}>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>🎯</Text>
                <Text
                  style={[
                    styles.featureText,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  Adaptativo
                </Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>📈</Text>
                <Text
                  style={[
                    styles.featureText,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  Progreso Real
                </Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>🧠</Text>
                <Text
                  style={[
                    styles.featureText,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  Mente Activa
                </Text>
              </View>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: height,
  },
  backgroundDecoration: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.3,
    borderBottomLeftRadius: borderRadius.xxl,
    borderBottomRightRadius: borderRadius.xxl,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    alignItems: "center",
    paddingBottom: spacing.xl,
  },

  // Header
  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  greeting: {
    ...typography.h2,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  motivationalMessage: {
    ...typography.bodyLarge,
    textAlign: "center",
    fontWeight: "500",
    fontStyle: "italic",
  },

  // Mascota
  mascotContainer: {
    alignItems: "center",
    marginBottom: spacing.xl,
    position: "relative",
  },
  mascotWrapper: {
    position: "relative",
    alignItems: "center",
  },
  sparkle: {
    position: "absolute",
  },
  sparkle1: {
    top: 20,
    right: 20,
  },
  sparkle2: {
    top: 60,
    left: 10,
  },
  sparkle3: {
    bottom: 30,
    right: 30,
  },
  sparkleText: {
    fontSize: 20,
  },
  speechBubble: {
    backgroundColor: colors.background.paper,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginTop: spacing.lg,
    maxWidth: width * 0.85,
    borderWidth: 1,
    ...shadows.soft,
  },
  speechText: {
    ...typography.body,
    textAlign: "center",
    lineHeight: 24,
  },

  // Stats rápidas
  quickStatsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.soft,
  },
  quickStat: {
    alignItems: "center",
    flex: 1,
  },
  quickStatNumber: {
    ...typography.h1,
    color: colors.duolingo.green,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  quickStatLabel: {
    ...typography.caption,
    textAlign: "center",
    fontWeight: "500",
  },

  // Botones
  buttonsContainer: {
    width: "100%",
    paddingHorizontal: spacing.sm,
    gap: spacing.md,
  },
  primaryButton: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.medium,
  },
  primaryButtonText: {
    ...typography.button,
    fontWeight: "700",
    textAlign: "center",
  },
  secondaryButtonsRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  secondaryButton: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    ...shadows.small,
  },
  halfButton: {
    flex: 1,
  },
  secondaryButtonText: {
    ...typography.button,
    fontWeight: "600",
    textAlign: "center",
  },
  profileButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.round,
    alignItems: "center",
    backgroundColor: colors.background.paper,
    borderWidth: 1,
    alignSelf: "center",
  },
  profileButtonText: {
    ...typography.caption,
    fontWeight: "600",
  },

  // Features
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: spacing.md,
    marginTop: spacing.xl,
  },
  feature: {
    alignItems: "center",
    flex: 1,
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  featureText: {
    ...typography.caption,
    textAlign: "center",
    fontWeight: "500",
  },

  // ✅ NUEVOS ESTILOS PARA IA
  aiIndicator: {
    backgroundColor: colors.duolingo.purple + "20",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.duolingo.purple + "30",
  },
  aiIndicatorText: {
    ...typography.caption,
    color: colors.duolingo.purple,
    fontWeight: "600",
    textAlign: "center",
  },
  confidenceIndicator: {
    backgroundColor: colors.duolingo.green + "20",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.duolingo.green + "30",
  },
  confidenceText: {
    ...typography.caption,
    color: colors.duolingo.green,
    fontWeight: "600",
    textAlign: "center",
  },
});
