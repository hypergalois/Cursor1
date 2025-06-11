// SimpleOnboardingScreen - Onboarding minimalista en 3 pasos
// Estilo Duolingo: sencillo, claro y amigable

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Switch,
  ScrollView,
} from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import MinoMascot from "../components/gamification/MinoMascot";
import { userProgressService } from "../services/UserProgress";

const { width, height } = Dimensions.get("window");

interface OnboardingData {
  name: string;
  age: number | null;
  largeText: boolean;
}

interface SimpleOnboardingScreenProps {
  navigation: any;
}

const SimpleOnboardingScreen: React.FC<SimpleOnboardingScreenProps> = ({
  navigation,
}) => {
  const theme = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    name: "",
    age: null,
    largeText: false,
  });

  // Paso 1: ¿Cómo te llamas?
  const renderNameStep = () => (
    <View style={styles.stepContainer}>
      <MinoMascot mood="happy" size={120} ageGroup="adults" context="welcome" />

      <Text style={[styles.title, { color: theme.colors.text.primary }]}>
        ¡Hola! 👋
      </Text>

      <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
        ¿Cómo te llamas?
      </Text>

      <TextInput
        style={[
          styles.nameInput,
          {
            backgroundColor: theme.colors.background.paper,
            borderColor: theme.colors.border,
            color: theme.colors.text.primary,
          },
        ]}
        value={data.name}
        onChangeText={(name) => setData((prev) => ({ ...prev, name }))}
        placeholder="Tu nombre"
        placeholderTextColor={theme.colors.text.secondary}
        autoCapitalize="words"
        autoCorrect={false}
        maxLength={20}
      />

      <TouchableOpacity
        style={[
          styles.continueButton,
          {
            backgroundColor:
              data.name.length > 0
                ? theme.colors.primary.main
                : theme.colors.border,
          },
        ]}
        onPress={() => setCurrentStep(2)}
        disabled={data.name.length === 0}
      >
        <Text
          style={[
            styles.continueButtonText,
            {
              color:
                data.name.length > 0
                  ? theme.colors.primary.contrastText
                  : theme.colors.text.secondary,
            },
          ]}
        >
          Continuar
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Paso 2: ¿Cuántos años tienes?
  const renderAgeStep = () => {
    const ageRanges = [
      { label: "Niño (5-12)", value: 8, group: "kids" },
      { label: "Adolescente (13-17)", value: 15, group: "teens" },
      { label: "Adulto (18-64)", value: 30, group: "adults" },
      { label: "Mayor (65+)", value: 70, group: "seniors" },
    ];

    return (
      <View style={styles.stepContainer}>
        <MinoMascot
          mood="thinking"
          size={100}
          ageGroup={getAgeGroup()}
          context="welcome"
        />

        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          ¡Hola {data.name}! 😊
        </Text>

        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          ¿Cuántos años tienes?
        </Text>

        <View style={styles.ageOptionsContainer}>
          {ageRanges.map((range, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.ageOption,
                {
                  backgroundColor:
                    data.age === range.value
                      ? theme.colors.primary.main
                      : theme.colors.background.paper,
                  borderColor:
                    data.age === range.value
                      ? theme.colors.primary.main
                      : theme.colors.border,
                },
              ]}
              onPress={() => setData((prev) => ({ ...prev, age: range.value }))}
            >
              <Text
                style={[
                  styles.ageOptionText,
                  {
                    color:
                      data.age === range.value
                        ? theme.colors.primary.contrastText
                        : theme.colors.text.primary,
                  },
                ]}
              >
                {range.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.continueButton,
            {
              backgroundColor:
                data.age !== null
                  ? theme.colors.primary.main
                  : theme.colors.border,
            },
          ]}
          onPress={() => setCurrentStep(3)}
          disabled={data.age === null}
        >
          <Text
            style={[
              styles.continueButtonText,
              {
                color:
                  data.age !== null
                    ? theme.colors.primary.contrastText
                    : theme.colors.text.secondary,
              },
            ]}
          >
            Continuar
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Paso 3: ¿Necesitas texto más grande?
  const renderAccessibilityStep = () => (
    <View style={styles.stepContainer}>
      <MinoMascot
        mood="focused"
        size={100}
        ageGroup={getAgeGroup()}
        context="welcome"
      />

      <Text style={[styles.title, { color: theme.colors.text.primary }]}>
        ¡Perfecto! 👍
      </Text>

      <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
        ¿Necesitas texto más grande para leer mejor?
      </Text>

      <View style={styles.accessibilityContainer}>
        <View
          style={[
            styles.switchContainer,
            { backgroundColor: theme.colors.background.paper },
          ]}
        >
          <View style={styles.switchLabelContainer}>
            <Text
              style={[styles.switchLabel, { color: theme.colors.text.primary }]}
            >
              Texto grande
            </Text>
            <Text
              style={[
                styles.switchDescription,
                { color: theme.colors.text.secondary },
              ]}
            >
              Hace los textos más fáciles de leer
            </Text>
          </View>
          <Switch
            value={data.largeText}
            onValueChange={(largeText) =>
              setData((prev) => ({ ...prev, largeText }))
            }
            thumbColor={
              data.largeText ? theme.colors.primary.main : theme.colors.border
            }
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primary.light,
            }}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.startButton,
          { backgroundColor: theme.colors.success.main },
        ]}
        onPress={handleComplete}
      >
        <Text style={[styles.startButtonText, { color: "#FFFFFF" }]}>
          ¡Empezar a practicar! 🚀
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Helpers
  const getAgeGroup = (): "kids" | "teens" | "adults" | "seniors" => {
    if (!data.age) return "adults";
    if (data.age <= 12) return "kids";
    if (data.age <= 17) return "teens";
    if (data.age <= 64) return "adults";
    return "seniors";
  };

  const handleComplete = async () => {
    try {
      // Guardar configuración básica del usuario
      await userProgressService.resetProgress(); // Empezar fresh

      // Aquí podrías guardar nombre, edad, y configuración de accesibilidad
      // Por simplicidad, vamos directo a la pantalla principal
      navigation.replace("CleanHome", {
        userName: data.name,
        ageGroup: getAgeGroup(),
        largeText: data.largeText,
      });
    } catch (error) {
      console.error("Error completing onboarding:", error);
      navigation.replace("CleanHome", {
        userName: data.name || "Usuario",
        ageGroup: getAgeGroup(),
        largeText: data.largeText,
      });
    }
  };

  // Barra de progreso
  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View
        style={[styles.progressBar, { backgroundColor: theme.colors.border }]}
      >
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: theme.colors.primary.main,
              width: `${(currentStep / 3) * 100}%`,
            },
          ]}
        />
      </View>
      <Text
        style={[styles.progressText, { color: theme.colors.text.secondary }]}
      >
        {currentStep} de 3
      </Text>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.default },
      ]}
    >
      {renderProgressBar()}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {currentStep === 1 && renderNameStep()}
        {currentStep === 2 && renderAgeStep()}
        {currentStep === 3 && renderAccessibilityStep()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressContainer: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  stepContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  nameInput: {
    width: "100%",
    height: 56,
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    textAlign: "center",
    marginBottom: 32,
  },
  ageOptionsContainer: {
    width: "100%",
    marginBottom: 32,
  },
  ageOption: {
    width: "100%",
    height: 56,
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  ageOptionText: {
    fontSize: 16,
    fontWeight: "600",
  },
  accessibilityContainer: {
    width: "100%",
    marginBottom: 32,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 12,
    justifyContent: "space-between",
  },
  switchLabelContainer: {
    flex: 1,
    marginRight: 16,
  },
  switchLabel: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  continueButton: {
    width: "100%",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  startButton: {
    width: "100%",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SimpleOnboardingScreen;
