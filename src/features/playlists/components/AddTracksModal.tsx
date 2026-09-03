import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState, ErrorView, Loader } from '../../../components';
import { playlistsService } from '../playlistsService';
import { useTheme } from '../../../theme';
import { toApiError } from '../../../services/api';
import { Track } from '../../../types';
import { PlaylistTrackRow } from './PlaylistTrackRow';

interface Props {
  visible: boolean;
  /** Track ids already in the playlist, so they render as "added". */
  existingTrackIds: number[];
  /** Resolves once the track is persisted; rejects to surface an error. */
  onAdd: (trackId: number) => Promise<void>;
  onClose: () => void;
}

type LoadState = 'idle' | 'loading' | 'succeeded' | 'failed';

export const AddTracksModal: React.FC<Props> = ({ visible, existingTrackIds, onAdd, onClose }) => {
  const { colors, spacing, radius, typography } = useTheme();
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [state, setState] = useState<LoadState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<number | null>(null);

  const existing = new Set(existingTrackIds);

  const fetchTracks = useCallback(async (search: string) => {
    setState('loading');
    setError(null);
    try {
      const results = await playlistsService.searchTracks(search);
      setTracks(results);
      setState('succeeded');
    } catch (err) {
      setError(toApiError(err).message);
      setState('failed');
    }
  }, []);

  // Load the default list when opened, and debounce subsequent searches.
  useEffect(() => {
    if (!visible) {
      return;
    }
    const handle = setTimeout(() => {
      void fetchTracks(query);
    }, query ? 350 : 0);
    return () => clearTimeout(handle);
  }, [visible, query, fetchTracks]);

  // Reset transient state whenever the sheet closes.
  useEffect(() => {
    if (!visible) {
      setQuery('');
      setTracks([]);
      setState('idle');
      setError(null);
      setAddingId(null);
    }
  }, [visible]);

  const handleAdd = async (trackId: number) => {
    setAddingId(trackId);
    try {
      await onAdd(trackId);
    } catch {
      // The parent slice records the error; keep the sheet open for a retry.
    } finally {
      setAddingId(null);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={[styles.header, { paddingHorizontal: spacing.md, paddingVertical: spacing.sm }]}>
          <Text style={[typography.sectionTitle, { color: colors.text }]}>Add songs</Text>
          <Pressable onPress={onClose} hitSlop={8} accessibilityRole="button" accessibilityLabel="Close">
            <Ionicons name="close" size={26} color={colors.text} />
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: spacing.md }}>
          <View
            style={[
              styles.search,
              { backgroundColor: colors.surfaceMuted, borderRadius: radius.md, paddingHorizontal: spacing.md },
            ]}
          >
            <Ionicons name="search" size={18} color={colors.textMuted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search songs or artists"
              placeholderTextColor={colors.textMuted}
              autoCorrect={false}
              returnKeyType="search"
              style={[typography.body, styles.searchInput, { color: colors.text }]}
            />
            {query ? (
              <Pressable onPress={() => setQuery('')} hitSlop={8} accessibilityLabel="Clear search">
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </Pressable>
            ) : null}
          </View>
        </View>

        {state === 'loading' && tracks.length === 0 ? (
          <Loader label="Loading songs…" />
        ) : state === 'failed' ? (
          <ErrorView message={error ?? 'Could not load songs.'} onRetry={() => void fetchTracks(query)} />
        ) : tracks.length === 0 ? (
          <EmptyState
            title="No songs found"
            message={query ? 'Try a different search.' : 'The library is empty right now.'}
          />
        ) : (
          <FlatList
            data={tracks}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{ padding: spacing.md }}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <PlaylistTrackRow
                track={item}
                action="add"
                added={existing.has(item.id)}
                busy={addingId === item.id}
                onAction={() => void handleAdd(item.id)}
              />
            )}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  search: { flexDirection: 'row', alignItems: 'center', minHeight: 48 },
  searchInput: { flex: 1, marginLeft: 8, minHeight: 48 },
});
