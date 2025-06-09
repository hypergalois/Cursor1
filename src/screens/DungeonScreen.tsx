import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  colors,
  spacing,
  typography,
  shadows,
  borderRadius,
} from "../styles/theme";
import { GameHeader } from "../components/GameHeader";
import { BottomNavBar } from "../components/BottomNavBar";
import DungeonMap from "../components/DungeonMap";
import SceneAssets from "../components/SceneAssets";
import MinoMascot from "../components/MinoMascot";

interface DungeonScreenProps {
  navigation: any;
}

export const DungeonScreen: React.FC<DungeonScreenProps> = ({ navigation }) => {
  const [currentView, setCurrentView] = useState<"overview" | "map">(
    "overview"
  );
  const [userProgress] = useState({
    currentLevel: 3,
    completedLevels: [1, 2],
    unlockedScenes: ["entrance", "golden_room", "mystery_tunnel"],
    totalStars: 42,
    totalProblems: 18,
  });

  const handleNavigate = (screen: string) => {
    switch (screen) {
      case "home":
        navigation.navigate("Welcome");
        break;
      case "progress":
        navigation.navigate("Progress");
        break;
      case "profile":
        navigation.navigate("Profile");
        break;
    }
  };

  const handleStartExploration = () => {
    navigation.navigate("Choice", {
      currentLevel: userProgress.currentLevel,
      currentScene: "entrance",
    });
  };

  const handleLevelSelect = (levelId: number) => {
    // Navegar a la escena específica del nivel
    const sceneMap = {
      1: "entrance",
      2: "golden_room",
      3: "mystery_tunnel",
      4: "tower",
      5: "treasure_cave",
      6: "fire_chamber",
      7: "ice_chamber",
      8: "boss_room",
    };

    const scene = sceneMap[levelId as keyof typeof sceneMap] || "entrance";

    navigation.navigate("Choice", {
      currentLevel: levelId,
      currentScene: scene,
    });
  };

  const handleQuickProblem = () => {
    navigation.navigate("Problem", {
      problemType: "suma",
      difficulty: "easy",
      currentLevel: userProgress.currentLevel,
    });
  };

  const renderOverviewTab = () => (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      bounces={true}
    >
      <View style={styles.content}>
        {/* Introducción con mascota */}
        <View style={styles.introSection}>
          <MinoMascot mood="happy" size={120} />
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>
              ¡Bienvenido a la Mazmorra Matemática! Aquí puedes explorar
              diferentes áreas y enfrentar desafíos únicos. ¿Estás listo para la
              aventura?
            </Text>
          </View>
        </View>

        {/* Sección de exploración rápida */}
        <View style={styles.explorationSection}>
          <Text style={styles.sectionTitle}>🗺️ Comienza tu Aventura</Text>

          <TouchableOpacity
            style={styles.primaryActionCard}
            onPress={handleStartExploration}
            activeOpacity={0.8}
          >
            <SceneAssets sceneType="entrance" size="medium" />
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Explorar Mazmorra</Text>
              <Text style={styles.actionDescription}>
                Continúa tu aventura donde la dejaste y elige tu próximo camino
              </Text>
              <View style={styles.levelIndicator}>
                <Text style={styles.levelText}>
                  Nivel actual: {userProgress.currentLevel}
                </Text>
              </View>
            </View>
            <Text style={styles.actionArrow}>🚀</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryActionCard}
            onPress={handleQuickProblem}
            activeOpacity={0.8}
          >
            <Text style={styles.quickIcon}>⚡</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Problema Rápido</Text>
              <Text style={styles.actionDescription}>
                Resuelve un problema matemático sin exploración
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Escenas disponibles */}
        <View style={styles.scenesSection}>
          <Text style={styles.sectionTitle}>🏰 Áreas Desbloqueadas</Text>
          <View style={styles.scenesGrid}>
            {userProgress.unlockedScenes.map((scene, index) => (
              <TouchableOpacity
                key={scene}
                style={styles.sceneCard}
                onPress={() =>
                  navigation.navigate("Choice", { currentScene: scene })
                }
                activeOpacity={0.8}
              >
                <SceneAssets sceneType={scene} size="small" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Estadísticas rápidas */}
        <View style={styles.quickStatsSection}>
          <Text style={styles.sectionTitle}>📊 Tu Progreso</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>⭐</Text>
              <Text style={styles.statValue}>{userProgress.totalStars}</Text>
              <Text style={styles.statLabel}>Estrellas</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🧮</Text>
              <Text style={styles.statValue}>{userProgress.totalProblems}</Text>
              <Text style={styles.statLabel}>Problemas</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🏆</Text>
              <Text style={styles.statValue}>{userProgress.currentLevel}</Text>
              <Text style={styles.statLabel}>Nivel</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderMapTab = () => (
    <DungeonMap
      currentLevel={userProgress.currentLevel}
      completedLevels={userProgress.completedLevels}
      onLevelSelect={handleLevelSelect}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.background.default}
      />

      <GameHeader xp={150} lives={3} level={userProgress.currentLevel} />

      {/* Tabs para cambiar vista */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, currentView === "overview" && styles.activeTab]}
          onPress={() => setCurrentView("overview")}
        >
          <Text
            style={[
              styles.tabText,
              currentView === "overview" && styles.activeTabText,
            ]}
          >
            🏰 Exploración
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, currentView === "map" && styles.activeTab]}
          onPress={() => setCurrentView("map")}
        >
          <Text
            style={[
              styles.tabText,
              currentView === "map" && styles.activeTabText,
            ]}
          >
            🗺️ Mapa
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contenido dinámico */}
      {currentView === "overview" ? renderOverviewTab() : renderMapTab()}

      <BottomNavBar currentScreen="home" onNavigate={handleNavigate} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: colors.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary.light,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: colors.primary.main,
    backgroundColor: colors.primary.light + "20",
  },
  tabText: {
    ...typography.body,
    color: colors.text.secondary,
    fontWeight: "500",
  },
  activeTabText: {
    color: colors.primary.main,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  introSection: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  speechBubble: {
    backgroundColor: colors.background.paper,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginTop: spacing.lg,
    maxWidth: "90%",
    ...shadows.medium,
  },
  speechText: {
    ...typography.body,
    color: colors.text.primary,
    textAlign: "center",
    lineHeight: 22,
  },
  explorationSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  primaryActionCard: {
    backgroundColor: colors.background.paper,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
    ...shadows.large,
    borderWidth: 2,
    borderColor: colors.primary.main,
  },
  secondaryActionCard: {
    backgroundColor: colors.background.paper,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    flexDirection: "row",
    alignItems: "center",
    ...shadows.medium,
    borderWidth: 1,
    borderColor: colors.primary.light,
  },
  quickIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  actionContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  actionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  actionDescription: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  levelIndicator: {
    marginTop: spacing.sm,
  },
  levelText: {
    ...typography.caption,
    color: colors.primary.main,
    fontWeight: "600",
  },
  actionArrow: {
    fontSize: 24,
    marginLeft: spacing.sm,
  },
  scenesSection: {
    marginBottom: spacing.xl,
  },
  scenesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    justifyContent: "center",
  },
  sceneCard: {
    ...shadows.small,
    borderRadius: borderRadius.lg,
  },
  quickStatsSection: {
    marginBottom: spacing.lg,
  },
  statsGrid: {
    flexDirection: "row",
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background.paper,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
    ...shadows.small,
    borderWidth: 1,
    borderColor: colors.primary.light,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  statValue: {
    ...typography.h2,
    color: colors.primary.main,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: "center",
  },
});

export default DungeonScreen;
