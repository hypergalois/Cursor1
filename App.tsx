import React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GameStateProvider } from "./src/context/GameStateProvider";
import { GameProvider } from "./src/contexts/GameContext";
import { ThemeProvider } from "./src/theme/ThemeProvider";
import { AudioProvider } from "./src/context/AudioProvider";
import { UserProvider } from "./src/context/UserContext";
import { enableScreens } from "react-native-screens";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Importar pantallas principales
import CleanHomeScreen from "./src/screens/CleanHomeScreen";
import FocusedProblemScreen from "./src/screens/FocusedProblemScreen";
import InstantFeedbackScreen from "./src/screens/InstantFeedbackScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import ExplorationScreen from "./src/screens/ExplorationScreen";
import MapScreen from "./src/screens/MapScreen";

// Importar pantallas de onboarding
import WelcomeScreen from "./src/screens/onboarding/WelcomeScreen";
import RegisterScreen from "./src/screens/onboarding/RegisterScreen";
import SignInScreen from "./src/screens/onboarding/SignInScreen";
import LearningGoalsScreen from "./src/screens/onboarding/LearningGoalsScreen";
import MathInterestsScreen from "./src/screens/onboarding/MathInterestsScreen";
import AccessibilityScreen from "./src/screens/onboarding/AccessibilityScreen";
import InterestsScreen from "./src/screens/onboarding/InterestsScreen";
import ProfilePictureScreen from "./src/screens/onboarding/ProfilePictureScreen";

// Hook para onboarding
import { useOnboarding } from "./src/hooks/useOnboarding";

// Enable native screens
enableScreens();

// Tipos de navegación
export type RootStackParamList = {
  // Onboarding screens
  WelcomeScreen: undefined;
  RegisterScreen: undefined;
  SignInScreen: undefined;
  LearningGoalsScreen: undefined;
  MathInterestsScreen: undefined;
  AccessibilityScreen: undefined;
  InterestsScreen: undefined;
  ProfilePictureScreen: undefined;

  // Main app screens
  CleanHome:
    | {
        userName?: string;
        ageGroup?: "kids" | "teens" | "adults" | "seniors";
        largeText?: boolean;
      }
    | undefined;
  FocusedProblem: undefined;
  InstantFeedback: undefined;
  ProfileScreen: undefined;
  ExplorationScreen: undefined;
  MapScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const { isLoading, shouldShowOnboarding, initialRoute } = useOnboarding();

  // Mostrar splash/loading mientras se determina el estado
  if (isLoading) {
    return (
      <SafeAreaProvider>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#F4EFF3",
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#F82E08" }}>
            Minotauro
          </Text>
          <Text style={{ fontSize: 16, color: "#889797", marginTop: 8 }}>
            Cargando...
          </Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <UserProvider>
          <GameStateProvider>
            <GameProvider>
              <AudioProvider>
                <NavigationContainer>
                  <Stack.Navigator
                    initialRouteName={initialRoute as any}
                    screenOptions={{
                      headerShown: false,
                      animation: "slide_from_right",
                      animationDuration: 300,
                      gestureEnabled: true,
                      gestureDirection: "horizontal",
                    }}
                  >
                    {/* Onboarding Screens */}
                    <Stack.Screen
                      name="WelcomeScreen"
                      component={WelcomeScreen}
                      options={{
                        animation: "fade",
                        animationDuration: 500,
                        gestureEnabled: false,
                      }}
                    />
                    <Stack.Screen
                      name="RegisterScreen"
                      component={RegisterScreen}
                    />
                    <Stack.Screen
                      name="SignInScreen"
                      component={SignInScreen}
                    />
                    <Stack.Screen
                      name="LearningGoalsScreen"
                      component={LearningGoalsScreen}
                    />
                    <Stack.Screen
                      name="MathInterestsScreen"
                      component={MathInterestsScreen}
                    />
                    <Stack.Screen
                      name="AccessibilityScreen"
                      component={AccessibilityScreen}
                    />
                    <Stack.Screen
                      name="InterestsScreen"
                      component={InterestsScreen}
                    />
                    <Stack.Screen
                      name="ProfilePictureScreen"
                      component={ProfilePictureScreen}
                    />

                    {/* Main App Screens */}
                    <Stack.Screen
                      name="CleanHome"
                      component={CleanHomeScreen}
                      options={{
                        animation: "fade",
                        animationDuration: 400,
                        gestureEnabled: false,
                      }}
                    />
                    <Stack.Screen
                      name="FocusedProblem"
                      component={FocusedProblemScreen}
                      options={{
                        animation: "slide_from_right",
                        animationDuration: 250,
                        gestureEnabled: false, // Evitar navegación accidental durante problema
                      }}
                    />
                    <Stack.Screen
                      name="InstantFeedback"
                      component={InstantFeedbackScreen}
                      options={{
                        animation: "slide_from_bottom",
                        animationDuration: 400,
                        gestureEnabled: false, // Forzar uso de botones
                      }}
                    />
                    <Stack.Screen
                      name="ProfileScreen"
                      component={ProfileScreen}
                      options={{
                        animation: "slide_from_right",
                        animationDuration: 300,
                        gestureEnabled: true,
                      }}
                    />
                    <Stack.Screen
                      name="ExplorationScreen"
                      component={ExplorationScreen}
                      options={{
                        animation: "slide_from_right",
                        animationDuration: 300,
                        gestureEnabled: true,
                      }}
                    />
                    <Stack.Screen
                      name="MapScreen"
                      component={MapScreen}
                      options={{
                        animation: "slide_from_right",
                        animationDuration: 300,
                        gestureEnabled: true,
                      }}
                    />
                  </Stack.Navigator>
                </NavigationContainer>
              </AudioProvider>
            </GameProvider>
          </GameStateProvider>
        </UserProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
