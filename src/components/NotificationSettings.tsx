import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
} from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import Icon from "react-native-vector-icons/MaterialIcons";

interface NotificationSettingsProps {
  initialSettings: {
    dailyReminder: boolean;
    achievementAlerts: boolean;
    levelUpNotifications: boolean;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
  };
  onSave: (settings: {
    dailyReminder: boolean;
    achievementAlerts: boolean;
    levelUpNotifications: boolean;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
  }) => void;
  onClose: () => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  initialSettings,
  onSave,
  onClose,
}) => {
  const theme = useTheme();
  const [settings, setSettings] = useState(initialSettings);

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
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
          Configuración de Notificaciones
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon name="close" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Notification Types */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
          >
            Tipos de Notificaciones
          </Text>
          {renderSettingRow(
            "Recordatorio Diario",
            "Recibe un recordatorio diario para practicar",
            "dailyReminder",
            "notifications"
          )}
          {renderSettingRow(
            "Logros",
            "Notificaciones cuando desbloquees logros",
            "achievementAlerts",
            "emoji-events"
          )}
          {renderSettingRow(
            "Subida de Nivel",
            "Notificaciones cuando subas de nivel",
            "levelUpNotifications",
            "trending-up"
          )}
        </View>

        {/* Notification Preferences */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
          >
            Preferencias
          </Text>
          {renderSettingRow(
            "Sonido",
            "Activar sonidos en las notificaciones",
            "soundEnabled",
            "volume-up"
          )}
          {renderSettingRow(
            "Vibración",
            "Activar vibración en las notificaciones",
            "vibrationEnabled",
            "vibration"
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

export default NotificationSettings;
