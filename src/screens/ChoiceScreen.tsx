import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
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

interface ChoiceScreenProps {
  navigation: any;
  route?: any;
}

interface ChoiceOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: "easy" | "medium" | "hard";
  scene: string;
  problemType: string;
}

const { width } = Dimensions.get("window");

export const ChoiceScreen: React.FC<ChoiceScreenProps> = ({
  navigation,
  route,
}) => {
  const {
    currentLevel = 1,
    currentScene = "entrance",
    problemsInSession = 1,
  } = route?.params || {};

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideLeftAnim = useRef(new Animated.Value(-50)).current;
  const slideRightAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  // Escenas y opciones dinámicas basadas en el nivel
  const getSceneData = () => {
    const scenes = {
      entrance: {
        title: "🏰 Entrada de la Mazmorra",
        description:
          "Te encuentras frente a dos caminos misteriosos. ¿Cuál eliges para comenzar tu aventura?",
        background: "🌫️",
        choices: [
          {
            id: "left",
            title: "Puerta Dorada",
            description:
              "Una puerta brillante con símbolos matemáticos grabados",
            icon: "🚪✨",
            difficulty: "easy" as const,
            scene: "golden_room",
            problemType: "suma",
          },
          {
            id: "right",
            title: "Túnel Misterioso",
            description: "Un pasaje oscuro con ecos de números susurrantes",
            icon: "🌀🔢",
            difficulty: "medium" as const,
            scene: "mystery_tunnel",
            problemType: "resta",
          },
        ],
      },
      golden_room: {
        title: "✨ Sala Dorada",
        description:
          "Has entrado en una sala resplandeciente. Dos escaleras te llevan a diferentes desafíos.",
        background: "⭐",
        choices: [
          {
            id: "stairs_up",
            title: "Escaleras Hacia Arriba",
            description:
              "Suben hacia una torre con problemas de multiplicación",
            icon: "⬆️🏗️",
            difficulty: "medium" as const,
            scene: "tower",
            problemType: "multiplicacion",
          },
          {
            id: "stairs_down",
            title: "Escaleras Hacia Abajo",
            description: "Bajan hacia una cueva con tesoros matemáticos",
            icon: "⬇️💎",
            difficulty: "easy" as const,
            scene: "treasure_cave",
            problemType: "suma",
          },
        ],
      },
      mystery_tunnel: {
        title: "🌀 Túnel Misterioso",
        description:
          "El túnel se divide en dos caminos. Cada uno tiene un aura diferente.",
        background: "🔮",
        choices: [
          {
            id: "fire_path",
            title: "Sendero de Fuego",
            description: "Un camino ardiente con desafíos de división",
            icon: "🔥🧮",
            difficulty: "hard" as const,
            scene: "fire_chamber",
            problemType: "division",
          },
          {
            id: "ice_path",
            title: "Sendero de Hielo",
            description: "Un camino helado con problemas refrescantes",
            icon: "❄️📐",
            difficulty: "medium" as const,
            scene: "ice_chamber",
            problemType: "resta",
          },
        ],
      },
    };

    return scenes[currentScene as keyof typeof scenes] || scenes.entrance;
  };

  const sceneData = getSceneData();

  useEffect(() => {
    // Animaciones de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        ...animations.spring,
        useNativeDriver: true,
      }),
      Animated.timing(slideLeftAnim, {
        toValue: 0,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideRightAnim, {
        toValue: 0,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleChoiceSelect = (choice: ChoiceOption) => {
    if (selectedChoice) return;

    setSelectedChoice(choice.id);

    // Animación de selección
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Navegar al problema después de la animación
      setTimeout(() => {
        navigation.navigate("Problem", {
          problemType: choice.problemType,
          difficulty: choice.difficulty,
          nextScene: choice.scene,
          currentLevel: currentLevel + 1,
          currentScene: choice.scene,
          problemsInSession,
        });
      }, 500);
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return colors.success.main;
      case "medium":
        return colors.gold;
      case "hard":
        return colors.error.main;
      default:
        return colors.primary.main;
    }
  };

  const getDifficultyStars = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "⭐";
      case "medium":
        return "⭐⭐";
      case "hard":
        return "⭐⭐⭐";
      default:
        return "⭐";
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.background.default}
      />

      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Fondo decorativo */}
        <View style={styles.backgroundDecoration}>
          <Text style={styles.backgroundIcon}>{sceneData.background}</Text>
        </View>

        {/* Header de la escena */}
        <Animated.View
          style={[styles.sceneHeader, { transform: [{ scale: scaleAnim }] }]}
        >
          <Text style={styles.sceneTitle}>{sceneData.title}</Text>
          <Text style={styles.sceneDescription}>{sceneData.description}</Text>
        </Animated.View>

        {/* Mascota guía */}
        <View style={styles.mascotContainer}>
          <MinoMascot mood="neutral" size={100} />
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>
              ¡Elige sabiamente, aventurero! Cada camino te llevará a un desafío
              diferente.
            </Text>
          </View>
        </View>

        {/* Opciones de elección */}
        <View style={styles.choicesContainer}>
          <Animated.View style={{ transform: [{ translateX: slideLeftAnim }] }}>
            <TouchableOpacity
              style={[
                styles.choiceCard,
                selectedChoice === sceneData.choices[0].id &&
                  styles.selectedChoice,
              ]}
              onPress={() => handleChoiceSelect(sceneData.choices[0])}
              activeOpacity={0.8}
              disabled={selectedChoice !== null}
            >
              <View style={styles.choiceHeader}>
                <Text style={styles.choiceIcon}>
                  {sceneData.choices[0].icon}
                </Text>
                <View
                  style={[
                    styles.difficultyBadge,
                    {
                      backgroundColor:
                        getDifficultyColor(sceneData.choices[0].difficulty) +
                        "20",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.difficultyText,
                      {
                        color: getDifficultyColor(
                          sceneData.choices[0].difficulty
                        ),
                      },
                    ]}
                  >
                    {getDifficultyStars(sceneData.choices[0].difficulty)}{" "}
                    {sceneData.choices[0].difficulty}
                  </Text>
                </View>
              </View>
              <Text style={styles.choiceTitle}>
                {sceneData.choices[0].title}
              </Text>
              <Text style={styles.choiceDescription}>
                {sceneData.choices[0].description}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            style={{ transform: [{ translateX: slideRightAnim }] }}
          >
            <TouchableOpacity
              style={[
                styles.choiceCard,
                selectedChoice === sceneData.choices[1].id &&
                  styles.selectedChoice,
              ]}
              onPress={() => handleChoiceSelect(sceneData.choices[1])}
              activeOpacity={0.8}
              disabled={selectedChoice !== null}
            >
              <View style={styles.choiceHeader}>
                <Text style={styles.choiceIcon}>
                  {sceneData.choices[1].icon}
                </Text>
                <View
                  style={[
                    styles.difficultyBadge,
                    {
                      backgroundColor:
                        getDifficultyColor(sceneData.choices[1].difficulty) +
                        "20",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.difficultyText,
                      {
                        color: getDifficultyColor(
                          sceneData.choices[1].difficulty
                        ),
                      },
                    ]}
                  >
                    {getDifficultyStars(sceneData.choices[1].difficulty)}{" "}
                    {sceneData.choices[1].difficulty}
                  </Text>
                </View>
              </View>
              <Text style={styles.choiceTitle}>
                {sceneData.choices[1].title}
              </Text>
              <Text style={styles.choiceDescription}>
                {sceneData.choices[1].description}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Indicador de progreso */}
        <View style={styles.progressIndicator}>
          <Text style={styles.progressText}>
            Nivel {currentLevel} | Escena: {currentScene}
          </Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  backgroundDecoration: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingTop: spacing.xxl,
  },
  backgroundIcon: {
    fontSize: 120,
    opacity: 0.1,
  },
  sceneHeader: {
    alignItems: "center",
    marginBottom: spacing.xl,
    paddingTop: spacing.lg,
  },
  sceneTitle: {
    ...typography.h1,
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  sceneDescription: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: spacing.sm,
  },
  mascotContainer: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  speechBubble: {
    backgroundColor: colors.background.paper,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginTop: spacing.md,
    maxWidth: width * 0.8,
    ...shadows.medium,
  },
  speechText: {
    ...typography.body,
    color: colors.text.primary,
    textAlign: "center",
    lineHeight: 22,
  },
  choicesContainer: {
    flex: 1,
    justifyContent: "center",
    gap: spacing.lg,
  },
  choiceCard: {
    backgroundColor: colors.background.paper,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.large,
    borderWidth: 2,
    borderColor: colors.primary.light,
  },
  selectedChoice: {
    borderColor: colors.success.main,
    backgroundColor: colors.success.light + "10",
    transform: [{ scale: 0.98 }],
  },
  choiceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  choiceIcon: {
    fontSize: 48,
  },
  difficultyBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    ...shadows.small,
  },
  difficultyText: {
    ...typography.caption,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  choiceTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  choiceDescription: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  progressIndicator: {
    alignItems: "center",
    paddingTop: spacing.md,
  },
  progressText: {
    ...typography.caption,
    color: colors.text.light,
    fontWeight: "500",
  },
});

export default ChoiceScreen;
