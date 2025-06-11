import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

interface SimpleParticlesProps {
  show: boolean;
  color?: string;
  intensity?: "low" | "medium" | "high";
  onComplete?: () => void;
}

const SimpleParticles: React.FC<SimpleParticlesProps> = ({
  show,
  color = "#FFD700",
  intensity = "medium",
  onComplete,
}) => {
  // Crear siempre el mismo número de animated values (fijo) para evitar hook violations
  const particles = useRef(
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(0),
      translateX: new Animated.Value(0),
      scale: new Animated.Value(0),
    }))
  ).current;

  // Determinar cuántas partículas usar basado en intensity
  const activeParticleCount =
    intensity === "low" ? 6 : intensity === "high" ? 12 : 8;
  const activeParticles = particles
    ? particles.slice(0, activeParticleCount)
    : [];

  useEffect(() => {
    if (show && activeParticles.length > 0) {
      startParticleAnimation();
    }
  }, [show, intensity]);

  const startParticleAnimation = () => {
    // Protección adicional
    if (!activeParticles || activeParticles.length === 0) return;

    // Reiniciar todas las animaciones
    activeParticles.forEach((particle) => {
      particle.opacity.setValue(0);
      particle.translateY.setValue(0);
      particle.translateX.setValue(0);
      particle.scale.setValue(0);
    });

    // Crear animaciones para cada partícula con delays aleatorios
    const animations = activeParticles.map((particle, index) => {
      const randomDelay = Math.random() * 200;
      const randomX = (Math.random() - 0.5) * 200; // -100 a 100
      const randomY = -(Math.random() * 150 + 100); // -100 a -250
      const randomScale = 0.5 + Math.random() * 0.8; // 0.5 a 1.3

      return Animated.sequence([
        Animated.delay(randomDelay),
        Animated.parallel([
          // Fade in y scale
          Animated.timing(particle.opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(particle.scale, {
            toValue: randomScale,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          // Movimiento
          Animated.timing(particle.translateX, {
            toValue: randomX,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(particle.translateY, {
            toValue: randomY,
            duration: 2000,
            useNativeDriver: true,
          }),
          // Fade out
          Animated.timing(particle.opacity, {
            toValue: 0,
            duration: 1000,
            delay: 1000,
            useNativeDriver: true,
          }),
        ]),
      ]);
    });

    Animated.parallel(animations).start(() => {
      onComplete?.();
    });
  };

  if (!show) return null;

  return (
    <View style={styles.container}>
      {activeParticles.map((particle, index) => (
        <Animated.View
          key={particle.id}
          style={[
            styles.particle,
            {
              backgroundColor: color,
              opacity: particle.opacity,
              transform: [
                { translateX: particle.translateX },
                { translateY: particle.translateY },
                { scale: particle.scale },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none",
  },
  particle: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default SimpleParticles;
