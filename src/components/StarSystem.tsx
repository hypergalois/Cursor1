import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Modal,
  Easing,
} from "react-native";
import {
  colors,
  spacing,
  typography,
  shadows,
  borderRadius,
} from "../styles/theme";

interface StarSystemProps {
  starsEarned: number;
  maxStars?: number;
  size?: "small" | "medium" | "large";
  animated?: boolean;
  showCount?: boolean;
  onStarPress?: (starIndex: number) => void;
  particleEffects?: boolean;
  shimmerEffect?: boolean;
  trailEffect?: boolean;
  starType?: "classic" | "golden" | "diamond" | "cosmic";
  magnetEffect?: boolean;
  soundEnabled?: boolean;
  ageGroup?: "kids" | "teens" | "adults" | "seniors";
}

interface StarCalculation {
  stars: number;
  criteria: string;
  bonus: string[];
}

interface StarParticle {
  id: string;
  x: Animated.Value;
  y: Animated.Value;
  scale: Animated.Value;
  opacity: Animated.Value;
  rotation: Animated.Value;
  color: string;
  emoji: string;
}

const { width, height } = Dimensions.get("window");

export const StarSystem: React.FC<StarSystemProps> = ({
  starsEarned,
  maxStars = 3,
  size = "medium",
  animated = true,
  showCount = true,
  onStarPress,
  particleEffects = true,
  shimmerEffect = true,
  trailEffect = true,
  starType = "classic",
  magnetEffect = true,
  soundEnabled = false,
  ageGroup = "adults",
}) => {
  const [displayedStars, setDisplayedStars] = useState(0);
  const [particles, setParticles] = useState<StarParticle[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const animationRefs = useRef<Animated.Value[]>([]);
  const shimmerRefs = useRef<Animated.Value[]>([]);
  const trailRefs = useRef<Animated.Value[]>([]);
  const magnetRefs = useRef<Animated.Value[]>([]);
  const containerRef = useRef<View>(null);

  useEffect(() => {
    animationRefs.current = Array.from(
      { length: maxStars },
      () => new Animated.Value(0)
    );
    shimmerRefs.current = Array.from(
      { length: maxStars },
      () => new Animated.Value(0)
    );
    trailRefs.current = Array.from(
      { length: maxStars },
      () => new Animated.Value(0)
    );
    magnetRefs.current = Array.from(
      { length: maxStars },
      () => new Animated.Value(0)
    );
  }, [maxStars]);

  const getAgeEffectConfig = () => {
    switch (ageGroup) {
      case "kids":
        return {
          particleCount: 15,
          sparkleEmojis: ["✨", "🌟", "⭐", "💫", "🌈", "🎉"],
          animationDuration: 800,
          bounceIntensity: 1.5,
          colorful: true,
        };
      case "teens":
        return {
          particleCount: 12,
          sparkleEmojis: ["✨", "💎", "⚡", "🔥", "💯", "🌟"],
          animationDuration: 600,
          bounceIntensity: 1.3,
          colorful: true,
        };
      case "adults":
        return {
          particleCount: 8,
          sparkleEmojis: ["✨", "⭐", "💫"],
          animationDuration: 500,
          bounceIntensity: 1.2,
          colorful: false,
        };
      case "seniors":
        return {
          particleCount: 6,
          sparkleEmojis: ["⭐", "🌟"],
          animationDuration: 700,
          bounceIntensity: 1.1,
          colorful: false,
        };
    }
  };

  const createStarParticles = (starIndex: number) => {
    if (!particleEffects) return;

    const config = getAgeEffectConfig();
    const newParticles: StarParticle[] = [];

    const starSize = getStarSize();
    const baseX = starIndex * (starSize + spacing.xs) + starSize / 2;
    const baseY = starSize / 2;

    for (let i = 0; i < config.particleCount; i++) {
      const angle = (Math.PI * 2 * i) / config.particleCount;
      const distance = 20 + Math.random() * 30;

      newParticles.push({
        id: `particle-${starIndex}-${i}`,
        x: new Animated.Value(baseX),
        y: new Animated.Value(baseY),
        scale: new Animated.Value(0),
        opacity: new Animated.Value(1),
        rotation: new Animated.Value(0),
        color: config.colorful
          ? ["#FFD700", "#FF69B4", "#00CED1", "#32CD32", "#FF6347"][
              Math.floor(Math.random() * 5)
            ]
          : "#FFD700",
        emoji:
          config.sparkleEmojis[
            Math.floor(Math.random() * config.sparkleEmojis.length)
          ],
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);

    newParticles.forEach((particle, index) => {
      const angle = (Math.PI * 2 * index) / config.particleCount;
      const distance = 30 + Math.random() * 40;
      const finalX = baseX + Math.cos(angle) * distance;
      const finalY = baseY + Math.sin(angle) * distance;

      Animated.parallel([
        Animated.timing(particle.scale, {
          toValue: 0.8 + Math.random() * 0.4,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(particle.x, {
          toValue: finalX,
          duration: config.animationDuration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(particle.y, {
          toValue: finalY,
          duration: config.animationDuration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(particle.rotation, {
          toValue: 360 * (1 + Math.random()),
          duration: config.animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(particle.opacity, {
          toValue: 0,
          duration: config.animationDuration,
          delay: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });

    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !p.id.includes(`-${starIndex}-`))
      );
    }, config.animationDuration + 500);
  };

  const startShimmerEffect = (starIndex: number) => {
    if (!shimmerEffect) return;

    const shimmerLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerRefs.current[starIndex], {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerRefs.current[starIndex], {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    shimmerLoop.start();
  };

  const createTrailEffect = (starIndex: number) => {
    if (!trailEffect) return;

    Animated.sequence([
      Animated.timing(trailRefs.current[starIndex], {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(trailRefs.current[starIndex], {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const createMagnetEffect = (starIndex: number) => {
    if (!magnetEffect) return;

    Animated.sequence([
      Animated.timing(magnetRefs.current[starIndex], {
        toValue: -5,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(magnetRefs.current[starIndex], {
        toValue: 0,
        tension: 200,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    if (!animated) {
      setDisplayedStars(starsEarned);
      return;
    }

    const animateStars = async () => {
      setIsAnimating(true);
      const config = getAgeEffectConfig();

      for (let i = 0; i < starsEarned; i++) {
        await new Promise((resolve) => {
          setTimeout(() => {
            setDisplayedStars(i + 1);

            createMagnetEffect(i);

            Animated.sequence([
              Animated.timing(animationRefs.current[i], {
                toValue: config.bounceIntensity,
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.spring(animationRefs.current[i], {
                toValue: 1,
                friction: 3,
                tension: 100,
                useNativeDriver: true,
              }),
            ]).start(() => {
              createStarParticles(i);
              createTrailEffect(i);
              startShimmerEffect(i);

              if (soundEnabled) {
                console.log(`🔊 Playing star sound: ${starType}`);
              }
            });

            resolve(true);
          }, i * 400);
        });
      }

      setIsAnimating(false);
    };

    animateStars();
  }, [starsEarned, animated]);

  const getStarSize = () => {
    const baseSizes = {
      small: 24,
      medium: 36,
      large: 48,
    };

    const ageMultiplier =
      ageGroup === "seniors" ? 1.2 : ageGroup === "kids" ? 1.1 : 1;

    return Math.floor(baseSizes[size] * ageMultiplier);
  };

  const getStarColor = (index: number) => {
    if (index < displayedStars) {
      switch (starType) {
        case "golden":
          return "#FFD700";
        case "diamond":
          return "#E8E8E8";
        case "cosmic":
          return "#9932CC";
        default:
          return colors.duolingo?.gold || "#FFD700";
      }
    } else {
      return colors.text.light;
    }
  };

  const getStarEmoji = (index: number, isEarned: boolean) => {
    if (!isEarned) return "☆";

    switch (starType) {
      case "golden":
        return "🌟";
      case "diamond":
        return "💎";
      case "cosmic":
        return "✨";
      default:
        return "⭐";
    }
  };

  const renderStar = (index: number) => {
    const starSize = getStarSize();
    const isEarned = index < displayedStars;

    const animatedStyle =
      animated && animationRefs.current[index]
        ? {
            transform: [
              { scale: animationRefs.current[index] },
              { translateX: magnetRefs.current[index] || 0 },
            ],
          }
        : {};

    const shimmerStyle =
      shimmerEffect && shimmerRefs.current[index]
        ? {
            opacity: shimmerRefs.current[index].interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0.3],
            }),
          }
        : {};

    return (
      <TouchableOpacity
        key={index}
        onPress={() => onStarPress?.(index)}
        disabled={!onStarPress || isAnimating}
        activeOpacity={0.8}
      >
        <View style={styles.starContainer}>
          {trailEffect && trailRefs.current[index] && (
            <Animated.View
              style={[
                styles.starTrail,
                {
                  opacity: trailRefs.current[index],
                  width: starSize * 1.5,
                  height: starSize * 1.5,
                },
              ]}
            />
          )}

          <Animated.View style={[animatedStyle]}>
            <Animated.Text
              style={[
                styles.star,
                shimmerStyle,
                {
                  fontSize: starSize,
                  color: getStarColor(index),
                  textShadowColor: "rgba(255, 215, 0, 0.5)",
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: isEarned ? 8 : 0,
                },
              ]}
            >
              {getStarEmoji(index, isEarned)}
            </Animated.Text>
          </Animated.View>

          {isEarned && shimmerEffect && (
            <Animated.View
              style={[
                styles.starGlow,
                {
                  opacity:
                    shimmerRefs.current[index]?.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 0.6],
                    }) || 0,
                },
              ]}
            >
              <Text style={[styles.starGlowText, { fontSize: starSize * 1.3 }]}>
                ✨
              </Text>
            </Animated.View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container} ref={containerRef}>
      {particles.map((particle) => (
        <Animated.View
          key={particle.id}
          style={[
            styles.particle,
            {
              left: particle.x,
              top: particle.y,
              transform: [
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
          pointerEvents="none"
        >
          <Text style={[styles.particleText, { color: particle.color }]}>
            {particle.emoji}
          </Text>
        </Animated.View>
      ))}

      <View style={styles.starsRow}>
        {Array.from({ length: maxStars }, (_, index) => renderStar(index))}
      </View>

      {showCount && (
        <View style={styles.countContainer}>
          <Text style={[styles.starCount, { fontSize: getStarSize() * 0.4 }]}>
            {displayedStars}/{maxStars}
          </Text>

          {starType !== "classic" && (
            <Text style={styles.starTypeLabel}>
              {starType === "golden" && "🌟 Doradas"}
              {starType === "diamond" && "💎 Diamante"}
              {starType === "cosmic" && "✨ Cósmicas"}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

export const calculateStars = (
  correct: boolean,
  timeSpent: number,
  difficulty: string,
  streak: number,
  hintsUsed: number,
  ageGroup?: "kids" | "teens" | "adults" | "seniors"
): StarCalculation => {
  let stars = 0;
  let criteria = "";
  const bonus: string[] = [];

  if (!correct) {
    return {
      stars: 0,
      criteria: "❌ Respuesta incorrecta",
      bonus: ["Inténtalo de nuevo para ganar estrellas"],
    };
  }

  stars = 1;
  criteria = "✅ Respuesta correcta";

  const getTimeThresholds = (
    difficulty: string,
    ageGroup: string = "adults"
  ) => {
    const baseThresholds = {
      easy: 20,
      medium: 30,
      hard: 45,
    };

    const ageMultipliers = {
      kids: 1.5,
      teens: 1.2,
      adults: 1.0,
      seniors: 1.8,
    };

    const base =
      baseThresholds[difficulty as keyof typeof baseThresholds] || 30;
    const multiplier =
      ageMultipliers[ageGroup as keyof typeof ageMultipliers] || 1.0;

    return base * multiplier;
  };

  const timeLimit = getTimeThresholds(difficulty, ageGroup);

  if (timeSpent <= timeLimit * 0.6) {
    stars = Math.max(stars, 2);
    bonus.push(`⚡ Velocidad increíble (${Math.round(timeSpent)}s)`);
  } else if (timeSpent <= timeLimit * 0.8) {
    if (stars < 2) {
      bonus.push(`🏃 Buena velocidad (${Math.round(timeSpent)}s)`);
    }
  }

  const perfectThreshold =
    ageGroup === "kids" || ageGroup === "seniors"
      ? timeLimit * 0.7
      : timeLimit * 0.5;
  const minStreak = ageGroup === "kids" ? 2 : 3;

  const perfectConditions = [
    timeSpent <= perfectThreshold,
    hintsUsed === 0,
    streak >= minStreak,
  ];

  const metConditions = perfectConditions.filter(Boolean).length;

  if (metConditions >= 2) {
    stars = 3;
    bonus.push("🏆 Rendimiento perfecto");
  }

  if (hintsUsed === 0) {
    bonus.push("🧠 Sin pistas usadas");
  }

  const streakThresholds = ageGroup === "kids" ? [3, 5] : [5, 8];
  if (streak >= streakThresholds[1]) {
    bonus.push(`🔥 Racha épica (${streak})`);
  } else if (streak >= streakThresholds[0]) {
    bonus.push(`🔥 Buena racha (${streak})`);
  }

  if (difficulty === "hard" && stars >= 2) {
    bonus.push("💪 Dificultad alta superada");
  }

  if (ageGroup === "kids" && stars >= 2) {
    bonus.push("🌈 ¡Excelente trabajo pequeño matemático!");
  } else if (ageGroup === "seniors" && stars >= 2) {
    bonus.push("🌟 ¡Sabiduría y precisión combinadas!");
  }

  return { stars, criteria, bonus };
};

export const StarBreakdown: React.FC<{
  calculation: StarCalculation;
  visible: boolean;
  onClose: () => void;
  starType?: "classic" | "golden" | "diamond" | "cosmic";
  ageGroup?: "kids" | "teens" | "adults" | "seniors";
}> = ({
  calculation,
  visible,
  onClose,
  starType = "classic",
  ageGroup = "adults",
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: visible ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: visible ? 0 : 30,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible]);

  const getAgeAppropriateTitle = () => {
    switch (ageGroup) {
      case "kids":
        return "🌟 ¡Estrellas Ganadas!";
      case "teens":
        return "⭐ Stars Earned!";
      case "adults":
        return "⭐ Evaluación de Rendimiento";
      case "seniors":
        return "🌟 Excelente Trabajo";
      default:
        return "⭐ Estrellas Ganadas";
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <Animated.View
            style={[
              styles.breakdown,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.breakdownTitle}>
              {getAgeAppropriateTitle()}
            </Text>

            <View style={styles.criteriaRow}>
              <Text style={styles.criteriaText}>{calculation.criteria}</Text>
              <StarSystem
                starsEarned={calculation.stars}
                size="small"
                animated={false}
                showCount={false}
                starType={starType}
                particleEffects={false}
                ageGroup={ageGroup}
              />
            </View>

            {calculation.bonus.length > 0 && (
              <View style={styles.bonusSection}>
                <Text style={styles.bonusTitle}>🎁 Bonus obtenidos:</Text>
                {calculation.bonus.map((bonus, index) => (
                  <Text key={index} style={styles.bonusText}>
                    • {bonus}
                  </Text>
                ))}
              </View>
            )}
          </Animated.View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export const useStarSystem = () => {
  const [totalStars, setTotalStars] = useState(0);
  const [dailyStars, setDailyStars] = useState(0);
  const [weeklyStars, setWeeklyStars] = useState(0);
  const [starHistory, setStarHistory] = useState<
    Array<{
      date: Date;
      stars: number;
      type: string;
    }>
  >([]);

  const awardStars = (amount: number, type: string = "classic") => {
    setTotalStars((prev) => prev + amount);
    setDailyStars((prev) => prev + amount);
    setWeeklyStars((prev) => prev + amount);

    setStarHistory((prev) => [
      ...prev,
      {
        date: new Date(),
        stars: amount,
        type,
      },
    ]);
  };

  const getStarLevel = () => {
    if (totalStars >= 1000)
      return { level: 10, title: "Maestro Estelar", emoji: "🌟" };
    if (totalStars >= 750)
      return { level: 9, title: "Cazador de Estrellas", emoji: "⭐" };
    if (totalStars >= 500)
      return { level: 8, title: "Coleccionista Estelar", emoji: "🌠" };
    if (totalStars >= 350)
      return { level: 7, title: "Navegante Estelar", emoji: "✨" };
    if (totalStars >= 250)
      return { level: 6, title: "Explorador Estelar", emoji: "💫" };
    if (totalStars >= 150)
      return { level: 5, title: "Buscador de Estrellas", emoji: "🌟" };
    if (totalStars >= 100)
      return { level: 4, title: "Aspirante Estelar", emoji: "⭐" };
    if (totalStars >= 50)
      return { level: 3, title: "Novato Estelar", emoji: "✨" };
    if (totalStars >= 25) return { level: 2, title: "Aprendiz", emoji: "💫" };
    return { level: 1, title: "Aventurero", emoji: "🌠" };
  };

  const getStarStats = () => {
    const today = new Date().toDateString();
    const todayStars = starHistory
      .filter((entry) => entry.date.toDateString() === today)
      .reduce((sum, entry) => sum + entry.stars, 0);

    return {
      totalStars,
      dailyStars: todayStars,
      weeklyStars,
      averageDaily:
        starHistory.length > 0
          ? totalStars / Math.max(1, starHistory.length)
          : 0,
      starHistory,
    };
  };

  return {
    totalStars,
    dailyStars,
    weeklyStars,
    awardStars,
    getStarLevel,
    getStarStats,
  };
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  starContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  star: {
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  starCount: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: "600",
    marginTop: spacing.xs,
  },
  breakdown: {
    backgroundColor: colors.background.paper,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginTop: spacing.md,
    ...shadows.medium,
    maxWidth: width * 0.9,
  },
  breakdownTitle: {
    ...typography.h3,
    color: colors.primary.main,
    textAlign: "center",
    marginBottom: spacing.md,
    fontWeight: "600",
  },
  criteriaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary.light + "30",
  },
  criteriaText: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: "500",
    flex: 1,
  },
  bonusSection: {
    marginTop: spacing.sm,
  },
  bonusTitle: {
    ...typography.h3,
    color: colors.primary.main,
    marginBottom: spacing.sm,
    fontWeight: "600",
  },
  bonusText: {
    ...typography.caption,
    color: colors.text.secondary,
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  closeButton: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.text.light + "20",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: colors.text.secondary,
    fontSize: 16,
    fontWeight: "bold",
  },
  starTrail: {
    position: "absolute",
    backgroundColor: "rgba(255, 215, 0, 0.3)",
    borderRadius: 50,
    top: "50%",
    left: "50%",
    marginLeft: -25,
    marginTop: -25,
  },
  starGlow: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    top: "50%",
    left: "50%",
    marginLeft: -20,
    marginTop: -20,
  },
  starGlowText: {
    color: colors.primary.main,
    fontSize: 16,
    fontWeight: "bold",
  },
  countContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.sm,
  },
  starTypeLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: "600",
  },
  particle: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: 20,
    height: 20,
  },
  particleText: {
    fontSize: 14,
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default StarSystem;
