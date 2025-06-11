import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { onboardingService } from "../../services/OnboardingService";

interface InterestsScreenProps {
  navigation: any;
}

const InterestsScreen: React.FC<InterestsScreenProps> = ({ navigation }) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const interests = onboardingService.getMathRelatedInterests();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSelect = (interest: string) => {
    const newInterests = [...selectedInterests];

    if (newInterests.includes(interest)) {
      // Remover interés
      newInterests.splice(newInterests.indexOf(interest), 1);
    } else {
      if (newInterests.length >= 5) {
        Alert.alert(
          "Límite alcanzado",
          "Puedes seleccionar máximo 5 intereses"
        );
        return;
      }
      // Agregar interés
      newInterests.push(interest);
    }

    setSelectedInterests(newInterests);
  };

  const handleContinue = async () => {
    try {
      // Actualizar perfil con intereses
      await onboardingService.updateUserProfile({
        interests: selectedInterests,
      });

      // Marcar paso como completado
      await onboardingService.completeOnboardingStep("interests");

      // Ir al siguiente paso
      navigation.navigate("ProfilePictureScreen");
    } catch (error) {
      Alert.alert("Error", "Error al guardar intereses");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F4EFF3" }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerAction}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Tus Intereses</Text>
        <Text style={styles.subtitle}>
          Selecciona temas que te interesan (opcional, máximo 5)
        </Text>
      </View>

      <KeyboardAwareScrollView style={styles.form}>
        <Text style={styles.selectedCount}>
          Seleccionados: {selectedInterests.length}/5
        </Text>

        <View style={styles.picker}>
          {interests.map((interest) => {
            const isActive = selectedInterests.includes(interest);

            return (
              <TouchableOpacity
                key={interest}
                onPress={() => handleSelect(interest)}
                style={[
                  styles.pickerItem,
                  isActive
                    ? { backgroundColor: "#F82E08", borderColor: "#F82E08" }
                    : {},
                ]}
              >
                <Text
                  style={[
                    styles.pickerLabel,
                    isActive ? { color: "#fff" } : {},
                  ]}
                >
                  {interest}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </KeyboardAwareScrollView>

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
  selectedCount: {
    fontSize: 13,
    color: "#F82E08",
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  picker: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  pickerItem: {
    margin: 2,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderStyle: "solid",
    borderRadius: 12,
  },
  pickerLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
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

export default InterestsScreen;
