import { configureStore } from '@reduxjs/toolkit';
import authReducer, { sessionExpired } from '../features/auth/authSlice';
import playlistsReducer from '../features/playlists/playlistsSlice';
import { registerUnauthorizedHandler } from '../services/api';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    playlists: playlistsReducer,
  },
});

// Lets the axios response interceptor sign the user out when a refresh fails,
// without api.ts importing the store (which would be circular).
registerUnauthorizedHandler(() => {
  store.dispatch(sessionExpired());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
