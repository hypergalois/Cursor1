import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, typography } from "../styles/theme";

export const ThemeSettings: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración de Tema</Text>
      <Text style={styles.subtitle}>Próximamente...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.default,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
  },
});

export default ThemeSettings;
