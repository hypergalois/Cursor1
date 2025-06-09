import React, { useEffect } from "react";
import { Animated, StyleSheet, View } from "react-native";

interface ScreenTransitionProps {
  children: React.ReactNode;
  isVisible: boolean;
  duration?: number;
}

const ScreenTransition: React.FC<ScreenTransitionProps> = ({
  children,
  isVisible,
  duration = 300,
}) => {
  const fadeAnim = new Animated.Value(isVisible ? 1 : 0);
  const scaleAnim = new Animated.Value(isVisible ? 1 : 0.95);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: isVisible ? 1 : 0,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: isVisible ? 1 : 0.95,
        duration,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isVisible, duration]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default ScreenTransition;
