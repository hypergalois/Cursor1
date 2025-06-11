import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  colors,
  spacing,
  typography,
  shadows,
  borderRadius,
} from "../styles/theme";
import { GameHeader } from "./GameHeader";
import { BottomNavBar } from "./BottomNavBar";

interface ProblemCardProps {
  problem: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    hint: string;
    level: number;
    points: number;
  };
  onComplete: (points: number) => void;
  onError: () => void;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({
  problem,
  onComplete,
  onError,
}) => {
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
    <View style={styles.container}>
      <GameHeader xp={100} lives={3} level={problem.level} />

      <View style={styles.content}>
        <View style={styles.questionCard}>
          <Text style={styles.question}>{problem.question}</Text>
          <View style={styles.badges}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Nivel {problem.level}</Text>
            </View>
            <View style={[styles.badge, styles.pointsBadge]}>
              <Text style={[styles.badgeText, styles.pointsText]}>
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
                      ? colors.success.light
                      : colors.error.light,
                  borderColor:
                    index === problem.correctAnswer
                      ? colors.success.main
                      : colors.error.main,
                },
              ]}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {showExplanation && (
          <View style={styles.explanationCard}>
            <Text style={styles.explanationTitle}>Explicación:</Text>
            <Text style={styles.explanationText}>{problem.explanation}</Text>
            <Text style={styles.hintTitle}>Pista:</Text>
            <Text style={styles.hintText}>{problem.hint}</Text>
          </View>
        )}
      </View>

      <BottomNavBar currentScreen="home" onNavigate={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  questionCard: {
    backgroundColor: colors.background.paper,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    ...shadows.medium,
  },
  question: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  badges: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  badge: {
    backgroundColor: colors.primary.light,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  pointsBadge: {
    backgroundColor: colors.gold,
  },
  badgeText: {
    ...typography.caption,
    color: colors.primary.main,
  },
  pointsText: {
    color: colors.text.primary,
  },
  optionsContainer: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  option: {
    backgroundColor: colors.background.paper,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.primary.light,
    ...shadows.small,
  },
  optionText: {
    ...typography.body,
    color: colors.text.primary,
    textAlign: "center",
  },
  explanationCard: {
    backgroundColor: colors.background.paper,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
  },
  explanationTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  explanationText: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  hintTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  hintText: {
    ...typography.body,
    color: colors.text.secondary,
  },
});
