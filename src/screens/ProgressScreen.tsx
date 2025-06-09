import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { useUser } from "../context/UserContext";

type ProgressScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Progress">;
};

const ProgressScreen: React.FC<ProgressScreenProps> = () => {
  const { stats } = useUser();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.statsContainer}>
          <Text style={styles.title}>Tu Progreso</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.xp}</Text>
              <Text style={styles.statLabel}>XP Total</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.level}</Text>
              <Text style={styles.statLabel}>Nivel Actual</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.stars}</Text>
              <Text style={styles.statLabel}>Estrellas</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.streak}</Text>
              <Text style={styles.statLabel}>Racha</Text>
            </View>
          </View>
        </View>

        <View style={styles.competencesContainer}>
          <Text style={styles.sectionTitle}>Camino de Progreso</Text>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${stats.xp % 100}%` }]}
            />
          </View>
          <Text style={styles.progressText}>
            {stats.xp % 100}/100 XP al siguiente nivel
          </Text>
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
