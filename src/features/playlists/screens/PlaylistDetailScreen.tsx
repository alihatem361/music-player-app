import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  EmptyState,
  ErrorView,
  Loader,
  NameInputDialog,
  ScreenContainer,
  ScreenHeader,
  SheetModal,
} from "../../../components";
import type { PlaylistsStackParamList } from "../../../navigation/types";
import { useTheme } from "../../../theme";
import { playTrack, setQueue } from "../../player/playerSlice";
import { AddSongsSheet } from "../components/AddSongsSheet";
import {
  deletePlaylist,
  fetchPlaylist,
  removeTrackFromPlaylist,
  renamePlaylist,
} from "../playlistsSlice";

type Props = NativeStackScreenProps<PlaylistsStackParamList, "PlaylistDetail">;

export const PlaylistDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const dispatch = useAppDispatch();
  const playlist = useAppSelector((state) => state.playlists.current);
  const { status, error } = useAppSelector((state) => state.playlists);
  const { colors, spacing, typography } = useTheme();
  const [actions, setActions] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [addingSongs, setAddingSongs] = useState(false);

  const { playlistId } = route.params;

  useEffect(() => {
    void dispatch(fetchPlaylist(playlistId));
  }, [dispatch, playlistId]);

  const rename = async (name: string) => {
    await dispatch(renamePlaylist({ id: playlistId, name })).unwrap();
    setRenaming(false);
  };

  const confirmDelete = () => {
    setActions(false);
    Alert.alert("Delete playlist", "This can't be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          void (async () => {
            try {
              await dispatch(deletePlaylist(playlistId)).unwrap();
              navigation.goBack();
            } catch (caught) {
              Alert.alert(
                "Could not delete",
                caught instanceof Error ? caught.message : String(caught),
              );
            }
          })();
        },
      },
    ]);
  };

  const removeTrack = (trackId: number) => {
    void (async () => {
      try {
        await dispatch(removeTrackFromPlaylist({ playlistId, trackId })).unwrap();
      } catch (caught) {
        Alert.alert(
          "Could not remove song",
          caught instanceof Error ? caught.message : String(caught),
        );
      }
    })();
  };

  if (!playlist) {
    return (
      <ScreenContainer padded={false}>
        <ScreenHeader onBack={navigation.goBack} />
        {status === "failed" ? (
          <ErrorView
            message={error ?? "Unable to load this playlist."}
            onRetry={() => void dispatch(fetchPlaylist(playlistId))}
          />
        ) : (
          <Loader label="Loading playlist…" />
        )}
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer padded={false}>
      <ScreenHeader
        onBack={navigation.goBack}
        onAction={() => setActions(true)}
        actionIcon="ellipsis-horizontal"
        actionLabel="Playlist options"
      />
      <View style={styles.hero}>
        <Text style={[styles.title, { color: colors.text }]}>{playlist.name}</Text>
        <Text style={{ color: colors.textMuted }}>
          {playlist.tracks.length} {playlist.tracks.length === 1 ? "song" : "songs"}
        </Text>
      </View>
      <FlatList
        data={playlist.tracks}
        keyExtractor={(track) => String(track.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => {
              dispatch(setQueue({ tracks: playlist.tracks, startIndex: index }));
              dispatch(playTrack(item));
            }}
            style={styles.track}
          >
            <Image source={{ uri: item.cover_url }} style={styles.cover} />
            <View style={styles.trackText}>
              <Text numberOfLines={1} style={[styles.trackTitle, { color: colors.text }]}>
                {item.title}
              </Text>
              <Text numberOfLines={1} style={{ color: colors.textMuted }}>
                {item.artist}
              </Text>
            </View>
            <Pressable
              accessibilityLabel={`Remove ${item.title}`}
              hitSlop={10}
              onPress={() => removeTrack(item.id)}
            >
              <Ionicons name="remove-circle-outline" size={22} color={colors.textMuted} />
            </Pressable>
          </Pressable>
        )}
        ListEmptyComponent={
          <EmptyState
            title="No songs yet"
            message="Add songs from your library to fill this playlist."
            actionLabel="Add songs"
            onAction={() => setAddingSongs(true)}
          />
        }
      />

      <SheetModal visible={actions} onClose={() => setActions(false)} title={playlist.name}>
        {(
          [
            { icon: "musical-notes-outline", label: "Add songs", onPress: () => { setActions(false); setAddingSongs(true); } },
            { icon: "create-outline", label: "Rename playlist", onPress: () => { setActions(false); setRenaming(true); } },
            { icon: "trash-outline", label: "Delete playlist", onPress: confirmDelete, danger: true },
          ] as const
        ).map((action) => (
          <Pressable
            key={action.label}
            onPress={action.onPress}
            style={[styles.action, { paddingHorizontal: spacing.lg }]}
          >
            <Ionicons
              name={action.icon}
              size={22}
              color={"danger" in action && action.danger ? colors.danger : colors.textMuted}
            />
            <Text
              style={[
                typography.subtitle,
                { color: "danger" in action && action.danger ? colors.danger : colors.text },
              ]}
            >
              {action.label}
            </Text>
          </Pressable>
        ))}
      </SheetModal>

      <NameInputDialog
        visible={renaming}
        mode="rename"
        initialName={playlist.name}
        onSubmit={rename}
        onCancel={() => setRenaming(false)}
      />

      <AddSongsSheet
        visible={addingSongs}
        playlistId={playlistId}
        existingTrackIds={playlist.tracks.map((track) => track.id)}
        onClose={() => setAddingSongs(false)}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  hero: { marginHorizontal: 29, marginTop: 35, marginBottom: 23 },
  title: { fontSize: 27, fontWeight: "700", marginBottom: 6 },
  list: { padding: 29, paddingTop: 0, gap: 15 },
  track: { flexDirection: "row", alignItems: "center", gap: 13 },
  trackText: { flex: 1 },
  cover: { width: 55, height: 55, borderRadius: 7 },
  trackTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  action: { height: 56, flexDirection: "row", alignItems: "center", gap: 16 },
});
