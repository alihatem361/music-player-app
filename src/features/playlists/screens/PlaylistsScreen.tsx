import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text } from "react-native";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  EmptyState,
  ErrorView,
  GlowBackdrop,
  Loader,
  NameInputDialog,
  PlaylistCard,
  ScreenContainer,
  ScreenHeader,
} from "../../../components";
import type { PlaylistsStackParamList } from "../../../navigation/types";
import { useTheme } from "../../../theme";
import { createPlaylist, fetchPlaylists } from "../playlistsSlice";

/** Figma node 2:728: a single 227pt playlist card centred under the pink bloom. */
const COVER = 227;

type Props = NativeStackScreenProps<PlaylistsStackParamList, "PlaylistsHome">;

export const PlaylistsScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.playlists);
  const { colors } = useTheme();
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    void dispatch(fetchPlaylists());
  }, [dispatch]);

  const create = async (name: string) => {
    await dispatch(createPlaylist({ name })).unwrap();
    setCreating(false);
  };

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
          <PlaylistCard
            playlist={item}
            size={COVER}
            onPress={() =>
              navigation.navigate("PlaylistDetail", {
                playlistId: item.id,
                name: item.name,
              })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="No playlists yet"
            message="Create one and start collecting songs."
            actionLabel="New playlist"
            onAction={() => setCreating(true)}
          />
        }
      />
    );
  };

  return (
    <ScreenContainer padded={false}>
      <GlowBackdrop />
      <ScreenHeader
        onBack={() => navigation.getParent()?.navigate("Discover")}
        onAction={() => setCreating(true)}
        actionIcon="add"
        actionLabel="New playlist"
      />
      <Text style={[styles.title, { color: colors.text }]}>Playlists</Text>
      {body()}
      <NameInputDialog
        visible={creating}
        onSubmit={create}
        onCancel={() => setCreating(false)}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: { marginTop: 28, marginLeft: 32, fontSize: 24, fontWeight: "700" },
  list: { paddingTop: 22, paddingBottom: 24, alignItems: "center", gap: 28 },
});
