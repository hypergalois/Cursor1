import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import {
  colors,
  spacing,
  typography,
  shadows,
  borderRadius,
} from "../styles/theme";
import MinoMascot from "../components/MinoMascot";

interface OnboardingScreenProps {
  navigation: any;
}

const { width } = Dimensions.get("window");

const onboardingSteps = [
  {
    title: "¡Bienvenido aventurero!",
    description:
      "Soy Mino, tu guía en esta increíble aventura matemática. Juntos exploraremos una mazmorra llena de desafíos.",
    mascotMood: "happy" as const,
    icon: "👋",
  },
  {
    title: "Explora la Mazmorra",
    description:
      "Elige tu camino y resuelve problemas matemáticos para avanzar. Cada decisión te llevará a nuevos desafíos.",
    mascotMood: "neutral" as const,
    icon: "🗺️",
  },
  {
    title: "Gana Estrellas y Sube de Nivel",
    description:
      "Por cada problema resuelto correctamente ganarás estrellas y XP. ¡Conviértete en el mejor matemático!",
    mascotMood: "happy" as const,
    icon: "⭐",
  },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  navigation,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigation.navigate("Welcome");
    }
  };

  const handleSkip = () => {
    navigation.navigate("Welcome");
  };

  const currentStepData = onboardingSteps[currentStep];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Saltar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.stepIcon}>{currentStepData.icon}</Text>
        </View>

        <View style={styles.mascotContainer}>
          <MinoMascot mood={currentStepData.mascotMood} size={180} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{currentStepData.title}</Text>
          <Text style={styles.description}>{currentStepData.description}</Text>
        </View>

        <View style={styles.indicatorsContainer}>
          {onboardingSteps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentStep && styles.activeIndicator,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentStep === onboardingSteps.length - 1
              ? "¡Comenzar!"
              : "Siguiente"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  skipButton: {
    padding: spacing.sm,
  },
  skipText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconContainer: {
    alignItems: "center",
    marginTop: spacing.lg,
  },
  stepIcon: {
    fontSize: 64,
  },
  mascotContainer: {
    alignItems: "center",
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 24,
  },
  indicatorsContainer: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.text.secondary + "40",
  },
  activeIndicator: {
    backgroundColor: colors.primary.main,
    width: 24,
  },
  nextButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl * 2,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.xl,
    ...shadows.medium,
  },
  nextButtonText: {
    ...typography.h2,
    color: colors.background.paper,
  },
});

export default OnboardingScreen;
