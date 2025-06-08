import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
} from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import Icon from "react-native-vector-icons/MaterialIcons";

interface PrivacySettingsProps {
  initialSettings: {
    profileVisibility: "public" | "friends" | "private";
    showProgress: boolean;
    showAchievements: boolean;
    allowFriendRequests: boolean;
    dataCollection: boolean;
  };
  onSave: (settings: {
    profileVisibility: "public" | "friends" | "private";
    showProgress: boolean;
    showAchievements: boolean;
    allowFriendRequests: boolean;
    dataCollection: boolean;
  }) => void;
  onClose: () => void;
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({
  initialSettings,
  onSave,
  onClose,
}) => {
  const theme = useTheme();
  const [settings, setSettings] = useState(initialSettings);

  const handleVisibilityChange = (
    visibility: "public" | "friends" | "private"
  ) => {
    setSettings((prev) => ({
      ...prev,
      profileVisibility: visibility,
    }));
  };

  const handleToggle = (setting: keyof typeof settings) => {
    if (setting === "dataCollection") {
      Alert.alert(
        "Recopilación de Datos",
        "¿Estás seguro de que deseas cambiar la configuración de recopilación de datos? Esto puede afectar la personalización de tu experiencia.",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Cambiar",
            onPress: () =>
              setSettings((prev) => ({
                ...prev,
                [setting]: !prev[setting],
              })),
          },
        ]
      );
    } else {
      setSettings((prev) => ({
        ...prev,
        [setting]: !prev[setting],
      }));
    }
  };

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  const renderSettingRow = (
    title: string,
    description: string,
    setting: keyof typeof settings,
    icon: string
  ) => (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Icon
          name={icon}
          size={24}
          color={theme.colors.primary.main}
          style={styles.settingIcon}
        />
        <View style={styles.settingText}>
          <Text
            style={[styles.settingTitle, { color: theme.colors.text.primary }]}
          >
            {title}
          </Text>
          <Text
            style={[
              styles.settingDescription,
              { color: theme.colors.text.secondary },
            ]}
          >
            {description}
          </Text>
        </View>
      </View>
      <Switch
        value={settings[setting]}
        onValueChange={() => handleToggle(setting)}
        trackColor={{
          false: theme.colors.border,
          true: theme.colors.primary.main,
        }}
        thumbColor={theme.colors.background.paper}
      />
    </View>
  );

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
          Configuración de Privacidad
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon name="close" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Visibility */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
          >
            Visibilidad del Perfil
          </Text>
          <View style={styles.visibilityOptions}>
            {(["public", "friends", "private"] as const).map((visibility) => (
              <TouchableOpacity
                key={visibility}
                style={[
                  styles.visibilityOption,
                  {
                    backgroundColor:
                      settings.profileVisibility === visibility
                        ? theme.colors.primary.main
                        : theme.colors.background.default,
                  },
                ]}
                onPress={() => handleVisibilityChange(visibility)}
              >
                <Icon
                  name={
                    visibility === "public"
                      ? "public"
                      : visibility === "friends"
                      ? "people"
                      : "lock"
                  }
                  size={24}
                  color={
                    settings.profileVisibility === visibility
                      ? theme.colors.primary.contrastText
                      : theme.colors.text.primary
                  }
                />
                <Text
                  style={[
                    styles.visibilityText,
                    {
                      color:
                        settings.profileVisibility === visibility
                          ? theme.colors.primary.contrastText
                          : theme.colors.text.primary,
                    },
                  ]}
                >
                  {visibility === "public"
                    ? "Público"
                    : visibility === "friends"
                    ? "Amigos"
                    : "Privado"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Privacy Options */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
          >
            Opciones de Privacidad
          </Text>
          {renderSettingRow(
            "Mostrar Progreso",
            "Permitir que otros vean tu progreso",
            "showProgress",
            "trending-up"
          )}
          {renderSettingRow(
            "Mostrar Logros",
            "Permitir que otros vean tus logros",
            "showAchievements",
            "emoji-events"
          )}
          {renderSettingRow(
            "Solicitudes de Amistad",
            "Permitir solicitudes de amistad",
            "allowFriendRequests",
            "person-add"
          )}
        </View>

        {/* Data Collection */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
          >
            Recopilación de Datos
          </Text>
          {renderSettingRow(
            "Análisis de Uso",
            "Permitir la recopilación de datos de uso",
            "dataCollection",
            "analytics"
          )}
        </View>
      </ScrollView>

      {/* Save button */}
      <TouchableOpacity
        style={[
          styles.saveButton,
          { backgroundColor: theme.colors.primary.main },
        ]}
        onPress={handleSave}
      >
        <Text
          style={[
            styles.saveText,
            { color: theme.colors.primary.contrastText },
          ]}
        >
          Guardar Configuración
        </Text>
      </TouchableOpacity>
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
  visibilityOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  visibilityOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  visibilityText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
  saveButton: {
    padding: 16,
    alignItems: "center",
    margin: 16,
    borderRadius: 8,
  },
  saveText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PrivacySettings;
