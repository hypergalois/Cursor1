import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
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
  userProfile?: {
    ageGroup: "kids" | "teens" | "adults" | "seniors";
    totalXP: number;
    streakDays: number;
  };
  onLevelSelect?: (level: number) => void;
  onAchievementView?: (achievement: any) => void;
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
  requiredXP: number;
  rewards: {
    xp: number;
    stars: number;
    gems?: number;
    special?: string;
  };
  achievements: string[];
  completionPercentage: number;
}

interface LevelDetail {
  level: MapLevel;
  visible: boolean;
}

const { width, height } = Dimensions.get("window");

export const DungeonMap: React.FC<DungeonMapProps> = ({
  currentLevel,
  completedLevels,
  userProfile,
  onLevelSelect,
  onAchievementView,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pathAnim = useRef(new Animated.Value(0)).current;
  const [selectedLevel, setSelectedLevel] = useState<LevelDetail>({
    level: {} as MapLevel,
    visible: false,
  });

  const mapLevels: MapLevel[] = [
    {
      id: 1,
      title: "Portal de Entrada",
      icon: "🚪",
      description: "Tu primera aventura matemática comienza aquí",
      difficulty: "easy",
      isCompleted: completedLevels.includes(1),
      isUnlocked: true,
      isCurrent: currentLevel === 1,
      position: "center",
      requiredXP: 0,
      rewards: { xp: 100, stars: 3, gems: 5, special: "Bienvenida heroica" },
      achievements: ["first_steps", "beginner_explorer"],
      completionPercentage: completedLevels.includes(1) ? 100 : 0,
    },
    {
      id: 2,
      title: "Sala de Oro",
      icon: "🏆",
      description: "Descubre los tesoros matemáticos básicos",
      difficulty: "easy",
      isCompleted: completedLevels.includes(2),
      isUnlocked: currentLevel >= 2 || completedLevels.includes(1),
      isCurrent: currentLevel === 2,
      position: "left",
      requiredXP: 100,
      rewards: {
        xp: 150,
        stars: 4,
        gems: 8,
        special: "Corona de principiante",
      },
      achievements: ["treasure_finder", "golden_mind"],
      completionPercentage: completedLevels.includes(2)
        ? 100
        : currentLevel === 2
        ? 25
        : 0,
    },
    {
      id: 3,
      title: "Túnel Espiral",
      icon: "🌪️",
      description: "Navega por desafíos en espiral creciente",
      difficulty: "medium",
      isCompleted: completedLevels.includes(3),
      isUnlocked: currentLevel >= 3 || completedLevels.includes(2),
      isCurrent: currentLevel === 3,
      position: "right",
      requiredXP: 250,
      rewards: { xp: 200, stars: 5, gems: 12, special: "Brújula mágica" },
      achievements: ["spiral_master", "problem_solver"],
      completionPercentage: completedLevels.includes(3)
        ? 100
        : currentLevel === 3
        ? 40
        : 0,
    },
    {
      id: 4,
      title: "Torre del Saber",
      icon: "🗼",
      description: "Asciende por los pisos del conocimiento",
      difficulty: "medium",
      isCompleted: completedLevels.includes(4),
      isUnlocked: currentLevel >= 4 || completedLevels.includes(3),
      isCurrent: currentLevel === 4,
      position: "center",
      requiredXP: 400,
      rewards: { xp: 250, stars: 6, gems: 15, special: "Cetro de sabiduría" },
      achievements: ["tower_climber", "knowledge_seeker"],
      completionPercentage: completedLevels.includes(4)
        ? 100
        : currentLevel === 4
        ? 60
        : 0,
    },
    {
      id: 5,
      title: "Caverna Cristalina",
      icon: "💎",
      description: "Explora las profundidades cristalizadas",
      difficulty: "medium",
      isCompleted: completedLevels.includes(5),
      isUnlocked: currentLevel >= 5 || completedLevels.includes(4),
      isCurrent: currentLevel === 5,
      position: "left",
      requiredXP: 600,
      rewards: { xp: 300, stars: 7, gems: 20, special: "Gema del poder" },
      achievements: ["crystal_hunter", "deep_explorer"],
      completionPercentage: completedLevels.includes(5)
        ? 100
        : currentLevel === 5
        ? 75
        : 0,
    },
    {
      id: 6,
      title: "Forja Ardiente",
      icon: "⚒️",
      description: "Forja tu mente en las llamas del desafío",
      difficulty: "hard",
      isCompleted: completedLevels.includes(6),
      isUnlocked: currentLevel >= 6 || completedLevels.includes(5),
      isCurrent: currentLevel === 6,
      position: "right",
      requiredXP: 800,
      rewards: { xp: 400, stars: 8, gems: 25, special: "Martillo legendario" },
      achievements: ["flame_forger", "heat_master"],
      completionPercentage: completedLevels.includes(6)
        ? 100
        : currentLevel === 6
        ? 80
        : 0,
    },
    {
      id: 7,
      title: "Glaciar Eterno",
      icon: "🧊",
      description: "Conquista las cumbres heladas del intelecto",
      difficulty: "hard",
      isCompleted: completedLevels.includes(7),
      isUnlocked: currentLevel >= 7 || completedLevels.includes(6),
      isCurrent: currentLevel === 7,
      position: "left",
      requiredXP: 1000,
      rewards: {
        xp: 500,
        stars: 9,
        gems: 30,
        special: "Cristal de hielo eterno",
      },
      achievements: ["ice_conqueror", "summit_climber"],
      completionPercentage: completedLevels.includes(7)
        ? 100
        : currentLevel === 7
        ? 90
        : 0,
    },
    {
      id: 8,
      title: "Trono del Minotauro",
      icon: "🐂",
      description: "Enfréntate al desafío final del laberinto",
      difficulty: "hard",
      isCompleted: completedLevels.includes(8),
      isUnlocked: currentLevel >= 8 || completedLevels.includes(7),
      isCurrent: currentLevel === 8,
      position: "center",
      requiredXP: 1500,
      rewards: {
        xp: 1000,
        stars: 15,
        gems: 50,
        special: "Corona del Minotauro",
      },
      achievements: ["minotaur_slayer", "maze_master", "final_champion"],
      completionPercentage: completedLevels.includes(8)
        ? 100
        : currentLevel === 8
        ? 95
        : 0,
    },
  ];

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );

    Animated.timing(pathAnim, {
      toValue: completedLevels.length / mapLevels.length,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, [currentLevel, completedLevels]);

  useEffect(() => {
    if (scrollViewRef.current) {
      const currentLevelIndex = mapLevels.findIndex((level) => level.isCurrent);
      if (currentLevelIndex > 0) {
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            y: currentLevelIndex * 200,
            animated: true,
          });
        }, 500);
      }
    }
  }, [currentLevel]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return colors.success.main;
      case "medium":
        return colors.warning.main;
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

  const openLevelDetails = (level: MapLevel) => {
    if (level.isUnlocked) {
      setSelectedLevel({ level, visible: true });
    }
  };

  const renderDuolingoPath = (
    index: number,
    currentLevel: MapLevel,
    nextLevel?: MapLevel
  ) => {
    if (!nextLevel) return null;

    const isPathCompleted = currentLevel.isCompleted;
    const pathProgress = pathAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.pathContainer}>
        <View
          style={[
            styles.pathBase,
            getPathDirection(currentLevel.position, nextLevel.position),
          ]}
        >
          <Animated.View
            style={[
              styles.pathProgress,
              {
                backgroundColor: isPathCompleted
                  ? colors.success.main
                  : colors.primary.main,
                width: pathProgress.interpolate({
                  inputRange: [
                    index / mapLevels.length,
                    (index + 1) / mapLevels.length,
                  ],
                  outputRange: ["0%", "100%"],
                  extrapolate: "clamp",
                }),
              },
            ]}
          />

          {isPathCompleted && (
            <View style={styles.pathParticles}>
              <Text style={styles.pathSparkle}>✨</Text>
            </View>
          )}
        </View>

        {index % 2 === 0 && (
          <View
            style={[
              styles.checkpoint,
              isPathCompleted && styles.checkpointActive,
            ]}
          >
            <Text style={styles.checkpointIcon}>
              {isPathCompleted ? "⭐" : "○"}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const getPathDirection = (current: string, next: string) => {
    if (current === next) return styles.pathStraight;
    if (
      (current === "left" && next === "right") ||
      (current === "right" && next === "left")
    ) {
      return styles.pathCurved;
    }
    return styles.pathDiagonal;
  };

  const getAgeAppropriateMessage = (level: MapLevel) => {
    const ageGroup = userProfile?.ageGroup || "adults";
    const messages = {
      kids: {
        locked: "¡Sigue jugando para desbloquear esta aventura! 🌟",
        unlocked: "¡Esta aventura te espera! ¿Estás listo? 🚀",
        current: "¡Estás aquí ahora! ¡Vamos a divertirnos! 🎮",
        completed: "¡Increíble! ¡Ya conquistaste este lugar! 🏆",
      },
      teens: {
        locked: "Complete the previous level to unlock this epic challenge! 💪",
        unlocked: "Ready to take on this challenge? Let's go! 🔥",
        current: "You're here! Time to show your skills! ⚡",
        completed: "Conquered! You absolutely crushed this level! 🎯",
      },
      adults: {
        locked: "Complete el nivel anterior para acceder a este desafío.",
        unlocked: "Nivel disponible. Progreso sistemático recomendado.",
        current: "Nivel actual. Enfoque y determinación conducen al éxito.",
        completed: "Nivel completado exitosamente. Excelente trabajo.",
      },
      seniors: {
        locked: "Complete el nivel anterior para continuar su jornada.",
        unlocked: "Nuevo desafío disponible a su ritmo y comodidad.",
        current: "Su ubicación actual. Tómese el tiempo necesario.",
        completed: "¡Felicitaciones! Nivel completado con maestría.",
      },
    };

    const status = getLevelStatus(level);
    return messages[ageGroup][status];
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🗺️ Camino del Aprendizaje</Text>
        <Text style={styles.subtitle}>
          Nivel {currentLevel} de {mapLevels.length}
        </Text>

        <View style={styles.globalProgress}>
          <View style={styles.globalProgressBar}>
            <View
              style={[
                styles.globalProgressFill,
                {
                  width: `${
                    (completedLevels.length / mapLevels.length) * 100
                  }%`,
                },
              ]}
            />
          </View>
          <Text style={styles.globalProgressText}>
            {Math.round((completedLevels.length / mapLevels.length) * 100)}%
            Completado
          </Text>
        </View>

        {userProfile && (
          <View style={styles.userStats}>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>✨</Text>
              <Text style={styles.statValue}>{userProfile.totalXP}</Text>
              <Text style={styles.statLabel}>XP Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>🔥</Text>
              <Text style={styles.statValue}>{userProfile.streakDays}</Text>
              <Text style={styles.statLabel}>Racha</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>🏆</Text>
              <Text style={styles.statValue}>{completedLevels.length}</Text>
              <Text style={styles.statLabel}>Completados</Text>
            </View>
          </View>
        )}
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
                onPress={() => level.isUnlocked && openLevelDetails(level)}
                disabled={!level.isUnlocked}
                activeOpacity={0.8}
              >
                <View style={styles.levelIconContainer}>
                  <Text
                    style={[
                      styles.levelIcon,
                      !level.isUnlocked && styles.lockedIcon,
                    ]}
                  >
                    {level.isUnlocked ? level.icon : "🔒"}
                  </Text>

                  <View
                    style={[
                      styles.levelNumberBadge,
                      {
                        backgroundColor: getDifficultyColor(level.difficulty),
                      },
                    ]}
                  >
                    <Text style={styles.levelNumber}>{level.id}</Text>
                  </View>
                </View>

                <View style={styles.levelInfo}>
                  <Text
                    style={[
                      styles.levelTitle,
                      !level.isUnlocked && styles.lockedText,
                    ]}
                  >
                    {level.title}
                  </Text>
                  <Text
                    style={[
                      styles.levelDescription,
                      !level.isUnlocked && styles.lockedText,
                    ]}
                  >
                    {level.description}
                  </Text>

                  {level.completionPercentage > 0 &&
                    level.completionPercentage < 100 && (
                      <View style={styles.levelProgressContainer}>
                        <View style={styles.levelProgressBar}>
                          <View
                            style={[
                              styles.levelProgressFill,
                              { width: `${level.completionPercentage}%` },
                            ]}
                          />
                        </View>
                        <Text style={styles.levelProgressText}>
                          {level.completionPercentage}%
                        </Text>
                      </View>
                    )}
                </View>

                {level.isCompleted && (
                  <View style={styles.completedBadge}>
                    <Text style={styles.completedText}>👑</Text>
                  </View>
                )}

                {level.isCurrent && (
                  <View style={styles.currentBadge}>
                    <Text style={styles.currentText}>📍</Text>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>

            {renderDuolingoPath(index, level, mapLevels[index + 1])}
          </View>
        ))}
      </ScrollView>

      <Modal
        visible={selectedLevel.visible}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setSelectedLevel({ ...selectedLevel, visible: false })
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalIcon}>{selectedLevel.level.icon}</Text>
              <View style={styles.modalTitleContainer}>
                <Text style={styles.modalTitle}>
                  {selectedLevel.level.title}
                </Text>
                <Text style={styles.modalSubtitle}>
                  Nivel {selectedLevel.level.id}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() =>
                  setSelectedLevel({ ...selectedLevel, visible: false })
                }
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDescription}>
              {selectedLevel.level.description}
            </Text>

            <View style={styles.motivationalMessage}>
              <Text style={styles.motivationalText}>
                {getAgeAppropriateMessage(selectedLevel.level)}
              </Text>
            </View>

            <View style={styles.rewardsSection}>
              <Text style={styles.sectionTitle}>🎁 Recompensas</Text>
              <View style={styles.rewardsList}>
                <View style={styles.rewardItem}>
                  <Text style={styles.rewardEmoji}>✨</Text>
                  <Text style={styles.rewardText}>
                    {selectedLevel.level.rewards.xp} XP
                  </Text>
                </View>
                <View style={styles.rewardItem}>
                  <Text style={styles.rewardEmoji}>⭐</Text>
                  <Text style={styles.rewardText}>
                    {selectedLevel.level.rewards.stars} Estrellas
                  </Text>
                </View>
                {selectedLevel.level.rewards.gems && (
                  <View style={styles.rewardItem}>
                    <Text style={styles.rewardEmoji}>💎</Text>
                    <Text style={styles.rewardText}>
                      {selectedLevel.level.rewards.gems} Gemas
                    </Text>
                  </View>
                )}
                {selectedLevel.level.rewards.special && (
                  <View style={styles.specialRewardItem}>
                    <Text style={styles.specialRewardText}>
                      🏆 {selectedLevel.level.rewards.special}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {selectedLevel.level.achievements.length > 0 && (
              <View style={styles.achievementsSection}>
                <Text style={styles.sectionTitle}>
                  🏅 Logros Desbloqueables
                </Text>
                <View style={styles.achievementsList}>
                  {selectedLevel.level.achievements.map(
                    (achievementId, index) => (
                      <View key={index} style={styles.achievementItem}>
                        <Text style={styles.achievementText}>
                          {achievementId}
                        </Text>
                      </View>
                    )
                  )}
                </View>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor: selectedLevel.level.isCompleted
                    ? colors.success.main
                    : selectedLevel.level.isCurrent
                    ? colors.primary.main
                    : colors.text.light,
                },
              ]}
              onPress={() => {
                setSelectedLevel({ ...selectedLevel, visible: false });
                onLevelSelect?.(selectedLevel.level.id);
              }}
              disabled={!selectedLevel.level.isUnlocked}
            >
              <Text style={styles.actionButtonText}>
                {selectedLevel.level.isCompleted
                  ? "✓ Completado"
                  : selectedLevel.level.isCurrent
                  ? "🚀 Continuar"
                  : selectedLevel.level.isUnlocked
                  ? "▶️ Comenzar"
                  : "🔒 Bloqueado"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

  // ✅ PROGRESO GLOBAL
  globalProgress: {
    width: "100%",
    alignItems: "center",
    marginTop: spacing.md,
  },
  globalProgressBar: {
    width: "80%",
    height: 12,
    backgroundColor: colors.primary.light + "30",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: spacing.xs,
  },
  globalProgressFill: {
    height: "100%",
    backgroundColor: colors.success.main,
    borderRadius: 6,
  },
  globalProgressText: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: "600",
  },

  // ✅ ESTADÍSTICAS DEL USUARIO
  userStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.primary.light + "30",
  },
  statItem: {
    alignItems: "center",
  },
  statEmoji: {
    fontSize: 20,
    marginBottom: spacing.xs,
  },
  statValue: {
    ...typography.h3,
    color: colors.primary.main,
    fontWeight: "700",
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    fontSize: 10,
  },

  // ✅ CAMINO TIPO DUOLINGO
  pathContainer: {
    alignItems: "center",
    height: 60,
    justifyContent: "center",
  },
  pathBase: {
    width: 6,
    height: 40,
    backgroundColor: colors.primary.light + "30",
    borderRadius: 3,
    overflow: "hidden",
    position: "relative",
  },
  pathProgress: {
    borderRadius: 3,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  pathStraight: {
    // Camino recto
  },
  pathCurved: {
    transform: [{ rotate: "15deg" }],
  },
  pathDiagonal: {
    transform: [{ rotate: "30deg" }],
  },
  pathParticles: {
    position: "absolute",
    top: -5,
    alignItems: "center",
    width: "100%",
  },
  pathSparkle: {
    fontSize: 12,
  },
  checkpoint: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.background.paper,
    borderWidth: 2,
    borderColor: colors.primary.light,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.xs,
  },
  checkpointActive: {
    borderColor: colors.success.main,
    backgroundColor: colors.success.light + "20",
  },
  checkpointIcon: {
    fontSize: 10,
  },

  // ✅ NIVEL MEJORADO
  levelIconContainer: {
    position: "relative",
    marginRight: spacing.md,
    alignItems: "center",
  },
  levelNumberBadge: {
    position: "absolute",
    bottom: -5,
    right: -5,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.background.paper,
  },
  lockedIcon: {
    opacity: 0.4,
  },
  lockedText: {
    opacity: 0.6,
  },
  levelProgressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
  },
  levelProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.primary.light + "30",
    borderRadius: 3,
    marginRight: spacing.xs,
    overflow: "hidden",
  },
  levelProgressFill: {
    height: "100%",
    backgroundColor: colors.primary.main,
    borderRadius: 3,
  },
  levelProgressText: {
    ...typography.caption,
    color: colors.text.secondary,
    fontSize: 10,
    fontWeight: "600",
    minWidth: 35,
  },

  // ✅ MODAL DE DETALLES
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    maxWidth: width * 0.9,
    maxHeight: height * 0.8,
    ...shadows.large,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  modalIcon: {
    fontSize: 40,
    marginRight: spacing.md,
  },
  modalTitleContainer: {
    flex: 1,
  },
  modalTitle: {
    ...typography.h2,
    color: colors.text.primary,
    fontWeight: "700",
  },
  modalSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  closeButton: {
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
  modalDescription: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  motivationalMessage: {
    backgroundColor: colors.primary.light + "20",
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary.main,
  },
  motivationalText: {
    ...typography.body,
    color: colors.primary.dark,
    fontWeight: "600",
    textAlign: "center",
  },

  // ✅ RECOMPENSAS
  rewardsSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  rewardsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  rewardItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  rewardEmoji: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  rewardText: {
    ...typography.caption,
    color: colors.text.primary,
    fontWeight: "600",
  },
  specialRewardItem: {
    backgroundColor: colors.warning.light + "20",
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginTop: spacing.sm,
    width: "100%",
  },
  specialRewardText: {
    ...typography.caption,
    color: colors.warning.dark,
    fontWeight: "600",
    textAlign: "center",
  },

  // ✅ LOGROS
  achievementsSection: {
    marginBottom: spacing.lg,
  },
  achievementsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  achievementItem: {
    backgroundColor: colors.primary.light + "20",
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  achievementText: {
    ...typography.caption,
    color: colors.primary.dark,
    fontSize: 10,
  },

  // ✅ BOTÓN DE ACCIÓN
  actionButton: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: "center",
    ...shadows.medium,
  },
  actionButtonText: {
    ...typography.body,
    color: colors.background.paper,
    fontWeight: "700",
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
