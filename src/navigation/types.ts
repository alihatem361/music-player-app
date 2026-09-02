import type { NavigatorScreenParams } from "@react-navigation/native";

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

export type LibraryStackParamList = {
  LibraryHome: undefined;
  NowPlaying: undefined;
};

export type PlaylistsStackParamList = {
  PlaylistsHome: undefined;
  PlaylistDetail: { playlistId: number; name: string };
};

export type MainTabParamList = {
  Discover: undefined;
  Library: NavigatorScreenParams<LibraryStackParamList>;
  Playlists: NavigatorScreenParams<PlaylistsStackParamList>;
  Favorites: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
