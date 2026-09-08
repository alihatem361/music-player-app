import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Song } from '../types';

interface SongCardProps {
  song: Song;
  onPress: () => void;
  onLikePress: () => void;
  isLikedInitially?: boolean; 
}
export const SongCard: React.FC<SongCardProps> = ({ 
  song, 
  onPress, 
  onLikePress,
  isLikedInitially = true 
}) => {
  const [isLiked, setIsLiked] = useState<boolean>(isLikedInitially);

  const handleLikePress = (e: GestureResponderEvent) => {
    
    e.stopPropagation(); 
    
    setIsLiked((prev) => !prev); 
    onLikePress(); 
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image 
        source={{ uri: song.cover_url }} 
        style={styles.coverImage} 
      />
      
      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>{song.title}</Text>
          <Text style={styles.artist} numberOfLines={1}>{song.artist}</Text>
        </View>

        <TouchableOpacity onPress={handleLikePress} style={styles.likeButton} activeOpacity={0.6}>
          <Ionicons 
            name={isLiked ? "heart" : "heart-outline"} 
            size={20} 
            color={isLiked ? "#EF4444" : "#9CA3AF"} 
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  coverImage: { width: '100%', height: 140 },
  infoContainer: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: { flex: 1, marginRight: 8 },
  title: { fontSize: 14, fontWeight: 'bold', color: '#000' },
  artist: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  likeButton: { padding: 4 },
});