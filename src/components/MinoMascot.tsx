import React from "react";
import { Image, StyleSheet, View } from "react-native";

interface MinoMascotProps {
  mood?: "happy" | "neutral" | "sad";
  size?: number;
}

const MinoMascot: React.FC<MinoMascotProps> = ({
  mood = "neutral",
  size = 200,
}) => {
  const getImageSource = () => {
    switch (mood) {
      case "happy":
        return require("../assets/images/mino-happy.png");
      case "sad":
        return require("../assets/images/mino-sad.png");
      default:
        return require("../assets/images/mino-neutral.png");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={getImageSource()}
        style={[styles.image, { width: size, height: size }]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default MinoMascot;
