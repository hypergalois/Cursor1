import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Problem } from "../types/Problem";
import { useTheme } from "../theme/ThemeProvider";

interface ProblemCardProps {
  problem: Problem;
  onComplete: (score: number) => void;
  onError: () => void;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({
  problem,
  onComplete,
  onError,
}) => {
  const theme = useTheme();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleAnswer = (index: number) => {
    if (isAnswered) return;

    setSelectedAnswer(index);
    setIsAnswered(true);
    const isCorrect = index === problem.correctAnswer;

    if (isCorrect) {
      onComplete(problem.points);
    } else {
      onError();
    }

    setShowExplanation(true);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.paper },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.question, { color: theme.colors.text.primary }]}>
          {problem.question}
        </Text>
        <View style={styles.badges}>
          <View
            style={[
              styles.badge,
              { backgroundColor: theme.colors.primary.light },
            ]}
          >
            <Text
              style={[styles.badgeText, { color: theme.colors.primary.main }]}
            >
              Nivel {problem.level}
            </Text>
          </View>
          <View
            style={[
              styles.badge,
              { backgroundColor: theme.colors.success.light },
            ]}
          >
            <Text
              style={[styles.badgeText, { color: theme.colors.success.main }]}
            >
              {problem.points} puntos
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.optionsContainer}>
        {problem.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleAnswer(index)}
            disabled={isAnswered}
            style={[
              styles.option,
              selectedAnswer === index && {
                backgroundColor:
                  index === problem.correctAnswer
                    ? theme.colors.success.light
                    : theme.colors.error.light,
                borderColor:
                  index === problem.correctAnswer
                    ? theme.colors.success.main
                    : theme.colors.error.main,
              },
            ]}
          >
            <Text
              style={[styles.optionText, { color: theme.colors.text.primary }]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {showExplanation && (
        <View
          style={[
            styles.explanation,
            { backgroundColor: theme.colors.background.default },
          ]}
        >
          <Text
            style={[
              styles.explanationTitle,
              { color: theme.colors.text.primary },
            ]}
          >
            Explicación:
          </Text>
          <Text
            style={[
              styles.explanationText,
              { color: theme.colors.text.secondary },
            ]}
          >
            {problem.explanation}
          </Text>
          <Text
            style={[styles.hintTitle, { color: theme.colors.text.primary }]}
          >
            Pista:
          </Text>
          <Text
            style={[styles.hintText, { color: theme.colors.text.secondary }]}
          >
            {problem.hint}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 16,
  },
  question: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  badges: {
    flexDirection: "row",
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  optionsContainer: {
    gap: 8,
    marginBottom: 16,
  },
  option: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  optionText: {
    fontSize: 16,
  },
  explanation: {
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    marginBottom: 16,
  },
  hintTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  hintText: {
    fontSize: 14,
  },
});
