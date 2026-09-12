import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "../theme";

interface Props {
  onBack: () => void;
  onAction?: () => void;
  /**
   * Right-hand glyph. Omit it entirely for screens with no trailing control —
   * a spacer keeps the title centred. Some designs show a decorative icon with
   * no behaviour yet, which is why this is independent of `onAction`.
   */
  actionIcon?: React.ComponentProps<typeof Ionicons>["name"];
  actionLabel?: string;
}

/** Back arrow + optional trailing action, as used by Liked Songs and Playlists. */
export const ScreenHeader: React.FC<Props> = ({
  onBack,
  onAction,
  actionIcon,
  actionLabel = "Filter",
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.header}>
      <Pressable accessibilityLabel="Go back" hitSlop={12} onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </Pressable>
      {actionIcon ? (
        <Pressable
          accessibilityLabel={actionLabel}
          disabled={!onAction}
          hitSlop={12}
          onPress={onAction}
        >
          <Ionicons name={actionIcon} size={24} color={colors.text} />
        </Pressable>
      ) : (
        <View style={styles.spacer} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  spacer: { width: 24 },
  header: {
    marginTop: 34,
    height: 24,
    paddingHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
