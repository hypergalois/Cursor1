import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import MinoMascot from "../../components/gamification/MinoMascot";

interface WelcomeScreenProps {
  navigation: any;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const theme = useTheme();

  const handleGetStarted = () => {
    navigation.navigate("RegisterScreen");
  };

  const handleSignIn = () => {
    navigation.navigate("SignInScreen");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#F4EFF3" }]}>
      <View style={styles.content}>
        {/* Hero Section con mascota */}
        <View style={styles.heroSection}>
          <MinoMascot
            mood="happy"
            size={200}
            ageGroup="adults"
            context="welcome"
            showThoughts={false}
          />
        </View>

        <View style={styles.textContent}>
          <Text style={styles.title}>Aprende Matemáticas</Text>
          <Text style={styles.title}>de Forma Divertida</Text>

          <Text style={styles.subtitle}>
            Domina las matemáticas con ejercicios adaptativos, gamificación
            inteligente y tu mascota personal Mino.
          </Text>

          <View style={styles.contentButtons}>
            <TouchableOpacity onPress={handleGetStarted}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Empezar Aventura</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSignIn}>
              <View style={styles.btnEmpty}>
                <Text style={styles.btnEmptyText}>Ya tengo una cuenta</Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.contentFooter}>
              Al continuar, aceptas nuestros{"\n "}
              <Text style={styles.contentLink}>
                Términos y Condiciones
              </Text> y{" "}
              <Text style={styles.contentLink}>Política de Privacidad</Text>.
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  heroSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  textContent: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#181818",
    textAlign: "center",
    lineHeight: 42,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
    color: "#889797",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  contentButtons: {
    width: "100%",
    marginTop: 36,
    marginBottom: "auto",
  },
  contentFooter: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "400",
    color: "#9fa5af",
    textAlign: "center",
    marginBottom: 20,
  },
  contentLink: {
    color: "#45464E",
    fontWeight: "600",
    textDecorationLine: "underline",
    textDecorationColor: "black",
    textDecorationStyle: "solid",
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
  btnEmpty: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 1.5,
    backgroundColor: "transparent",
    borderColor: "#F82E08",
    marginTop: 12,
  },
  btnEmptyText: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "bold",
    color: "#F82E08",
  },
});

export default WelcomeScreen;
