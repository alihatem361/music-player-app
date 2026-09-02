import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useAppDispatch } from "../app/hooks";
import { playTrack, setQueue } from "../features/player/playerSlice";
import { useTheme } from "../theme";
import type { Track } from "../types";

interface Props {
  track: Track;
  /** Tracks that become the player queue when this tile is pressed. */
  queue?: Track[];
  /** Artwork edge: 190 on the Home carousels, 145 in the two-column grids. */
  size?: number;
}

export const SongTile: React.FC<Props> = ({ track, queue, size = 190 }) => {
  const dispatch = useAppDispatch();
  const { colors, radius } = useTheme();

  const play = () => {
    if (queue) {
      const startIndex = Math.max(
        0,
        queue.findIndex((item) => item.id === track.id),
      );
      dispatch(setQueue({ tracks: queue, startIndex }));
    }
    dispatch(playTrack(track));
  };

  return (
    <Pressable accessibilityRole="button" onPress={play} style={[styles.container, { width: size }]}>
      <View
        style={[
          styles.artwork,
          {
            width: size,
            height: size,
            borderRadius: radius.card,
            backgroundColor: colors.surfaceMuted,
          },
        ]}
      >
        <Image source={{ uri: track.cover_url }} style={styles.image} />
      </View>
      <Text numberOfLines={1} style={[styles.title, { color: colors.text }]}>
        {track.title}
      </Text>
      <Text numberOfLines={1} style={[styles.artist, { color: colors.textMuted }]}>
        {track.artist}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center" },
  artwork: { overflow: "hidden" },
  image: { width: "100%", height: "100%" },
  title: { marginTop: 15, fontSize: 16, fontWeight: "500" },
  artist: { marginTop: 5, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.4 },
});
