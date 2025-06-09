import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  colors,
  spacing,
  typography,
  shadows,
  borderRadius,
  animations,
} from "../styles/theme";
import MinoMascot from "../components/MinoMascot";

interface WelcomeScreenProps {
  navigation: any;
}

const { width, height } = Dimensions.get("window");

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Secuencia de animaciones de entrada
    Animated.sequence([
      // Fade in general
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Mascota aparece con escala
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          ...animations.spring,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Botones aparecen
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleStartAdventure = () => {
    // Animación de presión
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate("Dungeon");
    });
  };

  const handleSettings = () => {
    navigation.navigate("Profile");
  };

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
        {/* Fondo decorativo */}
        <View style={styles.backgroundDecoration} />

        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Título principal */}
          <View style={styles.titleContainer}>
            <Text style={styles.welcomeText}>¡Bienvenido a</Text>
            <Text style={styles.appTitle}>MINOTAURO</Text>
            <Text style={styles.subtitle}>Aventuras Matemáticas</Text>
          </View>

          {/* Mascota animada */}
          <Animated.View
            style={[
              styles.mascotContainer,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <MinoMascot mood="happy" size={180} />
            <View style={styles.speechBubble}>
              <Text style={styles.speechText}>
                ¡Hola! Soy Mino, tu guía en esta aventura matemática. ¿Estás
                listo para explorar la mazmorra? 🏰
              </Text>
            </View>
          </Animated.View>

          {/* Botones principales */}
          <Animated.View
            style={[styles.buttonsContainer, { opacity: buttonAnim }]}
          >
            <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
              <TouchableOpacity
                style={styles.startButton}
                onPress={handleStartAdventure}
                activeOpacity={0.8}
              >
                <Text style={styles.startButtonText}>🚀 Comenzar Aventura</Text>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleSettings}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>👤 Mi Perfil</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Indicadores de características */}
          <View style={styles.featuresContainer}>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🧮</Text>
              <Text style={styles.featureText} numberOfLines={2}>
                Matemáticas{"\n"}Divertidas
              </Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>⭐</Text>
              <Text style={styles.featureText} numberOfLines={2}>
                Gana{"\n"}Estrellas
              </Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🏆</Text>
              <Text style={styles.featureText} numberOfLines={2}>
                Desbloquea{"\n"}Logros
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
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
    minHeight: height,
  },
  backgroundDecoration: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
    backgroundColor: colors.primary.light,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    alignItems: "center",
    paddingBottom: spacing.xl,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  welcomeText: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: "900",
    color: colors.primary.main,
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: spacing.xs,
    letterSpacing: 2,
  },
  subtitle: {
    ...typography.bodyLarge,
    color: colors.text.secondary,
    fontWeight: "500",
  },
  mascotContainer: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  speechBubble: {
    backgroundColor: colors.background.paper,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginTop: spacing.lg,
    maxWidth: width * 0.85,
    ...shadows.medium,
  },
  speechText: {
    ...typography.body,
    color: colors.text.primary,
    textAlign: "center",
    lineHeight: 24,
  },
  buttonsContainer: {
    width: "100%",
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  startButton: {
    backgroundColor: colors.success.main,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.md,
    ...shadows.large,
  },
  startButtonText: {
    ...typography.h2,
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
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  feature: {
    alignItems: "center",
    flex: 1,
    maxWidth: 80,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  featureText: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: "center",
    fontWeight: "500",
  },
});
