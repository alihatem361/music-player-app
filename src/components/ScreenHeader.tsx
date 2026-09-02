import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "../theme";

interface Props {
  onBack: () => void;
  onAction?: () => void;
  /** Right-hand glyph; the designs use the sliders icon. */
  actionIcon?: React.ComponentProps<typeof Ionicons>["name"];
  actionLabel?: string;
}

/** Back arrow + optional trailing action, as used by Liked Songs and Playlists. */
export const ScreenHeader: React.FC<Props> = ({
  onBack,
  onAction,
  actionIcon = "options-outline",
  actionLabel = "Filter",
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.header}>
      <Pressable accessibilityLabel="Go back" hitSlop={12} onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </Pressable>
      <Pressable accessibilityLabel={actionLabel} hitSlop={12} onPress={onAction}>
        <Ionicons name={actionIcon} size={24} color={colors.text} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 34,
    height: 24,
    paddingHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
