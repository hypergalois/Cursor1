import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { colors, spacing, typography, borderRadius } from "../styles/theme";

interface SceneAssetsProps {
  sceneType: string;
  size?: "small" | "medium" | "large";
  animated?: boolean;
}

const { width } = Dimensions.get("window");

export const SceneAssets: React.FC<SceneAssetsProps> = ({
  sceneType,
  size = "medium",
  animated = false,
}) => {
  const getSceneConfig = () => {
    const scenes = {
      entrance: {
        background: "#1a237e",
        elements: ["🏰", "🌫️", "🗝️"],
        title: "Entrada de la Mazmorra",
        particles: ["🌟", "✨", "💫"],
      },
      golden_room: {
        background: "#ff8f00",
        elements: ["✨", "💰", "🏛️"],
        title: "Sala Dorada",
        particles: ["✨", "💫", "🌟"],
      },
      mystery_tunnel: {
        background: "#4a148c",
        elements: ["🌀", "🔮", "🕳️"],
        title: "Túnel Misterioso",
        particles: ["🌙", "✨", "🌟"],
      },
      tower: {
        background: "#0d47a1",
        elements: ["🏗️", "⚡", "📚"],
        title: "Torre del Mago",
        particles: ["✨", "🔮", "⚡"],
      },
      treasure_cave: {
        background: "#1b5e20",
        elements: ["💎", "💰", "⛏️"],
        title: "Caverna del Tesoro",
        particles: ["💎", "💰", "⭐"],
      },
      fire_chamber: {
        background: "#bf360c",
        elements: ["🔥", "🌋", "🔴"],
        title: "Cámara de Fuego",
        particles: ["🔥", "💥", "⭐"],
      },
      ice_chamber: {
        background: "#006064",
        elements: ["❄️", "🧊", "❄️"],
        title: "Cámara de Hielo",
        particles: ["❄️", "✨", "🌟"],
      },
      boss_room: {
        background: "#263238",
        elements: ["👑", "⚔️", "💀"],
        title: "Sala del Jefe Final",
        particles: ["⚡", "🌟", "✨"],
      },
    };

    return scenes[sceneType as keyof typeof scenes] || scenes.entrance;
  };

  const getSizeConfig = () => {
    switch (size) {
      case "small":
        return {
          containerSize: width * 0.25,
          iconSize: 20,
          titleSize: 12,
        };
      case "large":
        return {
          containerSize: width * 0.7,
          iconSize: 40,
          titleSize: 18,
        };
      default:
        return {
          containerSize: width * 0.4,
          iconSize: 28,
          titleSize: 14,
        };
    }
  };

  const scene = getSceneConfig();
  const sizeConfig = getSizeConfig();

  return (
    <View
      style={[
        styles.container,
        {
          width: sizeConfig.containerSize,
          height: sizeConfig.containerSize,
          backgroundColor: scene.background + "20",
          borderColor: scene.background,
        },
      ]}
    >
      {/* Fondo atmosférico */}
      <View
        style={[styles.atmosphereLayer, { backgroundColor: scene.background }]}
      />

      {/* Elementos principales de la escena */}
      <View style={styles.mainElements}>
        {scene.elements.map((element, index) => (
          <Text
            key={index}
            style={[styles.elementIcon, { fontSize: sizeConfig.iconSize }]}
          >
            {element}
          </Text>
        ))}
      </View>

      {/* Partículas decorativas */}
      <View style={styles.particlesOverlay}>
        {scene.particles.map((particle, index) => (
          <Text
            key={index}
            style={[styles.particle, { fontSize: sizeConfig.iconSize * 0.5 }]}
          >
            {particle}
          </Text>
        ))}
      </View>

      {/* Título de la escena */}
      {size === "large" && (
        <View style={styles.titleContainer}>
          <Text style={[styles.sceneTitle, { fontSize: sizeConfig.titleSize }]}>
            {scene.title}
          </Text>
        </View>
      )}
    </View>
  );
};

// Componente especializado para mostrar múltiples escenas
export const SceneGallery: React.FC<{ scenes: string[] }> = ({ scenes }) => {
  return (
    <View style={styles.galleryContainer}>
      {scenes.map((scene, index) => (
        <SceneAssets key={index} sceneType={scene} size="small" />
      ))}
    </View>
  );
};

// Componente para mostrar transición entre escenas
export const SceneTransition: React.FC<{
  fromScene: string;
  toScene: string;
}> = ({ fromScene, toScene }) => {
  return (
    <View style={styles.transitionContainer}>
      <SceneAssets sceneType={fromScene} size="medium" />
      <View style={styles.transitionArrow}>
        <Text style={styles.arrowText}>➡️</Text>
      </View>
      <SceneAssets sceneType={toScene} size="medium" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    overflow: "hidden",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  atmosphereLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.2,
  },
  mainElements: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    zIndex: 2,
  },
  elementIcon: {
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  particlesOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-around",
    padding: spacing.xs,
    pointerEvents: "none",
    zIndex: 1,
  },
  particle: {
    opacity: 0.4,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  titleContainer: {
    position: "absolute",
    bottom: spacing.xs,
    left: spacing.xs,
    right: spacing.xs,
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: borderRadius.sm,
    padding: spacing.xs,
    zIndex: 3,
  },
  sceneTitle: {
    color: colors.background.paper,
    textAlign: "center",
    fontWeight: "600",
  },
  galleryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    justifyContent: "center",
  },
  transitionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  transitionArrow: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.sm,
  },
  arrowText: {
    fontSize: 20,
    color: colors.primary.main,
  },
});

export default SceneAssets;
