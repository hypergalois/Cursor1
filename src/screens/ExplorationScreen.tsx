import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

type ExplorationScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Exploration">;
};

const ExplorationScreen: React.FC<ExplorationScreenProps> = ({
  navigation,
}) => {
  const handleDoorPress = (door: "left" | "right") => {
    // For now, we'll use a mock problem ID
    navigation.navigate("Problem", { problemId: "mock-1" });
  };

  return (
    <ImageBackground
      source={require("../assets/dungeon-bg.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Elige tu camino</Text>
        <View style={styles.doorsContainer}>
          <TouchableOpacity
            style={styles.door}
            onPress={() => handleDoorPress("left")}
          >
            <Text style={styles.doorText}>Puerta Izquierda</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.door}
            onPress={() => handleDoorPress("right")}
          >
            <Text style={styles.doorText}>Puerta Derecha</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 40,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  doorsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  door: {
    backgroundColor: "rgba(74, 144, 226, 0.8)",
    padding: 20,
    borderRadius: 10,
    width: "45%",
    alignItems: "center",
  },
  doorText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ExplorationScreen;
