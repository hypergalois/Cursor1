import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GameStateProvider } from "./src/context/GameStateProvider";
import { ThemeProvider } from "./src/theme/ThemeProvider";
import GameScreen from "./src/screens/GameScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <GameStateProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Game"
              component={GameScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </GameStateProvider>
    </ThemeProvider>
  );
}
