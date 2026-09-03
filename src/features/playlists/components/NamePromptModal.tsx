import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Button } from '../../../components';
import { useTheme } from '../../../theme';

interface Props {
  visible: boolean;
  title: string;
  /** Pre-fills the input — pass the current name when renaming. */
  initialValue?: string;
  confirmLabel: string;
  placeholder?: string;
  loading?: boolean;
  error?: string | null;
  onSubmit: (name: string) => void;
  onClose: () => void;
}

const MAX_LENGTH = 60;

/**
 * A single text-input dialog reused by both "New playlist" and "Rename". Keeps
 * validation (non-empty, trimmed, unchanged-name) in one place.
 */
export const NamePromptModal: React.FC<Props> = ({
  visible,
  title,
  initialValue = '',
  confirmLabel,
  placeholder = 'Playlist name',
  loading = false,
  error,
  onSubmit,
  onClose,
}) => {
  const { colors, spacing, radius, typography } = useTheme();
  const [value, setValue] = useState(initialValue);

  // Reset the field each time the dialog opens so stale text never lingers.
  useEffect(() => {
    if (visible) {
      setValue(initialValue);
    }
  }, [visible, initialValue]);

  const trimmed = value.trim();
  const isUnchanged = trimmed === initialValue.trim();
  const canSubmit = trimmed.length > 0 && !isUnchanged && !loading;

  const handleSubmit = () => {
    if (canSubmit) {
      onSubmit(trimmed);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <Pressable style={[styles.backdrop, { backgroundColor: colors.overlay }]} onPress={onClose}>
          {/* Stops taps inside the card from dismissing the modal. */}
          <Pressable
            onPress={() => undefined}
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg },
            ]}
          >
            <Text style={[typography.sectionTitle, { color: colors.text }]}>{title}</Text>

            <TextInput
              value={value}
              onChangeText={setValue}
              placeholder={placeholder}
              placeholderTextColor={colors.textMuted}
              autoFocus
              maxLength={MAX_LENGTH}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
              editable={!loading}
              style={[
                typography.body,
                styles.input,
                {
                  color: colors.text,
                  backgroundColor: colors.surfaceMuted,
                  borderRadius: radius.md,
                  borderColor: error ? colors.danger : colors.border,
                  paddingHorizontal: spacing.md,
                  marginTop: spacing.md,
                },
              ]}
            />

            {error ? (
              <Text style={[typography.caption, { color: colors.danger, marginTop: spacing.sm }]}>
                {error}
              </Text>
            ) : null}

            <View style={[styles.actions, { marginTop: spacing.lg }]}>
              <Button
                title="Cancel"
                onPress={onClose}
                variant="ghost"
                disabled={loading}
                style={styles.action}
              />
              <Button
                title={confirmLabel}
                onPress={handleSubmit}
                loading={loading}
                disabled={!canSubmit}
                style={styles.action}
              />
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  backdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 420 },
  input: { minHeight: 52 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  action: { minWidth: 110 },
});
