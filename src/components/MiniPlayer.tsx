import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { next, prev, setPlaying } from "../features/player/playerSlice";
import { pauseAudio, resumeAudio } from "../features/player/services/audioService";
import { useTheme } from "../theme";

/** Figma "Component 2": 66.5pt bar, flush square cover, full-bleed progress on the top edge. */
const BAR_HEIGHT = 66.5;
const COVER = 66.5;
const KNOB = 16.7;

export const MiniPlayer: React.FC = () => {
  const track = useAppSelector((state) => state.player.currentTrack);
  const isPlaying = useAppSelector((state) => state.player.isPlaying);
  const positionMs = useAppSelector((state) => state.player.positionMs);
  const durationMs = useAppSelector((state) => state.player.durationMs);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  // The Now Playing design has no mini player — it is the full-screen player.
  const isNowPlaying = useNavigationState((state) => {
    const findRoute = (node: typeof state): boolean => {
      const route = node?.routes?.[node.index ?? 0];
      if (!route) {
        return false;
      }
      if (route.name === "NowPlaying") {
        return true;
      }
      const nested = route.state as typeof state | undefined;
      return nested ? findRoute(nested) : false;
    };
    return findRoute(state);
  });

  if (!track || isNowPlaying) {
    return null;
  }

  const ratio = durationMs > 0 ? Math.min(1, Math.max(0, positionMs / durationMs)) : 0;
  const progressWidth: `${number}%` = `${ratio * 100}%`;

  const toggle = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      resumeAudio();
    }
    dispatch(setPlaying(!isPlaying));
  };

  const openNowPlaying = () =>
    navigation.navigate("Main", {
      screen: "Library",
      params: { screen: "NowPlaying" },
    } as never);

  return (
    <View
      style={[
        styles.wrap,
        { backgroundColor: colors.background, paddingBottom: insets.bottom },
      ]}
    >
      <View style={[styles.track, { backgroundColor: colors.track }]}>
        <View style={[styles.fill, { backgroundColor: colors.text, width: progressWidth }]} />
        <View
          style={[
            styles.knob,
            { backgroundColor: colors.text, left: progressWidth, marginLeft: -KNOB / 2 },
          ]}
        />
      </View>
      <View style={styles.row}>
        <Pressable accessibilityLabel="Open now playing" onPress={openNowPlaying}>
          <Image source={{ uri: track.cover_url }} style={styles.cover} />
        </Pressable>
        <Pressable style={styles.info} onPress={openNowPlaying}>
          <Text numberOfLines={1} style={[styles.title, { color: colors.text }]}>
            {track.title}
          </Text>
          <Text numberOfLines={1} style={[styles.artist, { color: colors.textMuted }]}>
            {track.artist}
          </Text>
        </Pressable>
        <Pressable accessibilityLabel="Previous" hitSlop={8} onPress={() => dispatch(prev())}>
          <Ionicons name="play-skip-back-outline" size={22} color={colors.text} />
        </Pressable>
        <Pressable
          accessibilityLabel={isPlaying ? "Pause" : "Play"}
          hitSlop={8}
          onPress={toggle}
        >
          <Ionicons
            name={isPlaying ? "pause-outline" : "play-outline"}
            size={24}
            color={colors.text}
          />
        </Pressable>
        <Pressable accessibilityLabel="Next" hitSlop={8} onPress={() => dispatch(next())}>
          <Ionicons name="play-skip-forward-outline" size={22} color={colors.text} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { paddingTop: KNOB / 2 },
  track: { height: 3, justifyContent: "center" },
  fill: { height: 3 },
  knob: {
    position: "absolute",
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
  },
  row: {
    height: BAR_HEIGHT,
    paddingRight: 28,
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  cover: { width: COVER, height: COVER },
  info: { flex: 1, paddingLeft: 13 },
  title: { fontSize: 18, fontWeight: "500" },
  artist: { fontSize: 10, marginTop: 4, textTransform: "uppercase", letterSpacing: 0.3 },
});
