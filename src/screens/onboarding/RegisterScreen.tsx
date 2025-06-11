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

interface RegisterScreenProps {
  navigation: any;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const validateForm = () => {
    if (!form.username.trim()) {
      Alert.alert("Error", "Por favor ingresa un nombre de usuario");
      return false;
    }
    if (!form.name.trim()) {
      Alert.alert("Error", "Por favor ingresa tu nombre");
      return false;
    }
    if (!form.email.trim()) {
      Alert.alert("Error", "Por favor ingresa un email");
      return false;
    }
    if (!form.email.includes("@")) {
      Alert.alert("Error", "Por favor ingresa un email válido");
      return false;
    }
    if (!form.password.trim()) {
      Alert.alert("Error", "Por favor ingresa una contraseña");
      return false;
    }
    if (form.password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await onboardingService.registerUser(form);

      if (result.success) {
        // Marcar paso como completado
        await onboardingService.completeOnboardingStep("register");
        // Ir al siguiente paso
        navigation.navigate("LearningGoalsScreen");
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F4EFF3" }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerAction}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Crear Cuenta</Text>
        <Text style={styles.subtitle}>
          Comienza tu aventura matemática con nosotros
        </Text>
      </View>

      <KeyboardAwareScrollView style={styles.form}>
        <Text style={styles.formLabel}>Nombre de Usuario</Text>
        <View style={styles.formInput}>
          <View style={styles.formIcon}>
            <Text style={styles.iconText}>@</Text>
          </View>
          <TextInput
            autoCapitalize="none"
            autoComplete="username"
            clearButtonMode="while-editing"
            onChangeText={(username) => setForm({ ...form, username })}
            placeholder="ej. juanperez"
            placeholderTextColor="#6b7280"
            style={styles.formInputControl}
            value={form.username}
          />
        </View>

        <Text style={styles.formLabel}>Nombre Completo</Text>
        <View style={styles.formInput}>
          <View style={styles.formIcon}>
            <Text style={styles.iconText}>👤</Text>
          </View>
          <TextInput
            clearButtonMode="while-editing"
            onChangeText={(name) => setForm({ ...form, name })}
            placeholder="ej. Juan Pérez"
            placeholderTextColor="#6b7280"
            style={styles.formInputControl}
            value={form.name}
          />
        </View>

        <Text style={styles.formLabel}>Email</Text>
        <View style={styles.formInput}>
          <View style={styles.formIcon}>
            <Text style={styles.iconText}>✉️</Text>
          </View>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
            keyboardType="email-address"
            onChangeText={(email) => setForm({ ...form, email })}
            placeholder="ej. juan@ejemplo.com"
            placeholderTextColor="#6b7280"
            style={styles.formInputControl}
            value={form.email}
          />
        </View>

        <Text style={styles.formLabel}>Contraseña</Text>
        <View style={styles.formInput}>
          <View style={styles.formIcon}>
            <Text style={styles.iconText}>🔒</Text>
          </View>
          <TextInput
            autoCorrect={false}
            clearButtonMode="while-editing"
            onChangeText={(password) => setForm({ ...form, password })}
            placeholder="********"
            placeholderTextColor="#6b7280"
            style={styles.formInputControl}
            secureTextEntry={true}
            value={form.password}
          />
        </View>

        <View style={styles.formAction}>
          <TouchableOpacity onPress={handleRegister} disabled={loading}>
            <View style={[styles.btn, loading && styles.btnDisabled]}>
              <Text style={styles.btnText}>
                {loading ? "Registrando..." : "Registrarse"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.formFooter}>
          Al hacer clic en "Registrarse", aceptas nuestros
          <Text style={{ color: "#45464E", fontWeight: "600" }}>
            {" "}
            Términos y Condiciones{" "}
          </Text>
          y
          <Text style={{ color: "#45464E", fontWeight: "600" }}>
            {" "}
            Política de Privacidad
          </Text>
          .
        </Text>
      </KeyboardAwareScrollView>
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
  formLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
    marginBottom: 6,
  },
  formInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    marginBottom: 16,
  },
  formIcon: {
    paddingLeft: 12,
    width: 40,
    alignItems: "center",
  },
  iconText: {
    fontSize: 20,
    color: "#889797",
  },
  formInputControl: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    paddingRight: 16,
    paddingLeft: 0,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
    paddingVertical: 12,
  },
  formAction: {
    marginVertical: 24,
  },
  formFooter: {
    marginTop: "auto",
    marginBottom: 24,
    paddingHorizontal: 0,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "400",
    color: "#9fa5af",
    textAlign: "center",
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

export default RegisterScreen;
