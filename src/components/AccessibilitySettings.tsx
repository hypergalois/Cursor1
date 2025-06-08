import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Slider,
} from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import Icon from "react-native-vector-icons/MaterialIcons";

interface AccessibilitySettingsProps {
  initialSettings: {
    highContrast: boolean;
    largeText: boolean;
    screenReader: boolean;
    reducedMotion: boolean;
    textSize: number;
    soundEnabled: boolean;
    hapticFeedback: boolean;
  };
  onSave: (settings: {
    highContrast: boolean;
    largeText: boolean;
    screenReader: boolean;
    reducedMotion: boolean;
    textSize: number;
    soundEnabled: boolean;
    hapticFeedback: boolean;
  }) => void;
  onClose: () => void;
}

const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({
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

  const handleTextSizeChange = (value: number) => {
    setSettings((prev) => ({
      ...prev,
      textSize: value,
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
          Configuración de Accesibilidad
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon name="close" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Visual Settings */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
          >
            Configuración Visual
          </Text>
          {renderSettingRow(
            "Alto Contraste",
            "Mejora el contraste de colores",
            "highContrast",
            "contrast"
          )}
          {renderSettingRow(
            "Texto Grande",
            "Aumenta el tamaño del texto",
            "largeText",
            "format-size"
          )}
          {renderSettingRow(
            "Lector de Pantalla",
            "Activa el soporte para lectores de pantalla",
            "screenReader",
            "record-voice-over"
          )}
          {renderSettingRow(
            "Reducir Movimiento",
            "Minimiza las animaciones",
            "reducedMotion",
            "motion-photos-off"
          )}
        </View>

        {/* Text Size Slider */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
          >
            Tamaño del Texto
          </Text>
          <View style={styles.sliderContainer}>
            <Icon
              name="format-size"
              size={24}
              color={theme.colors.text.secondary}
            />
            <Slider
              style={styles.slider}
              minimumValue={0.8}
              maximumValue={1.5}
              step={0.1}
              value={settings.textSize}
              onValueChange={handleTextSizeChange}
              minimumTrackTintColor={theme.colors.primary.main}
              maximumTrackTintColor={theme.colors.border}
              thumbTintColor={theme.colors.primary.main}
            />
            <Icon
              name="format-size"
              size={32}
              color={theme.colors.text.secondary}
            />
          </View>
          <Text
            style={[styles.sliderValue, { color: theme.colors.text.secondary }]}
          >
            {Math.round(settings.textSize * 100)}%
          </Text>
        </View>

        {/* Interaction Settings */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
          >
            Configuración de Interacción
          </Text>
          {renderSettingRow(
            "Sonido",
            "Activa los efectos de sonido",
            "soundEnabled",
            "volume-up"
          )}
          {renderSettingRow(
            "Retroalimentación Háptica",
            "Activa la vibración al tocar",
            "hapticFeedback",
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
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  slider: {
    flex: 1,
    marginHorizontal: 16,
  },
  sliderValue: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 8,
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

export default AccessibilitySettings;
