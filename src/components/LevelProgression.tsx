import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import {
  colors,
  spacing,
  typography,
  shadows,
  borderRadius,
} from "../styles/theme";

interface LevelProgressionProps {
  currentXP: number;
  level: number;
  animated?: boolean;
  showDetails?: boolean;
  onLevelUp?: (newLevel: number) => void;
}

interface LevelData {
  level: number;
  title: string;
  emoji: string;
  xpRequired: number;
  xpToNext: number;
  rewards: string[];
  unlocks: string[];
}

const { width } = Dimensions.get("window");

export const LevelProgression: React.FC<LevelProgressionProps> = ({
  currentXP,
  level,
  animated = true,
  showDetails = true,
  onLevelUp,
}) => {
  const [displayXP, setDisplayXP] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [showLevelUp, setShowLevelUp] = useState(false);

  const levelData = getLevelData(level);
  const progressPercentage = Math.min(
    (currentXP / levelData.xpToNext) * 100,
    100
  );

  // Animación de XP
  useEffect(() => {
    if (!animated) {
      setDisplayXP(currentXP);
      return;
    }

    // Animación gradual de XP
    Animated.timing(progressAnim, {
      toValue: progressPercentage / 100,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    // Contador animado de XP
    const animateXP = () => {
      const startXP = displayXP;
      const endXP = currentXP;
      const duration = 1000;
      const startTime = Date.now();

      const updateXP = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentDisplayXP = Math.floor(
          startXP + (endXP - startXP) * progress
        );

        setDisplayXP(currentDisplayXP);

        if (progress < 1) {
          requestAnimationFrame(updateXP);
        }
      };

      updateXP();
    };

    animateXP();
  }, [currentXP, animated, progressPercentage]);

  // Detectar level up
  useEffect(() => {
    if (currentXP >= levelData.xpToNext && level < getMaxLevel()) {
      setShowLevelUp(true);
      onLevelUp?.(level + 1);

      // Animación de level up
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => setShowLevelUp(false), 3000);
    }
  }, [currentXP, level, levelData.xpToNext]);

  return (
    <View style={styles.container}>
      {/* Header del nivel */}
      <Animated.View
        style={[styles.levelHeader, { transform: [{ scale: scaleAnim }] }]}
      >
        <Text style={styles.levelEmoji}>{levelData.emoji}</Text>
        <View style={styles.levelInfo}>
          <Text style={styles.levelNumber}>Nivel {levelData.level}</Text>
          <Text style={styles.levelTitle}>{levelData.title}</Text>
        </View>
      </Animated.View>

      {/* Barra de progreso */}
      <View style={styles.progressSection}>
        <View style={styles.progressBar}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>

        <View style={styles.xpInfo}>
          <Text style={styles.xpText}>
            {displayXP.toLocaleString()} / {levelData.xpToNext.toLocaleString()}{" "}
            XP
          </Text>
          <Text style={styles.progressText}>
            {Math.round(progressPercentage)}%
          </Text>
        </View>
      </View>

      {/* Detalles del nivel */}
      {showDetails && (
        <View style={styles.detailsSection}>
          {levelData.rewards.length > 0 && (
            <View style={styles.rewardsSection}>
              <Text style={styles.sectionTitle}>🎁 Recompensas</Text>
              {levelData.rewards.map((reward, index) => (
                <Text key={index} style={styles.rewardText}>
                  • {reward}
                </Text>
              ))}
            </View>
          )}

          {levelData.unlocks.length > 0 && (
            <View style={styles.unlocksSection}>
              <Text style={styles.sectionTitle}>🔓 Desbloqueado</Text>
              {levelData.unlocks.map((unlock, index) => (
                <Text key={index} style={styles.unlockText}>
                  • {unlock}
                </Text>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Animación de Level Up */}
      {showLevelUp && (
        <LevelUpAnimation
          newLevel={level + 1}
          newLevelData={getLevelData(level + 1)}
        />
      )}
    </View>
  );
};

// Componente de animación de level up
const LevelUpAnimation: React.FC<{
  newLevel: number;
  newLevelData: LevelData;
}> = ({ newLevel, newLevelData }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, 2500);
  }, []);

  return (
    <Animated.View
      style={[
        styles.levelUpOverlay,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={styles.levelUpTitle}>🎉 ¡NIVEL SUBIDO!</Text>
      <Text style={styles.levelUpEmoji}>{newLevelData.emoji}</Text>
      <Text style={styles.levelUpText}>Nivel {newLevel}</Text>
      <Text style={styles.levelUpSubtitle}>{newLevelData.title}</Text>
    </Animated.View>
  );
};

// Función para obtener datos del nivel
export const getLevelData = (level: number): LevelData => {
  const levels: { [key: number]: Omit<LevelData, "level"> } = {
    1: {
      title: "Aventurero Novato",
      emoji: "🌱",
      xpRequired: 0,
      xpToNext: 100,
      rewards: ["Bienvenida al mundo de las matemáticas"],
      unlocks: ["Problemas básicos de suma", "Tutorial completo"],
    },
    2: {
      title: "Explorador Curioso",
      emoji: "🔍",
      xpRequired: 100,
      xpToNext: 250,
      rewards: ["Pista gratis diaria", "+10% XP por velocidad"],
      unlocks: ["Problemas de resta", "Primer logro disponible"],
    },
    3: {
      title: "Matemático Aprendiz",
      emoji: "📚",
      xpRequired: 250,
      xpToNext: 500,
      rewards: ["Multiplicador de racha x1.5", "Avatar personalizable"],
      unlocks: ["Problemas de multiplicación", "Sistema de rachas"],
    },
    4: {
      title: "Calculador Hábil",
      emoji: "🧮",
      xpRequired: 500,
      xpToNext: 800,
      rewards: ["Bonus de estrella por perfección", "Tema dorado"],
      unlocks: ["Problemas de división", "Modos de dificultad"],
    },
    5: {
      title: "Estratega Numérico",
      emoji: "♟️",
      xpRequired: 800,
      xpToNext: 1200,
      rewards: ["Multiplicador de XP x2", "Efectos especiales"],
      unlocks: ["Problemas complejos", "Desafíos diarios"],
    },
    6: {
      title: "Maestro de Cifras",
      emoji: "🎓",
      xpRequired: 1200,
      xpToNext: 1800,
      rewards: ["Vida extra permanente", "Insignia de maestro"],
      unlocks: ["Modo experto", "Torneos semanales"],
    },
    7: {
      title: "Sabio Matemático",
      emoji: "🧙‍♂️",
      xpRequired: 1800,
      xpToNext: 2500,
      rewards: ["Pistas ilimitadas", "Aura mágica"],
      unlocks: ["Problemas épicos", "Liga de maestros"],
    },
    8: {
      title: "Genio Numérico",
      emoji: "🧠",
      xpRequired: 2500,
      xpToNext: 3500,
      rewards: ["Multiplicador x3", "Corona de genio"],
      unlocks: ["Desafíos imposibles", "Sala de la fama"],
    },
    9: {
      title: "Leyenda Viviente",
      emoji: "👑",
      xpRequired: 3500,
      xpToNext: 5000,
      rewards: ["Estatus legendario", "Efectos épicos"],
      unlocks: ["Modo leyenda", "Creador de problemas"],
    },
    10: {
      title: "Dios de las Matemáticas",
      emoji: "🌟",
      xpRequired: 5000,
      xpToNext: 9999999, // Nivel máximo
      rewards: ["Poder absoluto", "Inmortalidad matemática"],
      unlocks: ["Todos los secretos", "Mentor de otros"],
    },
  };

  const levelInfo = levels[level] || levels[1];
  return {
    level,
    ...levelInfo,
  };
};

export const getMaxLevel = () => 10;

export const calculateLevel = (totalXP: number): number => {
  for (let level = 1; level <= getMaxLevel(); level++) {
    const levelData = getLevelData(level);
    if (totalXP < levelData.xpToNext) {
      return level;
    }
  }
  return getMaxLevel();
};

// Hook para gestionar la progresión del usuario
export const useLevelProgression = (initialXP: number = 0) => {
  const [totalXP, setTotalXP] = useState(initialXP);
  const [currentLevel, setCurrentLevel] = useState(calculateLevel(initialXP));
  const [levelUpQueue, setLevelUpQueue] = useState<number[]>([]);

  const addXP = (amount: number) => {
    const newTotalXP = totalXP + amount;
    const newLevel = calculateLevel(newTotalXP);

    setTotalXP(newTotalXP);

    if (newLevel > currentLevel) {
      setLevelUpQueue((prev) => [...prev, newLevel]);
      setCurrentLevel(newLevel);
    }
  };

  const getLevelProgress = () => {
    const levelData = getLevelData(currentLevel);
    const progressToNext = totalXP - levelData.xpRequired;
    const xpNeededForNext = levelData.xpToNext - levelData.xpRequired;
    const percentage = Math.min((progressToNext / xpNeededForNext) * 100, 100);

    return {
      currentXP: progressToNext,
      xpToNext: xpNeededForNext,
      percentage,
      isMaxLevel: currentLevel >= getMaxLevel(),
    };
  };

  const processLevelUpQueue = () => {
    if (levelUpQueue.length > 0) {
      const nextLevel = levelUpQueue[0];
      setLevelUpQueue((prev) => prev.slice(1));
      return nextLevel;
    }
    return null;
  };

  return {
    totalXP,
    currentLevel,
    addXP,
    getLevelProgress,
    processLevelUpQueue,
    hasLevelUp: levelUpQueue.length > 0,
  };
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  levelHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
    backgroundColor: colors.background.paper,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
  },
  levelEmoji: {
    fontSize: 48,
    marginRight: spacing.md,
  },
  levelInfo: {
    flex: 1,
  },
  levelNumber: {
    ...typography.h1,
    color: colors.primary.main,
    fontWeight: "700",
  },
  levelTitle: {
    ...typography.body,
    color: colors.text.secondary,
    fontWeight: "500",
  },
  progressSection: {
    marginBottom: spacing.lg,
  },
  progressBar: {
    height: 12,
    backgroundColor: colors.primary.light + "30",
    borderRadius: borderRadius.round,
    overflow: "hidden",
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.round,
  },
  xpInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  xpText: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: "600",
  },
  progressText: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: "500",
  },
  detailsSection: {
    gap: spacing.md,
  },
  rewardsSection: {
    backgroundColor: colors.success.light + "20",
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.success.main,
  },
  unlocksSection: {
    backgroundColor: colors.accent + "20",
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  rewardText: {
    ...typography.caption,
    color: colors.success.dark,
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
  unlockText: {
    ...typography.caption,
    color: colors.accent,
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
  levelUpOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  levelUpTitle: {
    ...typography.h1,
    color: colors.gold,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: spacing.md,
  },
  levelUpEmoji: {
    fontSize: 80,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  levelUpText: {
    ...typography.h1,
    color: colors.background.paper,
    fontWeight: "700",
    textAlign: "center",
  },
  levelUpSubtitle: {
    ...typography.h2,
    color: colors.primary.light,
    textAlign: "center",
    marginTop: spacing.sm,
  },
});

export default LevelProgression;
