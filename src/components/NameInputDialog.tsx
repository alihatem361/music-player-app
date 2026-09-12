import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useTheme } from "../theme";
import { Button } from "./Button";

interface Props {
  visible: boolean;
  mode?: "create" | "rename";
  initialName?: string;
  /** Reject to keep the dialog open and surface the message inline. */
  onSubmit: (name: string) => Promise<void>;
  onCancel: () => void;
}

/** Centred name prompt — React Native has no `Alert.prompt` on Android. */
export const NameInputDialog: React.FC<Props> = ({
  visible,
  mode = "create",
  initialName = "",
  onSubmit,
  onCancel,
}) => {
  const { colors, radius, spacing, typography } = useTheme();
  const [value, setValue] = useState(initialName);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setValue(initialName);
      setSubmitting(false);
      setError(null);
    }
  }, [visible, initialName]);

  const submit = async () => {
    const name = value.trim();
    if (!name) {
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(name);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel} statusBarTranslucent>
      <KeyboardAvoidingView
        style={[styles.root, { backgroundColor: colors.overlay }]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={styles.dismiss} onPress={onCancel} accessibilityLabel="Cancel" />
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderRadius: radius.lg,
              padding: spacing.lg,
            },
          ]}
        >
          <Text style={[typography.title, { color: colors.text }]}>
            {mode === "rename" ? "Rename playlist" : "New playlist"}
          </Text>
          <TextInput
            value={value}
            onChangeText={setValue}
            autoFocus
            maxLength={60}
            returnKeyType="done"
            onSubmitEditing={() => void submit()}
            placeholder="Playlist name"
            placeholderTextColor={colors.textMuted}
            style={[
              styles.input,
              {
                marginTop: spacing.md,
                borderColor: colors.border,
                borderRadius: radius.md,
                color: colors.text,
                backgroundColor: colors.background,
              },
            ]}
          />
          {error ? (
            <Text style={[typography.caption, { color: colors.danger, marginTop: spacing.sm }]}>
              {error}
            </Text>
          ) : null}
          <View style={[styles.actions, { marginTop: spacing.lg }]}>
            <Button title="Cancel" variant="ghost" onPress={onCancel} style={styles.action} />
            <Button
              title={mode === "rename" ? "Save" : "Create"}
              onPress={() => void submit()}
              loading={submitting}
              disabled={!value.trim()}
              style={styles.action}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  dismiss: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  card: { width: "100%", maxWidth: 340 },
  input: { height: 48, borderWidth: 1, paddingHorizontal: 14, fontSize: 16 },
  actions: { flexDirection: "row", gap: 12 },
  action: { flex: 1 },
});
