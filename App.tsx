import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GameStateProvider } from "./src/context/GameStateProvider";
import { ThemeProvider } from "./src/theme/ThemeProvider";
import { AudioProvider } from "./src/context/AudioProvider";
import GameScreen from "./src/screens/GameScreen";
import { enableScreens } from "react-native-screens";
import { SafeAreaProvider } from "react-native-safe-area-context";

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
                screenOptions={{
                  headerShown: false,
                  animation: "none",
                }}
              >
                <Stack.Screen name="Game" component={GameScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </AudioProvider>
        </GameStateProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
