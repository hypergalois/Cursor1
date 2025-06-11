import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { onboardingService } from "../../services/OnboardingService";

interface SignInScreenProps {
  navigation: any;
}

const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSignIn = async () => {
    if (!form.email.trim() || !form.password.trim()) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      const result = await onboardingService.loginUser(
        form.email,
        form.password
      );

      if (result.success) {
        // Verificar si ya completó el onboarding
        const isCompleted = await onboardingService.isOnboardingCompleted();

        if (isCompleted) {
          // Ir directamente a la app principal
          navigation.reset({
            index: 0,
            routes: [{ name: "CleanHome" }],
          });
        } else {
          // Continuar onboarding desde donde se quedó
          const nextStep = await onboardingService.getNextOnboardingStep();
          if (nextStep) {
            navigation.navigate(nextStep.component);
          } else {
            navigation.navigate("LearningGoalsScreen");
          }
        }
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Recuperar Contraseña",
      "Esta función estará disponible próximamente. Por ahora, puedes crear una nueva cuenta.",
      [{ text: "OK" }]
    );
  };

  const handleCreateAccount = () => {
    navigation.navigate("RegisterScreen");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F4EFF3" }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerAction}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Iniciar Sesión</Text>
      </View>

      <KeyboardAwareScrollView>
        <View style={styles.form}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
              keyboardType="email-address"
              onChangeText={(email) => setForm({ ...form, email })}
              placeholder="ej. juan@ejemplo.com"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              value={form.email}
            />
          </View>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Contraseña</Text>
            <TextInput
              autoCorrect={false}
              clearButtonMode="while-editing"
              onChangeText={(password) => setForm({ ...form, password })}
              placeholder="********"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              secureTextEntry={true}
              value={form.password}
            />
          </View>

          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.formLink}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <View style={styles.formAction}>
            <TouchableOpacity onPress={handleSignIn} disabled={loading}>
              <View style={[styles.btn, loading && styles.btnDisabled]}>
                <Text style={styles.btnText}>
                  {loading ? "Iniciando..." : "Iniciar Sesión"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <TouchableOpacity onPress={handleCreateAccount}>
        <Text style={styles.formFooter}>
          ¿No tienes cuenta? <Text style={styles.formLink}>Regístrate</Text>
        </Text>
      </TouchableOpacity>
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
  formLink: {
    textAlign: "right",
    fontWeight: "600",
    color: "#F82E08",
    textDecorationLine: "underline",
    textDecorationColor: "#F82E08",
    textDecorationStyle: "solid",
  },
  formAction: {
    marginVertical: 24,
  },
  formFooter: {
    marginTop: "auto",
    marginBottom: 24,
    paddingHorizontal: 24,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "400",
    color: "#9fa5af",
    textAlign: "center",
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1c1c1e",
    marginBottom: 6,
  },
  inputControl: {
    height: 44,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: "500",
    color: "#24262e",
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

export default SignInScreen;
