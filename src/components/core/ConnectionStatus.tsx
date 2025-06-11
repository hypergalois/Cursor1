import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, typography } from "../styles/theme";

export const ConnectionStatus: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estado de Conexión</Text>
      <Text style={styles.subtitle}>Conectado ✅</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.success.light,
    borderRadius: 8,
  },
  title: {
    ...typography.caption,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.success.main,
  },
});

export default ConnectionStatus;
