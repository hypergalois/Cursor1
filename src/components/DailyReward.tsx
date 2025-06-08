import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import { useGameState } from "../context/GameStateProvider";
import MinoMascot from "./MinoMascot";

const DailyReward: React.FC = () => {
  const theme = useTheme();
  const { gameState, claimDailyReward } = useGameState();
  const [showModal, setShowModal] = useState(false);
  const [canClaim, setCanClaim] = useState(false);
  const scaleAnim = new Animated.Value(0);
  const opacityAnim = new Animated.Value(0);

  useEffect(() => {
    checkDailyReward();
  }, []);

  const checkDailyReward = () => {
    const today = new Date().toISOString().split("T")[0];
    setCanClaim(gameState.lastDailyReward !== today);
  };

  const handleClaim = async () => {
    const claimed = await claimDailyReward();
    if (claimed) {
      setShowModal(true);
      animateModal();
    }
  };

  const animateModal = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: theme.animation.timing.normal,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: theme.animation.timing.normal,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: theme.animation.timing.normal,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: theme.animation.timing.normal,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowModal(false);
    });
  };

  if (!canClaim) return null;

  return (
    <>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary.main }]}
        onPress={handleClaim}
      >
        <Text style={styles.buttonText}>🎁 Reclamar Recompensa Diaria</Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent
        animationType="none"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
              },
            ]}
          >
            <MinoMascot state="happy" size={150} animated={true} />

            <Text style={[styles.title, { color: theme.colors.text.primary }]}>
              ¡Recompensa Diaria!
            </Text>

            <View style={styles.rewardsContainer}>
              <Text
                style={[
                  styles.rewardText,
                  { color: theme.colors.text.secondary },
                ]}
              >
                💡 +1 Pista
              </Text>
              <Text
                style={[
                  styles.rewardText,
                  { color: theme.colors.text.secondary },
                ]}
              >
                ⭐ +50 XP
              </Text>
              <Text
                style={[
                  styles.rewardText,
                  { color: theme.colors.text.secondary },
                ]}
              >
                🔥 Racha: {gameState.streak} días
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.closeButton,
                { backgroundColor: theme.colors.primary.main },
              ]}
              onPress={closeModal}
            >
              <Text style={styles.closeButtonText}>¡Gracias!</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    margin: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    width: "80%",
    maxWidth: 400,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 24,
  },
  rewardsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  rewardText: {
    fontSize: 18,
    textAlign: "center",
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DailyReward;
