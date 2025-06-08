import React, { useEffect } from "react";
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
import MinoMascot from "./MinoMascot";

interface FeedbackModalProps {
  visible: boolean;
  isCorrect: boolean;
  score: number;
  onClose: () => void;
  onContinue: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  visible,
  isCorrect,
  score,
  onClose,
  onContinue,
}) => {
  const theme = useTheme();
  const scaleAnim = new Animated.Value(0);
  const opacityAnim = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
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
    } else {
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  const renderStars = () => {
    const stars: React.ReactNode[] = [];
    const maxStars = 3;
    const filledStars = Math.min(Math.floor(score / 2), maxStars);

    for (let i = 0; i < maxStars; i++) {
      stars.push(
        <Text
          key={i}
          style={[
            styles.star,
            {
              color:
                i < filledStars
                  ? theme.colors.status.warning
                  : theme.colors.text.secondary,
            },
          ]}
        >
          ★
        </Text>
      );
    }

    return <View style={styles.starsContainer}>{stars}</View>;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
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
          <MinoMascot
            state={isCorrect ? "happy" : "angry"}
            size={150}
            animated={true}
          />

          <Text
            style={[styles.resultText, { color: theme.colors.text.primary }]}
          >
            {isCorrect ? "¡Correcto!" : "Incorrecto"}
          </Text>

          <Text
            style={[styles.scoreText, { color: theme.colors.text.secondary }]}
          >
            Puntuación: {score} puntos
          </Text>

          {renderStars()}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: theme.colors.primary.main },
              ]}
              onPress={onContinue}
            >
              <Text style={styles.buttonText}>Continuar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: theme.colors.text.secondary },
              ]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  resultText: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 20,
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 24,
  },
  star: {
    fontSize: 32,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 120,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default FeedbackModal;
