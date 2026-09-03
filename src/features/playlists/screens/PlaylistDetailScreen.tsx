import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { EmptyState, ErrorView, Loader, ScreenContainer } from '../../../components';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useTheme } from '../../../theme';
import type { PlaylistsStackParamList } from '../../../navigation/types';
import { AddTracksModal, NamePromptModal, PlaylistTrackRow } from '../components';
import {
  addTrackToPlaylist,
  clearDetail,
  clearMutationError,
  deletePlaylist,
  loadPlaylist,
  removeTrackFromPlaylist,
  renamePlaylist,
} from '../playlistsSlice';

type Props = NativeStackScreenProps<PlaylistsStackParamList, 'PlaylistDetail'>;

export const PlaylistDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { playlistId, name } = route.params;
  const { colors, spacing, radius, typography } = useTheme();
  const dispatch = useAppDispatch();

  const detail = useAppSelector((state) => state.playlists.detail);
  const detailStatus = useAppSelector((state) => state.playlists.detailStatus);
  const detailError = useAppSelector((state) => state.playlists.detailError);
  const isMutating = useAppSelector((state) => state.playlists.isMutating);
  const mutationError = useAppSelector((state) => state.playlists.mutationError);

  const [isRenaming, setIsRenaming] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);

  // Only trust `detail` once it belongs to the playlist this screen opened.
  const playlist = detail?.id === playlistId ? detail : null;
  const title = playlist?.name ?? name;

  useEffect(() => {
    void dispatch(loadPlaylist(playlistId));
    return () => {
      dispatch(clearDetail());
    };
  }, [dispatch, playlistId]);

  const existingTrackIds = useMemo(
    () => playlist?.tracks.map((track) => track.id) ?? [],
    [playlist],
  );

  const handleRename = useCallback(
    async (nextName: string) => {
      const result = await dispatch(renamePlaylist({ playlistId, name: nextName }));
      if (renamePlaylist.fulfilled.match(result)) {
        setIsRenaming(false);
        navigation.setParams({ name: nextName });
      }
    },
    [dispatch, playlistId, navigation],
  );

  const confirmDelete = () => {
    Alert.alert('Delete playlist', `Delete "${title}"? This can't be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const result = await dispatch(deletePlaylist(playlistId));
          if (deletePlaylist.fulfilled.match(result)) {
            navigation.goBack();
          } else {
            Alert.alert('Could not delete', mutationError ?? 'Please try again.');
          }
        },
      },
    ]);
  };

  const handleRemoveTrack = async (trackId: number) => {
    setRemovingId(trackId);
    await dispatch(removeTrackFromPlaylist({ playlistId, trackId }));
    setRemovingId(null);
  };

  const handleAddTrack = async (trackId: number) => {
    const result = await dispatch(addTrackToPlaylist({ playlistId, trackId }));
    if (!addTrackToPlaylist.fulfilled.match(result)) {
      throw new Error('add failed');
    }
  };

  const openRename = () => {
    dispatch(clearMutationError());
    setIsRenaming(true);
  };

  const isInitialLoading = detailStatus === 'loading' && !playlist;

  const renderBody = () => {
    if (isInitialLoading) {
      return <Loader label="Loading playlist…" />;
    }
    if (detailStatus === 'failed' && !playlist) {
      return (
        <ErrorView
          message={detailError ?? 'Could not load this playlist.'}
          onRetry={() => void dispatch(loadPlaylist(playlistId))}
        />
      );
    }
    if (!playlist) {
      return null;
    }

    return (
      <FlatList
        data={playlist.tracks}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Pressable
            onPress={() => setIsAdding(true)}
            style={({ pressed }) => [
              styles.addRow,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: radius.md,
                paddingVertical: spacing.md,
                paddingHorizontal: spacing.md,
                marginBottom: spacing.sm,
              },
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="add-circle" size={24} color={colors.text} />
            <Text style={[typography.subtitle, { color: colors.text, marginLeft: spacing.sm }]}>
              Add songs
            </Text>
          </Pressable>
        }
        ListEmptyComponent={
          <EmptyState
            title="No songs yet"
            message="Add songs to this playlist to start listening."
            actionLabel="Add songs"
            onAction={() => setIsAdding(true)}
          />
        }
        renderItem={({ item }) => (
          <PlaylistTrackRow
            track={item}
            action="remove"
            busy={removingId === item.id}
            onAction={() => void handleRemoveTrack(item.id)}
          />
        )}
      />
    );
  };

  const subtitle =
    playlist != null
      ? `${playlist.tracks.length} ${playlist.tracks.length === 1 ? 'song' : 'songs'}`
      : '';

  return (
    <ScreenContainer>
      <View style={[styles.header, { paddingVertical: spacing.sm }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </Pressable>

        <View style={styles.headerActions}>
          <Pressable
            onPress={openRename}
            hitSlop={8}
            disabled={!playlist}
            accessibilityRole="button"
            accessibilityLabel="Rename playlist"
            style={({ pressed }) => pressed && styles.pressed}
          >
            <Ionicons name="create-outline" size={24} color={playlist ? colors.text : colors.textMuted} />
          </Pressable>
          <Pressable
            onPress={confirmDelete}
            hitSlop={8}
            disabled={!playlist}
            accessibilityRole="button"
            accessibilityLabel="Delete playlist"
            style={({ pressed }) => pressed && styles.pressed}
          >
            <Ionicons name="trash-outline" size={24} color={playlist ? colors.danger : colors.textMuted} />
          </Pressable>
        </View>
      </View>

      <View style={{ paddingBottom: spacing.sm }}>
        <Text numberOfLines={2} style={[typography.screenTitle, { color: colors.text }]}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[typography.caption, { color: colors.textMuted, marginTop: spacing.xs }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {renderBody()}

      <NamePromptModal
        visible={isRenaming}
        title="Rename playlist"
        initialValue={title}
        confirmLabel="Save"
        loading={isMutating}
        error={mutationError}
        onSubmit={handleRename}
        onClose={() => setIsRenaming(false)}
      />

      <AddTracksModal
        visible={isAdding}
        existingTrackIds={existingTrackIds}
        onAdd={handleAddTrack}
        onClose={() => setIsAdding(false)}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  addRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1 },
  pressed: { opacity: 0.6 },
  listContent: { paddingTop: 8, paddingBottom: 24 },
});
