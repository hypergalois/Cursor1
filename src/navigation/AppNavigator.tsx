import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

// Import screens
import HomeScreen from "../screens/HomeScreen";
import ExplorationScreen from "../screens/ExplorationScreen";
import ProblemScreen from "../screens/ProblemScreen";
import ResultScreen from "../screens/ResultScreen";
import ProgressScreen from "../screens/ProgressScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#4A90E2",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Minotauro" }}
        />
        <Stack.Screen
          name="Exploration"
          component={ExplorationScreen}
          options={{ title: "Exploración" }}
        />
        <Stack.Screen
          name="Problem"
          component={ProblemScreen}
          options={{ title: "Desafío" }}
        />
        <Stack.Screen
          name="Result"
          component={ResultScreen}
          options={{ title: "Resultado" }}
        />
        <Stack.Screen
          name="Progress"
          component={ProgressScreen}
          options={{ title: "Progreso" }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: "Perfil" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
