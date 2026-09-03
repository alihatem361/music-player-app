import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../theme';
import { Track } from '../../../types';
import { formatDuration } from '../../../utils';
import { CoverArt } from './CoverArt';

type Action = 'remove' | 'add';

interface Props {
  track: Track;
  /** `remove` shows a minus (detail list); `add` shows a plus/check (picker). */
  action: Action;
  /** For the picker: renders a check instead of a plus once added. */
  added?: boolean;
  busy?: boolean;
  onPress?: () => void;
  onAction: () => void;
}

const THUMB = 52;

export const PlaylistTrackRow: React.FC<Props> = ({
  track,
  action,
  added = false,
  busy = false,
  onPress,
  onAction,
}) => {
  const { colors, spacing, typography } = useTheme();

  const icon = action === 'remove' ? 'remove-circle-outline' : added ? 'checkmark-circle' : 'add-circle-outline';
  const iconColor = action === 'remove' ? colors.danger : added ? colors.primary : colors.text;
  const actionLabel = action === 'remove' ? `Remove ${track.title}` : `Add ${track.title}`;

  return (
    <View style={[styles.row, { paddingVertical: spacing.sm }]}>
      <Pressable
        style={styles.main}
        onPress={onPress}
        disabled={!onPress}
        accessibilityRole={onPress ? 'button' : undefined}
      >
        <CoverArt uri={track.cover_url} size={THUMB} />
        <View style={[styles.meta, { marginLeft: spacing.md }]}>
          <Text numberOfLines={1} style={[typography.subtitle, { color: colors.text }]}>
            {track.title}
          </Text>
          <Text
            numberOfLines={1}
            style={[typography.caption, { color: colors.textMuted, marginTop: 2 }]}
          >
            {track.artist} · {formatDuration(track.duration)}
          </Text>
        </View>
      </Pressable>

      <Pressable
        onPress={onAction}
        disabled={busy || (action === 'add' && added)}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={actionLabel}
        style={({ pressed }) => [styles.action, pressed && styles.pressed]}
      >
        {busy ? (
          <ActivityIndicator size="small" color={colors.textMuted} />
        ) : (
          <Ionicons name={icon} size={26} color={iconColor} />
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  main: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  meta: { flex: 1 },
  action: { paddingLeft: 12 },
  pressed: { opacity: 0.6 },
});
