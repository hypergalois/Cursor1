export const colors = {
  // Primary colors
  primary: {
    main: "#4A90E2", // Blue
    light: "#6BA5E8",
    dark: "#2C5AA0",
  },
  // Secondary colors
  secondary: {
    main: "#FF6B6B", // Coral
    light: "#FF8E8E",
    dark: "#CC5555",
  },
  // Background colors
  background: {
    primary: "#F5F5F5",
    secondary: "#FFFFFF",
    dark: "#2C3E50",
  },
  // Text colors
  text: {
    primary: "#333333",
    secondary: "#666666",
    light: "#FFFFFF",
  },
  // Status colors
  status: {
    success: "#4CAF50",
    error: "#F44336",
    warning: "#FFC107",
    info: "#2196F3",
  },
  // Game specific colors
  game: {
    door: "#8B4513",
    doorLight: "#A0522D",
    maze: "#34495E",
    path: "#95A5A6",
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  fontFamily: {
    regular: "System",
    bold: "System",
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
};

export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

export const animation = {
  timing: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    easeInOut: "ease-in-out",
    easeOut: "ease-out",
    easeIn: "ease-in",
  },
};

// Export theme object
export const theme = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  animation,
};
