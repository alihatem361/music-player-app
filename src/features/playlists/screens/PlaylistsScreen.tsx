import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { EmptyState, ErrorView, Loader, ScreenContainer } from '../../../components';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useTheme } from '../../../theme';
import type { PlaylistsStackParamList } from '../../../navigation/types';
import { NamePromptModal, PlaylistCard } from '../components';
import {
  clearMutationError,
  createPlaylist,
  loadPlaylists,
} from '../playlistsSlice';

type Props = NativeStackScreenProps<PlaylistsStackParamList, 'PlaylistsHome'>;

const COLUMN_GAP = 16;

export const PlaylistsScreen: React.FC<Props> = ({ navigation }) => {
  const { colors, spacing, typography } = useTheme();
  const { width } = useWindowDimensions();
  const dispatch = useAppDispatch();

  const items = useAppSelector((state) => state.playlists.items);
  const listStatus = useAppSelector((state) => state.playlists.listStatus);
  const listError = useAppSelector((state) => state.playlists.listError);
  const isMutating = useAppSelector((state) => state.playlists.isMutating);
  const mutationError = useAppSelector((state) => state.playlists.mutationError);

  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    void dispatch(loadPlaylists());
  }, [dispatch]);

  // Two columns inside the screen's horizontal gutter (spacing.md each side).
  const cardWidth = (width - spacing.md * 2 - COLUMN_GAP) / 2;

  const openCreate = () => {
    dispatch(clearMutationError());
    setIsCreating(true);
  };

  const handleCreate = useCallback(
    async (name: string) => {
      const result = await dispatch(createPlaylist(name));
      if (createPlaylist.fulfilled.match(result)) {
        setIsCreating(false);
      }
    },
    [dispatch],
  );

  const openDetail = (playlistId: number, name: string) => {
    navigation.navigate('PlaylistDetail', { playlistId, name });
  };

  const isInitialLoading = listStatus === 'loading' && items.length === 0;
  const isRefreshing = listStatus === 'loading' && items.length > 0;

  const renderBody = () => {
    if (isInitialLoading) {
      return <Loader label="Loading your playlists…" />;
    }
    if (listStatus === 'failed' && items.length === 0) {
      return (
        <ErrorView
          message={listError ?? 'Could not load your playlists.'}
          onRetry={() => void dispatch(loadPlaylists())}
        />
      );
    }

    return (
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={{ gap: COLUMN_GAP }}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: spacing.lg }} />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => void dispatch(loadPlaylists())}
            tintColor={colors.textMuted}
          />
        }
        ListEmptyComponent={
          <EmptyState
            title="No playlists yet"
            message="Create your first playlist to start collecting songs."
            actionLabel="New playlist"
            onAction={openCreate}
          />
        }
        renderItem={({ item }) => (
          <PlaylistCard
            playlist={item}
            width={cardWidth}
            onPress={() => openDetail(item.id, item.name)}
          />
        )}
      />
    );
  };

  return (
    <ScreenContainer>
      <View style={[styles.header, { paddingVertical: spacing.sm }]}>
        <Text style={[typography.screenTitle, { color: colors.text }]}>Playlists</Text>
        <Pressable
          onPress={openCreate}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="New playlist"
          style={({ pressed }) => [
            styles.addButton,
            { backgroundColor: colors.surface, borderColor: colors.border },
            pressed && styles.pressed,
          ]}
        >
          <Ionicons name="add" size={24} color={colors.text} />
        </Pressable>
      </View>

      {renderBody()}

      <NamePromptModal
        visible={isCreating}
        title="New playlist"
        confirmLabel="Create"
        loading={isMutating}
        error={mutationError}
        onSubmit={handleCreate}
        onClose={() => setIsCreating(false)}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.7 },
  listContent: { paddingTop: 8, paddingBottom: 24 },
});
