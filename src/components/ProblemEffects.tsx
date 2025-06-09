import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { colors, spacing, typography } from "../styles/theme";

interface ProblemEffectsProps {
  effectType:
    | "correct"
    | "incorrect"
    | "streak"
    | "hint"
    | "celebration"
    | "none";
  isVisible: boolean;
  onComplete?: () => void;
  streakCount?: number;
  sceneType?: string;
}

const { width, height } = Dimensions.get("window");

export const ProblemEffects: React.FC<ProblemEffectsProps> = ({
  effectType,
  isVisible,
  onComplete,
  streakCount = 0,
  sceneType = "entrance",
}) => {
  // Animaciones para diferentes efectos
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const particle1 = useRef(new Animated.Value(0)).current;
  const particle2 = useRef(new Animated.Value(0)).current;
  const particle3 = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible && effectType !== "none") {
      startEffect();
    } else {
      resetAnimations();
    }
  }, [isVisible, effectType]);

  const resetAnimations = () => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0);
    particle1.setValue(0);
    particle2.setValue(0);
    particle3.setValue(0);
    rotateAnim.setValue(0);
  };

  const startEffect = () => {
    resetAnimations();

    switch (effectType) {
      case "correct":
        startCorrectEffect();
        break;
      case "incorrect":
        startIncorrectEffect();
        break;
      case "streak":
        startStreakEffect();
        break;
      case "hint":
        startHintEffect();
        break;
      case "celebration":
        startCelebrationEffect();
        break;
    }
  };

  const startCorrectEffect = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 150,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(particle1, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(particle2, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(particle3, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(onComplete);
      }, 1000);
    });
  };

  const startIncorrectEffect = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(onComplete);
  };

  const startStreakEffect = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        { iterations: 2 }
      ),
      Animated.spring(scaleAnim, {
        toValue: 1.5,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }).start(onComplete);
      }, 2000);
    });
  };

  const startHintEffect = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        { iterations: 3 }
      ),
    ]).start(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(onComplete);
    });
  };

  const startCelebrationEffect = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 2,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.stagger(200, [
        Animated.timing(particle1, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(particle2, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(particle3, {
          toValue: 1,
          duration: 1600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(rotateAnim, {
        toValue: 2,
        duration: 3000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }).start(onComplete);
      }, 1000);
    });
  };

  const getEffectElements = () => {
    const sceneEmojis = {
      entrance: ["🏰", "⚔️", "🗝️"],
      golden_room: ["✨", "💰", "👑"],
      mystery_tunnel: ["🔮", "🌟", "💫"],
      tower: ["⚡", "🪄", "📚"],
      treasure_cave: ["💎", "💰", "🏆"],
      fire_chamber: ["🔥", "💥", "☄️"],
      ice_chamber: ["❄️", "✨", "💎"],
      boss_room: ["👑", "⚔️", "🌟"],
    };

    return (
      sceneEmojis[sceneType as keyof typeof sceneEmojis] || sceneEmojis.entrance
    );
  };

  const renderParticles = () => {
    const elements = getEffectElements();

    return (
      <>
        <Animated.Text
          style={[
            styles.particle,
            styles.particle1,
            {
              opacity: particle1,
              transform: [
                {
                  translateY: particle1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -100],
                  }),
                },
                {
                  translateX: particle1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -50],
                  }),
                },
              ],
            },
          ]}
        >
          {elements[0]}
        </Animated.Text>

        <Animated.Text
          style={[
            styles.particle,
            styles.particle2,
            {
              opacity: particle2,
              transform: [
                {
                  translateY: particle2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -120],
                  }),
                },
                {
                  translateX: particle2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 50],
                  }),
                },
              ],
            },
          ]}
        >
          {elements[1]}
        </Animated.Text>

        <Animated.Text
          style={[
            styles.particle,
            styles.particle3,
            {
              opacity: particle3,
              transform: [
                {
                  translateY: particle3.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -80],
                  }),
                },
                {
                  translateX: particle3.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {elements[2]}
        </Animated.Text>
      </>
    );
  };

  const getEffectText = () => {
    switch (effectType) {
      case "correct":
        return "¡Correcto! ✨";
      case "incorrect":
        return "¡Inténtalo de nuevo! 💪";
      case "streak":
        return `¡${streakCount} seguidas! 🔥`;
      case "hint":
        return "💡 Pista disponible";
      case "celebration":
        return "🎉 ¡INCREÍBLE! 🎉";
      default:
        return "";
    }
  };

  const getEffectColor = () => {
    switch (effectType) {
      case "correct":
        return colors.success.main;
      case "incorrect":
        return colors.error.main;
      case "streak":
        return colors.gold;
      case "hint":
        return colors.accent;
      case "celebration":
        return colors.primary.main;
      default:
        return colors.text.primary;
    }
  };

  if (!isVisible || effectType === "none") {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View
        style={[
          styles.effectContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              {
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "360deg"],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={[styles.effectText, { color: getEffectColor() }]}>
          {getEffectText()}
        </Text>
      </Animated.View>

      {(effectType === "correct" || effectType === "celebration") &&
        renderParticles()}

      {/* Efecto de destello para respuestas correctas */}
      {effectType === "correct" && (
        <Animated.View
          style={[
            styles.flash,
            {
              opacity: fadeAnim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 0.3, 0],
              }),
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  effectContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  effectText: {
    ...typography.h1,
    fontWeight: "700",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  particle: {
    position: "absolute",
    fontSize: 32,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  particle1: {
    top: -20,
    left: -30,
  },
  particle2: {
    top: -10,
    right: -30,
  },
  particle3: {
    top: -30,
    left: 0,
  },
  flash: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.success.light,
  },
});

export default ProblemEffects;
