import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  colors,
  shadows,
  spacing,
  typography,
  borderRadius,
} from "../styles/theme";

interface BottomNavBarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentScreen,
  onNavigate,
}) => {
  const navItems = [
    { id: "home", label: "Inicio", icon: "🏠" },
    { id: "progress", label: "Progreso", icon: "📊" },
    { id: "profile", label: "Perfil", icon: "👤" },
  ];

  return (
    <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
      <View style={styles.container}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.navItem,
              currentScreen === item.id && styles.activeNavItem,
            ]}
            onPress={() => onNavigate(item.id)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconContainer,
                currentScreen === item.id && styles.activeIconContainer,
              ]}
            >
              <Text
                style={[
                  styles.icon,
                  currentScreen === item.id && styles.activeIcon,
                ]}
              >
                {item.icon}
              </Text>
            </View>
            <Text
              style={[
                styles.label,
                currentScreen === item.id && styles.activeLabel,
              ]}
              numberOfLines={1}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background.paper,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: colors.background.paper,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.primary.light + "40",
    ...shadows.medium,
  },
  navItem: {
    alignItems: "center",
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    minWidth: 80,
  },
  activeNavItem: {
    backgroundColor: colors.primary.light + "30",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  activeIconContainer: {
    backgroundColor: colors.primary.main,
    ...shadows.small,
  },
  icon: {
    fontSize: 20,
  },
  activeIcon: {
    fontSize: 22,
  },
  label: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: "500",
  },
  activeLabel: {
    color: colors.primary.main,
    fontWeight: "600",
  },
});
