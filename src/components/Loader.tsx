import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme';

interface Props {
  label?: string;
  /** Fills the available space and centres itself; off for inline spinners. */
  fullScreen?: boolean;
}

export const Loader: React.FC<Props> = ({ label, fullScreen = true }) => {
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={[styles.root, fullScreen && styles.fullScreen, { padding: spacing.lg }]}>
      <ActivityIndicator size="large" color={colors.primary} />
      {label ? (
        <Text style={[typography.body, { color: colors.textMuted, marginTop: spacing.sm }]}>
          {label}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { alignItems: 'center', justifyContent: 'center' },
  fullScreen: { flex: 1 },
});
