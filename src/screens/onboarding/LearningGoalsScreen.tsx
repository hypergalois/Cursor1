import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { onboardingService } from "../../services/OnboardingService";

interface LearningGoalsScreenProps {
  navigation: any;
}

const LearningGoalsScreen: React.FC<LearningGoalsScreenProps> = ({
  navigation,
}) => {
  const [form, setForm] = useState({
    goal: "",
    studyReminders: false,
    weeklyProgress: false,
  });

  const goals = onboardingService.getLearningGoalsForMath();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSkip = () => {
    handleContinue();
  };

  const handleContinue = async () => {
    if (!form.goal) {
      Alert.alert(
        "Selección Requerida",
        "Por favor selecciona un objetivo de aprendizaje"
      );
      return;
    }

    try {
      // Actualizar perfil con objetivo seleccionado
      await onboardingService.updateUserProfile({
        learningGoal: form.goal as any,
        studyReminders: form.studyReminders,
        weeklyProgress: form.weeklyProgress,
      });

      // Marcar paso como completado
      await onboardingService.completeOnboardingStep("goals");

      // Ir al siguiente paso
      navigation.navigate("MathInterestsScreen");
    } catch (error) {
      Alert.alert("Error", "Error al guardar objetivos");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.header}>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleBack} style={styles.headerAction}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.headerSkipText}>Omitir</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Objetivos de Aprendizaje</Text>
        <Text style={styles.subtitle}>
          Cuéntanos qué quieres lograr aprendiendo matemáticas
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            ¿Cuál es tu objetivo principal?
          </Text>

          {goals.map((goal, index) => {
            const isActive = goal.id === form.goal;

            return (
              <TouchableOpacity
                key={index}
                onPress={() => setForm({ ...form, goal: goal.id })}
                style={[
                  styles.goalCard,
                  isActive
                    ? { borderColor: "#F82E08", backgroundColor: "#FFF5F5" }
                    : {},
                ]}
              >
                <View style={styles.goalInfo}>
                  <View style={styles.goalHeader}>
                    <View style={styles.goalIcon}>
                      <Text style={styles.goalIconText}>
                        {goal.icon === "school"
                          ? "🎓"
                          : goal.icon === "heart"
                          ? "❤️"
                          : goal.icon === "briefcase"
                          ? "💼"
                          : "📚"}
                      </Text>
                    </View>

                    <View style={styles.goalContent}>
                      <Text style={styles.goalLabel}>{goal.name}</Text>
                      <Text style={styles.goalDescription}>
                        {goal.description}
                      </Text>
                    </View>

                    {isActive && <Text style={styles.checkIcon}>✓</Text>}
                  </View>

                  {isActive && (
                    <View style={styles.goalFeatures}>
                      {goal.features.map((feature, featureIndex) => (
                        <View key={featureIndex} style={styles.goalFeature}>
                          <Text style={styles.goalFeatureIcon}>
                            {feature.icon === "book"
                              ? "📚"
                              : feature.icon === "time"
                              ? "⏰"
                              : feature.icon === "stats-chart"
                              ? "📊"
                              : feature.icon === "star"
                              ? "⭐"
                              : feature.icon === "game-controller"
                              ? "🎮"
                              : feature.icon === "people"
                              ? "👥"
                              : feature.icon === "calculator"
                              ? "🧮"
                              : feature.icon === "trending-up"
                              ? "📈"
                              : feature.icon === "trophy"
                              ? "🏆"
                              : "✨"}
                          </Text>
                          <Text style={styles.goalFeatureText}>
                            {feature.text}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferencias de Aprendizaje</Text>

          <View style={styles.formSwitch}>
            <Text
              style={[
                styles.formSwitchText,
                form.studyReminders && { fontWeight: "600", color: "#1D2A32" },
              ]}
            >
              Recordatorios Diarios
            </Text>
            <Switch
              onValueChange={(studyReminders) =>
                setForm({ ...form, studyReminders })
              }
              trackColor={{ false: "#E5E7EB", true: "#F82E08" }}
              value={form.studyReminders}
            />
          </View>

          <View style={styles.formSwitch}>
            <Text
              style={[
                styles.formSwitchText,
                form.weeklyProgress && { fontWeight: "600", color: "#1D2A32" },
              ]}
            >
              Reporte Semanal de Progreso
            </Text>
            <Switch
              onValueChange={(weeklyProgress) =>
                setForm({ ...form, weeklyProgress })
              }
              trackColor={{ false: "#E5E7EB", true: "#F82E08" }}
              value={form.weeklyProgress}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.formAction}>
        <TouchableOpacity onPress={handleContinue}>
          <View style={styles.btn}>
            <Text style={styles.btnText}>Continuar</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#181818",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "500",
    color: "#889797",
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffdada",
    marginBottom: 16,
  },
  backText: {
    fontSize: 24,
    color: "#F82E08",
    fontWeight: "bold",
  },
  headerSkipText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#f82e08",
    textDecorationLine: "underline",
    textDecorationColor: "#f82e08",
    textDecorationStyle: "solid",
  },
  form: {
    paddingHorizontal: 24,
  },
  formSwitch: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    marginBottom: 12,
  },
  formSwitchText: {
    width: "75%",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "500",
    color: "#889797",
  },
  formAction: {
    marginTop: 16,
    marginHorizontal: 0,
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#889797",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  goalCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
  },
  goalInfo: {
    flexDirection: "column",
    alignItems: "center",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  goalHeader: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  goalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff5f5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  goalIconText: {
    fontSize: 20,
  },
  goalContent: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  goalLabel: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",
    color: "#1d2a32",
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: "#889797",
  },
  checkIcon: {
    fontSize: 20,
    color: "#F82E08",
    fontWeight: "bold",
  },
  goalFeatures: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    width: "100%",
    paddingLeft: 52,
  },
  goalFeature: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  goalFeatureIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  goalFeatureText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#1d2a32",
    letterSpacing: 0.18,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 1,
    backgroundColor: "#F82E08",
    borderColor: "#F82E08",
  },
  btnText: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default LearningGoalsScreen;
