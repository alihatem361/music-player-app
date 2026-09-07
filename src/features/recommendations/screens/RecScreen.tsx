import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecommendedSongs } from '../slice/recommSlice';
import { RootState, AppDispatch } from '../../../app/store';
import { SideMenu } from '../Components/SideMenu';
import { SongCard } from '../Components/SongCard';
import { Song } from '../types';

export default function RecommendationsScreen({  }: any) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const dispatch = useDispatch<AppDispatch>();
  const { recommendedSongs, loading } = useSelector((state: RootState) => state.recommendations);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

 
  const textColor = isDarkMode ? '#FFFFFF' : '#111';

  useEffect(() => {
    dispatch(fetchRecommendedSongs());
  }, [dispatch]);

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#FAFAFC' }]}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => setIsMenuOpen(true)}>
          <Feather name="menu" size={24} color="#637b1a" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Recommended for you</Text>
        {loading ? (
          <ActivityIndicator size="small" color={textColor} style={{ marginVertical: 20 }} />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
            {recommendedSongs?.map((song: Song) => (
              <SongCard key={`rec-${song.id || Math.random()}`} song={song} onPress={() => console.log('Clicked:', song.title)} />
            ))}
          </ScrollView>
        )}

        <Text style={[styles.sectionTitle, { color: textColor }]}>My Playlist</Text>
        {loading ? (
          <ActivityIndicator size="small" color={textColor} style={{ marginVertical: 20 }} />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
            {recommendedSongs?.map((song: Song) => (
              <SongCard key={`playlist-${song.id || Math.random()}`} song={song} onPress={() => console.log('Clicked:', song.title)} />
            ))}
          </ScrollView>
        )}
      </ScrollView>

      {/* Side Menu Component */}
      <SideMenu 
        visible={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFC',
    paddingTop: 50,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 90,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  horizontalList: {
    marginBottom: 10,
  },
});