import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import {
  colors,
  spacing,
  shadows,
  borderRadius,
  animations,
} from "../../styles/theme";

interface MinoMascotProps {
  mood?:
    | "happy"
    | "neutral"
    | "sad"
    | "excited"
    | "thinking"
    | "celebrating"
    | "sleepy"
    | "surprised"
    | "focused"
    | "proud"
    | "frustrated"
    | "confused"
    | "motivated"
    | "tired"
    | "amazed"
    | "determined"
    | "relaxed"
    | "worried"
    | "confident";
  size?: number;
  ageGroup?: "kids" | "teens" | "adults" | "seniors";
  showThoughts?: boolean;
  isInteractive?: boolean;
  context?:
    | "welcome"
    | "problem"
    | "result"
    | "profile"
    | "achievement"
    | "streak"
    | "failure";
}

const { width } = Dimensions.get("window");

const MinoMascot: React.FC<MinoMascotProps> = ({
  mood = "neutral",
  size = 200,
  ageGroup = "adults",
  showThoughts = false,
  isInteractive = false,
  context = "welcome",
}) => {
  const [currentExpression, setCurrentExpression] = useState(mood);
  const [isBlinking, setIsBlinking] = useState(false);

  // Animaciones principales
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const thoughtAnim = useRef(new Animated.Value(0)).current;

  // Animaciones de personalidad
  const eyeBlinkAnim = useRef(new Animated.Value(1)).current;
  const heartBeatAnim = useRef(new Animated.Value(1)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setCurrentExpression(mood);

    // Animaciones base según el estado de ánimo
    startMoodAnimations();

    // Parpadeo natural
    startBlinkingAnimation();

    // Animaciones específicas por edad
    startAgeSpecificAnimations();
  }, [mood, ageGroup]);

  const startMoodAnimations = () => {
    // Detener animaciones previas
    bounceAnim.stopAnimation();
    scaleAnim.stopAnimation();
    rotateAnim.stopAnimation();
    glowAnim.stopAnimation();

    switch (mood) {
      case "happy":
        startHappyAnimations();
        break;
      case "excited":
        startExcitedAnimations();
        break;
      case "celebrating":
        startCelebratingAnimations();
        break;
      case "thinking":
        startThinkingAnimations();
        break;
      case "proud":
        startProudAnimations();
        break;
      case "surprised":
        startSurprisedAnimations();
        break;
      case "focused":
        startFocusedAnimations();
        break;
      case "sleepy":
        startSleepyAnimations();
        break;
      case "sad":
        startSadAnimations();
        break;
      case "frustrated":
        startFrustratedAnimations();
        break;
      case "confused":
        startConfusedAnimations();
        break;
      case "motivated":
        startMotivatedAnimations();
        break;
      case "tired":
        startTiredAnimations();
        break;
      case "amazed":
        startAmazedAnimations();
        break;
      case "determined":
        startDeterminedAnimations();
        break;
      case "relaxed":
        startRelaxedAnimations();
        break;
      case "worried":
        startWorriedAnimations();
        break;
      case "confident":
        startConfidentAnimations();
        break;
      default:
        startNeutralAnimations();
    }
  };

  const startHappyAnimations = () => {
    // Rebote suave y continuo
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -8,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Brillo sutil
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startExcitedAnimations = () => {
    // Rebote más rápido y energético
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -12,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Vibración lateral sutil
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: -1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Sparkles
    startSparkleAnimation();
  };

  const startCelebratingAnimations = () => {
    // Salto de celebración
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -20,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.delay(200),
      ])
    ).start();

    // Escalado pulsante
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    startSparkleAnimation();
  };

  const startThinkingAnimations = () => {
    // Balanceo pensativo
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: -1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Mostrar burbujas de pensamiento
    if (showThoughts) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(thoughtAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(thoughtAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  };

  const startProudAnimations = () => {
    // Postura erguida y orgullosa
    Animated.timing(scaleAnim, {
      toValue: 1.05,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Brillo dorado
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.5,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startSurprisedAnimations = () => {
    // Salto de sorpresa único
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: -15,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const startFocusedAnimations = () => {
    // Respiración concentrada
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.02,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Reduce el parpadeo cuando está concentrado
    setIsBlinking(false);
  };

  const startSleepyAnimations = () => {
    // Balanceo lento
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 0.5,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: -0.5,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Parpadeo más lento
    setIsBlinking(true);
  };

  const startSadAnimations = () => {
    // Caída lenta
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Balanceo triste
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: -0.5,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startNeutralAnimations = () => {
    // Respiración natural
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -3,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Nuevas animaciones para estados emocionales adicionales
  const startFrustratedAnimations = () => {
    // Vibración de frustración
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: -1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(500),
      ])
    ).start();

    // Resplandor rojizo
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.2,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startConfusedAnimations = () => {
    // Bamboleo confuso
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: -1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0.5,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Parpadeo más frecuente
    setIsBlinking(true);
  };

  const startMotivatedAnimations = () => {
    // Rebote energético
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.delay(200),
      ])
    ).start();

    // Pulsación fuerte
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Brillo naranja
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.7,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startTiredAnimations = () => {
    // Caída lenta y pesada
    Animated.timing(scaleAnim, {
      toValue: 0.9,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    // Balanceo muy lento
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 0.3,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: -0.3,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Parpadeo muy lento
    setIsBlinking(true);
  };

  const startAmazedAnimations = () => {
    // Salto de asombro grande
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: -25,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.15,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Sparkles de asombro
    startSparkleAnimation();

    // Brillo azul intenso
    Animated.timing(glowAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const startDeterminedAnimations = () => {
    // Postura firme
    Animated.timing(scaleAnim, {
      toValue: 1.02,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Respiración determinada
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Brillo verde constante
    Animated.timing(glowAnim, {
      toValue: 0.6,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const startRelaxedAnimations = () => {
    // Respiración muy calmada
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -2,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Escala ligeramente relajada
    Animated.timing(scaleAnim, {
      toValue: 0.98,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    // Brillo suave verde
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.4,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startWorriedAnimations = () => {
    // Temblor nervioso
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 0.3,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: -0.3,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.delay(300),
      ])
    ).start();

    // Parpadeo rápido
    setIsBlinking(true);

    // Brillo amarillo nervioso
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.6,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.2,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startConfidentAnimations = () => {
    // Postura segura y orgullosa
    Animated.timing(scaleAnim, {
      toValue: 1.08,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Rebote confiado
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -5,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Brillo dorado constante
    Animated.timing(glowAnim, {
      toValue: 0.8,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Sparkles ocasionales
    startSparkleAnimation();
  };

  const startSparkleAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startBlinkingAnimation = () => {
    if (!isBlinking) return;

    const blink = () => {
      Animated.sequence([
        Animated.timing(eyeBlinkAnim, {
          toValue: 0.1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(eyeBlinkAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      // Parpadeo aleatorio cada 2-5 segundos
      setTimeout(blink, Math.random() * 3000 + 2000);
    };

    setTimeout(blink, 1000);
  };

  const startAgeSpecificAnimations = () => {
    switch (ageGroup) {
      case "kids":
        // Más energético y juguetón
        if (mood === "happy" || mood === "excited") {
          startHeartBeatAnimation();
        }
        break;
      case "teens":
        // Más cool y moderno
        break;
      case "adults":
        // Profesional pero amigable
        break;
      case "seniors":
        // Más lento y gentil
        // Reducir velocidad de todas las animaciones
        break;
    }
  };

  const startHeartBeatAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(heartBeatAnim, {
          toValue: 1.05,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(heartBeatAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(heartBeatAnim, {
          toValue: 1.05,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(heartBeatAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Obtener emoji según mood y ageGroup
  const getMascotEmoji = () => {
    const expressions = {
      kids: {
        happy: "😊",
        excited: "🤩",
        celebrating: "🥳",
        thinking: "🤔",
        proud: "😁",
        surprised: "😮",
        focused: "🧐",
        sleepy: "😴",
        sad: "😢",
        neutral: "😐",
        frustrated: "😤",
        confused: "😵‍💫",
        motivated: "💪",
        tired: "😩",
        amazed: "🤯",
        determined: "😤",
        relaxed: "😌",
        worried: "😰",
        confident: "😎",
      },
      teens: {
        happy: "😄",
        excited: "🤯",
        celebrating: "🥳",
        thinking: "🧐",
        proud: "😎",
        surprised: "😲",
        focused: "🎯",
        sleepy: "😪",
        sad: "😔",
        neutral: "😐",
        frustrated: "😠",
        confused: "😵",
        motivated: "🔥",
        tired: "😴",
        amazed: "😱",
        determined: "💪",
        relaxed: "😌",
        worried: "😟",
        confident: "😏",
      },
      adults: {
        happy: "🙂",
        excited: "😃",
        celebrating: "🎉",
        thinking: "🤓",
        proud: "😌",
        surprised: "😯",
        focused: "🧠",
        sleepy: "😴",
        sad: "😞",
        neutral: "😐",
        frustrated: "😤",
        confused: "🤷‍♂️",
        motivated: "💪",
        tired: "😪",
        amazed: "😲",
        determined: "😤",
        relaxed: "😊",
        worried: "😰",
        confident: "😎",
      },
      seniors: {
        happy: "😊",
        excited: "😊",
        celebrating: "🎉",
        thinking: "🧐",
        proud: "😌",
        surprised: "😮",
        focused: "🤓",
        sleepy: "😴",
        sad: "😢",
        neutral: "😐",
        frustrated: "😤",
        confused: "🤔",
        motivated: "💪",
        tired: "😴",
        amazed: "😯",
        determined: "💪",
        relaxed: "😌",
        worried: "😟",
        confident: "😊",
      },
    };

    return (
      expressions[ageGroup][currentExpression] || expressions[ageGroup].neutral
    );
  };

  // Obtener color del aura según mood
  const getAuraColor = () => {
    const auraColors = {
      happy: colors.success.main,
      excited: colors.duolingo.orange,
      celebrating: colors.duolingo.gold,
      thinking: colors.duolingo.purple,
      proud: colors.duolingo.gold,
      surprised: colors.duolingo.blue,
      focused: colors.primary.main,
      sleepy: colors.text.light,
      sad: colors.text.secondary,
      neutral: colors.primary.main,
      frustrated: colors.error.main,
      confused: colors.warning.main,
      motivated: colors.duolingo.orange,
      tired: colors.text.light,
      amazed: colors.duolingo.blue,
      determined: colors.success.main,
      relaxed: colors.duolingo.green,
      worried: colors.warning.main,
      confident: colors.duolingo.gold,
    };
    return auraColors[currentExpression];
  };

  // Obtener efectos especiales
  const getSpecialEffects = () => {
    const effects = [];

    if (mood === "celebrating" || mood === "excited") {
      effects.push(
        <Animated.View
          key="sparkles"
          style={[styles.sparkles, { opacity: sparkleAnim }]}
        >
          <Text style={[styles.sparkle, styles.sparkle1]}>✨</Text>
          <Text style={[styles.sparkle, styles.sparkle2]}>⭐</Text>
          <Text style={[styles.sparkle, styles.sparkle3]}>💫</Text>
          <Text style={[styles.sparkle, styles.sparkle4]}>🌟</Text>
        </Animated.View>
      );
    }

    if (mood === "thinking" && showThoughts) {
      effects.push(
        <Animated.View
          key="thoughts"
          style={[styles.thoughtBubbles, { opacity: thoughtAnim }]}
        >
          <Text style={styles.thoughtBubble1}>💭</Text>
          <Text style={styles.thoughtBubble2}>💭</Text>
          <Text style={styles.thoughtBubble3}>💭</Text>
        </Animated.View>
      );
    }

    if (mood === "proud") {
      effects.push(
        <Animated.View
          key="glow"
          style={[
            styles.glowEffect,
            {
              opacity: glowAnim,
              borderColor: colors.duolingo.gold,
            },
          ]}
        />
      );
    }

    return effects;
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-3deg", "3deg"],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.6],
  });

  return (
    <View style={[styles.container, { width: size + 40, height: size + 40 }]}>
      <Animated.View
        style={[
          styles.mascotWrapper,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [
              { translateY: bounceAnim },
              { scale: Animated.multiply(scaleAnim, heartBeatAnim) },
              { rotate: rotate },
            ],
          },
        ]}
      >
        {/* Aura/Background con color dinámico */}
        <Animated.View
          style={[
            styles.background,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: getAuraColor(),
              opacity: glowOpacity,
            },
          ]}
        />

        {/* Círculo interior */}
        <View
          style={[
            styles.innerCircle,
            {
              width: size * 0.85,
              height: size * 0.85,
              borderRadius: (size * 0.85) / 2,
              backgroundColor: colors.background.paper,
            },
          ]}
        />

        {/* Minotauro emoji con animación de parpadeo */}
        <Animated.Text
          style={[
            styles.mascot,
            {
              fontSize: size * 0.5,
              transform: [{ scaleY: eyeBlinkAnim }],
            },
          ]}
        >
          {getMascotEmoji()}
        </Animated.Text>

        {/* Efectos especiales dinámicos */}
        {getSpecialEffects()}
      </Animated.View>

      {/* Indicador de contexto para adultos/seniors */}
      {(ageGroup === "adults" || ageGroup === "seniors") &&
        context !== "welcome" && (
          <View style={styles.contextIndicator}>
            <Text style={styles.contextEmoji}>
              {context === "problem" && "🧮"}
              {context === "result" && "📊"}
              {context === "profile" && "👤"}
              {context === "achievement" && "🏆"}
            </Text>
          </View>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  mascotWrapper: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    ...shadows.large,
  },
  background: {
    position: "absolute",
  },
  innerCircle: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    ...shadows.medium,
  },
  mascot: {
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    zIndex: 10,
  },

  // Efectos especiales
  sparkles: {
    position: "absolute",
    width: "150%",
    height: "150%",
    pointerEvents: "none",
  },
  sparkle: {
    position: "absolute",
    fontSize: 16,
  },
  sparkle1: {
    top: "10%",
    right: "10%",
  },
  sparkle2: {
    bottom: "15%",
    left: "15%",
  },
  sparkle3: {
    top: "20%",
    left: "5%",
  },
  sparkle4: {
    bottom: "10%",
    right: "5%",
  },

  thoughtBubbles: {
    position: "absolute",
    top: -20,
    right: -10,
    pointerEvents: "none",
  },
  thoughtBubble1: {
    fontSize: 12,
    position: "absolute",
    top: -10,
    right: 5,
  },
  thoughtBubble2: {
    fontSize: 8,
    position: "absolute",
    top: -5,
    right: 0,
  },
  thoughtBubble3: {
    fontSize: 6,
    position: "absolute",
    top: 0,
    right: -3,
  },

  glowEffect: {
    position: "absolute",
    width: "120%",
    height: "120%",
    borderRadius: 1000,
    borderWidth: 3,
  },

  contextIndicator: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: colors.background.paper,
    borderRadius: 15,
    padding: 4,
    ...shadows.small,
  },
  contextEmoji: {
    fontSize: 12,
  },
});

export default MinoMascot;
