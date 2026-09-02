import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
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
import { fetchTracks, searchTracks } from "../tracksSlice";

const TILE = 145;
const SEARCH_DEBOUNCE_MS = 350;

export const LibraryScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { items, searchResults, status, error } = useAppSelector((state) => state.tracks);
  const { colors, radius } = useTheme();
  const [query, setQuery] = useState("");

  useEffect(() => {
    void dispatch(fetchTracks({ limit: 30 }));
  }, [dispatch]);

  useEffect(() => {
    if (!query.trim()) {
      return;
    }
    const timer = setTimeout(() => {
      void dispatch(searchTracks(query.trim()));
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [dispatch, query]);

  const data = query.trim() ? searchResults : items;

  const body = () => {
    if (status === "loading" && items.length === 0) {
      return <Loader label="Loading your library…" />;
    }
    if (status === "failed" && items.length === 0) {
      return (
        <ErrorView
          message={error ?? "Unable to load tracks."}
          onRetry={() => void dispatch(fetchTracks({ limit: 30 }))}
        />
      );
    }
    return (
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={data.length ? styles.row : undefined}
        renderItem={({ item }) => <SongTile track={item} queue={data} size={TILE} />}
        ListEmptyComponent={
          <EmptyState
            title="No tracks found"
            message={query.trim() ? "Try a different search." : "Your library is empty."}
          />
        }
      />
    );
  };

  return (
    <ScreenContainer padded={false}>
      <ScreenHeader
        onBack={() => navigation.navigate("Main", { screen: "Discover" } as never)}
        actionIcon="options-outline"
      />
      <Text style={[styles.title, { color: colors.text }]}>Your Library</Text>
      <View
        style={[
          styles.search,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radius.md,
          },
        ]}
      >
        <Ionicons name="search-outline" size={20} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          placeholder="Search songs or artists"
          placeholderTextColor={colors.textMuted}
          style={[styles.input, { color: colors.text }]}
        />
      </View>
      {body()}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: { marginTop: 36, marginLeft: 30, fontSize: 26, fontWeight: "700" },
  search: {
    marginHorizontal: 30,
    marginTop: 22,
    height: 46,
    borderWidth: 1,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  input: { flex: 1, fontSize: 15 },
  grid: { paddingHorizontal: 30, paddingTop: 24, paddingBottom: 24 },
  row: { justifyContent: "space-between", marginBottom: 24 },
});
