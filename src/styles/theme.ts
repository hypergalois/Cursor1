import { StyleSheet } from "react-native";

// 🎨 COLORES TIPO DUOLINGO - SUAVES Y ACCESIBLES
export const colors = {
  // Paleta principal - inspirada en Duolingo
  primary: {
    main: "#58A6FF", // Azul cielo suave
    light: "#B3D4FF", // Azul muy claro
    dark: "#0F172A", // Azul oscuro legible
    background: "#F0F8FF", // Fondo azul muy suave
  },

  // Verde motivacional - para éxitos
  success: {
    main: "#22C55E", // Verde menta suave
    light: "#DCFCE7", // Verde muy claro
    dark: "#166534", // Verde oscuro
    background: "#F0FDF4", // Fondo verde muy suave
  },

  // Naranja cálido - para errores amigables
  warning: {
    main: "#F59E0B", // Naranja cálido
    light: "#FEF3C7", // Naranja muy claro
    dark: "#D97706", // Naranja oscuro
    background: "#FFFBEB", // Fondo naranja muy suave
  },

  // Rojo suave - para errores sin asustar
  error: {
    main: "#EF4444", // Rojo coral suave
    light: "#FEE2E2", // Rojo muy claro
    dark: "#DC2626", // Rojo oscuro
    background: "#FEF2F2", // Fondo rojo muy suave
  },

  // Fondos principales
  background: {
    default: "#FFFBF5", // Crema muy suave (color base Duolingo)
    paper: "#FFFFFF", // Blanco puro para tarjetas
    secondary: "#F8FAFC", // Gris muy claro
    elevated: "#FFFFFF", // Blanco para elementos elevados
  },

  // Textos optimizados para legibilidad
  text: {
    primary: "#1E293B", // Azul oscuro - máximo contraste
    secondary: "#475569", // Gris medio - buen contraste
    tertiary: "#64748B", // Gris claro - contraste mínimo
    light: "#94A3B8", // Gris muy claro
    white: "#FFFFFF", // Blanco puro
    accent: "#7C3AED", // Púrpura para destacar
  },

  // Colores especiales Duolingo-style
  duolingo: {
    green: "#58CC02", // Verde Duolingo icónico
    blue: "#1CB0F6", // Azul Duolingo
    gold: "#FFC800", // Oro para logros
    purple: "#CE82FF", // Púrpura suave
    pink: "#FF9BDA", // Rosa suave
    orange: "#FF9600", // Naranja cálido
  },

  // Colores adicionales para compatibilidad con componentes existentes
  accent: "#7C3AED", // Púrpura para destacar
  gold: "#FFC800", // Oro para logros y celebraciones
  info: {
    main: "#1CB0F6", // Azul informativo
    light: "#BAE6FD", // Azul claro
    dark: "#0284C7", // Azul oscuro
  },

  // Gradientes suaves
  gradients: {
    primary: ["#58A6FF", "#1CB0F6"],
    success: ["#22C55E", "#58CC02"],
    warm: ["#FFC800", "#FF9600"],
    cool: ["#CE82FF", "#58A6FF"],
  },

  // Modo alto contraste (accesibilidad)
  highContrast: {
    background: "#FFFFFF",
    text: "#000000",
    primary: "#0066CC",
    success: "#008000",
    error: "#CC0000",
    warning: "#FF6600",
  },

  // Colores para diferentes edades
  ageGroups: {
    kids: {
      primary: "#FF9BDA", // Rosa alegre
      secondary: "#58CC02", // Verde brillante
      background: "#FFF0F8", // Rosa muy suave
    },
    teens: {
      primary: "#7C3AED", // Púrpura moderno
      secondary: "#1CB0F6", // Azul vibrante
      background: "#F8FAFF", // Azul muy suave
    },
    adults: {
      primary: "#58A6FF", // Azul profesional
      secondary: "#22C55E", // Verde equilibrado
      background: "#FFFBF5", // Crema suave
    },
    seniors: {
      primary: "#0066CC", // Azul de alto contraste
      secondary: "#008000", // Verde de alto contraste
      background: "#FFFFFF", // Blanco puro
    },
  },
};

// 📏 ESPACIADO ESCALABLE
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,

  // Espaciado específico para accesibilidad
  touch: {
    min: 44, // Mínimo recomendado por Apple/Google
    comfortable: 56, // Cómodo para todas las edades
    large: 64, // Grande para personas mayores
  },
};

// 🔄 BORDES REDONDEADOS SUAVES
export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 50,

  // Bordes específicos por tipo de elemento
  button: 12,
  card: 16,
  modal: 20,
  avatar: 50,
};

// 🌟 SOMBRAS SUAVES Y NATURALES
export const shadows = {
  none: {
    shadowOpacity: 0,
    elevation: 0,
  },

  soft: {
    shadowColor: "#1E293B",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  small: {
    shadowColor: "#1E293B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  medium: {
    shadowColor: "#1E293B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },

  large: {
    shadowColor: "#1E293B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },

  floating: {
    shadowColor: "#1E293B",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
};

// 📝 TIPOGRAFÍA ESCALABLE Y ACCESIBLE
export const typography = {
  // Títulos principales
  h1: {
    fontSize: 32,
    fontWeight: "700" as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  },

  h2: {
    fontSize: 24,
    fontWeight: "600" as const,
    lineHeight: 32,
    letterSpacing: -0.25,
  },

  h3: {
    fontSize: 20,
    fontWeight: "600" as const,
    lineHeight: 28,
  },

  h4: {
    fontSize: 18,
    fontWeight: "600" as const,
    lineHeight: 24,
  },

  // Cuerpos de texto
  bodyLarge: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "400" as const,
  },

  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },

  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },

  // Textos especializados
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400" as const,
  },

  overline: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "600" as const,
    letterSpacing: 1,
    textTransform: "uppercase" as const,
  },

  // Botones
  button: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600" as const,
    letterSpacing: 0.25,
  },

  buttonLarge: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "600" as const,
    letterSpacing: 0.25,
  },

  // Tipografía por edad
  ageGroups: {
    kids: {
      h1: { fontSize: 28, fontWeight: "700" as const, lineHeight: 36 },
      body: { fontSize: 18, lineHeight: 28, fontWeight: "400" as const },
      button: { fontSize: 18, lineHeight: 28, fontWeight: "600" as const },
    },
    teens: {
      h1: { fontSize: 30, fontWeight: "700" as const, lineHeight: 38 },
      body: { fontSize: 16, lineHeight: 24, fontWeight: "400" as const },
      button: { fontSize: 16, lineHeight: 24, fontWeight: "600" as const },
    },
    adults: {
      h1: { fontSize: 32, fontWeight: "700" as const, lineHeight: 40 },
      body: { fontSize: 16, lineHeight: 24, fontWeight: "400" as const },
      button: { fontSize: 16, lineHeight: 24, fontWeight: "600" as const },
    },
    seniors: {
      h1: { fontSize: 36, fontWeight: "700" as const, lineHeight: 44 },
      body: { fontSize: 20, lineHeight: 32, fontWeight: "400" as const },
      button: { fontSize: 20, lineHeight: 32, fontWeight: "700" as const },
    },
  },
};

// 🎬 ANIMACIONES SUAVES Y NATURALES
export const animations = {
  // Timings base
  fast: 200,
  normal: 300,
  slow: 500,

  // Easing curves naturales
  easing: {
    standard: [0.4, 0.0, 0.2, 1],
    decelerate: [0.0, 0.0, 0.2, 1],
    accelerate: [0.4, 0.0, 1, 1],
    sharp: [0.4, 0.0, 0.6, 1],
  },

  // Springs suaves
  spring: {
    gentle: { tension: 120, friction: 14 },
    normal: { tension: 140, friction: 10 },
    bouncy: { tension: 200, friction: 8 },
  },

  // Configuraciones por tipo
  button: {
    duration: 150,
    scale: { from: 1, to: 0.98 },
  },

  modal: {
    duration: 300,
    damping: 0.8,
  },

  page: {
    duration: 250,
    easing: [0.4, 0.0, 0.2, 1],
  },
};

// 🎯 UTILIDADES PARA ACCESIBILIDAD
export const accessibility = {
  // Ratios de contraste mínimos
  contrastRatios: {
    normal: 4.5, // WCAG AA
    large: 3, // WCAG AA para texto grande
    enhanced: 7, // WCAG AAA
  },

  // Tamaños mínimos de toque
  touchTargets: {
    minimum: 44, // iOS/Android mínimo
    recommended: 48, // Recomendado
    comfortable: 56, // Cómodo para todos
  },

  // Configuraciones por discapacidad
  visualImpairment: {
    highContrast: true,
    largeText: true,
    boldText: true,
  },

  motorImpairment: {
    largeTargets: true,
    reduceMotion: false,
    extraSpacing: true,
  },
};

// 🎨 TEMA DINÁMICO POR EDAD
export const getThemeForAge = (
  ageGroup: "kids" | "teens" | "adults" | "seniors"
) => {
  const ageColors = colors.ageGroups[ageGroup];

  return {
    colors: {
      ...colors,
      primary: {
        main: ageColors.primary,
        light: ageColors.primary + "30",
        dark: ageColors.secondary,
        background: ageColors.background,
      },
    },
    typography: {
      ...typography,
      ...typography.ageGroups[ageGroup],
    },
    spacing:
      ageGroup === "seniors"
        ? { ...spacing, touch: { ...spacing.touch, min: 56, comfortable: 64 } }
        : spacing,
  };
};

// 🌙 TEMA OSCURO (para futuro)
export const darkTheme = {
  background: {
    default: "#0F172A",
    paper: "#1E293B",
    secondary: "#334155",
  },
  text: {
    primary: "#F8FAFC",
    secondary: "#CBD5E1",
    tertiary: "#94A3B8",
  },
};

export default {
  colors,
  spacing,
  borderRadius,
  shadows,
  typography,
  animations,
  accessibility,
  getThemeForAge,
  darkTheme,
};
