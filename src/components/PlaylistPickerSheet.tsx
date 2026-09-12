import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  addTrackToPlaylist,
  createPlaylist,
  fetchPlaylists,
} from "../features/playlists/playlistsSlice";
import { useTheme } from "../theme";
import type { Playlist } from "../types";
import { EmptyState } from "./EmptyState";
import { ErrorView } from "./ErrorView";
import { Loader } from "./Loader";
import { NameInputDialog } from "./NameInputDialog";
import { SheetModal } from "./SheetModal";

const artwork = require("../../assets/figma/playlist-cover.jpeg");

interface Props {
  visible: boolean;
  /** Tracks to add — an array so a multi-select caller works unchanged. */
  trackIds: number[];
  onClose: () => void;
  onAdded?: (playlist: Playlist) => void;
  title?: string;
}

/** Shared "add these tracks to a playlist" chooser. */
export const PlaylistPickerSheet: React.FC<Props> = ({
  visible,
  trackIds,
  onClose,
  onAdded,
  title = "Add to playlist",
}) => {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.playlists);
  const { colors, radius, spacing, typography } = useTheme();
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [rowError, setRowError] = useState<string | null>(null);
  const [naming, setNaming] = useState(false);

  useEffect(() => {
    if (visible && items.length === 0) {
      void dispatch(fetchPlaylists());
    }
    if (visible) {
      setRowError(null);
    }
  }, [visible, items.length, dispatch]);

  const addAll = async (playlistId: number) => {
    setPendingId(playlistId);
    setRowError(null);
    try {
      let latest: Playlist | undefined;
      for (const trackId of trackIds) {
        latest = await dispatch(addTrackToPlaylist({ playlistId, trackId })).unwrap();
      }
      if (latest) {
        onAdded?.(latest);
      }
      onClose();
    } catch (caught) {
      setRowError(caught instanceof Error ? caught.message : String(caught));
    } finally {
      setPendingId(null);
    }
  };

  const createThenAdd = async (name: string) => {
    const created = await dispatch(createPlaylist({ name })).unwrap();
    setNaming(false);
    await addAll(created.id);
  };

  const body = () => {
    if (status === "loading" && items.length === 0) {
      return <Loader label="Loading playlists…" fullScreen={false} />;
    }
    if (status === "failed" && items.length === 0) {
      return (
        <ErrorView
          message={error ?? "Unable to load playlists."}
          onRetry={() => void dispatch(fetchPlaylists())}
        />
      );
    }
    if (items.length === 0) {
      return (
        <EmptyState
          title="No playlists yet"
          message="Create one to save this song."
          actionLabel="New playlist"
          onAction={() => setNaming(true)}
        />
      );
    }
    return (
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        style={styles.list}
        contentContainerStyle={{ paddingBottom: spacing.md }}
        renderItem={({ item }) => (
          <Pressable
            disabled={pendingId !== null}
            onPress={() => void addAll(item.id)}
            style={[styles.row, { paddingHorizontal: spacing.lg, opacity: pendingId !== null ? 0.6 : 1 }]}
          >
            <Image source={artwork} style={[styles.thumb, { borderRadius: radius.sm }]} />
            <View style={styles.rowText}>
              <Text numberOfLines={1} style={[typography.subtitle, { color: colors.text }]}>
                {item.name}
              </Text>
              <Text style={[typography.caption, { color: colors.textMuted }]}>
                {item.track_count} {item.track_count === 1 ? "song" : "songs"}
              </Text>
            </View>
            {pendingId === item.id ? <ActivityIndicator color={colors.primary} /> : null}
          </Pressable>
        )}
      />
    );
  };

  return (
    <>
      <SheetModal
        visible={visible && !naming}
        onClose={onClose}
        title={title}
        actionLabel="New playlist"
        onAction={() => setNaming(true)}
      >
        {rowError ? (
          <Text
            style={[
              typography.caption,
              { color: colors.danger, paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
            ]}
          >
            {rowError}
          </Text>
        ) : null}
        {body()}
      </SheetModal>
      <NameInputDialog
        visible={naming}
        onSubmit={createThenAdd}
        onCancel={() => setNaming(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  list: { flexShrink: 1 },
  row: { height: 64, flexDirection: "row", alignItems: "center", gap: 14 },
  thumb: { width: 44, height: 44 },
  rowText: { flex: 1 },
});
