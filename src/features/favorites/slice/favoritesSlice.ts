import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Song } from '../types';
import { favoritesService } from '../services/favoritesService';

interface FavoritesState {
  songs: Song[];
  loading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  songs: [],
  loading: false,
  error: null,
};

export const fetchLikedSongs = createAsyncThunk(
  'favorites/fetchLikedSongs',
  async (_, { rejectWithValue }) => {
    try {
      return await favoritesService.getLikedSongs();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to fetch liked songs');
    }
  }
);

export const toggleLike = createAsyncThunk(
  'favorites/toggleLike',
  async (trackId: number, { rejectWithValue }) => {
    try {
      const data = await favoritesService.toggleLikeSong(trackId);
      return { trackId, liked: data.liked };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Failed to toggle like');
    }
  }
);

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLikedSongs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLikedSongs.fulfilled, (state, action: PayloadAction<Song[]>) => {
        state.loading = false;
        state.songs = action.payload;
      })
      .addCase(fetchLikedSongs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { trackId, liked } = action.payload;
        if (!liked) {
          state.songs = state.songs.filter((song) => song.id !== trackId);
        }
      });
  },
});

export default favoritesSlice.reducer;