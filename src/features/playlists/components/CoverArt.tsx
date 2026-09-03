import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../../theme';
import { toHttps } from '../../../utils';

interface Props {
  uri?: string | null;
  size: number;
  /** Corner radius; defaults to the theme's medium radius. */
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Square artwork with a graceful fallback. Playlists have no cover of their own,
 * so callers pass the first track's `cover_url` (or nothing) and we render a
 * music-note placeholder when there's no image.
 */
export const CoverArt: React.FC<Props> = ({ uri, size, radius, style }) => {
  const theme = useTheme();
  const cornerRadius = radius ?? theme.radius.md;
  const dimensions = { width: size, height: size, borderRadius: cornerRadius };

  if (uri) {
    return (
      <Image
        source={{ uri: toHttps(uri) }}
        style={[dimensions, style as StyleProp<ImageStyle>]}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />
    );
  }

  return (
    <View
      style={[
        styles.placeholder,
        dimensions,
        { backgroundColor: theme.colors.surfaceMuted },
        style,
      ]}
    >
      <Ionicons name="musical-notes" size={size * 0.4} color={theme.colors.textMuted} />
    </View>
  );
};

const styles = StyleSheet.create({
  placeholder: { alignItems: 'center', justifyContent: 'center' },
});
