import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDrawer } from "../navigation/DrawerContext";
import type { MainTabParamList } from "../navigation/types";
import { useTheme, useThemeControls } from "../theme";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface MenuItem {
  icon: IconName;
  label: string;
  /** Items the design shows without a destination stay inert. */
  target?: keyof MainTabParamList;
}

const MENU: MenuItem[] = [
  { icon: "home-outline", label: "Home", target: "Discover" },
  { icon: "heart-outline", label: "Liked Songs", target: "Favorites" },
  { icon: "list-outline", label: "Playlists", target: "Playlists" },
  { icon: "chatbox-outline", label: "Contact Us" },
  { icon: "bulb-outline", label: "Learn More" },
  { icon: "person-circle-outline", label: "Profile", target: "Profile" },
];

/**
 * Slide-out menu matching Figma node 1:170 — a 265pt panel over a dimmed
 * screen. Rendered above the navigators so it is reachable from any tab.
 */
export const AppDrawer: React.FC = () => {
  const { isOpen, close } = useDrawer();
  const { colors } = useTheme();
  const { toggleMode } = useThemeControls();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  if (!isOpen) {
    return null;
  }

  const go = (item: MenuItem) => {
    if (!item.target) {
      return;
    }
    close();
    navigation.navigate("Main", { screen: item.target } as never);
  };

  return (
    <View style={styles.root}>
      <View
        style={[
          styles.panel,
          { backgroundColor: colors.background, paddingTop: insets.top + 12 },
        ]}
      >
        <View style={styles.header}>
          <Pressable accessibilityLabel="Close menu" hitSlop={12} onPress={close}>
            <Ionicons name="close" size={26} color={colors.text} />
          </Pressable>
          <Pressable accessibilityLabel="Toggle dark mode" hitSlop={12} onPress={toggleMode}>
            <Ionicons name="moon-outline" size={24} color={colors.textMuted} />
          </Pressable>
        </View>
        {MENU.map((item) => (
          <Pressable
            key={item.label}
            accessibilityState={{ disabled: !item.target }}
            disabled={!item.target}
            onPress={() => go(item)}
            style={[styles.row, !item.target && styles.rowDisabled]}
          >
            <View style={styles.iconSlot}>
              <Ionicons name={item.icon} size={22} color={colors.textMuted} />
            </View>
            <Text style={[styles.label, { color: colors.text }]}>{item.label}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable
        accessibilityLabel="Close menu"
        onPress={close}
        style={[styles.scrim, { backgroundColor: colors.overlay }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    zIndex: 20,
  },
  // Figma: 265pt panel, close/moon on one row, items on a 56pt pitch.
  panel: { width: 265, paddingHorizontal: 26 },
  header: {
    height: 24,
    marginBottom: 33,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  // 56pt pitch from Figma, rendered as a full-height row so the touch target is usable.
  row: { height: 56, flexDirection: "row", alignItems: "center" },
  // Items the design shows but that have no destination yet.
  rowDisabled: { opacity: 0.4 },
  iconSlot: { width: 48 },
  label: { fontSize: 20, fontWeight: "400" },
  scrim: { flex: 1 },
});
