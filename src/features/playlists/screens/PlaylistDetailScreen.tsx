import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  EmptyState,
  ErrorView,
  Loader,
  ScreenContainer,
  ScreenHeader,
} from "../../../components";
import { playTrack, setQueue } from "../../player/playerSlice";
import type { PlaylistsStackParamList } from "../../../navigation/types";
import { fetchPlaylist } from "../playlistsSlice";
import { useTheme } from "../../../theme";
type Props = NativeStackScreenProps<PlaylistsStackParamList, "PlaylistDetail">;
export const PlaylistDetailScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const dispatch = useAppDispatch();
  const playlist = useAppSelector((state) => state.playlists.current);
  const { status, error } = useAppSelector((state) => state.playlists);
  const { colors } = useTheme();
  useEffect(() => {
    void dispatch(fetchPlaylist(route.params.playlistId));
  }, [dispatch, route.params.playlistId]);
  if (!playlist) {
    return (
      <ScreenContainer padded={false}>
        <ScreenHeader onBack={navigation.goBack} actionIcon="ellipsis-horizontal" />
        {status === "failed" ? (
          <ErrorView
            message={error ?? "Unable to load this playlist."}
            onRetry={() => void dispatch(fetchPlaylist(route.params.playlistId))}
          />
        ) : (
          <Loader label="Loading playlist…" />
        )}
      </ScreenContainer>
    );
  }
  return (
    <ScreenContainer padded={false}>
      <ScreenHeader onBack={navigation.goBack} actionIcon="ellipsis-horizontal" />
      <View style={styles.hero}>
        <Text style={[styles.title, { color: colors.text }]}>
          {playlist.name}
        </Text>
        <Text style={{ color: colors.textMuted }}>
          {playlist.tracks.length} songs
        </Text>
      </View>
      <FlatList
        data={playlist.tracks}
        keyExtractor={(track) => String(track.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => {
              dispatch(
                setQueue({ tracks: playlist.tracks, startIndex: index }),
              );
              dispatch(playTrack(item));
            }}
            style={styles.track}
          >
            <Image source={{ uri: item.cover_url }} style={styles.cover} />
            <View style={{ flex: 1 }}>
              <Text
                numberOfLines={1}
                style={[styles.trackTitle, { color: colors.text }]}
              >
                {item.title}
              </Text>
              <Text numberOfLines={1} style={{ color: colors.textMuted }}>
                {item.artist}
              </Text>
            </View>
            <Ionicons name="play-outline" size={22} color={colors.text} />
          </Pressable>
        )}
        ListEmptyComponent={
          <EmptyState
            title="No songs yet"
            message="Add songs to this playlist from your library."
          />
        }
      />
    </ScreenContainer>
  );
};
const styles = StyleSheet.create({
  hero: { marginHorizontal: 29, marginTop: 35, marginBottom: 23 },
  title: { fontSize: 27, fontWeight: "700", marginBottom: 6 },
  list: { padding: 29, paddingTop: 0, gap: 15 },
  track: { flexDirection: "row", alignItems: "center", gap: 13 },
  cover: { width: 55, height: 55, borderRadius: 7 },
  trackTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
});
