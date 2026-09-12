import React from "react";
import { Image, Pressable, StyleSheet, Text } from "react-native";
import { useTheme } from "../theme";
import type { PlaylistSummary } from "../types";

/** The API carries no playlist artwork, so every card uses the Figma cover. */
const artwork = require("../../assets/figma/playlist-cover.jpeg");

interface Props {
  playlist: PlaylistSummary;
  onPress: () => void;
  /** Cover edge: 227 on the Playlists screen, 160 in the Home carousel. */
  size?: number;
}

export const PlaylistCard: React.FC<Props> = ({ playlist, onPress, size = 160 }) => {
  const { colors, radius } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.card, { width: size }]}
    >
      <Image
        source={artwork}
        style={{ width: size, height: size, borderRadius: radius.md }}
      />
      <Text numberOfLines={1} style={[styles.name, { color: colors.text }]}>
        {playlist.name}
      </Text>
      <Text style={[styles.count, { color: colors.textMuted }]}>
        {playlist.track_count} {playlist.track_count === 1 ? "song" : "songs"}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: { alignItems: "center" },
  name: { marginTop: 14, fontSize: 16, fontWeight: "500" },
  count: { marginTop: 5, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.4 },
});
