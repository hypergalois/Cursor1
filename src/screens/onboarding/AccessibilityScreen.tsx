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

interface AccessibilityScreenProps {
  navigation: any;
}

const AccessibilityScreen: React.FC<AccessibilityScreenProps> = ({
  navigation,
}) => {
  const [form, setForm] = useState({
    textSize: "medium" as "small" | "medium" | "large",
    colorMode: "default" as "default" | "high-contrast",
    reduceMotion: false,
    screenReader: false,
    hapticFeedback: true,
  });

  const textSizes = [
    { id: "small", label: "Pequeño", scale: 0.75 },
    { id: "medium", label: "Mediano", scale: 1 },
    { id: "large", label: "Grande", scale: 1.25 },
  ];

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSkip = () => {
    handleContinue();
  };

  const handleContinue = async () => {
    try {
      // Actualizar perfil con configuración de accesibilidad
      await onboardingService.updateUserProfile({
        accessibility: form,
      });

      // Marcar paso como completado
      await onboardingService.completeOnboardingStep("accessibility");

      // Ir al siguiente paso
      navigation.navigate("InterestsScreen");
    } catch (error) {
      Alert.alert("Error", "Error al guardar configuración de accesibilidad");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F4EFF3" }}>
      <View style={styles.header}>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleBack} style={styles.headerAction}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.headerSkipText}>Omitir</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Accesibilidad</Text>
        <Text style={styles.subtitle}>
          Personaliza la app para una mejor experiencia de uso
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tamaño de Texto</Text>

          <View style={styles.textSizePreview}>
            <Text
              style={[
                styles.previewText,
                {
                  fontSize:
                    16 *
                    (textSizes.find((s) => s.id === form.textSize)?.scale || 1),
                },
              ]}
            >
              Vista previa del tamaño de texto
            </Text>
          </View>

          <View style={styles.textSizeOptions}>
            {textSizes.map((size) => (
              <TouchableOpacity
                key={size.id}
                onPress={() => setForm({ ...form, textSize: size.id as any })}
                style={[
                  styles.textSizeOption,
                  form.textSize === size.id
                    ? { borderColor: "#F82E08", backgroundColor: "#FFF5F5" }
                    : {},
                ]}
              >
                <Text style={styles.textSizeLabel}>{size.label}</Text>
                <View style={styles.textSizeBars}>
                  {Array(size.id === "small" ? 1 : size.id === "medium" ? 2 : 3)
                    .fill(0)
                    .map((_, i) => (
                      <View
                        key={i}
                        style={[
                          styles.textSizeBar,
                          {
                            backgroundColor:
                              form.textSize === size.id ? "#F82E08" : "#E5E7EB",
                          },
                        ]}
                      />
                    ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Modo de Color</Text>

          <View style={styles.colorModes}>
            <TouchableOpacity
              onPress={() => setForm({ ...form, colorMode: "default" })}
              style={[
                styles.colorModeOption,
                form.colorMode === "default" ? { borderColor: "#F82E08" } : {},
              ]}
            >
              <View style={[styles.colorModePreview, styles.defaultMode]}>
                <View style={styles.colorModeCircle} />
              </View>
              <Text style={styles.colorModeLabel}>Normal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setForm({ ...form, colorMode: "high-contrast" })}
              style={[
                styles.colorModeOption,
                form.colorMode === "high-contrast"
                  ? { borderColor: "#F82E08" }
                  : {},
              ]}
            >
              <View style={[styles.colorModePreview, styles.highContrastMode]}>
                <View style={styles.colorModeCircle} />
              </View>
              <Text style={styles.colorModeLabel}>Alto Contraste</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferencias</Text>

          <View style={styles.preferenceOption}>
            <View style={styles.preferenceContent}>
              <Text style={styles.preferenceLabel}>Reducir Movimiento</Text>
              <Text style={styles.preferenceDescription}>
                Minimizar animaciones y transiciones
              </Text>
            </View>
            <Switch
              onValueChange={(reduceMotion) =>
                setForm({ ...form, reduceMotion })
              }
              trackColor={{ false: "#E5E7EB", true: "#F82E08" }}
              value={form.reduceMotion}
            />
          </View>

          <View style={styles.preferenceOption}>
            <View style={styles.preferenceContent}>
              <Text style={styles.preferenceLabel}>Lector de Pantalla</Text>
              <Text style={styles.preferenceDescription}>
                Activar retroalimentación por voz
              </Text>
            </View>
            <Switch
              onValueChange={(screenReader) =>
                setForm({ ...form, screenReader })
              }
              trackColor={{ false: "#E5E7EB", true: "#F82E08" }}
              value={form.screenReader}
            />
          </View>

          <View style={styles.preferenceOption}>
            <View style={styles.preferenceContent}>
              <Text style={styles.preferenceLabel}>Vibración al Tocar</Text>
              <Text style={styles.preferenceDescription}>
                Vibrar en interacciones táctiles
              </Text>
            </View>
            <Switch
              onValueChange={(hapticFeedback) =>
                setForm({ ...form, hapticFeedback })
              }
              trackColor={{ false: "#E5E7EB", true: "#F82E08" }}
              value={form.hapticFeedback}
            />
          </View>
        </View>

        <View style={styles.formAction}>
          <TouchableOpacity onPress={handleContinue}>
            <View style={styles.btn}>
              <Text style={styles.btnText}>Guardar Preferencias</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  previewText: {
    color: "#1d2a32",
    textAlign: "center",
  },
  defaultMode: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  highContrastMode: {
    backgroundColor: "#000",
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
  formAction: {
    marginVertical: 24,
    marginTop: 16,
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
  textSizePreview: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  textSizeOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textSizeOption: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    padding: 12,
    alignItems: "center",
  },
  textSizeLabel: {
    fontSize: 13,
    lineHeight: 18,
    color: "#1d2a32",
    marginBottom: 8,
    letterSpacing: 0.19,
  },
  textSizeBars: {
    flexDirection: "row",
  },
  textSizeBar: {
    width: 16,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 1,
  },
  colorModes: {
    flexDirection: "row",
    marginBottom: 16,
  },
  colorModeOption: {
    flex: 1,
    marginRight: 12,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    padding: 12,
  },
  colorModePreview: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  colorModeCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#f82e08",
  },
  colorModeLabel: {
    fontSize: 13,
    lineHeight: 18,
    color: "#1d2a32",
    letterSpacing: 0.19,
  },
  preferenceOption: {
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
  preferenceContent: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    marginRight: 16,
  },
  preferenceLabel: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",
    color: "#1d2a32",
    marginBottom: 4,
  },
  preferenceDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: "#889797",
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

export default AccessibilityScreen;
