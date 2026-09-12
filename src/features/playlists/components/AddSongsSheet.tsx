import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { EmptyState, ErrorView, Loader, SheetModal } from "../../../components";
import { useTheme } from "../../../theme";
import { fetchTracks, searchTracks } from "../../tracks/tracksSlice";
import { addTrackToPlaylist } from "../playlistsSlice";

const SEARCH_DEBOUNCE_MS = 350;

interface Props {
  visible: boolean;
  playlistId: number;
  /** Already in the playlist — shown checked and not addable. */
  existingTrackIds: number[];
  onClose: () => void;
}

/** Searchable library picker for filling a playlist. Stays open between adds. */
export const AddSongsSheet: React.FC<Props> = ({
  visible,
  playlistId,
  existingTrackIds,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const { items, searchResults, status, error } = useAppSelector((state) => state.tracks);
  const { colors, radius, spacing, typography } = useTheme();
  const [query, setQuery] = useState("");
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [rowError, setRowError] = useState<string | null>(null);

  useEffect(() => {
    if (visible && items.length === 0) {
      void dispatch(fetchTracks({ limit: 50 }));
    }
  }, [visible, items.length, dispatch]);

  useEffect(() => {
    if (!query.trim()) {
      return;
    }
    const timer = setTimeout(() => {
      void dispatch(searchTracks(query.trim()));
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [dispatch, query]);

  const data = query.trim() ? searchResults : items;

  const add = async (trackId: number) => {
    setPendingId(trackId);
    setRowError(null);
    try {
      await dispatch(addTrackToPlaylist({ playlistId, trackId })).unwrap();
    } catch (caught) {
      setRowError(caught instanceof Error ? caught.message : String(caught));
    } finally {
      setPendingId(null);
    }
  };

  const body = () => {
    if (status === "loading" && data.length === 0) {
      return <Loader label="Loading songs…" fullScreen={false} />;
    }
    if (status === "failed" && data.length === 0) {
      return (
        <ErrorView
          message={error ?? "Unable to load songs."}
          onRetry={() => void dispatch(fetchTracks({ limit: 50 }))}
        />
      );
    }
    return (
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: spacing.md }}
        renderItem={({ item }) => {
          const alreadyAdded = existingTrackIds.includes(item.id);
          return (
            <Pressable
              disabled={alreadyAdded || pendingId !== null}
              onPress={() => void add(item.id)}
              style={[styles.row, { paddingHorizontal: spacing.lg }]}
            >
              <Image
                source={{ uri: item.cover_url }}
                style={[styles.thumb, { borderRadius: radius.sm }]}
              />
              <View style={styles.rowText}>
                <Text numberOfLines={1} style={[typography.subtitle, { color: colors.text }]}>
                  {item.title}
                </Text>
                <Text numberOfLines={1} style={[typography.caption, { color: colors.textMuted }]}>
                  {item.artist}
                </Text>
              </View>
              {pendingId === item.id ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <Ionicons
                  name={alreadyAdded ? "checkmark-circle" : "add-circle-outline"}
                  size={24}
                  color={alreadyAdded ? colors.primary : colors.textMuted}
                />
              )}
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            title="No tracks found"
            message={query.trim() ? "Try a different search." : "Your library is empty."}
          />
        }
      />
    );
  };

  return (
    <SheetModal visible={visible} onClose={onClose} title="Add songs">
      <View
        style={[
          styles.search,
          {
            marginHorizontal: spacing.lg,
            backgroundColor: colors.background,
            borderColor: colors.border,
            borderRadius: radius.md,
          },
        ]}
      >
        <Ionicons name="search-outline" size={20} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          placeholder="Search songs or artists"
          placeholderTextColor={colors.textMuted}
          style={[styles.input, { color: colors.text }]}
        />
      </View>
      {rowError ? (
        <Text
          style={[
            typography.caption,
            { color: colors.danger, paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
          ]}
        >
          {rowError}
        </Text>
      ) : null}
      <View style={[styles.body, { paddingTop: spacing.sm }]}>{body()}</View>
    </SheetModal>
  );
};

const styles = StyleSheet.create({
  search: {
    height: 46,
    borderWidth: 1,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  input: { flex: 1, fontSize: 15 },
  // Lets the list scroll inside the sheet's maxHeight instead of overflowing.
  body: { flexShrink: 1 },
  row: { height: 64, flexDirection: "row", alignItems: "center", gap: 14 },
  thumb: { width: 44, height: 44 },
  rowText: { flex: 1 },
});
