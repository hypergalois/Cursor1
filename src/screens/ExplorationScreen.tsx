import React from "react";
import { View, Text, StyleSheet, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MainBottomNavBar from "../components/MainBottomNavBar";

interface ExplorationScreenProps {
  navigation: any;
}

const ExplorationScreen: React.FC<ExplorationScreenProps> = ({
  navigation,
}) => {
  // Manejar navegación de la barra inferior
  const handleBottomNavigation = (route: string) => {
    navigation.navigate(route);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🔍 Exploración</Text>
          <Text style={styles.subtitle}>
            Descubre nuevos mundos matemáticos
          </Text>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.comingSoonContainer}>
            <Text style={styles.comingSoonIcon}>🚀</Text>
            <Text style={styles.comingSoonTitle}>¡Próximamente!</Text>
            <Text style={styles.comingSoonText}>
              Aquí podrás explorar diferentes mundos matemáticos, descubrir
              nuevos tipos de problemas y desbloquear aventuras únicas.
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🌟</Text>
            <Text style={styles.featureTitle}>Mundos Temáticos</Text>
            <Text style={styles.featureDescription}>
              Explora diferentes universos matemáticos
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🎯</Text>
            <Text style={styles.featureTitle}>Desafíos Especiales</Text>
            <Text style={styles.featureDescription}>
              Retos únicos y problemas creativos
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🏆</Text>
            <Text style={styles.featureTitle}>Tesoros Ocultos</Text>
            <Text style={styles.featureDescription}>
              Encuentra recompensas especiales
            </Text>
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <MainBottomNavBar
          currentScreen="exploration"
          onNavigate={handleBottomNavigation}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1D1D1F",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  comingSoonContainer: {
    backgroundColor: "#FFFFFF",
    padding: 32,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  comingSoonIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  comingSoonTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#007AFF",
    marginBottom: 12,
  },
  comingSoonText: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 24,
  },
  featureCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: "#8E8E93",
    lineHeight: 20,
  },
});

export default ExplorationScreen;
