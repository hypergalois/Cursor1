import React from "react";
import { View, Text, StyleSheet, Switch, Slider } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import { useAudio } from "../context/AudioProvider";

const AudioSettings: React.FC = () => {
  const theme = useTheme();
  const {
    audioState,
    toggleMusic,
    toggleSound,
    setMusicVolume,
    setSoundVolume,
  } = useAudio();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.paper },
      ]}
    >
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>
        Configuración de Audio
      </Text>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.colors.text.primary }]}>
            Música de Fondo
          </Text>
          <Switch
            value={audioState.isMusicEnabled}
            onValueChange={toggleMusic}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primary.main,
            }}
            thumbColor={theme.colors.background.paper}
          />
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          step={0.1}
          value={audioState.musicVolume}
          onValueChange={setMusicVolume}
          minimumTrackTintColor={theme.colors.primary.main}
          maximumTrackTintColor={theme.colors.border}
          thumbTintColor={theme.colors.primary.main}
          disabled={!audioState.isMusicEnabled}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.colors.text.primary }]}>
            Efectos de Sonido
          </Text>
          <Switch
            value={audioState.isSoundEnabled}
            onValueChange={toggleSound}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primary.main,
            }}
            thumbColor={theme.colors.background.paper}
          />
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          step={0.1}
          value={audioState.soundVolume}
          onValueChange={setSoundVolume}
          minimumTrackTintColor={theme.colors.primary.main}
          maximumTrackTintColor={theme.colors.border}
          thumbTintColor={theme.colors.primary.main}
          disabled={!audioState.isSoundEnabled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    margin: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
  },
  slider: {
    width: "100%",
    height: 40,
  },
});

export default AudioSettings;
