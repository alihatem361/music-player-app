import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { FavoritesScreen } from '../features/favorites/screens/FavoritesScreen';
import { NowPlayingScreen } from '../features/player/screens/NowPlayingScreen';
import { PlaylistDetailScreen } from '../features/playlists/screens/PlaylistDetailScreen';
import { PlaylistsScreen } from '../features/playlists/screens/PlaylistsScreen';
import  RecommendationsScreen  from '../features/recommendations/screens/RecScreen';
import { LibraryScreen } from '../features/tracks/screens/LibraryScreen';
import { useTheme } from '../theme';
import type { LibraryStackParamList, MainTabParamList, PlaylistsStackParamList } from './types';

const LibraryNav = createNativeStackNavigator<LibraryStackParamList>();

const LibraryStack: React.FC = () => (
  <LibraryNav.Navigator screenOptions={{ headerShown: false }}>
    <LibraryNav.Screen name="LibraryHome" component={LibraryScreen} />
    <LibraryNav.Screen
      name="NowPlaying"
      component={NowPlayingScreen}
      options={{ presentation: 'card' }}
    />
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

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const iconByRoute: Record<keyof MainTabParamList, { active: IconName; inactive: IconName }> = {
  Discover: { active: 'compass', inactive: 'compass-outline' },
  Library: { active: 'musical-notes', inactive: 'musical-notes-outline' },
  Playlists: { active: 'albums', inactive: 'albums-outline' },
  Favorites: { active: 'heart', inactive: 'heart-outline' },
};

export const MainTabs: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = iconByRoute[route.name];
          return <Ionicons name={focused ? icons.active : icons.inactive} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Discover" component={RecommendationsScreen} />
      <Tab.Screen name="Library" component={LibraryStack} />
      <Tab.Screen name="Playlists" component={PlaylistsStack} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
    </Tab.Navigator>
  );
};
