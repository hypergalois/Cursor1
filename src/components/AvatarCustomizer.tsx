import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import Icon from "react-native-vector-icons/MaterialIcons";

interface AvatarPart {
  id: string;
  name: string;
  image: any;
}

interface AvatarCustomizerProps {
  onSave: (avatar: {
    face: string;
    hair: string;
    eyes: string;
    mouth: string;
    accessory: string;
  }) => void;
  onClose: () => void;
}

const AvatarCustomizer: React.FC<AvatarCustomizerProps> = ({
  onSave,
  onClose,
}) => {
  const theme = useTheme();
  const [selectedParts, setSelectedParts] = useState({
    face: "face1",
    hair: "hair1",
    eyes: "eyes1",
    mouth: "mouth1",
    accessory: "none",
  });

  // Mock data for avatar parts
  const avatarParts = {
    face: [
      {
        id: "face1",
        name: "Cara 1",
        image: require("../assets/avatar/face1.png"),
      },
      {
        id: "face2",
        name: "Cara 2",
        image: require("../assets/avatar/face2.png"),
      },
      {
        id: "face3",
        name: "Cara 3",
        image: require("../assets/avatar/face3.png"),
      },
    ],
    hair: [
      {
        id: "hair1",
        name: "Pelo 1",
        image: require("../assets/avatar/hair1.png"),
      },
      {
        id: "hair2",
        name: "Pelo 2",
        image: require("../assets/avatar/hair2.png"),
      },
      {
        id: "hair3",
        name: "Pelo 3",
        image: require("../assets/avatar/hair3.png"),
      },
    ],
    eyes: [
      {
        id: "eyes1",
        name: "Ojos 1",
        image: require("../assets/avatar/eyes1.png"),
      },
      {
        id: "eyes2",
        name: "Ojos 2",
        image: require("../assets/avatar/eyes2.png"),
      },
      {
        id: "eyes3",
        name: "Ojos 3",
        image: require("../assets/avatar/eyes3.png"),
      },
    ],
    mouth: [
      {
        id: "mouth1",
        name: "Boca 1",
        image: require("../assets/avatar/mouth1.png"),
      },
      {
        id: "mouth2",
        name: "Boca 2",
        image: require("../assets/avatar/mouth2.png"),
      },
      {
        id: "mouth3",
        name: "Boca 3",
        image: require("../assets/avatar/mouth3.png"),
      },
    ],
    accessory: [
      {
        id: "none",
        name: "Ninguno",
        image: require("../assets/avatar/none.png"),
      },
      {
        id: "glasses1",
        name: "Gafas 1",
        image: require("../assets/avatar/glasses1.png"),
      },
      {
        id: "hat1",
        name: "Sombrero 1",
        image: require("../assets/avatar/hat1.png"),
      },
    ],
  };

  const handlePartSelect = (category: string, partId: string) => {
    setSelectedParts((prev) => ({
      ...prev,
      [category]: partId,
    }));
  };

  const handleSave = () => {
    onSave(selectedParts);
    onClose();
  };

  const renderPartSelector = (category: string, parts: AvatarPart[]) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {parts.map((part) => (
          <TouchableOpacity
            key={part.id}
            style={[
              styles.partOption,
              {
                backgroundColor:
                  selectedParts[category as keyof typeof selectedParts] ===
                  part.id
                    ? theme.colors.primary.main
                    : theme.colors.background.default,
              },
            ]}
            onPress={() => handlePartSelect(category, part.id)}
          >
            <Image source={part.image} style={styles.partImage} />
            <Text
              style={[
                styles.partName,
                {
                  color:
                    selectedParts[category as keyof typeof selectedParts] ===
                    part.id
                      ? theme.colors.primary.contrastText
                      : theme.colors.text.primary,
                },
              ]}
            >
              {part.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.paper },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Personalizar Avatar
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon name="close" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Avatar Preview */}
      <View style={styles.previewContainer}>
        <View style={styles.avatarContainer}>
          <Image
            source={
              avatarParts.face.find((p) => p.id === selectedParts.face)?.image
            }
            style={styles.avatarBase}
          />
          <Image
            source={
              avatarParts.hair.find((p) => p.id === selectedParts.hair)?.image
            }
            style={styles.avatarLayer}
          />
          <Image
            source={
              avatarParts.eyes.find((p) => p.id === selectedParts.eyes)?.image
            }
            style={styles.avatarLayer}
          />
          <Image
            source={
              avatarParts.mouth.find((p) => p.id === selectedParts.mouth)?.image
            }
            style={styles.avatarLayer}
          />
          {selectedParts.accessory !== "none" && (
            <Image
              source={
                avatarParts.accessory.find(
                  (p) => p.id === selectedParts.accessory
                )?.image
              }
              style={styles.avatarLayer}
            />
          )}
        </View>
      </View>

      {/* Part Selectors */}
      <ScrollView style={styles.content}>
        {Object.entries(avatarParts).map(([category, parts]) =>
          renderPartSelector(category, parts)
        )}
      </ScrollView>

      {/* Save button */}
      <TouchableOpacity
        style={[
          styles.saveButton,
          { backgroundColor: theme.colors.primary.main },
        ]}
        onPress={handleSave}
      >
        <Text
          style={[
            styles.saveText,
            { color: theme.colors.primary.contrastText },
          ]}
        >
          Guardar Avatar
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 8,
  },
  previewContainer: {
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  avatarContainer: {
    width: 200,
    height: 200,
    position: "relative",
  },
  avatarBase: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  avatarLayer: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  partOption: {
    width: 100,
    height: 120,
    marginRight: 16,
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
  },
  partImage: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  partName: {
    fontSize: 14,
    textAlign: "center",
  },
  saveButton: {
    padding: 16,
    alignItems: "center",
    margin: 16,
    borderRadius: 8,
  },
  saveText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AvatarCustomizer;
