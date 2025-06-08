import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Slider,
} from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import Icon from "react-native-vector-icons/MaterialIcons";

interface DifficultySettingsProps {
  initialSettings: {
    level: "easy" | "medium" | "hard";
    timeLimit: number;
    hintsEnabled: boolean;
    showFeedback: boolean;
  };
  onSave: (settings: {
    level: "easy" | "medium" | "hard";
    timeLimit: number;
    hintsEnabled: boolean;
    showFeedback: boolean;
  }) => void;
  onClose: () => void;
}

const DifficultySettings: React.FC<DifficultySettingsProps> = ({
  initialSettings,
  onSave,
  onClose,
}) => {
  const theme = useTheme();
  const [settings, setSettings] = useState(initialSettings);

  const handleLevelChange = (level: "easy" | "medium" | "hard") => {
    setSettings((prev) => ({
      ...prev,
      level,
    }));
  };

  const handleTimeLimitChange = (value: number) => {
    setSettings((prev) => ({
      ...prev,
      timeLimit: value,
    }));
  };

  const handleHintsToggle = () => {
    setSettings((prev) => ({
      ...prev,
      hintsEnabled: !prev.hintsEnabled,
    }));
  };

  const handleFeedbackToggle = () => {
    setSettings((prev) => ({
      ...prev,
      showFeedback: !prev.showFeedback,
    }));
  };

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  const getLevelColor = (level: "easy" | "medium" | "hard") => {
    switch (level) {
      case "easy":
        return theme.colors.success.main;
      case "medium":
        return theme.colors.warning.main;
      case "hard":
        return theme.colors.error.main;
      default:
        return theme.colors.primary.main;
    }
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
          Configuración de Dificultad
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon name="close" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Difficulty Level */}
      <View style={styles.section}>
        <Text
          style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
        >
          Nivel de Dificultad
        </Text>
        <View style={styles.levelButtons}>
          {(["easy", "medium", "hard"] as const).map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.levelButton,
                {
                  backgroundColor:
                    settings.level === level
                      ? getLevelColor(level)
                      : theme.colors.background.default,
                },
              ]}
              onPress={() => handleLevelChange(level)}
            >
              <Text
                style={[
                  styles.levelText,
                  {
                    color:
                      settings.level === level
                        ? theme.colors.background.paper
                        : theme.colors.text.primary,
                  },
                ]}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Time Limit */}
      <View style={styles.section}>
        <Text
          style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
        >
          Límite de Tiempo: {settings.timeLimit} segundos
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={30}
          maximumValue={180}
          step={30}
          value={settings.timeLimit}
          onValueChange={handleTimeLimitChange}
          minimumTrackTintColor={theme.colors.primary.main}
          maximumTrackTintColor={theme.colors.border}
          thumbTintColor={theme.colors.primary.main}
        />
      </View>

      {/* Hints */}
      <View style={styles.section}>
        <View style={styles.switchRow}>
          <Text
            style={[styles.switchLabel, { color: theme.colors.text.primary }]}
          >
            Pistas Disponibles
          </Text>
          <Switch
            value={settings.hintsEnabled}
            onValueChange={handleHintsToggle}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primary.main,
            }}
            thumbColor={theme.colors.background.paper}
          />
        </View>
      </View>

      {/* Feedback */}
      <View style={styles.section}>
        <View style={styles.switchRow}>
          <Text
            style={[styles.switchLabel, { color: theme.colors.text.primary }]}
          >
            Mostrar Retroalimentación
          </Text>
          <Switch
            value={settings.showFeedback}
            onValueChange={handleFeedbackToggle}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primary.main,
            }}
            thumbColor={theme.colors.background.paper}
          />
        </View>
      </View>

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
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  levelButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  levelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  levelText: {
    fontSize: 16,
    fontWeight: "500",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  switchLabel: {
    fontSize: 16,
  },
  saveButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  saveText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DifficultySettings;
