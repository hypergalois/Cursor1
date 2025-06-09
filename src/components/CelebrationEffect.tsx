import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";

interface CelebrationEffectProps {
  onComplete?: () => void;
}

const CelebrationEffect: React.FC<CelebrationEffectProps> = ({
  onComplete,
}) => {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.play();
    }
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        ref={animationRef}
        source={require("../assets/animations/celebration.json")}
        style={styles.animation}
        autoPlay
        loop={false}
        onAnimationFinish={onComplete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  animation: {
    width: "100%",
    height: "100%",
  },
});

export default CelebrationEffect;
