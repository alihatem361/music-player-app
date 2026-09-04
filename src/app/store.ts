import { configureStore } from '@reduxjs/toolkit';
import authReducer, { sessionExpired } from '../features/auth/authSlice';
import favoritesReducer from '../features/favorites/slice/favoritesSlice'; 
import { registerUnauthorizedHandler } from '../services/api';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    favorites: favoritesReducer, 
  },
});

registerUnauthorizedHandler(() => {
  store.dispatch(sessionExpired());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;