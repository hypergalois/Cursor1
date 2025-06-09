import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import { useGameState } from "../context/GameStateProvider";
import { useAudio } from "../context/AudioProvider";
import ScreenTransition from "../components/ScreenTransition";
import GameStatus from "../components/GameStatus";
import { ProblemCard } from "../components/ProblemCard";
import DailyReward from "../components/DailyReward";
import AudioSettings from "../components/AudioSettings";
import { mockProblems } from "../data/mockProblems";
import { Problem } from "../types/Problem";

const GameScreen: React.FC = () => {
  const theme = useTheme();
  const { gameState } = useGameState();
  const { playMusic, stopMusic } = useAudio();
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isScreenVisible, setIsScreenVisible] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    // Start background music when the game screen mounts
    playMusic("background");
    return () => {
      // Stop music when the component unmounts
      stopMusic();
    };
  }, []);

  useEffect(() => {
    if (gameState.lives <= 0) {
      setIsGameOver(true);
    }
  }, [gameState.lives]);

  const availableProblems = mockProblems.filter(
    (p) => p.level <= gameState.level
  );

  const handleProblemComplete = (problemScore: number) => {
    setScore((prev) => prev + problemScore);
    setIsScreenVisible(false);

    setTimeout(() => {
      setCurrentProblemIndex((prev) => (prev + 1) % availableProblems.length);
      setIsScreenVisible(true);
    }, 500);
  };

  const handleProblemError = () => {
    setIsScreenVisible(false);
    setTimeout(() => {
      setIsScreenVisible(true);
    }, 500);
  };

  if (isGameOver) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: theme.colors.background.default },
        ]}
      >
        <Text
          style={[styles.gameOverText, { color: theme.colors.text.primary }]}
        >
          ¡Juego Terminado!
        </Text>
        <Text
          style={[styles.scoreText, { color: theme.colors.text.secondary }]}
        >
          Puntuación Final: {score}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.default },
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      <GameStatus />
      <DailyReward />
      <AudioSettings />
      <ScreenTransition isVisible={isScreenVisible}>
        <ProblemCard
          problem={availableProblems[currentProblemIndex]}
          onComplete={handleProblemComplete}
          onError={handleProblemError}
        />
      </ScreenTransition>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  gameOverText: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 100,
  },
  scoreText: {
    fontSize: 24,
    textAlign: "center",
    marginTop: 16,
  },
});

export default GameScreen;
