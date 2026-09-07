import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {api} from "../../../services/api";
import { Song } from "../types/songTypes";

interface SongLibraryState {
  songs: Song[];
  selectedSong: Song | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
}

const initialState: SongLibraryState = {
  songs: [],
  selectedSong: null,
  loading: false,
  error: null,
  searchQuery: "",
};

export const fetchSongs = createAsyncThunk<
  Song[],
  void,
  { rejectValue: string }
>(
  "songLibrary/fetchSongs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/tracks/");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail ||
          "Failed to load songs"
      );
    }
  }
);

export const searchSongs = createAsyncThunk<
  Song[],
  string,
  { rejectValue: string }
>(
  "songLibrary/searchSongs",
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get(
        "/tracks/search/",
        {
          params: {
            q: query,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail ||
          "Search failed"
      );
    }
  }
);

export const fetchSongById = createAsyncThunk<
  Song,
  number,
  { rejectValue: string }
>(
  "songLibrary/fetchSongById",
  async (trackId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/tracks/${trackId}/`
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail ||
          "Failed to load song"
      );
    }
  }
);

const songLibrarySlice = createSlice({
  name: "songLibrary",
  initialState,

  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },

    clearSearch: (state) => {
      state.searchQuery = "";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchSongs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchSongs.fulfilled, (state, action) => {
        state.loading = false;
        state.songs = action.payload;
      })

      .addCase(fetchSongs.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to load songs";
      })

      .addCase(searchSongs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(searchSongs.fulfilled, (state, action) => {
        state.loading = false;
        state.songs = action.payload;
      })

      .addCase(searchSongs.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Search failed";
      })

      .addCase(fetchSongById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchSongById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSong = action.payload;
      })

      .addCase(fetchSongById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to load song";
      });
  },
});

export const {
  setSearchQuery,
  clearSearch,
} = songLibrarySlice.actions;

export default songLibrarySlice.reducer;