import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme';
import { Button } from './Button';

interface Props {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export const ErrorView: React.FC<Props> = ({ message, onRetry, retryLabel = 'Try again' }) => {
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={[styles.root, { padding: spacing.xl }]}>
      <Text style={[typography.title, { color: colors.danger, textAlign: 'center' }]}>
        Something went wrong
      </Text>
      <Text
        style={[
          typography.body,
          { color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm },
        ]}
      >
        {message}
      </Text>
      {onRetry ? (
        <Button
          title={retryLabel}
          onPress={onRetry}
          variant="secondary"
          style={{ marginTop: spacing.lg }}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
