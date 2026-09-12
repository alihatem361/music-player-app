import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  ErrorView,
  Loader,
  PlaylistCard,
  ScreenContainer,
  SongTile,
} from "../../../components";
import { useDrawer } from "../../../navigation/DrawerContext";
import type { RootStackParamList } from "../../../navigation/types";
import { fetchPlaylists } from "../../playlists/playlistsSlice";
import { useTheme } from "../../../theme";
import { fetchRecommendations } from "../recommendationsSlice";

interface SectionProps {
  title: string;
  isEmpty: boolean;
  emptyMessage: string;
  children: React.ReactNode;
}

/** Heading + horizontal rail, or a quiet message when the rail has nothing. */
const Section: React.FC<SectionProps> = ({ title, isEmpty, emptyMessage, children }) => {
  const { colors } = useTheme();

  return (
    <>
      <Text style={[styles.heading, { color: colors.text }]}>{title}</Text>
      {isEmpty ? (
        <Text style={[styles.empty, { color: colors.textMuted }]}>{emptyMessage}</Text>
      ) : (
        children
      )}
    </>
  );
};

export const DiscoverScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { open } = useDrawer();
  const { colors } = useTheme();
  const { items: recommended, status, error } = useAppSelector((state) => state.recommendations);
  const playlists = useAppSelector((state) => state.playlists.items);

  useEffect(() => {
    void dispatch(fetchRecommendations());
    void dispatch(fetchPlaylists());
  }, [dispatch]);

  const openPlaylist = (playlistId: number, name: string) =>
    navigation.navigate("Main", {
      screen: "Playlists",
      params: { screen: "PlaylistDetail", params: { playlistId, name } },
    });

  const header = (
    <View style={styles.header}>
      <Pressable accessibilityLabel="Open menu" hitSlop={12} onPress={open}>
        <Ionicons name="menu" size={26} color={colors.text} />
      </Pressable>
      <Pressable
        accessibilityLabel="Search"
        hitSlop={12}
        onPress={() =>
          navigation.navigate("Main", {
            screen: "Library",
            params: { screen: "LibraryHome" },
          })
        }
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
          isEmpty={recommended.length === 0}
          emptyMessage="No recommendations yet."
        >
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.row}
            data={recommended}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <SongTile track={item} queue={recommended} />}
          />
        </Section>
        <Section
          title="My Playlists"
          isEmpty={playlists.length === 0}
          emptyMessage="You haven't created any playlists yet."
        >
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.row}
            data={playlists}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <PlaylistCard
                playlist={item}
                size={160}
                onPress={() => openPlaylist(item.id, item.name)}
              />
            )}
          />
        </Section>
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
