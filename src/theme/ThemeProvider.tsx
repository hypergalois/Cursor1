import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ThemeColors {
  primary: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
  };
  background: {
    default: string;
    paper: string;
  };
  text: {
    primary: string;
    secondary: string;
  };
  border: string;
  success: {
    main: string;
    light: string;
    dark: string;
  };
  warning: {
    main: string;
    light: string;
    dark: string;
  };
  error: {
    main: string;
    light: string;
    dark: string;
  };
}

interface Theme {
  colors: ThemeColors;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
}

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setPrimaryColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const lightTheme: Theme = {
  colors: {
    primary: {
      main: "#2196F3",
      light: "#64B5F6",
      dark: "#1976D2",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F5F5F5",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#212121",
      secondary: "#757575",
    },
    border: "#E0E0E0",
    success: {
      main: "#4CAF50",
      light: "#81C784",
      dark: "#388E3C",
    },
    warning: {
      main: "#FFC107",
      light: "#FFD54F",
      dark: "#FFA000",
    },
    error: {
      main: "#F44336",
      light: "#E57373",
      dark: "#D32F2F",
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
  },
};

const darkTheme: Theme = {
  colors: {
    primary: {
      main: "#2196F3",
      light: "#64B5F6",
      dark: "#1976D2",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#121212",
      paper: "#1E1E1E",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#B0B0B0",
    },
    border: "#2C2C2C",
    success: {
      main: "#4CAF50",
      light: "#81C784",
      dark: "#388E3C",
    },
    warning: {
      main: "#FFC107",
      light: "#FFD54F",
      dark: "#FFA000",
    },
    error: {
      main: "#F44336",
      light: "#E57373",
      dark: "#D32F2F",
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
  },
};

const generateThemeFromPrimary = (
  primaryColor: string,
  isDark: boolean
): Theme => {
  const baseTheme = isDark ? darkTheme : lightTheme;
  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: {
        main: primaryColor,
        light: `${primaryColor}99`,
        dark: `${primaryColor}CC`,
        contrastText: "#FFFFFF",
      },
    },
  };
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === "dark");
  const [primaryColor, setPrimaryColorState] = useState(
    lightTheme.colors.primary.main
  );
  const [theme, setTheme] = useState<Theme>(
    generateThemeFromPrimary(primaryColor, isDarkMode)
  );

  useEffect(() => {
    const loadThemeSettings = async () => {
      try {
        const savedDarkMode = await AsyncStorage.getItem("darkMode");
        const savedPrimaryColor = await AsyncStorage.getItem("primaryColor");

        if (savedDarkMode !== null) {
          setIsDarkMode(savedDarkMode === "true");
        }
        if (savedPrimaryColor !== null) {
          setPrimaryColorState(savedPrimaryColor);
        }
      } catch (error) {
        console.error("Error loading theme settings:", error);
      }
    };

    loadThemeSettings();
  }, []);

  useEffect(() => {
    setTheme(generateThemeFromPrimary(primaryColor, isDarkMode));
  }, [isDarkMode, primaryColor]);

  const toggleTheme = async () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    try {
      await AsyncStorage.setItem("darkMode", newDarkMode.toString());
    } catch (error) {
      console.error("Error saving dark mode setting:", error);
    }
  };

  const setPrimaryColor = async (color: string) => {
    setPrimaryColorState(color);
    try {
      await AsyncStorage.setItem("primaryColor", color);
    } catch (error) {
      console.error("Error saving primary color:", error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{ theme, isDarkMode, toggleTheme, setPrimaryColor }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context.theme;
};

export type { Theme, ThemeColors };
