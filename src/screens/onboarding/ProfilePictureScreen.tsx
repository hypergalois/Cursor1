import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { onboardingService } from "../../services/OnboardingService";
import MinoMascot from "../../components/gamification/MinoMascot";

interface ProfilePictureScreenProps {
  navigation: any;
}

const ProfilePictureScreen: React.FC<ProfilePictureScreenProps> = ({
  navigation,
}) => {
  const [profilePicture, setProfilePicture] = useState<string>("");

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleGallery = () => {
    Alert.alert(
      "Galería",
      "En esta versión demo, usaremos tu mascota Mino como foto de perfil",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Usar Mascota", onPress: () => setProfilePicture("mascot") },
      ]
    );
  };

  const handleCamera = () => {
    Alert.alert(
      "Cámara",
      "En esta versión demo, usaremos tu mascota Mino como foto de perfil",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Usar Mascota", onPress: () => setProfilePicture("mascot") },
      ]
    );
  };

  const handleComplete = async () => {
    try {
      // Actualizar perfil con foto (si seleccionó)
      if (profilePicture) {
        await onboardingService.updateUserProfile({
          profilePicture,
        });
      }

      // Marcar paso como completado
      await onboardingService.completeOnboardingStep("profile_picture");

      // Completar onboarding
      await onboardingService.completeOnboarding();

      // Ir a la app principal
      navigation.reset({
        index: 0,
        routes: [{ name: "CleanHome" }],
      });
    } catch (error) {
      Alert.alert("Error", "Error al completar onboarding");
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

        <Text style={styles.title}>Foto de Perfil</Text>
        <Text style={styles.subtitle}>
          Añade una foto para personalizar tu perfil
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.avatarPreview}>
          {profilePicture === "mascot" ? (
            <View style={styles.mascotContainer}>
              <MinoMascot
                mood="happy"
                size={160}
                ageGroup="adults"
                context="profile"
                showThoughts={false}
              />
            </View>
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarIcon}>👤</Text>
            </View>
          )}

          {profilePicture && (
            <TouchableOpacity
              onPress={() => setProfilePicture("")}
              style={styles.avatarRemove}
            >
              <Text style={styles.removeIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.formAction}>
          <TouchableOpacity onPress={handleGallery} style={styles.uploadOption}>
            <View style={styles.uploadOptionIcon}>
              <Text style={styles.uploadIcon}>🖼️</Text>
            </View>
            <View style={styles.uploadOptionContent}>
              <Text style={styles.uploadOptionLabel}>Elegir de Galería</Text>
              <Text style={styles.uploadOptionDescription}>
                Selecciona una foto de tu dispositivo
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleCamera} style={styles.uploadOption}>
            <View style={styles.uploadOptionIcon}>
              <Text style={styles.uploadIcon}>📷</Text>
            </View>
            <View style={styles.uploadOptionContent}>
              <Text style={styles.uploadOptionLabel}>Tomar Foto</Text>
              <Text style={styles.uploadOptionDescription}>
                Usa tu cámara para tomar una nueva foto
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formFooter}>
          <TouchableOpacity
            onPress={handleComplete}
            style={styles.completeButton}
          >
            <View style={styles.btn}>
              <Text style={styles.btnText}>
                {profilePicture
                  ? "Finalizar Configuración"
                  : "Omitir y Finalizar"}
              </Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.formFooterText}>
            Al continuar aceptas nuestros
          </Text>
          <View style={styles.formFooterLinks}>
            <TouchableOpacity>
              <Text style={styles.formFooterLinkText}>
                Términos de Servicio
              </Text>
            </TouchableOpacity>
            <Text style={styles.formFooterText}> y </Text>
            <TouchableOpacity>
              <Text style={styles.formFooterLinkText}>
                Política de Privacidad
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  formAction: {
    marginVertical: 24,
    marginTop: 16,
    marginBottom: 0,
  },
  formFooter: {
    marginTop: "auto",
    marginBottom: 24,
    alignItems: "center",
  },
  formFooterText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#889797",
    textAlign: "center",
  },
  formFooterLinks: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  formFooterLinkText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#f82e08",
    textDecorationLine: "underline",
    textDecorationColor: "#f82e08",
    textDecorationStyle: "solid",
  },
  avatarPreview: {
    width: 200,
    height: 200,
    marginTop: 24,
    marginBottom: 12,
    position: "relative",
    alignSelf: "center",
  },
  mascotContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#F82E08",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#f5f5f5",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarIcon: {
    fontSize: 80,
    color: "#889797",
  },
  avatarRemove: {
    position: "absolute",
    right: -4,
    top: -4,
    backgroundColor: "#F82E08",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  removeIcon: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  uploadOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    marginBottom: 12,
  },
  uploadOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff5f5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  uploadIcon: {
    fontSize: 20,
  },
  uploadOptionContent: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  uploadOptionLabel: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",
    color: "#1d2a32",
    marginBottom: 4,
  },
  uploadOptionDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: "#889797",
    letterSpacing: 0.16,
  },
  chevron: {
    fontSize: 20,
    color: "#889797",
    fontWeight: "bold",
  },
  completeButton: {
    width: "100%",
    marginBottom: 16,
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

export default ProfilePictureScreen;
