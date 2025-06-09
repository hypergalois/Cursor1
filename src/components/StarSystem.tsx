import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Modal,
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
}

interface StarCalculation {
  stars: number;
  criteria: string;
  bonus: string[];
}

const { width } = Dimensions.get("window");

export const StarSystem: React.FC<StarSystemProps> = ({
  starsEarned,
  maxStars = 3,
  size = "medium",
  animated = true,
  showCount = true,
  onStarPress,
}) => {
  const [displayedStars, setDisplayedStars] = useState(0);
  const animationRefs = useRef<Animated.Value[]>([]);

  // Inicializar animaciones
  useEffect(() => {
    animationRefs.current = Array.from(
      { length: maxStars },
      () => new Animated.Value(0)
    );
  }, [maxStars]);

  // Animación de estrellas
  useEffect(() => {
    if (!animated) {
      setDisplayedStars(starsEarned);
      return;
    }

    // Animar entrada de estrellas una por una
    const animateStars = async () => {
      for (let i = 0; i < starsEarned; i++) {
        await new Promise((resolve) => {
          setTimeout(() => {
            setDisplayedStars(i + 1);

            // Animación de aparición con bounce
            Animated.sequence([
              Animated.timing(animationRefs.current[i], {
                toValue: 1.3,
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.spring(animationRefs.current[i], {
                toValue: 1,
                friction: 3,
                tension: 100,
                useNativeDriver: true,
              }),
            ]).start();

            resolve(true);
          }, i * 300); // Delay entre estrellas
        });
      }
    };

    animateStars();
  }, [starsEarned, animated]);

  const getStarSize = () => {
    switch (size) {
      case "small":
        return 24;
      case "medium":
        return 36;
      case "large":
        return 48;
      default:
        return 36;
    }
  };

  const getStarColor = (index: number) => {
    if (index < displayedStars) {
      return colors.gold; // Estrella ganada
    } else if (index < starsEarned) {
      return colors.primary.main; // Estrella en progreso
    } else {
      return colors.text.light; // Estrella vacía
    }
  };

  const renderStar = (index: number) => {
    const starSize = getStarSize();
    const isEarned = index < displayedStars;
    const animatedStyle =
      animated && animationRefs.current[index]
        ? {
            transform: [{ scale: animationRefs.current[index] }],
          }
        : {};

    return (
      <TouchableOpacity
        key={index}
        onPress={() => onStarPress?.(index)}
        disabled={!onStarPress}
        activeOpacity={0.8}
      >
        <Animated.View style={[styles.starContainer, animatedStyle]}>
          <Text
            style={[
              styles.star,
              {
                fontSize: starSize,
                color: getStarColor(index),
              },
            ]}
          >
            {isEarned ? "⭐" : "☆"}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.starsRow}>
        {Array.from({ length: maxStars }, (_, index) => renderStar(index))}
      </View>

      {showCount && (
        <Text style={[styles.starCount, { fontSize: getStarSize() * 0.4 }]}>
          {displayedStars}/{maxStars}
        </Text>
      )}
    </View>
  );
};

// Función para calcular estrellas basadas en rendimiento
export const calculateStars = (
  correct: boolean,
  timeSpent: number,
  difficulty: string,
  streak: number,
  hintsUsed: number
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

  // Estrella base por respuesta correcta
  stars = 1;
  criteria = "✅ Respuesta correcta";

  // Estrella por velocidad
  const timeThresholds = {
    easy: 20,
    medium: 30,
    hard: 45,
  };

  const timeLimit =
    timeThresholds[difficulty as keyof typeof timeThresholds] || 30;

  if (timeSpent <= timeLimit * 0.6) {
    stars = Math.max(stars, 2);
    bonus.push(`⚡ Velocidad increíble (${Math.round(timeSpent)}s)`);
  } else if (timeSpent <= timeLimit * 0.8) {
    if (stars < 2) {
      bonus.push(`🏃 Buena velocidad (${Math.round(timeSpent)}s)`);
    }
  }

  // Estrella por rendimiento perfecto
  const perfectConditions = [
    timeSpent <= timeLimit * 0.5,
    hintsUsed === 0,
    streak >= 3,
  ];

  const metConditions = perfectConditions.filter(Boolean).length;

  if (metConditions >= 2) {
    stars = 3;
    bonus.push("🏆 Rendimiento perfecto");
  }

  // Bonus adicionales
  if (hintsUsed === 0) {
    bonus.push("🧠 Sin pistas usadas");
  }

  if (streak >= 5) {
    bonus.push(`🔥 Racha épica (${streak})`);
  } else if (streak >= 3) {
    bonus.push(`🔥 Buena racha (${streak})`);
  }

  if (difficulty === "hard" && stars >= 2) {
    bonus.push("💪 Dificultad alta superada");
  }

  return { stars, criteria, bonus };
};

// Componente para mostrar el desglose de estrellas
export const StarBreakdown: React.FC<{
  calculation: StarCalculation;
  visible: boolean;
  onClose: () => void;
}> = ({ calculation, visible, onClose }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

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
          <Animated.View style={[styles.breakdown, { opacity: fadeAnim }]}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.breakdownTitle}>⭐ Estrellas Ganadas</Text>

            <View style={styles.criteriaRow}>
              <Text style={styles.criteriaText}>{calculation.criteria}</Text>
              <StarSystem
                starsEarned={calculation.stars}
                size="small"
                animated={false}
                showCount={false}
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

// Hook para gestionar estrellas del usuario
export const useStarSystem = () => {
  const [totalStars, setTotalStars] = useState(0);
  const [dailyStars, setDailyStars] = useState(0);
  const [weeklyStars, setWeeklyStars] = useState(0);

  const awardStars = (amount: number) => {
    setTotalStars((prev) => prev + amount);
    setDailyStars((prev) => prev + amount);
    setWeeklyStars((prev) => prev + amount);
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

  return {
    totalStars,
    dailyStars,
    weeklyStars,
    awardStars,
    getStarLevel,
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
    color: colors.accent,
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
});

export default StarSystem;
