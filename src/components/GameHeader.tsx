import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, typography, shadows } from "../styles/theme";

interface GameHeaderProps {
  xp: number;
  lives: number;
  level: number;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ xp, lives, level }) => {
  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>XP</Text>
          <Text style={styles.statValue}>{xp}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Nivel</Text>
          <Text style={styles.statValue}>{level}</Text>
        </View>
      </View>

      <View style={styles.livesContainer}>
        {[...Array(lives)].map((_, index) => (
          <Text key={index} style={styles.heart}>
            ❤️
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: colors.background.paper,
    ...shadows.small,
    marginBottom: spacing.md,
  },
  statsContainer: {
    flexDirection: "row",
    gap: spacing.md,
  },
  statCard: {
    backgroundColor: colors.primary.light,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    alignItems: "center",
  },
  statLabel: {
    ...typography.caption,
    color: colors.primary.main,
  },
  statValue: {
    ...typography.h2,
    color: colors.primary.dark,
  },
  livesContainer: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  heart: {
    fontSize: 24,
  },
});
