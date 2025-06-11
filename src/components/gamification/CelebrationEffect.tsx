import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  View,
  Text,
  Dimensions,
  Easing,
} from "react-native";
import { colors, typography, spacing } from "../styles/theme";

interface CelebrationEffectProps {
  type:
    | "correct"
    | "achievement"
    | "level_up"
    | "streak"
    | "perfect_session"
    | "epic_achievement"
    | "milestone";
  ageGroup: "kids" | "teens" | "adults" | "seniors";
  intensity?: "low" | "medium" | "high" | "epic";
  onComplete?: () => void;
  visible: boolean;
  customMessage?: string;
  achievementTitle?: string;
}

interface Particle {
  id: string;
  x: Animated.Value;
  y: Animated.Value;
  rotation: Animated.Value;
  scale: Animated.Value;
  opacity: Animated.Value;
  color: string;
  emoji?: string;
  initialX: number;
  initialY: number;
  velocityX?: number;
  velocityY?: number;
  type?: "confetti" | "sparkle" | "star" | "lightning" | "cascade";
}

interface FireworkBurst {
  id: string;
  x: number;
  y: number;
  particles: Particle[];
  burstTime: number;
}

const { width, height } = Dimensions.get("window");

const CelebrationEffect: React.FC<CelebrationEffectProps> = ({
  type,
  ageGroup,
  intensity = "medium",
  onComplete,
  visible,
  customMessage,
  achievementTitle,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [fireworks, setFireworks] = useState<FireworkBurst[]>([]);
  const [lightningStrikes, setLightningStrikes] = useState<Particle[]>([]);

  const containerOpacity = useRef(new Animated.Value(0)).current;
  const mainScale = useRef(new Animated.Value(0)).current;
  const textSlide = useRef(new Animated.Value(50)).current;
  const screenPulse = useRef(new Animated.Value(0)).current;
  const lightningFlash = useRef(new Animated.Value(0)).current;
  const cascadeFlow = useRef(new Animated.Value(0)).current;

  // ✅ CONFIGURACIONES MEJORADAS POR EDAD Y TIPO
  const getAgeConfig = () => {
    const baseConfig = {
      kids: {
        colors: [
          "#FF6B6B",
          "#4ECDC4",
          "#45B7D1",
          "#96CEB4",
          "#FFEAA7",
          "#DDA0DD",
          "#FF69B4",
          "#32CD32",
          "#FFD700",
          "#FF1493",
          "#00CED1",
          "#FF6347",
        ],
        emojis: [
          "🎉",
          "🌟",
          "🎈",
          "🦄",
          "🌈",
          "⭐",
          "🎊",
          "🎂",
          "🎆",
          "🎇",
          "✨",
          "💫",
        ],
        confettiStyle: true,
        bouncy: true,
      },
      teens: {
        colors: [
          "#667eea",
          "#764ba2",
          "#f093fb",
          "#f5576c",
          "#4facfe",
          "#00f2fe",
          "#43e97b",
          "#38f9d7",
          "#ffecd2",
          "#fcb69f",
          "#a8edea",
          "#fed6e3",
        ],
        emojis: [
          "🔥",
          "💯",
          "⚡",
          "🚀",
          "💎",
          "🏆",
          "👑",
          "💫",
          "🌟",
          "⭐",
          "✨",
          "🎯",
        ],
        modernStyle: true,
        bouncy: true,
      },
      adults: {
        colors: [
          "#667eea",
          "#764ba2",
          "#f093fb",
          "#f5576c",
          "#4facfe",
          "#00f2fe",
        ],
        emojis: ["✨", "🏆", "⭐", "💼", "🎯", "📈"],
        elegantStyle: true,
        bouncy: false,
      },
      seniors: {
        colors: [
          "#ffecd2",
          "#fcb69f",
          "#a8edea",
          "#fed6e3",
          "#d299c2",
          "#fef9d3",
        ],
        emojis: ["🌟", "👏", "🎯", "💫", "⭐", "🏆"],
        gentleStyle: true,
        bouncy: false,
      },
    };

    const ageBase = baseConfig[ageGroup] || baseConfig.adults;

    // ✅ CONFIGURACIONES ESPECÍFICAS POR TIPO E INTENSIDAD
    const intensityMultiplier = {
      low: 0.5,
      medium: 1,
      high: 1.5,
      epic: 2.5,
    }[intensity];

    const typeEnhancements = {
      correct: {
        particleCount: Math.floor(15 * intensityMultiplier),
        duration: 2000,
        effects: ["particles"],
      },
      achievement: {
        particleCount: Math.floor(25 * intensityMultiplier),
        duration: 2500,
        effects: ["particles", "pulse"],
      },
      level_up: {
        particleCount: Math.floor(35 * intensityMultiplier),
        duration: 3000,
        effects: ["particles", "fireworks", "pulse"],
      },
      streak: {
        particleCount: Math.floor(20 * intensityMultiplier),
        duration: 2200,
        effects: ["particles", "lightning"],
      },
      perfect_session: {
        particleCount: Math.floor(40 * intensityMultiplier),
        duration: 3500,
        effects: ["particles", "fireworks", "cascade", "pulse"],
      },
      epic_achievement: {
        particleCount: Math.floor(60 * intensityMultiplier),
        duration: 4000,
        effects: ["particles", "fireworks", "lightning", "cascade", "pulse"],
      },
      milestone: {
        particleCount: Math.floor(50 * intensityMultiplier),
        duration: 3800,
        effects: ["particles", "fireworks", "cascade"],
      },
    };

    return {
      ...ageBase,
      ...typeEnhancements[type],
    };
  };

  const getCelebrationMessage = () => {
    if (customMessage) return customMessage;

    const messages = {
      kids: {
        correct: [
          "¡Muy bien! 🎉",
          "¡Genial! 🌟",
          "¡Súper! 🎈",
          "¡Excelente! 🦄",
        ],
        achievement: ["¡Nuevo logro! 🏆", "¡Increíble! 🌈", "¡Fantástico! 🎊"],
        level_up: [
          "¡Subiste de nivel! 🚀",
          "¡Nuevo nivel! ⭐",
          "¡Asombroso! 🎂",
        ],
        streak: ["¡Racha perfecta! 🔥", "¡Sigue así! 💫", "¡Imparable! ⚡"],
        perfect_session: [
          "¡Sesión perfecta! 🏆",
          "¡Eres increíble! 🌟",
          "¡Todo correcto! 🎉",
        ],
        epic_achievement: ["¡ÉPICO! 🦄", "¡LEYENDA! 🌈", "¡INCREÍBLE! 🎆"],
        milestone: [
          "¡Gran hito! 🏔️",
          "¡Logro especial! 🎯",
          "¡Momento histórico! 📚",
        ],
      },
      teens: {
        correct: [
          "¡Nailed it! 🔥",
          "¡Perfect! 💯",
          "¡Awesome! ⚡",
          "¡Epic! 🚀",
        ],
        achievement: [
          "Achievement unlocked! 🏆",
          "¡Level up! 💎",
          "¡Beast mode! 👑",
        ],
        level_up: [
          "New level unlocked! 🚀",
          "¡You're on fire! 🔥",
          "¡Legendary! 💫",
        ],
        streak: ["¡Streak master! ⚡", "¡Unstoppable! 💯", "¡On fire! 🔥"],
        perfect_session: [
          "¡Flawless victory! 👑",
          "¡Perfect game! 💎",
          "¡Unbeatable! 🏆",
        ],
        epic_achievement: ["¡LEGENDARY! 👑", "¡GODLIKE! ⚡", "¡INSANE! 🔥"],
        milestone: [
          "¡Milestone achieved! 🚀",
          "¡Major flex! 💎",
          "¡Hall of fame! 🏆",
        ],
      },
      adults: {
        correct: ["Correcto ✓", "Excelente", "Bien hecho ⭐", "Perfecto 💼"],
        achievement: [
          "Objetivo alcanzado 🏆",
          "Logro desbloqueado ✨",
          "Meta cumplida 🎯",
        ],
        level_up: [
          "Nivel completado 📈",
          "Progreso excelente 🏆",
          "Avance significativo ⭐",
        ],
        streak: [
          "Consistencia perfecta 📊",
          "Racha excelente 🎯",
          "Rendimiento óptimo ✨",
        ],
        perfect_session: [
          "Sesión impecable 🏆",
          "Rendimiento perfecto 💼",
          "Excelencia total ⭐",
        ],
        epic_achievement: [
          "Logro excepcional 🏆",
          "Rendimiento sobresaliente ⭐",
          "Excelencia máxima 💼",
        ],
        milestone: [
          "Hito importante 📈",
          "Progreso significativo 🎯",
          "Meta estratégica 🏆",
        ],
      },
      seniors: {
        correct: [
          "¡Excelente! 🌟",
          "Muy bien 👏",
          "Perfecto 🎯",
          "Magnífico ⭐",
        ],
        achievement: [
          "¡Felicitaciones! 🏆",
          "Gran logro 🌟",
          "Muy bien hecho 👏",
        ],
        level_up: [
          "¡Nuevo nivel! 📚",
          "Progreso excelente 🌟",
          "Gran avance 🎯",
        ],
        streak: [
          "¡Excelente serie! 💫",
          "Muy consistente 🌟",
          "Gran trabajo 👏",
        ],
        perfect_session: [
          "¡Sesión perfecta! 🏆",
          "Trabajo excelente 🌟",
          "Muy bien hecho 👏",
        ],
        epic_achievement: [
          "¡Logro extraordinario! 🏆",
          "¡Excelencia total! 🌟",
          "¡Trabajo magnífico! 👏",
        ],
        milestone: [
          "¡Hito importante! 📚",
          "¡Progreso destacado! 🌟",
          "¡Momento especial! 🎯",
        ],
      },
    };

    const ageMessages = messages[ageGroup] || messages.adults;
    const typeMessages = ageMessages[type] || ageMessages.correct;
    return typeMessages[Math.floor(Math.random() * typeMessages.length)];
  };

  // ✅ CREAR PARTÍCULAS CON FÍSICA MEJORADA
  const createParticles = () => {
    const config = getAgeConfig();
    const newParticles: Particle[] = [];

    for (let i = 0; i < config.particleCount; i++) {
      const initialX = width / 2 + (Math.random() - 0.5) * 100;
      const initialY = height / 2 + (Math.random() - 0.5) * 100;

      // ✅ DIFERENTES TIPOS DE PARTÍCULAS
      const particleTypes = ["confetti", "sparkle", "star"];
      const particleType =
        particleTypes[Math.floor(Math.random() * particleTypes.length)];

      newParticles.push({
        id: `particle-${i}`,
        x: new Animated.Value(initialX),
        y: new Animated.Value(initialY),
        rotation: new Animated.Value(0),
        scale: new Animated.Value(0),
        opacity: new Animated.Value(1),
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
        emoji: config.emojis[Math.floor(Math.random() * config.emojis.length)],
        initialX,
        initialY,
        velocityX: (Math.random() - 0.5) * 300,
        velocityY: -(Math.random() * 200 + 100),
        type: particleType as any,
      });
    }

    setParticles(newParticles);
    return newParticles;
  };

  // ✅ CREAR FUEGOS ARTIFICIALES
  const createFireworks = () => {
    const fireworksArray: FireworkBurst[] = [];
    const numFireworks =
      intensity === "epic" ? 5 : intensity === "high" ? 3 : 2;

    for (let i = 0; i < numFireworks; i++) {
      const burstX = Math.random() * width;
      const burstY = Math.random() * height * 0.4 + height * 0.2;
      const burstParticles: Particle[] = [];

      // Crear partículas en círculo para explosión
      const particlesInBurst = 12;
      for (let j = 0; j < particlesInBurst; j++) {
        const angle = (j / particlesInBurst) * Math.PI * 2;
        const speed = 100 + Math.random() * 50;

        burstParticles.push({
          id: `firework-${i}-${j}`,
          x: new Animated.Value(burstX),
          y: new Animated.Value(burstY),
          rotation: new Animated.Value(0),
          scale: new Animated.Value(0),
          opacity: new Animated.Value(1),
          color: colors.duolingo.gold,
          emoji: "✨",
          initialX: burstX,
          initialY: burstY,
          velocityX: Math.cos(angle) * speed,
          velocityY: Math.sin(angle) * speed,
          type: "sparkle",
        });
      }

      fireworksArray.push({
        id: `firework-${i}`,
        x: burstX,
        y: burstY,
        particles: burstParticles,
        burstTime: i * 500 + 1000, // Escalonar explosiones
      });
    }

    return fireworksArray;
  };

  // ✅ CREAR RAYOS (LIGHTNING)
  const createLightning = () => {
    const lightningArray: Particle[] = [];
    const numStrikes = 3;

    for (let i = 0; i < numStrikes; i++) {
      lightningArray.push({
        id: `lightning-${i}`,
        x: new Animated.Value(Math.random() * width),
        y: new Animated.Value(0),
        rotation: new Animated.Value(0),
        scale: new Animated.Value(0),
        opacity: new Animated.Value(1),
        color: ageGroup === "teens" ? "#FFD700" : "#87CEEB",
        emoji: "⚡",
        initialX: Math.random() * width,
        initialY: 0,
        type: "lightning",
      });
    }

    return lightningArray;
  };

  // ✅ ANIMAR PARTÍCULAS CON FÍSICA REALISTA
  const animateParticles = (particlesToAnimate: Particle[]) => {
    const config = getAgeConfig();

    particlesToAnimate.forEach((particle, index) => {
      const delay = index * 30;

      // Animación de aparición
      Animated.timing(particle.scale, {
        toValue: Math.random() * 0.8 + 0.6,
        duration: 300,
        delay,
        useNativeDriver: true,
      }).start();

      // ✅ FÍSICA REALISTA CON GRAVEDAD
      const gravity = 500; // pixels/s²
      const friction = 0.98;
      const duration = config.duration;

      if ((config as any).confettiStyle || (config as any).modernStyle) {
        // Movimiento con gravedad y rebotes
        Animated.parallel([
          Animated.timing(particle.x, {
            toValue:
              particle.initialX +
              (particle.velocityX || 0) * (duration / 1000) * friction,
            duration,
            delay,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(particle.y, {
            toValue: height + 100,
            duration,
            delay,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(particle.rotation, {
            toValue: (Math.random() - 0.5) * 1440, // Hasta 4 rotaciones
            duration,
            delay,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        // Movimiento elegante para adultos/seniors
        Animated.parallel([
          Animated.timing(particle.y, {
            toValue: particle.initialY + Math.random() * 150 + 50,
            duration,
            delay,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(particle.x, {
            toValue: particle.initialX + (Math.random() - 0.5) * 80,
            duration,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(particle.opacity, {
            toValue: 0,
            duration: duration * 0.8,
            delay: delay + duration * 0.2,
            useNativeDriver: true,
          }),
        ]).start();
      }
    });
  };

  // ✅ ANIMAR FUEGOS ARTIFICIALES
  const animateFireworks = (fireworksArray: FireworkBurst[]) => {
    fireworksArray.forEach((firework) => {
      setTimeout(() => {
        // Flash de lightning
        Animated.sequence([
          Animated.timing(lightningFlash, {
            toValue: 0.3,
            duration: 100,
            useNativeDriver: false,
          }),
          Animated.timing(lightningFlash, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }),
        ]).start();

        // Animar partículas de explosión
        firework.particles.forEach((particle, index) => {
          const delay = index * 20;

          Animated.parallel([
            Animated.timing(particle.scale, {
              toValue: 1,
              duration: 200,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(particle.x, {
              toValue: particle.initialX + (particle.velocityX || 0) * 2,
              duration: 1500,
              delay,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(particle.y, {
              toValue: particle.initialY + (particle.velocityY || 0) * 2,
              duration: 1500,
              delay,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(particle.opacity, {
              toValue: 0,
              duration: 1000,
              delay: delay + 500,
              useNativeDriver: true,
            }),
          ]).start();
        });
      }, firework.burstTime);
    });
  };

  // ✅ EFECTO DE PULSO DE PANTALLA
  const animateScreenPulse = () => {
    if (intensity === "high" || intensity === "epic") {
      Animated.sequence([
        Animated.timing(screenPulse, {
          toValue: 0.1,
          duration: 150,
          useNativeDriver: false,
        }),
        Animated.timing(screenPulse, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  // ✅ ANIMACIÓN PRINCIPAL MEJORADA
  const startCelebration = () => {
    const config = getAgeConfig();

    // Crear y animar partículas base
    const newParticles = createParticles();
    animateParticles(newParticles);

    // Efectos adicionales según configuración
    if (config.effects?.includes("fireworks")) {
      const fireworksArray = createFireworks();
      setFireworks(fireworksArray);
      animateFireworks(fireworksArray);
    }

    if (config.effects?.includes("lightning")) {
      const lightningArray = createLightning();
      setLightningStrikes(lightningArray);

      // Animar rayos
      lightningArray.forEach((lightning, index) => {
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(lightning.scale, {
              toValue: 2,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(lightning.y, {
              toValue: height,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(lightning.opacity, {
              toValue: 0,
              duration: 400,
              delay: 200,
              useNativeDriver: true,
            }),
          ]).start();
        }, index * 300);
      });
    }

    if (config.effects?.includes("pulse")) {
      animateScreenPulse();
    }

    if (config.effects?.includes("cascade")) {
      // Efecto cascada para logros épicos
      Animated.timing(cascadeFlow, {
        toValue: 1,
        duration: config.duration * 0.8,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }

    // Animación del contenedor principal
    Animated.parallel([
      Animated.timing(containerOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(mainScale, {
        toValue: 1,
        tension: config.bouncy ? 200 : 100,
        friction: config.bouncy ? 4 : 8,
        useNativeDriver: true,
      }),
      Animated.spring(textSlide, {
        toValue: 0,
        tension: 120,
        friction: 8,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-completar
    setTimeout(() => {
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        onComplete?.();
        // Limpiar estado
        setParticles([]);
        setFireworks([]);
        setLightningStrikes([]);
        containerOpacity.setValue(0);
        mainScale.setValue(0);
        textSlide.setValue(50);
        screenPulse.setValue(0);
        lightningFlash.setValue(0);
        cascadeFlow.setValue(0);
      });
    }, config.duration);
  };

  useEffect(() => {
    if (visible) {
      startCelebration();
    }
  }, [visible]);

  if (!visible) return null;

  const config = getAgeConfig();
  const message = getCelebrationMessage();

  return (
    <Animated.View
      style={[styles.container, { opacity: containerOpacity }]}
      pointerEvents="none"
    >
      {/* ✅ PULSO DE PANTALLA */}
      <Animated.View
        style={[
          styles.screenPulse,
          {
            opacity: screenPulse,
            backgroundColor:
              ageGroup === "kids"
                ? "#FFD700"
                : ageGroup === "teens"
                ? "#FF1493"
                : ageGroup === "adults"
                ? "#4169E1"
                : "#DDA0DD",
          },
        ]}
      />

      {/* ✅ FLASH DE LIGHTNING */}
      <Animated.View
        style={[
          styles.lightningFlash,
          {
            opacity: lightningFlash,
            backgroundColor: "#FFFFFF",
          },
        ]}
      />

      {/* Partículas principales */}
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
        >
          {particle.emoji ? (
            <Text
              style={[
                styles.particleEmoji,
                {
                  color: particle.color,
                  fontSize:
                    ageGroup === "kids" ? 28 : ageGroup === "teens" ? 24 : 18,
                  textShadowColor: "rgba(0,0,0,0.3)",
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 2,
                },
              ]}
            >
              {particle.emoji}
            </Text>
          ) : (
            <View
              style={[
                styles.particleDot,
                {
                  backgroundColor: particle.color,
                  width: ageGroup === "kids" ? 10 : 8,
                  height: ageGroup === "kids" ? 10 : 8,
                  shadowColor: particle.color,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.8,
                  shadowRadius: 4,
                },
              ]}
            />
          )}
        </Animated.View>
      ))}

      {/* ✅ FUEGOS ARTIFICIALES */}
      {fireworks.map((firework) =>
        firework.particles.map((particle) => (
          <Animated.View
            key={particle.id}
            style={[
              styles.particle,
              {
                left: particle.x,
                top: particle.y,
                transform: [{ scale: particle.scale }],
                opacity: particle.opacity,
              },
            ]}
          >
            <Text style={[styles.fireworkParticle, { color: particle.color }]}>
              {particle.emoji}
            </Text>
          </Animated.View>
        ))
      )}

      {/* ✅ RAYOS */}
      {lightningStrikes.map((lightning) => (
        <Animated.View
          key={lightning.id}
          style={[
            styles.lightning,
            {
              left: lightning.x,
              top: lightning.y,
              transform: [{ scale: lightning.scale }],
              opacity: lightning.opacity,
            },
          ]}
        >
          <Text style={[styles.lightningEmoji, { color: lightning.color }]}>
            {lightning.emoji}
          </Text>
        </Animated.View>
      ))}

      {/* Mensaje central mejorado */}
      <Animated.View
        style={[
          styles.messageContainer,
          {
            transform: [{ scale: mainScale }, { translateY: textSlide }],
          },
        ]}
      >
        <View
          style={[
            styles.messageBox,
            config.confettiStyle && styles.kidsMessageBox,
            config.modernStyle && styles.teensMessageBox,
            config.elegantStyle && styles.adultsMessageBox,
            config.gentleStyle && styles.seniorsMessageBox,
            (intensity === "epic" || type === "epic_achievement") &&
              styles.epicMessageBox,
          ]}
        >
          {/* ✅ TÍTULO ACHIEVEMENT SI EXISTE */}
          {achievementTitle && (
            <Text
              style={[styles.achievementTitle, { color: config.colors[0] }]}
            >
              {achievementTitle}
            </Text>
          )}

          <Text
            style={[
              styles.messageText,
              config.confettiStyle && styles.kidsMessageText,
              config.modernStyle && styles.teensMessageText,
              config.elegantStyle && styles.adultsMessageText,
              config.gentleStyle && styles.seniorsMessageText,
              (intensity === "epic" || type === "epic_achievement") &&
                styles.epicMessageText,
            ]}
          >
            {message}
          </Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  particle: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  particleEmoji: {
    fontWeight: "bold",
  },
  particleDot: {
    borderRadius: 50,
  },
  messageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  messageBox: {
    backgroundColor: colors.background.paper,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: colors.primary.main,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  messageText: {
    ...typography.h2,
    color: colors.text.primary,
    textAlign: "center",
    fontWeight: "700",
  },
  // Estilos específicos por edad
  kidsMessageBox: {
    backgroundColor: "#FFF9E6",
    borderColor: "#FF6B6B",
    borderWidth: 4,
    transform: [{ rotate: "-2deg" }],
  },
  kidsMessageText: {
    ...typography.h1,
    color: "#FF6B6B",
    fontSize: 28,
  },
  teensMessageBox: {
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    borderColor: "#667eea",
    borderWidth: 3,
    borderRadius: 15,
  },
  teensMessageText: {
    ...typography.h2,
    color: "#667eea",
    fontSize: 24,
    fontWeight: "800",
  },
  adultsMessageBox: {
    backgroundColor: colors.background.paper,
    borderColor: colors.primary.main,
    borderWidth: 2,
    borderRadius: 12,
  },
  adultsMessageText: {
    ...typography.h3,
    color: colors.primary.main,
    fontSize: 20,
    fontWeight: "600",
  },
  seniorsMessageBox: {
    backgroundColor: "#FFFEF7",
    borderColor: "#B8860B",
    borderWidth: 2,
    borderRadius: 20,
  },
  seniorsMessageText: {
    ...typography.h2,
    color: "#B8860B",
    fontSize: 22,
    fontWeight: "600",
  },
  screenPulse: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
  },
  lightningFlash: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
  },
  lightning: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  lightningEmoji: {
    fontSize: 24,
    fontWeight: "bold",
  },
  epicMessageBox: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderColor: "#FFD700",
    borderWidth: 4,
    transform: [{ rotate: "-2deg" }],
  },
  achievementTitle: {
    ...typography.h1,
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: spacing.md,
  },
  epicMessageText: {
    ...typography.h1,
    color: "#FFD700",
    fontSize: 28,
  },
  fireworkParticle: {
    fontSize: 20,
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default CelebrationEffect;
