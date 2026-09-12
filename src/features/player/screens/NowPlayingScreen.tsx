import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { EmptyState, PlaylistPickerSheet, ScreenContainer } from "../../../components";
import { toggleLike } from "../../favorites/favoritesSlice";
import { useTheme } from "../../../theme";
import { formatDuration } from "../../../utils";
import { ArtworkCarousel } from "../components/ArtworkCarousel";
import { cycleRepeat, next, prev, setPlaying, setQueue, toggleShuffle } from "../playerSlice";
import { pauseAudio, resumeAudio } from "../services/audioService";

const KNOB = 17;

export const NowPlayingScreen: React.FC = () => {
  const player = useAppSelector((state) => state.player);
  const likedIds = useAppSelector((state) => state.favorites.likedIds);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [picker, setPicker] = useState(false);

  const track = player.currentTrack;

  const handleIndexChange = useCallback(
    (index: number) => {
      const target = player.queue[index];
      if (!target) {
        return;
      }
      dispatch(setQueue({ tracks: player.queue, startIndex: index }));
    },
    [dispatch, player.queue],
  );

  if (!track) {
    return (
      <ScreenContainer>
        <EmptyState title="Nothing playing" message="Choose a song to start listening." />
      </ScreenContainer>
    );
  }

  const durationSeconds = player.durationMs > 0 ? player.durationMs / 1000 : track.duration;
  const ratio =
    player.durationMs > 0
      ? Math.min(1, Math.max(0, player.positionMs / player.durationMs))
      : 0;
  const progressWidth: `${number}%` = `${ratio * 100}%`;
  const isLiked = likedIds.includes(track.id);

  const togglePlayback = () => {
    if (player.isPlaying) {
      pauseAudio();
    } else {
      resumeAudio();
    }
    dispatch(setPlaying(!player.isPlaying));
  };

  return (
    <ScreenContainer padded={false}>
      <View style={styles.header}>
        <Pressable accessibilityLabel="Go back" hitSlop={12} onPress={navigation.goBack}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Playing Now</Text>
        <Pressable
          accessibilityLabel="More options"
          hitSlop={12}
          onPress={() => setPicker(true)}
          style={styles.headerSpacer}
        >
          <Ionicons name="ellipsis-horizontal" size={24} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.carousel}>
        <ArtworkCarousel
          queue={player.queue.length ? player.queue : [track]}
          currentIndex={player.currentIndex >= 0 ? player.currentIndex : 0}
          onIndexChange={handleIndexChange}
        />
      </View>

      <View style={styles.trackRow}>
        <View style={styles.trackText}>
          <Text numberOfLines={1} style={[styles.title, { color: colors.text }]}>
            {track.title}
          </Text>
          <Text numberOfLines={1} style={[styles.artist, { color: colors.textMuted }]}>
            {track.artist}
          </Text>
        </View>
        <Pressable
          accessibilityLabel={isLiked ? "Unlike" : "Like"}
          hitSlop={12}
          onPress={() => dispatch(toggleLike(track))}
          style={styles.like}
        >
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={20}
            color={isLiked ? colors.like : colors.textMuted}
          />
        </Pressable>
      </View>

      <View style={styles.modes}>
        <Ionicons name="volume-low-outline" size={20} color={colors.textMuted} />
        <View style={styles.rightModes}>
          <Pressable
            accessibilityLabel={`Repeat ${player.repeat}`}
            hitSlop={10}
            onPress={() => dispatch(cycleRepeat())}
          >
            <Ionicons
              name={player.repeat === "one" ? "repeat" : "repeat-outline"}
              size={20}
              color={player.repeat === "off" ? colors.textMuted : colors.text}
            />
          </Pressable>
          <Pressable
            accessibilityLabel="Shuffle"
            hitSlop={10}
            onPress={() => dispatch(toggleShuffle())}
          >
            <Ionicons
              name="shuffle-outline"
              size={20}
              color={player.shuffle ? colors.text : colors.textMuted}
            />
          </Pressable>
        </View>
      </View>

      <View style={styles.timeRow}>
        <Text style={[styles.time, { color: colors.text }]}>
          {formatDuration(player.positionMs / 1000)}
        </Text>
        <Text style={[styles.time, { color: colors.text }]}>
          {formatDuration(durationSeconds)}
        </Text>
      </View>

      <View style={[styles.bar, { backgroundColor: colors.track }]}>
        <View style={[styles.fill, { backgroundColor: colors.text, width: progressWidth }]} />
        <View
          style={[
            styles.knob,
            { backgroundColor: colors.text, left: progressWidth, marginLeft: -KNOB / 2 },
          ]}
        />
      </View>

      <View style={styles.controls}>
        <Pressable accessibilityLabel="Previous" hitSlop={10} onPress={() => dispatch(prev())}>
          <Ionicons name="play-skip-back-outline" size={30} color={colors.text} />
        </Pressable>
        <Pressable
          accessibilityLabel={player.isPlaying ? "Pause" : "Play"}
          hitSlop={10}
          onPress={togglePlayback}
        >
          <Ionicons
            name={player.isPlaying ? "pause-outline" : "play-outline"}
            size={38}
            color={colors.text}
          />
        </Pressable>
        <Pressable accessibilityLabel="Next" hitSlop={10} onPress={() => dispatch(next())}>
          <Ionicons name="play-skip-forward-outline" size={30} color={colors.text} />
        </Pressable>
      </View>

      <PlaylistPickerSheet
        visible={picker}
        trackIds={[track.id]}
        onClose={() => setPicker(false)}
      />
    </ScreenContainer>
  );
};

// Spacing mirrors Figma node 1:500 (375x815 frame).
const styles = StyleSheet.create({
  header: {
    height: 24,
    marginTop: 34,
    paddingHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 20, fontWeight: "600" },
  headerSpacer: { width: 24 },
  carousel: { marginTop: 61 },
  trackRow: {
    marginTop: 28,
    paddingLeft: 30,
    paddingRight: 29,
    flexDirection: "row",
    alignItems: "center",
  },
  trackText: { flex: 1, alignItems: "center", paddingLeft: 20 },
  title: { fontSize: 24, fontWeight: "500" },
  artist: { fontSize: 16, marginTop: 6, letterSpacing: 0.2, textTransform: "uppercase" },
  like: { width: 20, alignItems: "flex-end" },
  modes: {
    marginTop: 40,
    paddingHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rightModes: { flexDirection: "row", gap: 12 },
  timeRow: {
    marginTop: 61,
    paddingHorizontal: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  time: { fontSize: 12 },
  bar: { height: 3, marginHorizontal: 29, marginTop: 37, justifyContent: "center" },
  fill: { height: 3 },
  knob: { position: "absolute", width: KNOB, height: KNOB, borderRadius: KNOB / 2 },
  controls: {
    marginTop: 62,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 38,
  },
});
