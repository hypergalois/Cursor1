import React, { useEffect } from "react";
import { View, Image, StyleSheet, Animated, Easing } from "react-native";
import { useTheme } from "../theme/ThemeProvider";

type MinoState = "neutral" | "happy" | "angry";

interface MinoMascotProps {
  state?: MinoState;
  size?: number;
  animated?: boolean;
}

const MinoMascot: React.FC<MinoMascotProps> = ({
  state = "neutral",
  size = 200,
  animated = true,
}) => {
  const theme = useTheme();
  const bounceAnim = new Animated.Value(0);

  useEffect(() => {
    if (animated) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: theme.animation.timing.normal,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: theme.animation.timing.normal,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [animated]);

  const getMinoImage = () => {
    switch (state) {
      case "happy":
        return require("../assets/images/mino-happy.png");
      case "angry":
        return require("../assets/images/mino-angry.png");
      default:
        return require("../assets/images/mino-neutral.png");
    }
  };

  const translateY = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.imageContainer,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <Image
          source={getMinoImage()}
          style={[
            styles.image,
            {
              width: size,
              height: size,
            },
          ]}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default MinoMascot;
