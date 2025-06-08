import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import { useGameState } from "../context/GameStateProvider";

const GameStatus: React.FC = () => {
  const theme = useTheme();
  const { gameState } = useGameState();

  const renderLives = () => {
    const lives = [];
    for (let i = 0; i < gameState.maxLives; i++) {
      lives.push(
        <Text
          key={i}
          style={[
            styles.heart,
            {
              color:
                i < gameState.lives
                  ? theme.colors.status.error
                  : theme.colors.text.secondary,
            },
          ]}
        >
          ❤️
        </Text>
      );
    }
    return lives;
  };

  const renderExperienceBar = () => {
    const progress =
      (gameState.experience / gameState.experienceToNextLevel) * 100;
    return (
      <View style={styles.experienceContainer}>
        <View style={styles.experienceBar}>
          <View
            style={[
              styles.experienceProgress,
              {
                width: `${progress}%`,
                backgroundColor: theme.colors.primary.main,
              },
            ]}
          />
        </View>
        <Text
          style={[
            styles.experienceText,
            { color: theme.colors.text.secondary },
          ]}
        >
          Nivel {gameState.level} - {gameState.experience}/
          {gameState.experienceToNextLevel} XP
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.livesContainer}>{renderLives()}</View>
        <View style={styles.hintsContainer}>
          <Text
            style={[styles.hintsText, { color: theme.colors.text.secondary }]}
          >
            💡 {gameState.hints}
          </Text>
        </View>
      </View>
      {renderExperienceBar()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    margin: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  livesContainer: {
    flexDirection: "row",
    gap: 4,
  },
  heart: {
    fontSize: 24,
  },
  hintsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  hintsText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  experienceContainer: {
    gap: 4,
  },
  experienceBar: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  experienceProgress: {
    height: "100%",
    borderRadius: 4,
  },
  experienceText: {
    fontSize: 12,
    textAlign: "center",
  },
});

export default GameStatus;
