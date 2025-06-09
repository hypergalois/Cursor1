import React, { createContext, useContext, useState, useEffect } from "react";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playMusic: (type: "background" | "success" | "error") => Promise<void>;
  stopMusic: () => Promise<void>;
  volume: number;
  setVolume: (volume: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [backgroundSound, setBackgroundSound] = useState<Audio.Sound | null>(
    null
  );

  useEffect(() => {
    loadAudioSettings();
    return () => {
      // Cleanup sound when component unmounts
      if (backgroundSound) {
        backgroundSound.unloadAsync();
      }
    };
  }, []);

  const loadAudioSettings = async () => {
    try {
      const savedMute = await AsyncStorage.getItem("@audio_muted");
      const savedVolume = await AsyncStorage.getItem("@audio_volume");

      if (savedMute !== null) {
        setIsMuted(JSON.parse(savedMute));
      }
      if (savedVolume !== null) {
        setVolume(JSON.parse(savedVolume));
      }
    } catch (error) {
      console.error("Error loading audio settings:", error);
    }
  };

  const saveAudioSettings = async () => {
    try {
      await AsyncStorage.setItem("@audio_muted", JSON.stringify(isMuted));
      await AsyncStorage.setItem("@audio_volume", JSON.stringify(volume));
    } catch (error) {
      console.error("Error saving audio settings:", error);
    }
  };

  const toggleMute = async () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    await saveAudioSettings();

    if (backgroundSound) {
      if (newMuteState) {
        await backgroundSound.setVolumeAsync(0);
      } else {
        await backgroundSound.setVolumeAsync(volume);
      }
    }
  };

  const playMusic = async (type: "background" | "success" | "error") => {
    if (isMuted) return;

    try {
      // Stop any existing background music
      if (backgroundSound) {
        await backgroundSound.stopAsync();
        await backgroundSound.unloadAsync();
      }

      // For now, we'll just log that we would play the sound
      console.log(`Would play ${type} sound`);
      return;

      // TODO: Add actual sound files to assets/audio/
      // let soundFile;
      // switch (type) {
      //   case "background":
      //     soundFile = require("../assets/audio/background.mp3");
      //     break;
      //   case "success":
      //     soundFile = require("../assets/audio/success.mp3");
      //     break;
      //   case "error":
      //     soundFile = require("../assets/audio/error.mp3");
      //     break;
      // }

      // const { sound } = await Audio.Sound.createAsync(soundFile, {
      //   isLooping: type === "background",
      //   volume: volume,
      // });

      // if (type === "background") {
      //   setBackgroundSound(sound);
      // }

      // await sound.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const stopMusic = async () => {
    try {
      if (backgroundSound) {
        await backgroundSound.stopAsync();
        await backgroundSound.unloadAsync();
        setBackgroundSound(null);
      }
    } catch (error) {
      console.error("Error stopping music:", error);
    }
  };

  const handleSetVolume = async (newVolume: number) => {
    setVolume(newVolume);
    await saveAudioSettings();

    if (backgroundSound && !isMuted) {
      await backgroundSound.setVolumeAsync(newVolume);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        isMuted,
        toggleMute,
        playMusic,
        stopMusic,
        volume,
        setVolume: handleSetVolume,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
