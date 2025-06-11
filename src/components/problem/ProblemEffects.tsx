import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
} from "react-native";
import { colors, spacing, typography } from "../styles/theme";

interface ProblemEffectsProps {
  effectType:
    | "correct"
    | "incorrect"
    | "streak"
    | "hint"
    | "celebration"
    | "thinking"
    | "combo"
    | "perfect"
    | "scene_transition"
    | "none";
  isVisible: boolean;
  onComplete?: () => void;
  streakCount?: number;
  sceneType?: string;
  ageGroup?: "kids" | "teens" | "adults" | "seniors";
  intensity?: "low" | "medium" | "high" | "epic";
  comboMultiplier?: number;
  problemDifficulty?: "easy" | "medium" | "hard";
  responseTime?: number;
  isInstantFeedback?: boolean;
}

interface EnvironmentalParticle {
  id: string;
  x: Animated.Value;
  y: Animated.Value;
  scale: Animated.Value;
  opacity: Animated.Value;
  rotation: Animated.Value;
  emoji: string;
  color: string;
}

const { width, height } = Dimensions.get("window");

export const ProblemEffects: React.FC<ProblemEffectsProps> = ({
  effectType,
  isVisible,
  onComplete,
  streakCount = 0,
  sceneType = "entrance",
  ageGroup = "adults",
  intensity = "medium",
  comboMultiplier = 1,
  problemDifficulty = "medium",
  responseTime = 0,
  isInstantFeedback = true,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const [environmentParticles, setEnvironmentParticles] = useState<
    EnvironmentalParticle[]
  >([]);
  const [backgroundEffect, setBackgroundEffect] = useState<Animated.Value>(
    new Animated.Value(0)
  );

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
    slideAnim.setValue(50);
    rotateAnim.setValue(0);
    pulseAnim.setValue(1);
    shakeAnim.setValue(0);
    glowAnim.setValue(0);
    setEnvironmentParticles([]);
  };

  const getSceneConfig = () => {
    const sceneConfigs = {
      entrance: {
        colors: ["#8A2BE2", "#4B0082", "#9370DB"],
        emojis: ["🏰", "⚔️", "🗝️", "🛡️", "👑"],
        ambientEmojis: ["✨", "💫", "🌟"],
        atmosphere: "mystical",
        backgroundGradient: ["#2E1A47", "#1A0B2E"],
      },
      golden_room: {
        colors: ["#FFD700", "#FFA500", "#FF8C00"],
        emojis: ["💰", "👑", "💎", "🏆", "✨"],
        ambientEmojis: ["✨", "💰", "🌟"],
        atmosphere: "golden",
        backgroundGradient: ["#FFD700", "#FFA500"],
      },
      mystery_tunnel: {
        colors: ["#9932CC", "#8B008B", "#4B0082"],
        emojis: ["🔮", "🌟", "💫", "🎭", "🗝️"],
        ambientEmojis: ["🔮", "💫", "✨"],
        atmosphere: "mysterious",
        backgroundGradient: ["#2F1B69", "#0F051F"],
      },
      tower: {
        colors: ["#1E90FF", "#00BFFF", "#87CEEB"],
        emojis: ["⚡", "🪄", "📚", "🔬", "🧪"],
        ambientEmojis: ["⚡", "✨", "💫"],
        atmosphere: "magical",
        backgroundGradient: ["#1E3A8A", "#1E40AF"],
      },
      treasure_cave: {
        colors: ["#32CD32", "#228B22", "#006400"],
        emojis: ["💎", "🏆", "💰", "⚱️", "🗝️"],
        ambientEmojis: ["💎", "✨", "🌟"],
        atmosphere: "adventure",
        backgroundGradient: ["#064E3B", "#065F46"],
      },
      fire_chamber: {
        colors: ["#FF4500", "#FF6347", "#DC143C"],
        emojis: ["🔥", "💥", "☄️", "🌋", "🎆"],
        ambientEmojis: ["🔥", "💥", "✨"],
        atmosphere: "fiery",
        backgroundGradient: ["#7F1D1D", "#991B1B"],
      },
      ice_chamber: {
        colors: ["#00CED1", "#20B2AA", "#48D1CC"],
        emojis: ["❄️", "💎", "🧊", "✨", "🌟"],
        ambientEmojis: ["❄️", "✨", "💫"],
        atmosphere: "icy",
        backgroundGradient: ["#1E3A8A", "#1E40AF"],
      },
      boss_room: {
        colors: ["#DC143C", "#B22222", "#8B0000"],
        emojis: ["👑", "⚔️", "🛡️", "🏆", "💀"],
        ambientEmojis: ["⚡", "🔥", "💫"],
        atmosphere: "epic",
        backgroundGradient: ["#450A0A", "#7F1D1D"],
      },
    };

    return (
      sceneConfigs[sceneType as keyof typeof sceneConfigs] ||
      sceneConfigs.entrance
    );
  };

  const getAgeConfig = () => {
    switch (ageGroup) {
      case "kids":
        return {
          fontSize: 32,
          duration: 1200,
          bounceIntensity: 1.8,
          particleCount: 20,
          colors: ["#FF69B4", "#32CD32", "#FFD700", "#00CED1"],
          playful: true,
        };
      case "teens":
        return {
          fontSize: 28,
          duration: 800,
          bounceIntensity: 1.5,
          particleCount: 15,
          colors: ["#FF1493", "#00FF7F", "#1E90FF", "#FFD700"],
          modern: true,
        };
      case "adults":
        return {
          fontSize: 24,
          duration: 600,
          bounceIntensity: 1.3,
          particleCount: 10,
          colors: ["#4169E1", "#32CD32", "#FFD700"],
          professional: true,
        };
      case "seniors":
        return {
          fontSize: 28,
          duration: 1000,
          bounceIntensity: 1.2,
          particleCount: 8,
          colors: ["#4169E1", "#228B22", "#DAA520"],
          gentle: true,
        };
    }
  };

  const createEnvironmentalParticles = () => {
    const sceneConfig = getSceneConfig();
    const ageConfig = getAgeConfig();
    const newParticles: EnvironmentalParticle[] = [];

    for (let i = 0; i < ageConfig.particleCount; i++) {
      newParticles.push({
        id: `env-${i}`,
        x: new Animated.Value(Math.random() * width),
        y: new Animated.Value(Math.random() * height),
        scale: new Animated.Value(0),
        opacity: new Animated.Value(0.8),
        rotation: new Animated.Value(0),
        emoji:
          sceneConfig.ambientEmojis[
            Math.floor(Math.random() * sceneConfig.ambientEmojis.length)
          ],
        color:
          sceneConfig.colors[
            Math.floor(Math.random() * sceneConfig.colors.length)
          ],
      });
    }

    setEnvironmentParticles(newParticles);
    return newParticles;
  };

  const animateEnvironmentalParticles = (
    particles: EnvironmentalParticle[]
  ) => {
    const ageConfig = getAgeConfig();

    particles.forEach((particle, index) => {
      const delay = index * 50;

      Animated.parallel([
        Animated.timing(particle.scale, {
          toValue: 0.5 + Math.random() * 0.5,
          duration: 300,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(particle.x, {
          toValue: Math.random() * width,
          duration: ageConfig.duration * 2,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(particle.y, {
          toValue: Math.random() * height,
          duration: ageConfig.duration * 2,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(particle.rotation, {
          toValue: 360 * (1 + Math.random()),
          duration: ageConfig.duration * 1.5,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(particle.opacity, {
          toValue: 0,
          duration: ageConfig.duration,
          delay: delay + ageConfig.duration,
          useNativeDriver: true,
        }),
      ]).start();
    });

    setTimeout(() => {
      setEnvironmentParticles([]);
    }, ageConfig.duration * 3);
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
      case "thinking":
        startThinkingEffect();
        break;
      case "combo":
        startComboEffect();
        break;
      case "perfect":
        startPerfectEffect();
        break;
      case "scene_transition":
        startSceneTransitionEffect();
        break;
    }
  };

  const startCorrectEffect = () => {
    const ageConfig = getAgeConfig();
    const sceneConfig = getSceneConfig();

    const particles = createEnvironmentalParticles();
    animateEnvironmentalParticles(particles);

    Animated.timing(backgroundEffect, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      Animated.timing(backgroundEffect, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }).start();
    });

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: isInstantFeedback ? 200 : 300,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: ageConfig.bounceIntensity,
          tension: 150,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: isInstantFeedback ? 300 : 500,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        { iterations: 2 }
      ),
    ]).start(() => {
      setTimeout(
        () => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }).start(onComplete);
        },
        isInstantFeedback ? 800 : 1200
      );
    });
  };

  const startIncorrectEffect = () => {
    const ageConfig = getAgeConfig();

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: -5,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 5,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -3,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 150,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(
        () => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }).start(onComplete);
        },
        ageGroup === "kids" ? 1500 : 1000
      );
    });
  };

  const startStreakEffect = () => {
    const ageConfig = getAgeConfig();
    const particles = createEnvironmentalParticles();
    animateEnvironmentalParticles(particles);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1.8,
        tension: 80,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        { iterations: 3 }
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        { iterations: 3 }
      ),
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

  const startThinkingEffect = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.timing(fadeAnim, {
      toValue: 0.7,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const startComboEffect = () => {
    const ageConfig = getAgeConfig();
    const particles = createEnvironmentalParticles();
    animateEnvironmentalParticles(particles);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 2 + comboMultiplier * 0.2,
        tension: 60,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: comboMultiplier,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(onComplete);
      }, 1500);
    });
  };

  const startPerfectEffect = () => {
    const particles = createEnvironmentalParticles();
    animateEnvironmentalParticles(particles);

    Animated.sequence([
      Animated.timing(backgroundEffect, {
        toValue: 0.3,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(backgroundEffect, {
        toValue: 0,
        duration: 800,
        useNativeDriver: false,
      }),
    ]).start();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 2.5,
        tension: 40,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 2,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }).start(onComplete);
      }, 2000);
    });
  };

  const startSceneTransitionEffect = () => {
    const sceneConfig = getSceneConfig();

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1.2,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
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
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
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
    const particles = createEnvironmentalParticles();
    animateEnvironmentalParticles(particles);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 2.2,
        tension: 60,
        friction: 6,
        useNativeDriver: true,
      }),
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
      }, 2000);
    });
  };

  const getEffectElements = () => {
    const sceneConfig = getSceneConfig();

    switch (effectType) {
      case "correct":
        return sceneConfig.emojis.slice(0, 3);
      case "streak":
        return ["🔥", "⚡", "💯"];
      case "combo":
        return ["💥", "🌟", "🚀"];
      case "perfect":
        return ["👑", "💎", "🏆"];
      default:
        return sceneConfig.emojis.slice(0, 3);
    }
  };

  const getEffectText = () => {
    const ageTexts = {
      kids: {
        correct: ["¡Genial! 🌟", "¡Súper! 🎉", "¡Excelente! 🦄"][
          Math.floor(Math.random() * 3)
        ],
        incorrect: "¡Casi! Inténtalo otra vez 💪",
        streak: `¡${streakCount} seguidas! 🔥`,
        combo: `¡COMBO x${comboMultiplier}! 💥`,
        perfect: "¡PERFECTO! 👑",
        thinking: "🤔 Pensando...",
        hint: "💡 ¡Aquí tienes una pista!",
        celebration: "🎉 ¡INCREÍBLE! 🎉",
        scene_transition: `¡Entrando a ${sceneType}! 🚪`,
      },
      teens: {
        correct: ["¡Nailed it! 🔥", "¡Perfect! 💯", "¡Epic! ⚡"][
          Math.floor(Math.random() * 3)
        ],
        incorrect: "¡Almost! Try again 💪",
        streak: `${streakCount} streak! 🔥`,
        combo: `COMBO x${comboMultiplier}! 💥`,
        perfect: "FLAWLESS! 👑",
        thinking: "🤔 Thinking...",
        hint: "💡 Hint incoming!",
        celebration: "🎉 LEGENDARY! 🎉",
        scene_transition: `Entering ${sceneType}! 🚪`,
      },
      adults: {
        correct: ["Correcto ✓", "Excelente 🌟", "Bien hecho ⭐"][
          Math.floor(Math.random() * 3)
        ],
        incorrect: "Incorrecto. Inténtalo de nuevo 💪",
        streak: `Racha de ${streakCount} 🎯`,
        combo: `Combo x${comboMultiplier} 💥`,
        perfect: "Perfecto 🏆",
        thinking: "🤔 Procesando...",
        hint: "💡 Pista disponible",
        celebration: "🎉 Excelente trabajo 🎉",
        scene_transition: `Accediendo a ${sceneType} 🚪`,
      },
      seniors: {
        correct: ["¡Excelente! 🌟", "¡Muy bien! 👏", "¡Perfecto! 🎯"][
          Math.floor(Math.random() * 3)
        ],
        incorrect: "Vamos a intentarlo otra vez 💪",
        streak: `¡${streakCount} consecutivas! 🌟`,
        combo: `Secuencia x${comboMultiplier} 💫`,
        perfect: "¡Trabajo perfecto! 🏆",
        thinking: "🤔 Reflexionando...",
        hint: "💡 Aquí tiene una ayuda",
        celebration: "🎉 ¡Magnífico trabajo! 🎉",
        scene_transition: `Explorando ${sceneType} 🚪`,
      },
    };

    return (
      ageTexts[ageGroup][
        effectType as keyof (typeof ageTexts)[typeof ageGroup]
      ] || ""
    );
  };

  const getEffectColor = () => {
    const sceneConfig = getSceneConfig();
    const ageConfig = getAgeConfig();

    switch (effectType) {
      case "correct":
        return ageConfig.playful ? ageConfig.colors[0] : colors.success.main;
      case "incorrect":
        return ageConfig.gentle ? "#FF6B6B" : colors.error.main;
      case "streak":
        return "#FF4500";
      case "combo":
        return sceneConfig.colors[1];
      case "perfect":
        return "#FFD700";
      case "thinking":
        return sceneConfig.colors[2];
      case "hint":
        return "#4169E1";
      case "celebration":
        return sceneConfig.colors[0];
      case "scene_transition":
        return sceneConfig.colors[1];
      default:
        return colors.text.primary;
    }
  };

  if (!isVisible || effectType === "none") {
    return null;
  }

  const sceneConfig = getSceneConfig();
  const ageConfig = getAgeConfig();

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View
        style={[
          styles.backgroundEffect,
          {
            opacity: backgroundEffect,
            backgroundColor: sceneConfig.colors[0] + "40",
          },
        ]}
      />

      {environmentParticles.map((particle) => (
        <Animated.View
          key={particle.id}
          style={[
            styles.environmentParticle,
            {
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
                { scale: particle.scale },
                {
                  rotate: particle.rotation.interpolate({
                    inputRange: [0, 360],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
              opacity: particle.opacity,
            },
          ]}
        >
          <Text style={[styles.particleEmoji, { color: particle.color }]}>
            {particle.emoji}
          </Text>
        </Animated.View>
      ))}

      <Animated.View
        style={[
          styles.effectContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim },
              { translateX: shakeAnim },
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
        <Animated.View
          style={[
            styles.glowEffect,
            {
              opacity: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.6],
              }),
              backgroundColor: getEffectColor() + "40",
            },
          ]}
        />

        <Animated.Text
          style={[
            styles.effectText,
            {
              color: getEffectColor(),
              fontSize: ageConfig.fontSize,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          {getEffectText()}
        </Animated.Text>

        {(effectType === "correct" ||
          effectType === "celebration" ||
          effectType === "combo" ||
          effectType === "perfect") && (
          <View style={styles.decorativeElements}>
            {getEffectElements().map((emoji, index) => (
              <Animated.Text
                key={index}
                style={[
                  styles.decorativeEmoji,
                  {
                    opacity: fadeAnim,
                    transform: [
                      {
                        translateY: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, -10 - index * 15],
                        }),
                      },
                      {
                        translateX: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, (index - 1) * 30],
                        }),
                      },
                    ],
                  },
                ]}
              >
                {emoji}
              </Animated.Text>
            ))}
          </View>
        )}
      </Animated.View>

      {(effectType === "correct" || effectType === "perfect") && (
        <Animated.View
          style={[
            styles.flash,
            {
              opacity: backgroundEffect.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.2],
              }),
              backgroundColor: sceneConfig.colors[0],
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

  flash: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.success.light,
  },
  backgroundEffect: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  environmentParticle: {
    position: "absolute",
    zIndex: -1,
  },
  particleEmoji: {
    fontSize: 32,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  glowEffect: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  decorativeElements: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  decorativeEmoji: {
    position: "absolute",
    fontSize: 32,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default ProblemEffects;
