import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { ErrorView, Loader, ScreenContainer, SongTile } from "../../../components";
import { useDrawer } from "../../../navigation/DrawerContext";
import { fetchTracks } from "../../tracks/tracksSlice";
import { useTheme } from "../../../theme";
import type { Track } from "../../../types";
import { fetchRecommendations } from "../recommendationsSlice";

interface SectionProps {
  title: string;
  tracks: Track[];
  emptyMessage: string;
}

const Section: React.FC<SectionProps> = ({ title, tracks, emptyMessage }) => {
  const { colors } = useTheme();

  return (
    <>
      <Text style={[styles.heading, { color: colors.text }]}>{title}</Text>
      {tracks.length === 0 ? (
        <Text style={[styles.empty, { color: colors.textMuted }]}>{emptyMessage}</Text>
      ) : (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}
          data={tracks}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <SongTile track={item} queue={tracks} />}
        />
      )}
    </>
  );
};

export const DiscoverScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { open } = useDrawer();
  const { colors } = useTheme();
  const { items: recommended, status, error } = useAppSelector((state) => state.recommendations);
  const library = useAppSelector((state) => state.tracks.items);

  useEffect(() => {
    void dispatch(fetchRecommendations());
    void dispatch(fetchTracks({ limit: 20 }));
  }, [dispatch]);

  const header = (
    <View style={styles.header}>
      <Pressable accessibilityLabel="Open menu" hitSlop={12} onPress={open}>
        <Ionicons name="menu" size={26} color={colors.text} />
      </Pressable>
      <Pressable
        accessibilityLabel="Search"
        hitSlop={12}
        onPress={() => navigation.navigate("Main", { screen: "Library" } as never)}
      >
        <Ionicons name="search" size={22} color={colors.text} />
      </Pressable>
    </View>
  );

  if (status === "loading" && recommended.length === 0) {
    return (
      <ScreenContainer padded={false}>
        {header}
        <Loader label="Finding music for you…" />
      </ScreenContainer>
    );
  }

  if (status === "failed" && recommended.length === 0) {
    return (
      <ScreenContainer padded={false}>
        {header}
        <ErrorView
          message={error ?? "Unable to load recommendations."}
          onRetry={() => void dispatch(fetchRecommendations())}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer padded={false}>
      {header}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Section
          title="Recommended for you"
          tracks={recommended}
          emptyMessage="No recommendations yet."
        />
        <Section
          title="My Playlist"
          tracks={library}
          emptyMessage="Your library is empty."
        />
      </ScrollView>
    </ScreenContainer>
  );
};

// Spacing mirrors Figma node 1:2 (375x812 frame).
const styles = StyleSheet.create({
  header: {
    marginTop: 36,
    height: 26,
    paddingLeft: 28,
    paddingRight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  content: { paddingBottom: 24 },
  heading: { marginTop: 42, marginLeft: 28, fontSize: 24, fontWeight: "700" },
  row: { paddingHorizontal: 28, paddingTop: 20, gap: 20 },
  empty: { marginTop: 20, marginLeft: 28, fontSize: 14 },
});
