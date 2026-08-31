import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../theme';

type Variant = 'primary' | 'secondary' | 'ghost';

interface Props {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<Props> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}) => {
  const { colors, radius, spacing, typography } = useTheme();
  const isDisabled = disabled || loading;

  const containerByVariant: Record<Variant, ViewStyle> = {
    primary: { backgroundColor: colors.primary },
    secondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
    ghost: { backgroundColor: 'transparent' },
  };

  const labelByVariant: Record<Variant, TextStyle> = {
    primary: { color: colors.onPrimary },
    secondary: { color: colors.text },
    ghost: { color: colors.primary },
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          borderRadius: radius.pill,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
        },
        containerByVariant[variant],
        pressed && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={labelByVariant[variant].color as string} />
      ) : (
        <Text style={[typography.button, labelByVariant[variant]]}>{title}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', minHeight: 52 },
  pressed: { opacity: 0.75 },
  disabled: { opacity: 0.5 },
});
