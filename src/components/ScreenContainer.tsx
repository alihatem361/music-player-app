import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';

interface Props {
  children: React.ReactNode;
  /** Adds the standard horizontal gutter. Off for full-bleed lists. */
  padded?: boolean;
  edges?: readonly Edge[];
  style?: ViewStyle;
}

export const ScreenContainer: React.FC<Props> = ({
  children,
  padded = true,
  edges = ['top'],
  style,
}) => {
  const { colors, spacing } = useTheme();

  return (
    <SafeAreaView edges={edges} style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.content, padded && { paddingHorizontal: spacing.md }, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1 },
});
