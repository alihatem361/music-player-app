import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { FlatList, StyleSheet, Text } from "react-native";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  EmptyState,
  ErrorView,
  Loader,
  ScreenContainer,
  ScreenHeader,
  SongTile,
} from "../../../components";
import { useTheme } from "../../../theme";
import { fetchLiked } from "../favoritesSlice";

/** Figma node 1:340: two columns of 145pt artwork on a 30pt gutter. */
const TILE = 145;

export const FavoritesScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { likedTracks, status, error } = useAppSelector((state) => state.favorites);
  const { colors } = useTheme();

  useEffect(() => {
    void dispatch(fetchLiked());
  }, [dispatch]);

  const goHome = () => navigation.navigate("Main", { screen: "Discover" } as never);

  const body = () => {
    if (status === "loading" && likedTracks.length === 0) {
      return <Loader label="Loading liked songs…" />;
    }
    if (status === "failed" && likedTracks.length === 0) {
      return (
        <ErrorView
          message={error ?? "Unable to load liked songs."}
          onRetry={() => void dispatch(fetchLiked())}
        />
      );
    }
    return (
      <FlatList
        data={likedTracks}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={likedTracks.length ? styles.row : undefined}
        renderItem={({ item }) => (
          <SongTile track={item} queue={likedTracks} size={TILE} />
        )}
        ListEmptyComponent={
          <EmptyState
            title="No liked songs"
            message="Tap the heart while a song is playing and it will show up here."
          />
        }
      />
    );
  };

  return (
    <ScreenContainer padded={false}>
      <ScreenHeader onBack={goHome} />
      <Text style={[styles.title, { color: colors.text }]}>Liked Songs</Text>
      {body()}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: { marginTop: 36, marginLeft: 30, fontSize: 26, fontWeight: "700" },
  grid: { paddingHorizontal: 30, paddingTop: 26, paddingBottom: 24 },
  row: { justifyContent: "space-between", marginBottom: 24 },
});
