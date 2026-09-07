import React from 'react';
import { Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Song } from '../types';

interface SongCardProps {
  song: Song;
  onPress?: () => void;
}

export const SongCard: React.FC<SongCardProps> = ({ song, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: song.cover_url }} style={styles.cardImage} />
      <Text style={styles.songTitle} numberOfLines={1}>{song.title}</Text>
      <Text style={styles.artistName} numberOfLines={1}>{song.artist}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 160,
    marginRight: 15,
  },
  cardImage: {
    width: 160,
    height: 160,
    borderRadius: 12,
    marginBottom: 8,
  },
  songTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },
  artistName: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
});