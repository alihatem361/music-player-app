import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  EmptyState,
  ErrorView,
  GlowBackdrop,
  Loader,
  ScreenContainer,
  ScreenHeader,
} from "../../../components";
import type { PlaylistsStackParamList } from "../../../navigation/types";
import { useTheme } from "../../../theme";
import { fetchPlaylists } from "../playlistsSlice";

/** Figma node 2:728: a single 227pt playlist card centred under the pink bloom. */
const COVER = 227;
const artwork = require("../../../../assets/figma/playlist-cover.jpeg");

type Props = NativeStackScreenProps<PlaylistsStackParamList, "PlaylistsHome">;

export const PlaylistsScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.playlists);
  const { colors, radius } = useTheme();

  useEffect(() => {
    void dispatch(fetchPlaylists());
  }, [dispatch]);

  const body = () => {
    if (status === "loading" && items.length === 0) {
      return <Loader label="Loading playlists…" />;
    }
    if (status === "failed" && items.length === 0) {
      return (
        <ErrorView
          message={error ?? "Unable to load playlists."}
          onRetry={() => void dispatch(fetchPlaylists())}
        />
      );
    }
    return (
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              navigation.navigate("PlaylistDetail", {
                playlistId: item.id,
                name: item.name,
              })
            }
            style={styles.card}
          >
            <Image source={artwork} style={[styles.cover, { borderRadius: radius.md }]} />
            <Text numberOfLines={1} style={[styles.name, { color: colors.text }]}>
              {item.name}
            </Text>
            <Text style={[styles.count, { color: colors.textMuted }]}>
              {item.track_count} {item.track_count === 1 ? "song" : "songs"}
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <EmptyState
            title="No playlists yet"
            message="Playlists you create will be collected here."
          />
        }
      />
    );
  };

  return (
    <ScreenContainer padded={false}>
      <GlowBackdrop />
      <ScreenHeader onBack={() => navigation.getParent()?.navigate("Discover")} />
      <Text style={[styles.title, { color: colors.text }]}>Playlists</Text>
      {body()}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: { marginTop: 28, marginLeft: 32, fontSize: 24, fontWeight: "700" },
  list: { paddingTop: 22, paddingBottom: 24, alignItems: "center", gap: 28 },
  card: { alignItems: "center" },
  cover: { width: COVER, height: COVER },
  name: { marginTop: 14, fontSize: 16, fontWeight: "500" },
  count: { marginTop: 5, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.4 },
});
