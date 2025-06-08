import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import Icon from "react-native-vector-icons/MaterialIcons";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  image: any;
  icon?: string;
}

interface OnboardingGuideProps {
  steps: OnboardingStep[];
  onComplete: () => void;
  onSkip: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const OnboardingGuide: React.FC<OnboardingGuideProps> = ({
  steps,
  onComplete,
  onSkip,
}) => {
  const theme = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const scrollViewRef = React.useRef<ScrollView>(null);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      scrollViewRef.current?.scrollTo({
        x: (currentStep + 1) * SCREEN_WIDTH,
        animated: true,
      });
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      scrollViewRef.current?.scrollTo({
        x: (currentStep - 1) * SCREEN_WIDTH,
        animated: true,
      });
    }
  };

  const handleScroll = (event: any) => {
    const newStep = Math.round(
      event.nativeEvent.contentOffset.x / SCREEN_WIDTH
    );
    if (newStep !== currentStep) {
      setCurrentStep(newStep);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.default },
      ]}
    >
      {/* Skip button */}
      <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
        <Text style={[styles.skipText, { color: theme.colors.text.secondary }]}>
          Omitir
        </Text>
      </TouchableOpacity>

      {/* Content */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {steps.map((step, index) => (
          <View key={step.id} style={[styles.step, { width: SCREEN_WIDTH }]}>
            <View style={styles.imageContainer}>
              <Image
                source={step.image}
                style={styles.image}
                resizeMode="contain"
              />
            </View>

            <View style={styles.content}>
              {step.icon && (
                <Icon
                  name={step.icon}
                  size={48}
                  color={theme.colors.primary.main}
                  style={styles.icon}
                />
              )}

              <Text
                style={[styles.title, { color: theme.colors.text.primary }]}
              >
                {step.title}
              </Text>

              <Text
                style={[
                  styles.description,
                  { color: theme.colors.text.secondary },
                ]}
              >
                {step.description}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigation}>
        {/* Progress dots */}
        <View style={styles.dots}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === currentStep
                      ? theme.colors.primary.main
                      : theme.colors.border,
                },
              ]}
            />
          ))}
        </View>

        {/* Navigation buttons */}
        <View style={styles.buttons}>
          {currentStep > 0 && (
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: theme.colors.background.paper },
              ]}
              onPress={handleBack}
            >
              <Text style={{ color: theme.colors.text.primary }}>Atrás</Text>
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
              {currentStep < steps.length - 1 ? "Siguiente" : "Comenzar"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: "absolute",
    top: 48,
    right: 16,
    zIndex: 1,
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    fontWeight: "500",
  },
  step: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "80%",
    height: "80%",
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: "center",
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  navigation: {
    padding: 24,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
});

export default OnboardingGuide;
