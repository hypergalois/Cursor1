import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

type ProgressScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Progress">;
};

const ProgressScreen: React.FC<ProgressScreenProps> = () => {
  // Mock data for now
  const stats = {
    problemsSolved: 15,
    correctAnswers: 12,
    currentLevel: 2,
    totalStars: 36,
  };

  const competences = [
    { name: "Álgebra", progress: 75 },
    { name: "Geometría", progress: 60 },
    { name: "Fracciones", progress: 45 },
    { name: "Porcentajes", progress: 30 },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.statsContainer}>
          <Text style={styles.title}>Tu Progreso</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.problemsSolved}</Text>
              <Text style={styles.statLabel}>Problemas Resueltos</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.correctAnswers}</Text>
              <Text style={styles.statLabel}>Respuestas Correctas</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.currentLevel}</Text>
              <Text style={styles.statLabel}>Nivel Actual</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalStars}</Text>
              <Text style={styles.statLabel}>Estrellas Totales</Text>
            </View>
          </View>
        </View>

        <View style={styles.competencesContainer}>
          <Text style={styles.sectionTitle}>Competencias</Text>
          {competences.map((competence, index) => (
            <View key={index} style={styles.competenceItem}>
              <Text style={styles.competenceName}>{competence.name}</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${competence.progress}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>{competence.progress}%</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  statsContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  statCard: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    width: "47%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A90E2",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },
  competencesContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  competenceItem: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  competenceName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4A90E2",
  },
  progressText: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
    textAlign: "right",
  },
});

export default ProgressScreen;
