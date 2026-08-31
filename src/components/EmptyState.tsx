import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme';
import { Button } from './Button';

interface Props {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<Props> = ({ title, message, actionLabel, onAction }) => {
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={[styles.root, { padding: spacing.xl }]}>
      <Text style={[typography.title, { color: colors.text, textAlign: 'center' }]}>{title}</Text>
      {message ? (
        <Text
          style={[
            typography.body,
            { color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm },
          ]}
        >
          {message}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button
          title={actionLabel}
          onPress={onAction}
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
