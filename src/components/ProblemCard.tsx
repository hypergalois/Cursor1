import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import { useGameState } from "../context/GameStateProvider";
import FeedbackModal from "./FeedbackModal";
import CelebrationEffect from "./CelebrationEffect";
import { useAudio } from "../context/AudioProvider";

interface ProblemCardProps {
  problem: {
    id: string;
    question: string;
    answer: string;
    hint?: string;
  };
  onComplete: (score: number) => void;
  onError: () => void;
}

const ProblemCard: React.FC<ProblemCardProps> = ({
  problem,
  onComplete,
  onError,
}) => {
  const theme = useTheme();
  const { gameState, loseLife, useHint, addExperience } = useGameState();
  const { playSound } = useAudio();
  const [answer, setAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Animation values
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const inputScaleAnim = useRef(new Animated.Value(1)).current;

  const handleSubmit = () => {
    const isAnswerCorrect = parseInt(answer) === problem.answer;
    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);

    if (isAnswerCorrect) {
      playSound("correct");
      animateSuccess();
      setShowCelebration(true);
      const score = calculateScore();
      addExperience(score);
      onComplete(score);
    } else {
      playSound("incorrect");
      animateError();
      loseLife();
    }
  };

  const animateError = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateSuccess = () => {
    Animated.sequence([
      Animated.timing(inputScaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(inputScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleHint = () => {
    if (useHint()) {
      setShowHint(true);
    }
  };

  const handleContinue = () => {
    setShowFeedback(false);
    setAnswer("");
    setShowHint(false);
    setShowCelebration(false);
  };

  const calculateScore = () => {
    const baseScore = 10 * gameState.level;
    const livesBonus = gameState.lives * 5;
    return baseScore + livesBonus;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View
        style={[
          styles.card,
          { backgroundColor: theme.colors.background.paper },
        ]}
      >
        <Text style={[styles.question, { color: theme.colors.text.primary }]}>
          {problem.question}
        </Text>

        {showHint && problem.hint && (
          <View style={styles.hintContainer}>
            <Text
              style={[styles.hintLabel, { color: theme.colors.text.secondary }]}
            >
              💡 Pista:
            </Text>
            <Text
              style={[styles.hintText, { color: theme.colors.text.secondary }]}
            >
              {problem.hint}
            </Text>
          </View>
        )}

        <Animated.View
          style={[
            styles.inputContainer,
            {
              transform: [{ translateX: shakeAnim }, { scale: inputScaleAnim }],
            },
          ]}
        >
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.background.default,
                color: theme.colors.text.primary,
                borderColor: theme.colors.border,
              },
            ]}
            value={answer}
            onChangeText={setAnswer}
            keyboardType="numeric"
            placeholder="Tu respuesta"
            placeholderTextColor={theme.colors.text.secondary}
          />
        </Animated.View>

        <View style={styles.buttonContainer}>
          {!showHint && problem.hint && (
            <TouchableOpacity
              style={[styles.button, styles.hintButton]}
              onPress={handleHint}
              disabled={gameState.hints <= 0}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: theme.colors.primary.main },
                ]}
              >
                💡 Usar Pista ({gameState.hints})
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.button,
              styles.submitButton,
              { backgroundColor: theme.colors.primary.main },
            ]}
            onPress={handleSubmit}
            disabled={!answer.trim()}
          >
            <Text style={styles.buttonText}>Comprobar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FeedbackModal
        visible={showFeedback}
        isCorrect={isCorrect}
        score={isCorrect ? calculateScore() : 0}
        onClose={() => setShowFeedback(false)}
        onContinue={handleContinue}
      />

      {showCelebration && (
        <CelebrationEffect
          isActive={showCelebration}
          onComplete={() => setShowCelebration(false)}
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  question: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  hintContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  hintLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  hintText: {
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  hintButton: {
    backgroundColor: "transparent",
  },
  submitButton: {
    minWidth: 120,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProblemCard;
