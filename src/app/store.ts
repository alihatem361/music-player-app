import { combineReducers, configureStore, type Action } from "@reduxjs/toolkit";
import authReducer, { logout, sessionExpired } from "../features/auth/authSlice";
import favoritesReducer from "../features/favorites/favoritesSlice";
import playerReducer from "../features/player/playerSlice";
import playlistsReducer from "../features/playlists/playlistsSlice";
import recommendationsReducer from "../features/recommendations/recommendationsSlice";
import tracksReducer from "../features/tracks/tracksSlice";
import { registerUnauthorizedHandler } from "../services/api";

const appReducer = combineReducers({
  auth: authReducer,
  favorites: favoritesReducer,
  player: playerReducer,
  playlists: playlistsReducer,
  recommendations: recommendationsReducer,
  tracks: tracksReducer,
});

export type RootState = ReturnType<typeof appReducer>;

/**
 * Signing out drops the per-user data slices back to their initial state —
 * otherwise the previous account's tracks, playlists and favourites stay in
 * memory and would be visible to whoever signs in next without a restart.
 *
 * `auth` is deliberately excluded from the blanket reset: its own reducers
 * already clear the session, and re-initialising it would restore
 * `isBootstrapping: true` and strand the app on the splash loader.
 */
const rootReducer = (state: RootState | undefined, action: Action): RootState => {
  if (action.type === logout.fulfilled.type || action.type === sessionExpired.type) {
    return { ...appReducer(undefined, action), auth: appReducer(state, action).auth };
  }
  return appReducer(state, action);
};

export const store = configureStore({ reducer: rootReducer });

// Lets the axios response interceptor sign the user out when a refresh fails,
// without api.ts importing the store (which would be circular).
registerUnauthorizedHandler(() => {
  store.dispatch(sessionExpired());
});

export type AppDispatch = typeof store.dispatch;
