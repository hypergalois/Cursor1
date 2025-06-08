import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";

type ResultScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Result">;
  route: RouteProp<RootStackParamList, "Result">;
};

const ResultScreen: React.FC<ResultScreenProps> = ({ navigation, route }) => {
  const { isCorrect, score } = route.params;

  const getMinoImage = () => {
    return isCorrect
      ? require("../assets/happy.png")
      : require("../assets/angry.png");
  };

  const getFeedbackMessage = () => {
    return isCorrect
      ? "¡Excelente trabajo! ¡Has resuelto el problema correctamente!"
      : "¡No te preocupes! Sigue practicando y mejorarás.";
  };

  return (
    <View style={styles.container}>
      <Image source={getMinoImage()} style={styles.minoImage} />
      <Text style={styles.resultText}>
        {isCorrect ? "¡Correcto!" : "Incorrecto"}
      </Text>
      <Text style={styles.feedbackText}>{getFeedbackMessage()}</Text>
      <Text style={styles.scoreText}>Puntuación: {score} estrellas</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Exploration")}
        >
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate("Progress")}
        >
          <Text style={styles.buttonText}>Ver Progreso</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  minoImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  resultText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  feedbackText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 24,
    color: "#4A90E2",
    marginBottom: 30,
  },
  buttonContainer: {
    width: "100%",
    gap: 15,
  },
  button: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 10,
    width: "100%",
  },
  secondaryButton: {
    backgroundColor: "#666",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ResultScreen;
