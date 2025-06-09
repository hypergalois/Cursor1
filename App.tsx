import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GameStateProvider } from "./src/context/GameStateProvider";
import { ThemeProvider } from "./src/theme/ThemeProvider";
import { AudioProvider } from "./src/context/AudioProvider";
import { UserProvider } from "./src/context/UserContext";
import { enableScreens } from "react-native-screens";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Importar todas las pantallas
import OnboardingScreen from "./src/screens/OnboardingScreen";
import { WelcomeScreen } from "./src/screens/WelcomeScreen";
import DungeonScreen from "./src/screens/DungeonScreen";
import { ChoiceScreen } from "./src/screens/ChoiceScreen";
import ProblemScreen from "./src/screens/ProblemScreen";
import ProgressScreen from "./src/screens/ProgressScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import ResultScreen from "./src/screens/ResultScreen";

// Enable native screens
enableScreens();

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <UserProvider>
          <GameStateProvider>
            <AudioProvider>
              <NavigationContainer>
                <Stack.Navigator
                  initialRouteName="Onboarding"
                  screenOptions={{
                    headerShown: false,
                    animation: "slide_from_right",
                    animationDuration: 300,
                    gestureEnabled: true,
                    gestureDirection: "horizontal",
                  }}
                >
                  <Stack.Screen
                    name="Onboarding"
                    component={OnboardingScreen}
                    options={{
                      animation: "fade",
                      animationDuration: 500,
                      gestureEnabled: false,
                    }}
                  />
                  <Stack.Screen
                    name="Welcome"
                    component={WelcomeScreen}
                    options={{
                      animation: "fade",
                      animationDuration: 400,
                      gestureEnabled: false,
                    }}
                  />
                  <Stack.Screen
                    name="Dungeon"
                    component={DungeonScreen}
                    options={{
                      animation: "slide_from_bottom",
                      animationDuration: 350,
                      gestureEnabled: true,
                    }}
                  />
                  <Stack.Screen
                    name="Choice"
                    component={ChoiceScreen}
                    options={{
                      animation: "slide_from_right",
                      animationDuration: 300,
                      gestureEnabled: true,
                    }}
                  />
                  <Stack.Screen
                    name="Problem"
                    component={ProblemScreen}
                    options={{
                      animation: "slide_from_right",
                      animationDuration: 250,
                      gestureEnabled: false, // Evitar navegación accidental durante problema
                    }}
                  />
                  <Stack.Screen
                    name="Result"
                    component={ResultScreen}
                    options={{
                      animation: "slide_from_bottom",
                      animationDuration: 400,
                      gestureEnabled: false, // Forzar uso de botones
                    }}
                  />
                  <Stack.Screen
                    name="Progress"
                    component={ProgressScreen}
                    options={{
                      animation: "slide_from_right",
                      animationDuration: 300,
                      gestureEnabled: true,
                    }}
                  />
                  <Stack.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                      animation: "slide_from_right",
                      animationDuration: 300,
                      gestureEnabled: true,
                    }}
                  />
                </Stack.Navigator>
              </NavigationContainer>
            </AudioProvider>
          </GameStateProvider>
        </UserProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
