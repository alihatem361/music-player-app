import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { SongCard } from '../Components/SongCard';

import { fetchLikedSongs, toggleLike } from '../slice/favoritesSlice';
import { setCurrentSong } from '../slice/playerSlice';

export const FavoritesScreen = () => {
  const dispatch = useDispatch<any>();
  const { songs = [], loading, error } = useSelector(
    (state: any) => state.favorites || {}
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchLikedSongs());
    }, [dispatch])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="options-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <Text style={styles.screenTitle}>Liked Songs</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 40 }} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={Array.isArray(songs) ? songs : []}
          keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
          renderItem={({ item }) => (
            <SongCard
              song={item}
              onPress={() => dispatch(setCurrentSong(item))}
              onLikePress={() => dispatch(toggleLike(item.id))}
            />
          )}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No liked songs yet.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
    marginBottom:10,
  },
  iconButton: { padding: 8 },
  screenTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    paddingHorizontal: 24,
    marginVertical: 16,
    fontFamily: 'serif',
  },
  listContent: { paddingHorizontal: 12, paddingBottom: 90 },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginTop: 40,
    fontSize: 16,
  },
  errorText: {
    textAlign: 'center',
    color: '#EF4444',
    marginTop: 40,
    fontSize: 15,
  },
});