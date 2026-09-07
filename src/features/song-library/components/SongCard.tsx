import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { Song } from "../types/songTypes";

interface SongCardProps {
  song: Song;
  onPress?: () => void;
}

export default function SongCard({
  song,
  onPress,
}: SongCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
    >
      <View style={styles.info}>
        <Text style={styles.title}>
          {song.title}
        </Text>

        <Text style={styles.artist}>
          {song.artist}
        </Text>

        {song.album && (
          <Text style={styles.album}>
            {song.album}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
  },

  info: {
    flex: 1,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
  },

  artist: {
    fontSize: 14,
    marginTop: 5,
  },

  album: {
    fontSize: 12,
    marginTop: 3,
  },
});