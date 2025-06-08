import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { useTheme } from "../theme/ThemeProvider";

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: "top" | "bottom" | "left" | "right";
}

interface TutorialOverlayProps {
  steps: TutorialStep[];
  onComplete: () => void;
  onSkip: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  steps,
  onComplete,
  onSkip,
}) => {
  const theme = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [targetPosition, setTargetPosition] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    // Find the target element and get its position
    const targetElement = document.getElementById(steps[currentStep].target);
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      setTargetPosition({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      });
    }

    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const getTooltipPosition = () => {
    const { position } = steps[currentStep];
    const { x, y, width, height } = targetPosition;
    const TOOLTIP_MARGIN = 16;

    switch (position) {
      case "top":
        return {
          top: y - TOOLTIP_MARGIN,
          left: x + width / 2,
          transform: [{ translateX: -100 }],
        };
      case "bottom":
        return {
          top: y + height + TOOLTIP_MARGIN,
          left: x + width / 2,
          transform: [{ translateX: -100 }],
        };
      case "left":
        return {
          top: y + height / 2,
          left: x - TOOLTIP_MARGIN,
          transform: [{ translateX: -200 }],
        };
      case "right":
        return {
          top: y + height / 2,
          left: x + width + TOOLTIP_MARGIN,
        };
      default:
        return {};
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.overlay }]}>
      {/* Highlight target */}
      <View
        style={[
          styles.highlight,
          {
            top: targetPosition.y,
            left: targetPosition.x,
            width: targetPosition.width,
            height: targetPosition.height,
            borderColor: theme.colors.primary.main,
          },
        ]}
      />

      {/* Tooltip */}
      <Animated.View
        style={[
          styles.tooltip,
          getTooltipPosition(),
          {
            backgroundColor: theme.colors.background.paper,
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          {steps[currentStep].title}
        </Text>
        <Text
          style={[styles.description, { color: theme.colors.text.secondary }]}
        >
          {steps[currentStep].description}
        </Text>

        {/* Navigation buttons */}
        <View style={styles.navigation}>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: theme.colors.background.default },
            ]}
            onPress={onSkip}
          >
            <Text style={{ color: theme.colors.text.secondary }}>Omitir</Text>
          </TouchableOpacity>

          <View style={styles.stepButtons}>
            {currentStep > 0 && (
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: theme.colors.background.default },
                ]}
                onPress={handleBack}
              >
                <Text style={{ color: theme.colors.text.secondary }}>
                  Atrás
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: theme.colors.primary.main },
              ]}
              onPress={handleNext}
            >
              <Text style={{ color: theme.colors.primary.contrastText }}>
                {currentStep < steps.length - 1 ? "Siguiente" : "Finalizar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  highlight: {
    position: "absolute",
    borderWidth: 2,
    borderRadius: 8,
  },
  tooltip: {
    position: "absolute",
    width: 280,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepButtons: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
});

export default TutorialOverlay;
