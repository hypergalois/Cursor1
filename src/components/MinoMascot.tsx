import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import {
  colors,
  spacing,
  shadows,
  borderRadius,
  animations,
} from "../styles/theme";

interface MinoMascotProps {
  mood?: "happy" | "neutral" | "sad";
  size?: number;
}

const MinoMascot: React.FC<MinoMascotProps> = ({
  mood = "neutral",
  size = 200,
}) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación de entrada con escala
    Animated.spring(scaleAnim, {
      toValue: 1,
      ...animations.spring,
      useNativeDriver: true,
    }).start();

    // Animación de rebote continua
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -8,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    // Animación de rotación sutil
    const rotateAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: -1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    );

    bounceAnimation.start();
    rotateAnimation.start();

    return () => {
      bounceAnimation.stop();
      rotateAnimation.stop();
    };
  }, []);

  const getMascotEmoji = () => {
    switch (mood) {
      case "happy":
        return "🐂";
      case "sad":
        return "😔";
      default:
        return "🐃";
    }
  };

  const getMoodColor = () => {
    switch (mood) {
      case "happy":
        return colors.success.main;
      case "sad":
        return colors.error.main;
      default:
        return colors.primary.main;
    }
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-5deg", "5deg"],
  });

  return (
    <View style={[styles.container, { width: size + 20, height: size + 20 }]}>
      <Animated.View
        style={[
          styles.mascotWrapper,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [
              { translateY: bounceAnim },
              { scale: scaleAnim },
              { rotate: rotate },
            ],
          },
        ]}
      >
        {/* Círculo de fondo con gradiente visual */}
        <View
          style={[
            styles.background,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: getMoodColor(),
            },
          ]}
        />

        {/* Círculo interior más claro */}
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

        {/* Minotauro emoji */}
        <Text style={[styles.mascot, { fontSize: size * 0.5 }]}>
          {getMascotEmoji()}
        </Text>

        {/* Efectos decorativos */}
        <View style={styles.sparkles}>
          <Animated.View
            style={[
              styles.sparkle,
              styles.sparkle1,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <Text style={styles.sparkleText}>✨</Text>
          </Animated.View>
          <Animated.View
            style={[
              styles.sparkle,
              styles.sparkle2,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <Text style={styles.sparkleText}>⭐</Text>
          </Animated.View>
          <Animated.View
            style={[
              styles.sparkle,
              styles.sparkle3,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <Text style={styles.sparkleText}>✨</Text>
          </Animated.View>
        </View>
      </Animated.View>
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
    opacity: 0.15,
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
  sparkles: {
    position: "absolute",
    width: "120%",
    height: "120%",
    pointerEvents: "none",
  },
  sparkle: {
    position: "absolute",
  },
  sparkle1: {
    top: "5%",
    right: "5%",
  },
  sparkle2: {
    bottom: "10%",
    left: "10%",
  },
  sparkle3: {
    top: "15%",
    left: "5%",
  },
  sparkleText: {
    fontSize: 16,
    opacity: 0.8,
  },
});

export default MinoMascot;
