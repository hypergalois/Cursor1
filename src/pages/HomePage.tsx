import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ProblemCard } from "../components/ProblemCard";
import { Problem } from "../types/Problem";
import { mockProblems } from "../data/mockProblems";
import { colors, spacing, typography } from "../styles/theme";

export const HomePage: React.FC = () => {
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [score, setScore] = useState(0);
  const [showList, setShowList] = useState(true);

  const handleProblemSelect = (problem: Problem) => {
    setSelectedProblem(problem);
    setShowList(false);
  };

  const handleProblemComplete = (points: number) => {
    setScore((prevScore) => prevScore + points);
  };

  const handleProblemError = () => {
    // Handle error logic here
  };

  const handleBackToList = () => {
    setSelectedProblem(null);
    setShowList(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Minotauro - Problemas Matemáticos</Text>
        <Text style={styles.score}>Puntuación: {score}</Text>
      </View>

      <View style={styles.content}>
        {showList ? (
          <View style={styles.problemsList}>
            {mockProblems.map((problem) => (
              <TouchableOpacity
                key={problem.id}
                style={styles.problemItem}
                onPress={() => handleProblemSelect(problem)}
              >
                <Text style={styles.problemTitle}>{problem.question}</Text>
                <Text style={styles.problemLevel}>Nivel {problem.level}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : selectedProblem ? (
          <View>
            <TouchableOpacity
              onPress={handleBackToList}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>← Volver a la lista</Text>
            </TouchableOpacity>
            <ProblemCard
              problem={selectedProblem}
              onComplete={handleProblemComplete}
              onError={handleProblemError}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  header: {
    backgroundColor: colors.background.paper,
    padding: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
  },
  score: {
    ...typography.body,
    color: colors.success.main,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  problemsList: {
    gap: spacing.md,
  },
  problemItem: {
    backgroundColor: colors.background.paper,
    padding: spacing.lg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary.light,
  },
  problemTitle: {
    ...typography.body,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  problemLevel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  backButton: {
    backgroundColor: colors.background.paper,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary.light,
  },
  backButtonText: {
    ...typography.body,
    color: colors.text.primary,
  },
});
