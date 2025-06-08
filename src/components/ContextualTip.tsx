import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import Icon from "react-native-vector-icons/MaterialIcons";

interface ContextualTipProps {
  message: string;
  type?: "info" | "success" | "warning" | "error";
  duration?: number;
  onClose?: () => void;
  position?: "top" | "bottom";
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const ContextualTip: React.FC<ContextualTipProps> = ({
  message,
  type = "info",
  duration = 5000,
  onClose,
  position = "top",
}) => {
  const theme = useTheme();
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide in animation
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss after duration
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: -100,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose?.();
    });
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return theme.colors.success.main;
      case "warning":
        return theme.colors.warning.main;
      case "error":
        return theme.colors.error.main;
      default:
        return theme.colors.info.main;
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return "check-circle";
      case "warning":
        return "warning";
      case "error":
        return "error";
      default:
        return "info";
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: position === "top" ? 0 : undefined,
          bottom: position === "bottom" ? 0 : undefined,
          backgroundColor: getBackgroundColor(),
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <View style={styles.content}>
        <Icon
          name={getIcon()}
          size={24}
          color={theme.colors.background.paper}
          style={styles.icon}
        />
        <Text
          style={[styles.message, { color: theme.colors.background.paper }]}
        >
          {message}
        </Text>
      </View>
      <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
        <Icon name="close" size={20} color={theme.colors.background.paper} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 1000,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 12,
  },
  message: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  closeButton: {
    padding: 4,
  },
});

export default ContextualTip;
