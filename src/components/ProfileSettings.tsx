import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import Icon from "react-native-vector-icons/MaterialIcons";

interface ProfileSettingsProps {
  initialProfile: {
    username: string;
    email: string;
    bio: string;
    avatar: {
      face: string;
      hair: string;
      eyes: string;
      mouth: string;
      accessory: string;
    };
  };
  onSave: (profile: {
    username: string;
    email: string;
    bio: string;
    avatar: {
      face: string;
      hair: string;
      eyes: string;
      mouth: string;
      accessory: string;
    };
  }) => void;
  onClose: () => void;
  onAvatarEdit: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  initialProfile,
  onSave,
  onClose,
  onAvatarEdit,
}) => {
  const theme = useTheme();
  const [profile, setProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(profile);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setProfile(initialProfile);
    setIsEditing(false);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.paper },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Configuración de Perfil
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon name="close" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Avatar Section */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
          >
            Avatar
          </Text>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={onAvatarEdit}
          >
            <View style={styles.avatarPreview}>
              <Image
                source={require("../assets/avatar/face1.png")}
                style={styles.avatarBase}
              />
              <Image
                source={require("../assets/avatar/hair1.png")}
                style={styles.avatarLayer}
              />
              <Image
                source={require("../assets/avatar/eyes1.png")}
                style={styles.avatarLayer}
              />
              <Image
                source={require("../assets/avatar/mouth1.png")}
                style={styles.avatarLayer}
              />
              {profile.avatar.accessory !== "none" && (
                <Image
                  source={require("../assets/avatar/glasses1.png")}
                  style={styles.avatarLayer}
                />
              )}
            </View>
            <Text
              style={[styles.editText, { color: theme.colors.primary.main }]}
            >
              Editar Avatar
            </Text>
          </TouchableOpacity>
        </View>

        {/* Profile Information */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
          >
            Información Personal
          </Text>

          {/* Username */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text.primary }]}>
              Nombre de Usuario
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.background.default,
                  color: theme.colors.text.primary,
                  borderColor: theme.colors.border,
                },
              ]}
              value={profile.username}
              onChangeText={(value) => handleInputChange("username", value)}
              editable={isEditing}
              placeholder="Ingresa tu nombre de usuario"
              placeholderTextColor={theme.colors.text.secondary}
            />
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text.primary }]}>
              Correo Electrónico
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.background.default,
                  color: theme.colors.text.primary,
                  borderColor: theme.colors.border,
                },
              ]}
              value={profile.email}
              onChangeText={(value) => handleInputChange("email", value)}
              editable={isEditing}
              placeholder="Ingresa tu correo electrónico"
              placeholderTextColor={theme.colors.text.secondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Bio */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text.primary }]}>
              Biografía
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.bioInput,
                {
                  backgroundColor: theme.colors.background.default,
                  color: theme.colors.text.primary,
                  borderColor: theme.colors.border,
                },
              ]}
              value={profile.bio}
              onChangeText={(value) => handleInputChange("bio", value)}
              editable={isEditing}
              placeholder="Cuéntanos sobre ti"
              placeholderTextColor={theme.colors.text.secondary}
              multiline
              numberOfLines={4}
            />
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actions}>
        {isEditing ? (
          <>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: theme.colors.text.primary },
                ]}
              >
                Cancelar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.saveButton,
                { backgroundColor: theme.colors.primary.main },
              ]}
              onPress={handleSave}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: theme.colors.primary.contrastText },
                ]}
              >
                Guardar
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[
              styles.button,
              styles.editButton,
              { backgroundColor: theme.colors.primary.main },
            ]}
            onPress={handleEdit}
          >
            <Text
              style={[
                styles.buttonText,
                { color: theme.colors.primary.contrastText },
              ]}
            >
              Editar Perfil
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  avatarContainer: {
    alignItems: "center",
  },
  avatarPreview: {
    width: 120,
    height: 120,
    position: "relative",
    marginBottom: 8,
  },
  avatarBase: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  avatarLayer: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  editText: {
    fontSize: 16,
    fontWeight: "500",
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  bioInput: {
    height: 120,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  editButton: {
    marginHorizontal: 0,
  },
  cancelButton: {
    backgroundColor: "#E0E0E0",
  },
  saveButton: {
    marginLeft: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default ProfileSettings;
