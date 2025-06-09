import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GameStateProvider } from "./src/context/GameStateProvider";
import { ThemeProvider } from "./src/theme/ThemeProvider";
import { AudioProvider } from "./src/context/AudioProvider";
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
        <GameStateProvider>
          <AudioProvider>
            <NavigationContainer>
              <Stack.Navigator
                initialRouteName="Onboarding"
                screenOptions={{
                  headerShown: false,
                  animation: "slide_from_right",
                }}
              >
                <Stack.Screen
                  name="Onboarding"
                  component={OnboardingScreen}
                  options={{ animation: "fade" }}
                />
                <Stack.Screen
                  name="Welcome"
                  component={WelcomeScreen}
                  options={{ animation: "fade" }}
                />
                <Stack.Screen name="Dungeon" component={DungeonScreen} />
                <Stack.Screen name="Choice" component={ChoiceScreen} />
                <Stack.Screen name="Problem" component={ProblemScreen} />
                <Stack.Screen name="Result" component={ResultScreen} />
                <Stack.Screen name="Progress" component={ProgressScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </AudioProvider>
        </GameStateProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
