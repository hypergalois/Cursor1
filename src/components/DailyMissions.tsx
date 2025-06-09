import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import {
  colors,
  spacing,
  typography,
  shadows,
  borderRadius,
} from "../styles/theme";

// ✅ INTERFACES PARA MISIONES DIARIAS
interface DailyMission {
  id: string;
  title: string;
  description: string;
  emoji: string;
  type:
    | "problems"
    | "accuracy"
    | "speed"
    | "streak"
    | "exploration"
    | "mastery";
  difficulty: "easy" | "medium" | "hard";
  ageGroup: "kids" | "teens" | "adults" | "seniors" | "all";
  target: number;
  progress: number;
  reward: {
    xp: number;
    stars: number;
    gems?: number;
    special?: string;
  };
  completed: boolean;
  expiresAt: Date;
  refreshesDaily: boolean;
}

interface StreakInfo {
  current: number;
  longest: number;
  lastActiveDate: Date | null;
  freezeAvailable: number;
  doubleXPAvailable: boolean;
}

interface DailyMissionsProps {
  userProfile?: {
    ageGroup: "kids" | "teens" | "adults" | "seniors";
    level: number;
    preferences: any;
  };
  onMissionComplete?: (mission: DailyMission) => void;
  onStreakUpdate?: (streak: StreakInfo) => void;
}

const { width } = Dimensions.get("window");

export const DailyMissions: React.FC<DailyMissionsProps> = ({
  userProfile,
  onMissionComplete,
  onStreakUpdate,
}) => {
  const [missions, setMissions] = useState<DailyMission[]>([]);
  const [streakInfo, setStreakInfo] = useState<StreakInfo>({
    current: 5, // Ejemplo
    longest: 12, // Ejemplo
    lastActiveDate: new Date(),
    freezeAvailable: 2,
    doubleXPAvailable: true,
  });
  const [showStreakDetail, setShowStreakDetail] = useState(false);
  const [selectedMission, setSelectedMission] = useState<DailyMission | null>(
    null
  );

  // Animaciones
  const streakPulseAnim = useRef(new Animated.Value(1)).current;
  const missionCompletionAnim = useRef(new Animated.Value(0)).current;

  // ✅ GENERAR MISIONES ADAPTATIVAS POR EDAD
  const generateDailyMissions = (
    ageGroup: string,
    level: number
  ): DailyMission[] => {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const missionTemplates = {
      kids: [
        {
          id: "kids_problems",
          title: "¡Pequeño Explorador!",
          description: "Resuelve 5 problemas divertidos",
          emoji: "🌟",
          type: "problems" as const,
          target: 5,
          reward: { xp: 100, stars: 3, gems: 10, special: "Sticker divertido" },
        },
        {
          id: "kids_accuracy",
          title: "¡Super Preciso!",
          description: "Acierta 3 problemas seguidos",
          emoji: "🎯",
          type: "accuracy" as const,
          target: 3,
          reward: { xp: 80, stars: 2, gems: 8, special: "Badge de puntería" },
        },
        {
          id: "kids_exploration",
          title: "¡Aventurero Curioso!",
          description: "Explora 2 escenas diferentes",
          emoji: "🗺️",
          type: "exploration" as const,
          target: 2,
          reward: { xp: 120, stars: 4, gems: 15, special: "Mapa colorido" },
        },
      ],
      teens: [
        {
          id: "teens_problems",
          title: "Daily Grind",
          description: "Complete 8 problems like a boss",
          emoji: "💯",
          type: "problems" as const,
          target: 8,
          reward: { xp: 150, stars: 4, gems: 20, special: "Epic badge" },
        },
        {
          id: "teens_speed",
          title: "Speed Runner",
          description: "Solve 3 problems under 10 seconds each",
          emoji: "⚡",
          type: "speed" as const,
          target: 3,
          reward: { xp: 200, stars: 5, gems: 25, special: "Lightning effect" },
        },
        {
          id: "teens_streak",
          title: "Streak Master",
          description: "Maintain your streak for the day",
          emoji: "🔥",
          type: "streak" as const,
          target: 1,
          reward: { xp: 100, stars: 3, gems: 15, special: "Flame icon" },
        },
      ],
      adults: [
        {
          id: "adults_problems",
          title: "Objetivo Diario",
          description: "Complete 10 problemas con eficiencia",
          emoji: "📊",
          type: "problems" as const,
          target: 10,
          reward: {
            xp: 200,
            stars: 5,
            gems: 30,
            special: "Certificado de logro",
          },
        },
        {
          id: "adults_mastery",
          title: "Dominio Técnico",
          description: "Obtenga 90% de precisión en 5 problemas",
          emoji: "🎯",
          type: "mastery" as const,
          target: 5,
          reward: {
            xp: 250,
            stars: 6,
            gems: 35,
            special: "Insignia de maestría",
          },
        },
        {
          id: "adults_exploration",
          title: "Análisis Completo",
          description: "Complete problemas en 3 categorías diferentes",
          emoji: "🔍",
          type: "exploration" as const,
          target: 3,
          reward: {
            xp: 180,
            stars: 4,
            gems: 25,
            special: "Reporte de progreso",
          },
        },
      ],
      seniors: [
        {
          id: "seniors_problems",
          title: "Ejercicio Mental Diario",
          description: "Resuelva 6 problemas a su ritmo",
          emoji: "🧠",
          type: "problems" as const,
          target: 6,
          reward: {
            xp: 150,
            stars: 4,
            gems: 25,
            special: "Medalla de sabiduría",
          },
        },
        {
          id: "seniors_accuracy",
          title: "Precisión y Calma",
          description: "Complete 4 problemas sin errores",
          emoji: "✅",
          type: "accuracy" as const,
          target: 4,
          reward: {
            xp: 180,
            stars: 5,
            gems: 30,
            special: "Diploma de excelencia",
          },
        },
        {
          id: "seniors_exploration",
          title: "Exploración Tranquila",
          description: "Visite 2 escenas nuevas",
          emoji: "🌅",
          type: "exploration" as const,
          target: 2,
          reward: {
            xp: 120,
            stars: 3,
            gems: 20,
            special: "Postal conmemorativa",
          },
        },
      ],
    };

    const templates =
      missionTemplates[ageGroup as keyof typeof missionTemplates] ||
      missionTemplates.adults;

    // Seleccionar 3 misiones aleatorias adaptadas al nivel
    const selectedTemplates = templates
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((template, index) => ({
        ...template,
        id: `${template.id}_${now.toDateString()}`,
        difficulty: (level < 5 ? "easy" : level < 15 ? "medium" : "hard") as
          | "easy"
          | "medium"
          | "hard",
        ageGroup: ageGroup as "kids" | "teens" | "adults" | "seniors",
        progress: 0,
        completed: false,
        expiresAt: tomorrow,
        refreshesDaily: true,
        // Ajustar recompensas según nivel
        reward: {
          ...template.reward,
          xp: template.reward.xp + level * 10,
          gems: (template.reward.gems || 0) + Math.floor(level / 2),
        },
      }));

    return selectedTemplates;
  };

  // ✅ INICIALIZAR MISIONES
  useEffect(() => {
    if (userProfile) {
      const newMissions = generateDailyMissions(
        userProfile.ageGroup,
        userProfile.level
      );
      setMissions(newMissions);
    }
  }, [userProfile]);

  // ✅ ANIMACIÓN DE RACHA
  useEffect(() => {
    if (streakInfo.current > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(streakPulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(streakPulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [streakInfo.current]);

  // ✅ ACTUALIZAR PROGRESO DE MISIÓN
  const updateMissionProgress = (missionId: string, progress: number) => {
    setMissions((prev) =>
      prev.map((mission) => {
        if (mission.id === missionId && !mission.completed) {
          const newProgress = Math.min(
            mission.progress + progress,
            mission.target
          );
          const completed = newProgress >= mission.target;

          if (completed && !mission.completed) {
            handleMissionComplete(mission);
          }

          return {
            ...mission,
            progress: newProgress,
            completed,
          };
        }
        return mission;
      })
    );
  };

  // ✅ MANEJAR MISIÓN COMPLETADA
  const handleMissionComplete = (mission: DailyMission) => {
    // Animación de completado
    Animated.sequence([
      Animated.timing(missionCompletionAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(missionCompletionAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    onMissionComplete?.(mission);

    // Mostrar alerta de completado según edad
    const ageMessages = {
      kids: {
        title: "🎉 ¡Misión Completada!",
        message: `¡Genial! Has completado "${mission.title}" y ganado ${mission.reward.xp} XP y ${mission.reward.stars} estrellas!`,
      },
      teens: {
        title: "💯 Mission Complete!",
        message: `Epic! You completed "${mission.title}" and earned ${mission.reward.xp} XP and ${mission.reward.stars} stars!`,
      },
      adults: {
        title: "✅ Misión Completada",
        message: `Ha completado "${mission.title}" exitosamente. Recompensa: ${mission.reward.xp} XP, ${mission.reward.stars} estrellas.`,
      },
      seniors: {
        title: "🌟 ¡Excelente Trabajo!",
        message: `¡Felicitaciones! Completó "${mission.title}" y obtuvo ${mission.reward.xp} XP y ${mission.reward.stars} estrellas.`,
      },
    };

    const ageGroup = userProfile?.ageGroup || "adults";
    const message = ageMessages[ageGroup];

    Alert.alert(message.title, message.message, [
      { text: "¡Genial!", style: "default" },
    ]);
  };

  // ✅ MANEJAR FREEZE DE RACHA
  const handleStreakFreeze = () => {
    if (streakInfo.freezeAvailable > 0) {
      setStreakInfo((prev) => ({
        ...prev,
        freezeAvailable: prev.freezeAvailable - 1,
      }));

      Alert.alert(
        "❄️ Racha Congelada",
        "Tu racha está protegida por hoy. ¡No la perderás si no juegas!",
        [{ text: "Entendido" }]
      );
    }
  };

  // ✅ OBTENER MENSAJE DE RACHA POR EDAD
  const getStreakMessage = () => {
    const ageMessages = {
      kids: `¡${streakInfo.current} días seguidos jugando! ¡Eres increíble! 🌟`,
      teens: `${streakInfo.current} day streak! You're on fire! 🔥`,
      adults: `Racha de ${streakInfo.current} días. Consistencia excelente. 📊`,
      seniors: `${streakInfo.current} días consecutivos. ¡Qué dedicación! 👏`,
    };

    return ageMessages[userProfile?.ageGroup || "adults"];
  };

  // ✅ OBTENER COLOR DE PROGRESO
  const getProgressColor = (progress: number, target: number) => {
    const percentage = progress / target;
    if (percentage >= 1) return colors.success.main;
    if (percentage >= 0.7) return colors.warning.main;
    return colors.primary.main;
  };

  return (
    <View style={styles.container}>
      {/* ✅ SECCIÓN DE RACHA */}
      <TouchableOpacity
        style={styles.streakContainer}
        onPress={() => setShowStreakDetail(!showStreakDetail)}
      >
        <Animated.View
          style={[
            styles.streakIcon,
            { transform: [{ scale: streakPulseAnim }] },
          ]}
        >
          <Text style={styles.streakEmoji}>🔥</Text>
          <Text style={styles.streakNumber}>{streakInfo.current}</Text>
        </Animated.View>

        <View style={styles.streakInfo}>
          <Text style={styles.streakTitle}>Racha Diaria</Text>
          <Text style={styles.streakMessage}>{getStreakMessage()}</Text>
          {streakInfo.current > streakInfo.longest / 2 && (
            <Text style={styles.streakRecord}>
              ¡A solo {streakInfo.longest - streakInfo.current} días de tu
              récord!
            </Text>
          )}
        </View>

        {streakInfo.freezeAvailable > 0 && (
          <TouchableOpacity
            style={styles.freezeButton}
            onPress={handleStreakFreeze}
          >
            <Text style={styles.freezeEmoji}>❄️</Text>
            <Text style={styles.freezeCount}>{streakInfo.freezeAvailable}</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {/* ✅ DETALLES DE RACHA EXPANDIBLES */}
      {showStreakDetail && (
        <Animated.View style={styles.streakDetails}>
          <View style={styles.streakStats}>
            <View style={styles.streakStat}>
              <Text style={styles.statNumber}>{streakInfo.current}</Text>
              <Text style={styles.statLabel}>Actual</Text>
            </View>
            <View style={styles.streakStat}>
              <Text style={styles.statNumber}>{streakInfo.longest}</Text>
              <Text style={styles.statLabel}>Récord</Text>
            </View>
            <View style={styles.streakStat}>
              <Text style={styles.statNumber}>
                {streakInfo.freezeAvailable}
              </Text>
              <Text style={styles.statLabel}>Congelador</Text>
            </View>
          </View>

          {streakInfo.doubleXPAvailable && (
            <View style={styles.doubleXPBanner}>
              <Text style={styles.doubleXPText}>
                ✨ ¡Doble XP disponible hoy! ✨
              </Text>
            </View>
          )}
        </Animated.View>
      )}

      {/* ✅ TÍTULO DE MISIONES */}
      <View style={styles.missionsHeader}>
        <Text style={styles.missionsTitle}>🎯 Misiones Diarias</Text>
        <Text style={styles.missionsSubtitle}>
          {missions.filter((m) => m.completed).length} de {missions.length}{" "}
          completadas
        </Text>
      </View>

      {/* ✅ LISTA DE MISIONES */}
      <ScrollView
        style={styles.missionsList}
        showsVerticalScrollIndicator={false}
      >
        {missions.map((mission, index) => (
          <TouchableOpacity
            key={mission.id}
            style={[
              styles.missionCard,
              mission.completed && styles.completedMissionCard,
            ]}
            onPress={() => setSelectedMission(mission)}
            activeOpacity={0.8}
          >
            <View style={styles.missionHeader}>
              <Text
                style={[
                  styles.missionEmoji,
                  mission.completed && styles.completedEmoji,
                ]}
              >
                {mission.completed ? "✅" : mission.emoji}
              </Text>

              <View style={styles.missionInfo}>
                <Text
                  style={[
                    styles.missionTitle,
                    mission.completed && styles.completedText,
                  ]}
                >
                  {mission.title}
                </Text>
                <Text
                  style={[
                    styles.missionDescription,
                    mission.completed && styles.completedText,
                  ]}
                >
                  {mission.description}
                </Text>
              </View>

              <View style={styles.missionReward}>
                <Text style={styles.rewardText}>+{mission.reward.xp} XP</Text>
                <Text style={styles.rewardStars}>
                  ⭐ {mission.reward.stars}
                </Text>
                {mission.reward.gems && (
                  <Text style={styles.rewardGems}>
                    💎 {mission.reward.gems}
                  </Text>
                )}
              </View>
            </View>

            {/* ✅ BARRA DE PROGRESO */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${(mission.progress / mission.target) * 100}%`,
                      backgroundColor: getProgressColor(
                        mission.progress,
                        mission.target
                      ),
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {mission.progress} / {mission.target}
              </Text>
            </View>

            {/* ✅ RECOMPENSA ESPECIAL */}
            {mission.reward.special && (
              <View style={styles.specialReward}>
                <Text style={styles.specialRewardText}>
                  🎁 {mission.reward.special}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ✅ BOTÓN DE REFRESCAR MISIONES */}
      <TouchableOpacity style={styles.refreshButton}>
        <Text style={styles.refreshEmoji}>🔄</Text>
        <Text style={styles.refreshText}>Nuevas misiones mañana</Text>
        <Text style={styles.refreshTimer}>23:45:30</Text>
      </TouchableOpacity>
    </View>
  );
};

// ✅ HOOK PARA GESTIONAR MISIONES DIARIAS
export const useDailyMissions = () => {
  const [missions, setMissions] = useState<DailyMission[]>([]);
  const [streakInfo, setStreakInfo] = useState<StreakInfo>({
    current: 0,
    longest: 0,
    lastActiveDate: null,
    freezeAvailable: 2,
    doubleXPAvailable: false,
  });

  const updateMissionProgress = (type: string, amount: number = 1) => {
    setMissions((prev) =>
      prev.map((mission) => {
        if (mission.type === type && !mission.completed) {
          const newProgress = Math.min(
            mission.progress + amount,
            mission.target
          );
          return {
            ...mission,
            progress: newProgress,
            completed: newProgress >= mission.target,
          };
        }
        return mission;
      })
    );
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastActive = streakInfo.lastActiveDate?.toDateString();

    if (lastActive !== today) {
      setStreakInfo((prev) => ({
        ...prev,
        current: prev.current + 1,
        longest: Math.max(prev.longest, prev.current + 1),
        lastActiveDate: new Date(),
        doubleXPAvailable: (prev.current + 1) % 7 === 0, // Cada 7 días
      }));
    }
  };

  const getCompletedMissions = () => missions.filter((m) => m.completed);
  const getTotalDailyXP = () =>
    getCompletedMissions().reduce((sum, m) => sum + m.reward.xp, 0);

  return {
    missions,
    streakInfo,
    updateMissionProgress,
    updateStreak,
    getCompletedMissions,
    getTotalDailyXP,
  };
};

// ✅ ESTILOS DEL COMPONENTE
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
    paddingHorizontal: spacing.md,
  },

  // ✅ ESTILOS DE RACHA
  streakContainer: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    ...shadows.medium,
  },
  streakIcon: {
    backgroundColor: colors.warning.light + "20",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  streakEmoji: {
    fontSize: 24,
    position: "absolute",
  },
  streakNumber: {
    ...typography.h2,
    color: colors.warning.main,
    fontWeight: "800",
    marginTop: spacing.xs,
  },
  streakInfo: {
    flex: 1,
  },
  streakTitle: {
    ...typography.h3,
    color: colors.text.primary,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  streakMessage: {
    ...typography.caption,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  streakRecord: {
    ...typography.caption,
    color: colors.warning.main,
    fontWeight: "600",
    marginTop: spacing.xs,
  },
  freezeButton: {
    backgroundColor: colors.primary.light + "20",
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignItems: "center",
  },
  freezeEmoji: {
    fontSize: 16,
  },
  freezeCount: {
    ...typography.caption,
    color: colors.primary.main,
    fontWeight: "600",
    fontSize: 10,
  },

  // ✅ DETALLES DE RACHA
  streakDetails: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  streakStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: spacing.md,
  },
  streakStat: {
    alignItems: "center",
  },
  statNumber: {
    ...typography.h2,
    color: colors.primary.main,
    fontWeight: "700",
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  doubleXPBanner: {
    backgroundColor: colors.warning.light + "20",
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning.main,
  },
  doubleXPText: {
    ...typography.body,
    color: colors.warning.dark,
    fontWeight: "600",
    textAlign: "center",
  },

  // ✅ MISIONES
  missionsHeader: {
    marginBottom: spacing.md,
  },
  missionsTitle: {
    ...typography.h2,
    color: colors.text.primary,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  missionsSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  missionsList: {
    flex: 1,
  },
  missionCard: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  completedMissionCard: {
    backgroundColor: colors.success.light + "10",
    borderWidth: 1,
    borderColor: colors.success.light,
  },
  missionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  missionEmoji: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  completedEmoji: {
    opacity: 0.8,
  },
  missionInfo: {
    flex: 1,
  },
  missionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  missionDescription: {
    ...typography.caption,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  completedText: {
    opacity: 0.7,
  },
  missionReward: {
    alignItems: "flex-end",
  },
  rewardText: {
    ...typography.caption,
    color: colors.success.main,
    fontWeight: "600",
  },
  rewardStars: {
    ...typography.caption,
    color: colors.warning.main,
    fontWeight: "600",
  },
  rewardGems: {
    ...typography.caption,
    color: colors.primary.main,
    fontWeight: "600",
  },

  // ✅ PROGRESO
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.primary.light + "30",
    borderRadius: 4,
    marginRight: spacing.sm,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: "600",
    minWidth: 40,
  },

  // ✅ RECOMPENSA ESPECIAL
  specialReward: {
    backgroundColor: colors.warning.light + "20",
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginTop: spacing.sm,
  },
  specialRewardText: {
    ...typography.caption,
    color: colors.warning.dark,
    fontWeight: "600",
    textAlign: "center",
  },

  // ✅ BOTÓN REFRESCAR
  refreshButton: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginTop: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...shadows.small,
  },
  refreshEmoji: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  refreshText: {
    ...typography.body,
    color: colors.text.secondary,
    flex: 1,
  },
  refreshTimer: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: "600",
  },
});

export default DailyMissions;
