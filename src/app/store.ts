import { configureStore } from "@reduxjs/toolkit";
import authReducer, { sessionExpired } from "../features/auth/authSlice";
import favoritesReducer from "../features/favorites/favoritesSlice";
import playerReducer from "../features/player/playerSlice";
import playlistsReducer from "../features/playlists/playlistsSlice";
import recommendationsReducer from "../features/recommendations/recommendationsSlice";
import tracksReducer from "../features/tracks/tracksSlice";
import { registerUnauthorizedHandler } from "../services/api";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    favorites: favoritesReducer,
    player: playerReducer,
    playlists: playlistsReducer,
    recommendations: recommendationsReducer,
    tracks: tracksReducer,
  },
});

// Lets the axios response interceptor sign the user out when a refresh fails,
// without api.ts importing the store (which would be circular).
registerUnauthorizedHandler(() => {
  store.dispatch(sessionExpired());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
