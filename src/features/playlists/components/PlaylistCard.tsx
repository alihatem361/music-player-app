import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../theme';
import { PlaylistSummary } from '../../../types';
import { CoverArt } from './CoverArt';

interface Props {
  playlist: PlaylistSummary;
  /** Card width, computed by the grid so two columns fit the gutter. */
  width: number;
  onPress: () => void;
}

const pluralize = (count: number, noun: string): string =>
  `${count} ${noun}${count === 1 ? '' : 's'}`;

export const PlaylistCard: React.FC<Props> = ({ playlist, width, onPress }) => {
  const { colors, spacing, typography } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${playlist.name}, ${pluralize(playlist.track_count, 'song')}`}
      onPress={onPress}
      style={({ pressed }) => [{ width }, pressed && styles.pressed]}
    >
      <CoverArt uri={null} size={width} />
      <View style={{ marginTop: spacing.sm }}>
        <Text numberOfLines={1} style={[typography.title, { color: colors.text }]}>
          {playlist.name}
        </Text>
        <Text
          numberOfLines={1}
          style={[typography.caption, { color: colors.textMuted, marginTop: spacing.xs }]}
        >
          {pluralize(playlist.track_count, 'song')}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressed: { opacity: 0.7 },
});
