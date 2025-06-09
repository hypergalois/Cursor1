import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
} from "react-native";
import {
  colors,
  spacing,
  typography,
  shadows,
  borderRadius,
} from "../styles/theme";

interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: "progression" | "mastery" | "consistency" | "special" | "social";
  difficulty: "bronze" | "silver" | "gold" | "platinum" | "legendary";
  requirements: {
    type: string;
    value: number;
    description: string;
  };
  reward: {
    xp: number;
    stars: number;
    special?: string;
  };
  unlocked: boolean;
  progress: number;
  unlockedAt?: Date;
}

interface AchievementSystemProps {
  achievements: Achievement[];
  onAchievementPress?: (achievement: Achievement) => void;
  showUnlockedOnly?: boolean;
  compact?: boolean;
}

const { width, height } = Dimensions.get("window");

export const AchievementSystem: React.FC<AchievementSystemProps> = ({
  achievements,
  onAchievementPress,
  showUnlockedOnly = false,
  compact = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null);

  const categories = [
    { id: "all", title: "Todos", emoji: "🏆" },
    { id: "progression", title: "Progreso", emoji: "📈" },
    { id: "mastery", title: "Maestría", emoji: "🧠" },
    { id: "consistency", title: "Constancia", emoji: "🔥" },
    { id: "special", title: "Especiales", emoji: "⭐" },
    { id: "social", title: "Social", emoji: "👥" },
  ];

  const filteredAchievements = achievements.filter((achievement) => {
    if (showUnlockedOnly && !achievement.unlocked) return false;
    if (selectedCategory === "all") return true;
    return achievement.category === selectedCategory;
  });

  const handleAchievementPress = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setShowModal(true);
    onAchievementPress?.(achievement);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "bronze":
        return "#CD7F32";
      case "silver":
        return "#C0C0C0";
      case "gold":
        return colors.warning.main;
      case "platinum":
        return "#E5E4E2";
      case "legendary":
        return "#FF6B35";
      default:
        return colors.primary.main;
    }
  };

  const getDifficultyGlow = (difficulty: string) => {
    const color = getDifficultyColor(difficulty);
    return {
      shadowColor: color,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 8,
      elevation: 8,
    };
  };

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filteredAchievements.slice(0, 5).map((achievement) => (
            <TouchableOpacity
              key={achievement.id}
              style={[
                styles.compactAchievement,
                achievement.unlocked &&
                  getDifficultyGlow(achievement.difficulty),
              ]}
              onPress={() => handleAchievementPress(achievement)}
            >
              <Text
                style={[
                  styles.compactEmoji,
                  !achievement.unlocked && styles.lockedEmoji,
                ]}
              >
                {achievement.emoji}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filtros de categoría */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScrollView}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={styles.categoryEmoji}>{category.emoji}</Text>
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.selectedCategoryText,
              ]}
            >
              {category.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista de logros */}
      <ScrollView
        style={styles.achievementsList}
        showsVerticalScrollIndicator={false}
      >
        {filteredAchievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            onPress={handleAchievementPress}
            getDifficultyColor={getDifficultyColor}
            getDifficultyGlow={getDifficultyGlow}
          />
        ))}
      </ScrollView>

      {/* Modal de detalles */}
      <AchievementModal
        achievement={selectedAchievement}
        visible={showModal}
        onClose={() => setShowModal(false)}
        getDifficultyColor={getDifficultyColor}
      />
    </View>
  );
};

// Componente de tarjeta de logro
const AchievementCard: React.FC<{
  achievement: Achievement;
  onPress: (achievement: Achievement) => void;
  getDifficultyColor: (difficulty: string) => string;
  getDifficultyGlow: (difficulty: string) => object;
}> = ({ achievement, onPress, getDifficultyColor, getDifficultyGlow }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (achievement.unlocked) {
      Animated.spring(animatedValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [achievement.unlocked]);

  return (
    <TouchableOpacity
      style={[
        styles.achievementCard,
        achievement.unlocked && getDifficultyGlow(achievement.difficulty),
      ]}
      onPress={() => onPress(achievement)}
      activeOpacity={0.8}
    >
      <View style={styles.achievementHeader}>
        <Animated.Text
          style={[
            styles.achievementEmoji,
            !achievement.unlocked && styles.lockedEmoji,
            {
              transform: [
                {
                  scale: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}
        >
          {achievement.emoji}
        </Animated.Text>

        <View style={styles.achievementInfo}>
          <Text
            style={[
              styles.achievementTitle,
              !achievement.unlocked && styles.lockedText,
            ]}
          >
            {achievement.title}
          </Text>
          <Text
            style={[
              styles.achievementDescription,
              !achievement.unlocked && styles.lockedText,
            ]}
          >
            {achievement.description}
          </Text>
        </View>

        <View
          style={[
            styles.difficultyBadge,
            {
              backgroundColor:
                getDifficultyColor(achievement.difficulty) + "20",
            },
          ]}
        >
          <Text
            style={[
              styles.difficultyText,
              { color: getDifficultyColor(achievement.difficulty) },
            ]}
          >
            {achievement.difficulty.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Barra de progreso */}
      {!achievement.unlocked && (
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${
                    (achievement.progress / achievement.requirements.value) *
                    100
                  }%`,
                  backgroundColor: getDifficultyColor(achievement.difficulty),
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {achievement.progress} / {achievement.requirements.value}
          </Text>
        </View>
      )}

      {/* Información de recompensa */}
      <View style={styles.rewardSection}>
        <Text style={styles.rewardText}>
          🌟 {achievement.reward.xp} XP • ⭐ {achievement.reward.stars}{" "}
          estrellas
        </Text>
        {achievement.reward.special && (
          <Text style={styles.specialRewardText}>
            🎁 {achievement.reward.special}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

// Modal de detalles del logro
const AchievementModal: React.FC<{
  achievement: Achievement | null;
  visible: boolean;
  onClose: () => void;
  getDifficultyColor: (difficulty: string) => string;
}> = ({ achievement, visible, onClose, getDifficultyColor }) => {
  if (!achievement) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.modalEmoji}>{achievement.emoji}</Text>
          <Text style={styles.modalTitle}>{achievement.title}</Text>

          <View
            style={[
              styles.modalDifficultyBadge,
              {
                backgroundColor:
                  getDifficultyColor(achievement.difficulty) + "20",
              },
            ]}
          >
            <Text
              style={[
                styles.modalDifficultyText,
                { color: getDifficultyColor(achievement.difficulty) },
              ]}
            >
              {achievement.difficulty.toUpperCase()}
            </Text>
          </View>

          <Text style={styles.modalDescription}>{achievement.description}</Text>

          <View style={styles.modalRequirements}>
            <Text style={styles.modalSectionTitle}>📋 Requisitos</Text>
            <Text style={styles.modalRequirementText}>
              {achievement.requirements.description}
            </Text>
          </View>

          <View style={styles.modalRewards}>
            <Text style={styles.modalSectionTitle}>🎁 Recompensas</Text>
            <Text style={styles.modalRewardText}>
              • {achievement.reward.xp} puntos de experiencia
            </Text>
            <Text style={styles.modalRewardText}>
              • {achievement.reward.stars} estrellas
            </Text>
            {achievement.reward.special && (
              <Text style={styles.modalRewardText}>
                • {achievement.reward.special}
              </Text>
            )}
          </View>

          {achievement.unlocked && achievement.unlockedAt && (
            <View style={styles.modalUnlockedInfo}>
              <Text style={styles.modalUnlockedText}>
                🎉 Desbloqueado el {achievement.unlockedAt.toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

// ✅ FUNCIÓN MEJORADA PARA GENERAR LOGROS CONTEXTUALES POR ESCENA
export const generateDefaultAchievements = (): Achievement[] => {
  return [
    // ✅ PROGRESIÓN BÁSICA
    {
      id: "first_steps",
      title: "Primeros Pasos",
      description: "Resuelve tu primer problema matemático",
      emoji: "👶",
      category: "progression",
      difficulty: "bronze",
      requirements: {
        type: "problems_solved",
        value: 1,
        description: "Resolver 1 problema",
      },
      reward: { xp: 50, stars: 1 },
      unlocked: false,
      progress: 0,
    },
    {
      id: "problem_solver",
      title: "Solucionador",
      description: "Resuelve 10 problemas correctamente",
      emoji: "🧩",
      category: "progression",
      difficulty: "bronze",
      requirements: {
        type: "problems_solved",
        value: 10,
        description: "Resolver 10 problemas",
      },
      reward: { xp: 100, stars: 2 },
      unlocked: false,
      progress: 0,
    },
    {
      id: "century_club",
      title: "Club del Centenar",
      description: "Resuelve 100 problemas correctamente",
      emoji: "💯",
      category: "progression",
      difficulty: "gold",
      requirements: {
        type: "problems_solved",
        value: 100,
        description: "Resolver 100 problemas",
      },
      reward: { xp: 500, stars: 5, special: "Badge de élite matemática" },
      unlocked: false,
      progress: 0,
    },

    // ✅ LOGROS CONTEXTUALES POR ESCENA
    {
      id: "entrance_explorer",
      title: "Explorador de la Entrada",
      description: "Completa 5 problemas en la Entrada Principal",
      emoji: "🚪",
      category: "special",
      difficulty: "bronze",
      requirements: {
        type: "scene_entrance_problems",
        value: 5,
        description: "5 problemas en Entrada Principal",
      },
      reward: { xp: 100, stars: 2, special: "Llave de bienvenida" },
      unlocked: false,
      progress: 0,
    },
    {
      id: "golden_scholar",
      title: "Erudito Dorado",
      description: "Domina la Sala Dorada con precisión perfecta",
      emoji: "🏆",
      category: "special",
      difficulty: "silver",
      requirements: {
        type: "scene_golden_perfection",
        value: 3,
        description: "3 problemas perfectos en Sala Dorada",
      },
      reward: { xp: 200, stars: 4, special: "Corona dorada" },
      unlocked: false,
      progress: 0,
    },
    {
      id: "spiral_master",
      title: "Maestro del Espiral",
      description: "Navega el Túnel Espiral sin errores",
      emoji: "🌪️",
      category: "special",
      difficulty: "silver",
      requirements: {
        type: "scene_spiral_flawless",
        value: 5,
        description: "5 problemas sin errores en Túnel Espiral",
      },
      reward: { xp: 250, stars: 5, special: "Brújula mágica" },
      unlocked: false,
      progress: 0,
    },
    {
      id: "tower_climber",
      title: "Escalador de Torre",
      description: "Asciende la Torre del Saber paso a paso",
      emoji: "🗼",
      category: "special",
      difficulty: "gold",
      requirements: {
        type: "scene_tower_completion",
        value: 1,
        description: "Completar Torre del Saber",
      },
      reward: { xp: 300, stars: 6, special: "Cetro de sabiduría" },
      unlocked: false,
      progress: 0,
    },
    {
      id: "crystal_hunter",
      title: "Cazador de Cristales",
      description: "Descubre todos los cristales en la Caverna",
      emoji: "💎",
      category: "special",
      difficulty: "gold",
      requirements: {
        type: "scene_crystal_collection",
        value: 8,
        description: "8 cristales en Caverna Cristalina",
      },
      reward: { xp: 350, stars: 7, special: "Gema del poder" },
      unlocked: false,
      progress: 0,
    },
    {
      id: "flame_forger",
      title: "Forjador de Llamas",
      description: "Forja tu mente en la Cámara de Fuego",
      emoji: "⚒️",
      category: "special",
      difficulty: "platinum",
      requirements: {
        type: "scene_fire_mastery",
        value: 10,
        description: "10 problemas en Cámara de Fuego",
      },
      reward: { xp: 400, stars: 8, special: "Martillo legendario" },
      unlocked: false,
      progress: 0,
    },
    {
      id: "ice_conqueror",
      title: "Conquistador de Hielo",
      description: "Conquista las cumbres heladas del intelecto",
      emoji: "🧊",
      category: "special",
      difficulty: "platinum",
      requirements: {
        type: "scene_ice_conquest",
        value: 12,
        description: "12 problemas en Cámara de Hielo",
      },
      reward: { xp: 500, stars: 9, special: "Cristal de hielo eterno" },
      unlocked: false,
      progress: 0,
    },
    {
      id: "minotaur_slayer",
      title: "Cazador del Minotauro",
      description: "Derrota al Minotauro en su propio trono",
      emoji: "🐂",
      category: "special",
      difficulty: "legendary",
      requirements: {
        type: "scene_boss_final",
        value: 1,
        description: "Derrotar al Minotauro final",
      },
      reward: { xp: 1000, stars: 15, special: "Corona del Minotauro" },
      unlocked: false,
      progress: 0,
    },

    // ✅ MAESTRÍA AVANZADA
    {
      id: "speed_demon",
      title: "Demonio de la Velocidad",
      description: "Resuelve un problema en menos de 5 segundos",
      emoji: "⚡",
      category: "mastery",
      difficulty: "silver",
      requirements: {
        type: "speed_record",
        value: 5,
        description: "Resolver en menos de 5 segundos",
      },
      reward: { xp: 150, stars: 3 },
      unlocked: false,
      progress: 0,
    },
    {
      id: "perfectionist",
      title: "Perfeccionista",
      description: "Consigue 3 estrellas en 10 problemas seguidos",
      emoji: "💎",
      category: "mastery",
      difficulty: "gold",
      requirements: {
        type: "perfect_streak",
        value: 10,
        description: "10 problemas con 3 estrellas",
      },
      reward: { xp: 300, stars: 5, special: "Efecto de diamante" },
      unlocked: false,
      progress: 0,
    },
    {
      id: "lightning_calculator",
      title: "Calculadora Relámpago",
      description: "Resuelve 5 problemas en menos de 3 segundos cada uno",
      emoji: "⚡",
      category: "mastery",
      difficulty: "platinum",
      requirements: {
        type: "ultra_speed_streak",
        value: 5,
        description: "5 problemas en menos de 3 segundos",
      },
      reward: { xp: 500, stars: 8, special: "Aura de velocidad" },
      unlocked: false,
      progress: 0,
    },

    // ✅ CONSTANCIA MEJORADA
    {
      id: "daily_visitor",
      title: "Visitante Diario",
      description: "Juega durante 3 días consecutivos",
      emoji: "📅",
      category: "consistency",
      difficulty: "bronze",
      requirements: {
        type: "daily_streak",
        value: 3,
        description: "3 días consecutivos",
      },
      reward: { xp: 100, stars: 2 },
      unlocked: false,
      progress: 0,
    },
    {
      id: "weekly_warrior",
      title: "Guerrero Semanal",
      description: "Juega durante 7 días consecutivos",
      emoji: "🗡️",
      category: "consistency",
      difficulty: "silver",
      requirements: {
        type: "daily_streak",
        value: 7,
        description: "7 días consecutivos",
      },
      reward: { xp: 200, stars: 4, special: "Espada de constancia" },
      unlocked: false,
      progress: 0,
    },
    {
      id: "marathon_runner",
      title: "Maratonista",
      description: "Juega durante 30 días consecutivos",
      emoji: "🏃‍♂️",
      category: "consistency",
      difficulty: "platinum",
      requirements: {
        type: "daily_streak",
        value: 30,
        description: "30 días consecutivos",
      },
      reward: { xp: 1000, stars: 10, special: "Medalla de dedicación" },
      unlocked: false,
      progress: 0,
    },
    {
      id: "year_champion",
      title: "Campeón del Año",
      description: "Mantén tu racha por 365 días",
      emoji: "👑",
      category: "consistency",
      difficulty: "legendary",
      requirements: {
        type: "daily_streak",
        value: 365,
        description: "365 días consecutivos",
      },
      reward: { xp: 5000, stars: 50, special: "Corona eterna del aprendizaje" },
      unlocked: false,
      progress: 0,
    },

    // ✅ SOCIALES Y ESPECIALES
    {
      id: "comeback_kid",
      title: "El Que Regresa",
      description: "Recupera tu racha perdida usando un congelador",
      emoji: "❄️",
      category: "special",
      difficulty: "bronze",
      requirements: {
        type: "streak_freeze_used",
        value: 1,
        description: "Usar 1 congelador de racha",
      },
      reward: { xp: 100, stars: 2, special: "Segunda oportunidad" },
      unlocked: false,
      progress: 0,
    },
    {
      id: "mission_specialist",
      title: "Especialista en Misiones",
      description: "Completa 10 misiones diarias",
      emoji: "🎯",
      category: "special",
      difficulty: "silver",
      requirements: {
        type: "daily_missions_completed",
        value: 10,
        description: "10 misiones diarias completadas",
      },
      reward: { xp: 300, stars: 5, special: "Insignia de especialista" },
      unlocked: false,
      progress: 0,
    },
    {
      id: "treasure_hunter",
      title: "Cazatesoros",
      description: "Encuentra todos los tesoros secretos",
      emoji: "🗝️",
      category: "special",
      difficulty: "legendary",
      requirements: {
        type: "secrets_found",
        value: 10,
        description: "Encontrar 10 secretos",
      },
      reward: { xp: 2000, stars: 15, special: "Mapa del tesoro dorado" },
      unlocked: false,
      progress: 0,
    },
    {
      id: "math_sage",
      title: "Sabio Matemático",
      description: "Desbloquea todos los logros de todas las escenas",
      emoji: "🧙‍♂️",
      category: "special",
      difficulty: "legendary",
      requirements: {
        type: "all_scene_achievements",
        value: 8,
        description: "Todos los logros de escena",
      },
      reward: { xp: 3000, stars: 25, special: "Título de Gran Maestro" },
      unlocked: false,
      progress: 0,
    },
  ];
};

// Hook para gestionar logros
export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>(
    generateDefaultAchievements()
  );

  const updateProgress = (type: string, value: number) => {
    setAchievements((prev) =>
      prev.map((achievement) => {
        if (achievement.requirements.type === type && !achievement.unlocked) {
          const newProgress = Math.min(
            achievement.progress + value,
            achievement.requirements.value
          );
          const unlocked = newProgress >= achievement.requirements.value;

          return {
            ...achievement,
            progress: newProgress,
            unlocked,
            unlockedAt: unlocked ? new Date() : achievement.unlockedAt,
          };
        }
        return achievement;
      })
    );
  };

  const getUnlockedAchievements = () => achievements.filter((a) => a.unlocked);
  const getTotalXPFromAchievements = () =>
    getUnlockedAchievements().reduce((total, a) => total + a.reward.xp, 0);

  return {
    achievements,
    updateProgress,
    getUnlockedAchievements,
    getTotalXPFromAchievements,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  compactContainer: {
    paddingVertical: spacing.sm,
  },
  compactAchievement: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.background.paper,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: spacing.xs,
    ...shadows.small,
  },
  compactEmoji: {
    fontSize: 24,
  },
  categoriesScrollView: {
    flexGrow: 0,
    marginBottom: spacing.md,
  },
  categoriesContainer: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.round,
    ...shadows.small,
  },
  selectedCategory: {
    backgroundColor: colors.primary.main,
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  categoryText: {
    ...typography.caption,
    color: colors.text.primary,
    fontWeight: "500",
  },
  selectedCategoryText: {
    color: colors.background.paper,
  },
  achievementsList: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  achievementCard: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  achievementHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  achievementEmoji: {
    fontSize: 40,
    marginRight: spacing.md,
  },
  lockedEmoji: {
    opacity: 0.3,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    ...typography.h3,
    color: colors.text.primary,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  achievementDescription: {
    ...typography.caption,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  lockedText: {
    opacity: 0.6,
  },
  difficultyBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  difficultyText: {
    ...typography.caption,
    fontWeight: "700",
    fontSize: 10,
  },
  progressSection: {
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.primary.light + "30",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    ...typography.caption,
    color: colors.text.secondary,
    fontSize: 10,
  },
  rewardSection: {
    borderTopWidth: 1,
    borderTopColor: colors.primary.light + "30",
    paddingTop: spacing.sm,
  },
  rewardText: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: "500",
  },
  specialRewardText: {
    ...typography.caption,
    color: colors.primary.main,
    fontWeight: "600",
    marginTop: spacing.xs,
  },
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
  closeButton: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
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
  modalEmoji: {
    fontSize: 60,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  modalTitle: {
    ...typography.h2,
    color: colors.text.primary,
    textAlign: "center",
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  modalDifficultyBadge: {
    alignSelf: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    marginBottom: spacing.lg,
  },
  modalDifficultyText: {
    ...typography.caption,
    fontWeight: "700",
  },
  modalDescription: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  modalRequirements: {
    marginBottom: spacing.lg,
  },
  modalRewards: {
    marginBottom: spacing.lg,
  },
  modalSectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  modalRequirementText: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  modalRewardText: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  modalUnlockedInfo: {
    backgroundColor: colors.success.light + "20",
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.success.main,
  },
  modalUnlockedText: {
    ...typography.caption,
    color: colors.success.dark,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default AchievementSystem;
