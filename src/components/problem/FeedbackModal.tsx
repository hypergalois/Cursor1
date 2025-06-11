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
  isCorrect: boolean;
  explanation: string;
  onContinue: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isCorrect,
  explanation,
  onContinue,
}) => {
  const theme = useTheme();
  const scaleAnim = new Animated.Value(0);
  const opacityAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Modal visible={true} transparent animationType="none">
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
              backgroundColor: theme.colors.background.paper,
            },
          ]}
        >
          <MinoMascot mood={isCorrect ? "happy" : "sad"} size={150} />

          <Text
            style={[styles.resultText, { color: theme.colors.text.primary }]}
          >
            {isCorrect ? "¡Correcto!" : "Incorrecto"}
          </Text>

          <Text
            style={[
              styles.explanationText,
              { color: theme.colors.text.secondary },
            ]}
          >
            {explanation}
          </Text>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: theme.colors.primary.main },
            ]}
            onPress={onContinue}
          >
            <Text
              style={[
                styles.buttonText,
                { color: theme.colors.primary.contrastText },
              ]}
            >
              Continuar
            </Text>
          </TouchableOpacity>
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
  explanationText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 120,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default FeedbackModal;
