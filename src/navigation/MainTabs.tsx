import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, View } from "react-native";
import { AppDrawer, MiniPlayer } from "../components";
import { ProfileScreen } from "../features/auth/screens/ProfileScreen";
import { FavoritesScreen } from "../features/favorites/screens/FavoritesScreen";
import { NowPlayingScreen } from "../features/player/screens/NowPlayingScreen";
import { usePlayerEngine } from "../features/player/usePlayerEngine";
import { PlaylistDetailScreen } from "../features/playlists/screens/PlaylistDetailScreen";
import { PlaylistsScreen } from "../features/playlists/screens/PlaylistsScreen";
import { DiscoverScreen } from "../features/recommendations/screens/DiscoverScreen";
import { LibraryScreen } from "../features/tracks/screens/LibraryScreen";
import { DrawerProvider } from "./DrawerContext";
import type {
  LibraryStackParamList,
  MainTabParamList,
  PlaylistsStackParamList,
} from "./types";

const LibraryNav = createNativeStackNavigator<LibraryStackParamList>();

const LibraryStack: React.FC = () => (
  <LibraryNav.Navigator screenOptions={{ headerShown: false }}>
    <LibraryNav.Screen name="LibraryHome" component={LibraryScreen} />
    <LibraryNav.Screen name="NowPlaying" component={NowPlayingScreen} />
  </LibraryNav.Navigator>
);

const PlaylistsNav = createNativeStackNavigator<PlaylistsStackParamList>();

const PlaylistsStack: React.FC = () => (
  <PlaylistsNav.Navigator screenOptions={{ headerShown: false }}>
    <PlaylistsNav.Screen name="PlaylistsHome" component={PlaylistsScreen} />
    <PlaylistsNav.Screen name="PlaylistDetail" component={PlaylistDetailScreen} />
  </PlaylistsNav.Navigator>
);

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabs: React.FC = () => {
  usePlayerEngine();

  return (
    <DrawerProvider>
      <View style={styles.root}>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            // None of the Figma screens show a tab bar — the slide-out menu in
            // node 1:170 is the app's navigation surface.
            tabBarStyle: { display: "none" },
          }}
        >
          <Tab.Screen name="Discover" component={DiscoverScreen} />
          <Tab.Screen name="Library" component={LibraryStack} />
          <Tab.Screen name="Playlists" component={PlaylistsStack} />
          <Tab.Screen name="Favorites" component={FavoritesScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
        <MiniPlayer />
        <AppDrawer />
      </View>
    </DrawerProvider>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
});
