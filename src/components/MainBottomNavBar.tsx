import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface MainBottomNavBarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export const MainBottomNavBar: React.FC<MainBottomNavBarProps> = ({
  currentScreen,
  onNavigate,
}) => {
  const navItems = [
    { id: "home", label: "Inicio", icon: "🏠", route: "CleanHome" },
    {
      id: "exploration",
      label: "Explorar",
      icon: "🔍",
      route: "ExplorationScreen",
    },
    { id: "map", label: "Mapa", icon: "🗺️", route: "MapScreen" },
    { id: "profile", label: "Perfil", icon: "👤", route: "ProfileScreen" },
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
            onPress={() => onNavigate(item.route)}
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
    backgroundColor: "#FFFFFF",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  navItem: {
    alignItems: "center",
    padding: 8,
    borderRadius: 12,
    flex: 1,
    maxWidth: 80,
  },
  activeNavItem: {
    backgroundColor: "#E3F2FD",
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  activeIconContainer: {
    backgroundColor: "#007AFF",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  icon: {
    fontSize: 18,
  },
  activeIcon: {
    fontSize: 20,
  },
  label: {
    fontSize: 11,
    color: "#8E8E93",
    fontWeight: "500",
    textAlign: "center",
  },
  activeLabel: {
    color: "#007AFF",
    fontWeight: "600",
  },
});

export default MainBottomNavBar;
