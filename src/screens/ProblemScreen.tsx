import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import { mockProblems } from "../data/mockProblems";

type ProblemScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Problem">;
  route: RouteProp<RootStackParamList, "Problem">;
};

const ProblemScreen: React.FC<ProblemScreenProps> = ({ navigation, route }) => {
  const { problemId } = route.params;
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // For now, we'll use the first mock problem
  const problem = mockProblems[0];

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === problem.correct_answer;
    const score = isCorrect ? 3 : 0; // Simple scoring for now

    setTimeout(() => {
      navigation.navigate("Result", {
        problemId,
        isCorrect,
        score,
      });
    }, 500);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{problem.text_esp}</Text>
      <View style={styles.optionsContainer}>
        {[...problem.wrong_answers, problem.correct_answer].map(
          (answer, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.option,
                selectedAnswer === answer && styles.selectedOption,
              ]}
              onPress={() => handleAnswerSelect(answer)}
              disabled={selectedAnswer !== null}
            >
              <Text style={styles.optionText}>{answer}</Text>
            </TouchableOpacity>
          )
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  question: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
    textAlign: "center",
  },
  optionsContainer: {
    gap: 15,
  },
  option: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#4A90E2",
  },
  selectedOption: {
    backgroundColor: "#4A90E2",
  },
  optionText: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
  },
});

export default ProblemScreen;
