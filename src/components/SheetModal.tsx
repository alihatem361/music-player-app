import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../theme";

interface Props {
  visible: boolean;
  onClose: () => void;
  title: string;
  /** Optional text action in the sheet header, e.g. "New playlist". */
  actionLabel?: string;
  onAction?: () => void;
  children: React.ReactNode;
}

/** Bottom-sheet shell shared by every sheet in the app. */
export const SheetModal: React.FC<Props> = ({
  visible,
  onClose,
  title,
  actionLabel,
  onAction,
  children,
}) => {
  const { colors, radius, spacing, typography } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable
          accessibilityLabel="Close"
          onPress={onClose}
          style={[styles.scrim, { backgroundColor: colors.overlay }]}
        />
        <View
          style={[
            styles.panel,
            {
              backgroundColor: colors.surface,
              borderTopLeftRadius: radius.lg,
              borderTopRightRadius: radius.lg,
              paddingBottom: insets.bottom + spacing.md,
            },
          ]}
        >
          <View style={[styles.header, { paddingHorizontal: spacing.lg }]}>
            <Text style={[typography.title, { color: colors.text, flex: 1 }]}>{title}</Text>
            {actionLabel && onAction ? (
              <Pressable hitSlop={8} onPress={onAction}>
                <Text style={[typography.subtitle, { color: colors.primary }]}>
                  {actionLabel}
                </Text>
              </Pressable>
            ) : null}
            <Pressable
              accessibilityLabel="Close"
              hitSlop={8}
              onPress={onClose}
              style={{ marginLeft: spacing.md }}
            >
              <Ionicons name="close" size={22} color={colors.textMuted} />
            </Pressable>
          </View>
          {children}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrim: { flex: 1 },
  panel: { maxHeight: "75%" },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
  },
});
