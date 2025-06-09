import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import {
  colors,
  spacing,
  typography,
  shadows,
  borderRadius,
} from "../styles/theme";

interface DungeonMapProps {
  currentLevel: number;
  completedLevels: number[];
  onLevelSelect?: (level: number) => void;
}

interface MapLevel {
  id: number;
  title: string;
  icon: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  isCompleted: boolean;
  isUnlocked: boolean;
  isCurrent: boolean;
  position: "left" | "center" | "right";
}

const { width } = Dimensions.get("window");

export const DungeonMap: React.FC<DungeonMapProps> = ({
  currentLevel,
  completedLevels,
  onLevelSelect,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Configuración de niveles del mapa
  const mapLevels: MapLevel[] = [
    {
      id: 1,
      title: "Entrada Principal",
      icon: "🏰",
      description: "El comienzo de tu aventura",
      difficulty: "easy",
      isCompleted: completedLevels.includes(1),
      isUnlocked: true,
      isCurrent: currentLevel === 1,
      position: "center",
    },
    {
      id: 2,
      title: "Sala Dorada",
      icon: "✨",
      description: "Un lugar resplandeciente lleno de tesoros",
      difficulty: "easy",
      isCompleted: completedLevels.includes(2),
      isUnlocked: currentLevel >= 2 || completedLevels.includes(1),
      isCurrent: currentLevel === 2,
      position: "left",
    },
    {
      id: 3,
      title: "Túnel Misterioso",
      icon: "🌀",
      description: "Pasajes oscuros con secretos ocultos",
      difficulty: "medium",
      isCompleted: completedLevels.includes(3),
      isUnlocked: currentLevel >= 3 || completedLevels.includes(2),
      isCurrent: currentLevel === 3,
      position: "right",
    },
    {
      id: 4,
      title: "Torre del Mago",
      icon: "🏗️",
      description: "Una torre elevada con desafíos complejos",
      difficulty: "medium",
      isCompleted: completedLevels.includes(4),
      isUnlocked: currentLevel >= 4 || completedLevels.includes(3),
      isCurrent: currentLevel === 4,
      position: "center",
    },
    {
      id: 5,
      title: "Caverna del Tesoro",
      icon: "💎",
      description: "Cavernas profundas con riquezas matemáticas",
      difficulty: "medium",
      isCompleted: completedLevels.includes(5),
      isUnlocked: currentLevel >= 5 || completedLevels.includes(4),
      isCurrent: currentLevel === 5,
      position: "left",
    },
    {
      id: 6,
      title: "Cámara de Fuego",
      icon: "🔥",
      description: "Un lugar ardiente lleno de desafíos",
      difficulty: "hard",
      isCompleted: completedLevels.includes(6),
      isUnlocked: currentLevel >= 6 || completedLevels.includes(5),
      isCurrent: currentLevel === 6,
      position: "right",
    },
    {
      id: 7,
      title: "Cámara de Hielo",
      icon: "❄️",
      description: "Un reino helado de problemas complejos",
      difficulty: "hard",
      isCompleted: completedLevels.includes(7),
      isUnlocked: currentLevel >= 7 || completedLevels.includes(6),
      isCurrent: currentLevel === 7,
      position: "left",
    },
    {
      id: 8,
      title: "Sala del Jefe Final",
      icon: "👑",
      description: "El desafío final del minotauro",
      difficulty: "hard",
      isCompleted: completedLevels.includes(8),
      isUnlocked: currentLevel >= 8 || completedLevels.includes(7),
      isCurrent: currentLevel === 8,
      position: "center",
    },
  ];

  useEffect(() => {
    // Animación de pulso para el nivel actual
    const pulseAnimation = Animated.loop(
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
    );

    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, [currentLevel]);

  useEffect(() => {
    // Auto scroll al nivel actual
    if (scrollViewRef.current) {
      const currentLevelIndex = mapLevels.findIndex((level) => level.isCurrent);
      if (currentLevelIndex > 0) {
        scrollViewRef.current.scrollTo({
          y: currentLevelIndex * 180,
          animated: true,
        });
      }
    }
  }, [currentLevel]);

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

  const getLevelStatus = (level: MapLevel) => {
    if (level.isCompleted) return "completed";
    if (level.isCurrent) return "current";
    if (level.isUnlocked) return "unlocked";
    return "locked";
  };

  const getLevelStyle = (level: MapLevel) => {
    const status = getLevelStatus(level);
    const baseStyle = [styles.levelNode];

    switch (status) {
      case "completed":
        return [...baseStyle, styles.completedLevel];
      case "current":
        return [...baseStyle, styles.currentLevel];
      case "unlocked":
        return [...baseStyle, styles.unlockedLevel];
      default:
        return [...baseStyle, styles.lockedLevel];
    }
  };

  const getPositionStyle = (position: "left" | "center" | "right") => {
    switch (position) {
      case "left":
        return { alignSelf: "flex-start" as const, marginLeft: spacing.lg };
      case "right":
        return { alignSelf: "flex-end" as const, marginRight: spacing.lg };
      default:
        return { alignSelf: "center" as const };
    }
  };

  const renderConnector = (
    index: number,
    currentPosition: string,
    nextPosition: string
  ) => {
    if (index === mapLevels.length - 1) return null;

    const isCompleted = mapLevels[index].isCompleted;
    const connectorStyle = [
      styles.connector,
      isCompleted ? styles.completedConnector : styles.defaultConnector,
    ];

    if (currentPosition === nextPosition) {
      return <View style={[connectorStyle, styles.straightConnector]} />;
    } else {
      const isLeftToRight =
        currentPosition === "left" && nextPosition === "right";
      const isRightToLeft =
        currentPosition === "right" && nextPosition === "left";
      const isCenterToSide =
        currentPosition === "center" &&
        (nextPosition === "left" || nextPosition === "right");
      const isSideToCenter =
        (currentPosition === "left" || currentPosition === "right") &&
        nextPosition === "center";

      return (
        <View style={styles.connectorContainer}>
          <View style={[connectorStyle, styles.curvedConnector]} />
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🗺️ Mapa de la Mazmorra</Text>
        <Text style={styles.subtitle}>Tu progreso aventurero</Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {mapLevels.map((level, index) => (
          <View key={level.id} style={styles.levelContainer}>
            <Animated.View
              style={[
                getLevelStyle(level),
                getPositionStyle(level.position),
                level.isCurrent && { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <TouchableOpacity
                style={styles.levelTouchable}
                onPress={() => level.isUnlocked && onLevelSelect?.(level.id)}
                disabled={!level.isUnlocked}
                activeOpacity={0.8}
              >
                <Text style={styles.levelIcon}>{level.icon}</Text>
                <Text style={styles.levelNumber}>{level.id}</Text>

                {level.isCompleted && (
                  <View style={styles.completedBadge}>
                    <Text style={styles.completedText}>✓</Text>
                  </View>
                )}

                {level.isCurrent && (
                  <View style={styles.currentBadge}>
                    <Text style={styles.currentText}>📍</Text>
                  </View>
                )}
              </TouchableOpacity>

              <View style={styles.levelInfo}>
                <Text style={styles.levelTitle} numberOfLines={1}>
                  {level.title}
                </Text>
                <Text style={styles.levelDescription} numberOfLines={2}>
                  {level.description}
                </Text>
                <View
                  style={[
                    styles.difficultyBadge,
                    {
                      backgroundColor:
                        getDifficultyColor(level.difficulty) + "20",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.difficultyText,
                      { color: getDifficultyColor(level.difficulty) },
                    ]}
                  >
                    {level.difficulty}
                  </Text>
                </View>
              </View>
            </Animated.View>

            {renderConnector(
              index,
              level.position,
              mapLevels[index + 1]?.position
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendIcon, styles.completedLevel]} />
          <Text style={styles.legendText}>Completado</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendIcon, styles.currentLevel]} />
          <Text style={styles.legendText}>Actual</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendIcon, styles.lockedLevel]} />
          <Text style={styles.legendText}>Bloqueado</Text>
        </View>
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
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: colors.background.paper,
    ...shadows.small,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  levelContainer: {
    marginBottom: spacing.lg,
  },
  levelNode: {
    width: width * 0.7,
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.medium,
    borderWidth: 2,
  },
  completedLevel: {
    borderColor: colors.success.main,
    backgroundColor: colors.success.light + "10",
  },
  currentLevel: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.light + "10",
  },
  unlockedLevel: {
    borderColor: colors.primary.light,
    backgroundColor: colors.background.paper,
  },
  lockedLevel: {
    borderColor: colors.text.light,
    backgroundColor: colors.background.secondary,
    opacity: 0.6,
  },
  levelTouchable: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
    position: "relative",
  },
  levelIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  levelNumber: {
    ...typography.h1,
    color: colors.text.primary,
    minWidth: 40,
  },
  completedBadge: {
    position: "absolute",
    right: 0,
    top: -spacing.xs,
    backgroundColor: colors.success.main,
    borderRadius: borderRadius.round,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  completedText: {
    color: colors.background.paper,
    fontSize: 12,
    fontWeight: "bold",
  },
  currentBadge: {
    position: "absolute",
    right: 0,
    top: -spacing.xs,
  },
  currentText: {
    fontSize: 16,
  },
  levelInfo: {
    paddingLeft: spacing.sm,
  },
  levelTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  levelDescription: {
    ...typography.body,
    color: colors.text.secondary,
    fontSize: 14,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  difficultyBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  difficultyText: {
    ...typography.caption,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  connectorContainer: {
    alignItems: "center",
    height: 30,
  },
  connector: {
    width: 4,
    height: 30,
  },
  straightConnector: {
    alignSelf: "center",
  },
  curvedConnector: {
    borderRadius: 2,
  },
  defaultConnector: {
    backgroundColor: colors.text.light,
  },
  completedConnector: {
    backgroundColor: colors.success.main,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: spacing.md,
    backgroundColor: colors.background.paper,
    borderTopWidth: 1,
    borderTopColor: colors.primary.light,
  },
  legendItem: {
    alignItems: "center",
    gap: spacing.xs,
  },
  legendIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  legendText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
});

export default DungeonMap;
