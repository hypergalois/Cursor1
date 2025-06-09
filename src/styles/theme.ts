import { StyleSheet } from "react-native";

export const colors = {
  primary: {
    main: "#448AFF",
    light: "#E3F2FD",
    dark: "#1976D2",
  },
  success: {
    main: "#4CAF50",
    light: "#E8F5E9",
    dark: "#2E7D32",
  },
  error: {
    main: "#F44336",
    light: "#FFEBEE",
    dark: "#C62828",
  },
  background: {
    default: "#fffaf0",
    paper: "#FFFFFF",
    secondary: "#f5f5f5",
  },
  text: {
    primary: "#2E3A59",
    secondary: "#6B7280",
    light: "#9CA3AF",
  },
  gold: "#FFB300",
  cream: "#FFF8E1",
  accent: "#FF6B9D",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 50,
};

export const shadows = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: "700" as const,
    lineHeight: 36,
  },
  h2: {
    fontSize: 22,
    fontWeight: "600" as const,
    lineHeight: 28,
  },
  h3: {
    fontSize: 18,
    fontWeight: "600" as const,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  bodyLarge: {
    fontSize: 18,
    lineHeight: 26,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    lineHeight: 16,
  },
};

export const animations = {
  spring: {
    tension: 50,
    friction: 8,
  },
  timing: {
    duration: 300,
  },
};
