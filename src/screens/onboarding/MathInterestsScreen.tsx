import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert,
} from "react-native";
import { onboardingService } from "../../services/OnboardingService";

interface MathInterestsScreenProps {
  navigation: any;
}

const MathInterestsScreen: React.FC<MathInterestsScreenProps> = ({
  navigation,
}) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const mathOptions = onboardingService.getMathInterestsOptions();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSelect = (interestId: string) => {
    const newInterests = [...selectedInterests];

    if (newInterests.includes(interestId)) {
      // Remover interés
      newInterests.splice(newInterests.indexOf(interestId), 1);
    } else {
      if (newInterests.length >= 4) {
        Alert.alert(
          "Límite alcanzado",
          "Puedes seleccionar máximo 4 tipos de problemas"
        );
        return;
      }
      // Agregar interés
      newInterests.push(interestId);
    }

    setSelectedInterests(newInterests);
  };

  const handleContinue = async () => {
    if (selectedInterests.length === 0) {
      Alert.alert(
        "Selección requerida",
        "Por favor selecciona al menos un tipo de problema matemático"
      );
      return;
    }

    try {
      // Actualizar perfil con intereses matemáticos
      await onboardingService.updateUserProfile({
        mathInterests: selectedInterests,
      });

      // Marcar paso como completado
      await onboardingService.completeOnboardingStep("math_interests");

      // Ir al siguiente paso
      navigation.navigate("AccessibilityScreen");
    } catch (error) {
      Alert.alert("Error", "Error al guardar intereses matemáticos");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F4EFF3" }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerAction}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Tipos de Problemas</Text>
        <Text style={styles.subtitle}>
          Selecciona los tipos de matemáticas que más te interesan (máximo 4)
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipos de Matemáticas</Text>
          <Text style={styles.sectionDescription}>
            Seleccionados: {selectedInterests.length}/4
          </Text>

          <View style={styles.mathGrid}>
            {mathOptions.map((mathType, index) => {
              const isSelected = selectedInterests.includes(mathType.id);

              return (
                <TouchableOpacity
                  key={mathType.id}
                  onPress={() => handleSelect(mathType.id)}
                  style={[
                    styles.mathCard,
                    isSelected
                      ? { borderColor: "#F82E08", backgroundColor: "#FFF5F5" }
                      : {},
                  ]}
                >
                  <View style={styles.mathCardContent}>
                    <Text style={styles.mathEmoji}>{mathType.emoji}</Text>
                    <Text style={styles.mathName}>{mathType.name}</Text>
                    <Text style={styles.mathDescription}>
                      {mathType.description}
                    </Text>

                    {isSelected && <Text style={styles.checkIcon}>✓</Text>}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {selectedInterests.length > 0 && (
          <View style={styles.selectedSection}>
            <Text style={styles.selectedTitle}>Tipos Seleccionados:</Text>
            <View style={styles.selectedList}>
              {selectedInterests.map((interestId) => {
                const mathType = mathOptions.find((m) => m.id === interestId);
                return mathType ? (
                  <View key={interestId} style={styles.selectedItem}>
                    <Text style={styles.selectedItemText}>
                      {mathType.emoji} {mathType.name}
                    </Text>
                  </View>
                ) : null;
              })}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.formAction}>
        <TouchableOpacity
          onPress={handleContinue}
          style={[
            styles.btn,
            selectedInterests.length === 0 && styles.btnDisabled,
          ]}
          disabled={selectedInterests.length === 0}
        >
          <Text style={styles.btnText}>
            Continuar ({selectedInterests.length} seleccionados)
          </Text>
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
    marginBottom: 28,
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
  form: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    paddingHorizontal: 24,
  },
  formAction: {
    marginVertical: 24,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#889797",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  sectionDescription: {
    fontSize: 13,
    color: "#F82E08",
    fontWeight: "600",
    marginBottom: 12,
  },
  mathGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  mathCard: {
    width: "48%",
    marginBottom: 12,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    minHeight: 120,
  },
  mathCardContent: {
    alignItems: "center",
    position: "relative",
    height: "100%",
    justifyContent: "space-between",
  },
  mathEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  mathName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1d2a32",
    marginBottom: 4,
    textAlign: "center",
  },
  mathDescription: {
    fontSize: 11,
    lineHeight: 14,
    color: "#889797",
    textAlign: "center",
    marginBottom: 8,
  },
  checkIcon: {
    position: "absolute",
    top: -4,
    right: -4,
    fontSize: 16,
    color: "#F82E08",
    fontWeight: "bold",
    backgroundColor: "#fff",
    borderRadius: 10,
    width: 20,
    height: 20,
    textAlign: "center",
    lineHeight: 20,
  },
  selectedSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F82E08",
  },
  selectedTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1d2a32",
    marginBottom: 8,
  },
  selectedList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  selectedItem: {
    backgroundColor: "#FFF5F5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F82E08",
  },
  selectedItemText: {
    fontSize: 13,
    color: "#F82E08",
    fontWeight: "500",
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
  btnDisabled: {
    backgroundColor: "#ccc",
    borderColor: "#ccc",
  },
});

export default MathInterestsScreen;
