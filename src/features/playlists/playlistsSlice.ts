import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { toApiError } from "../../services/api";
import type {
  CreatePlaylistPayload,
  Playlist,
  PlaylistCreated,
  PlaylistSummary,
} from "../../types";
import {
  addTrackRequest,
  createPlaylistRequest,
  deletePlaylistRequest,
  getPlaylist,
  getPlaylists,
  removeTrackRequest,
  renamePlaylistRequest,
} from "./services/playlistsService";

interface State {
  items: PlaylistSummary[];
  current: Playlist | null;
  status: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: State = {
  items: [],
  current: null,
  status: "idle",
  error: null,
};

export const fetchPlaylists = createAsyncThunk<
  PlaylistSummary[],
  void,
  { rejectValue: string }
>("playlists/fetch", async (_, { rejectWithValue }) => {
  try {
    return await getPlaylists();
  } catch (error) {
    return rejectWithValue(toApiError(error).message);
  }
});

export const fetchPlaylist = createAsyncThunk<Playlist, number, { rejectValue: string }>(
  "playlists/detail",
  async (id, { rejectWithValue }) => {
    try {
      return await getPlaylist(id);
    } catch (error) {
      return rejectWithValue(toApiError(error).message);
    }
  },
);

export const createPlaylist = createAsyncThunk<
  PlaylistCreated,
  CreatePlaylistPayload,
  { rejectValue: string }
>("playlists/create", async (body, { rejectWithValue }) => {
  try {
    return await createPlaylistRequest(body);
  } catch (error) {
    return rejectWithValue(toApiError(error).message);
  }
});

export const renamePlaylist = createAsyncThunk<
  { id: number; name: string },
  { id: number; name: string },
  { rejectValue: string }
>("playlists/rename", async ({ id, name }, { rejectWithValue }) => {
  try {
    await renamePlaylistRequest(id, name);
    // The PUT response shape is unverified, so trust the request: patching only
    // `name` avoids clobbering `track_count` with an absent field.
    return { id, name };
  } catch (error) {
    return rejectWithValue(toApiError(error).message);
  }
});

export const deletePlaylist = createAsyncThunk<number, number, { rejectValue: string }>(
  "playlists/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deletePlaylistRequest(id);
      return id;
    } catch (error) {
      return rejectWithValue(toApiError(error).message);
    }
  },
);

export const addTrackToPlaylist = createAsyncThunk<
  Playlist,
  { playlistId: number; trackId: number },
  { rejectValue: string }
>("playlists/addTrack", async ({ playlistId, trackId }, { rejectWithValue }) => {
  try {
    return await addTrackRequest(playlistId, trackId);
  } catch (error) {
    return rejectWithValue(toApiError(error).message);
  }
});

export const removeTrackFromPlaylist = createAsyncThunk<
  Playlist,
  { playlistId: number; trackId: number },
  { rejectValue: string }
>("playlists/removeTrack", async ({ playlistId, trackId }, { rejectWithValue }) => {
  try {
    return await removeTrackRequest(playlistId, trackId);
  } catch (error) {
    return rejectWithValue(toApiError(error).message);
  }
});

/**
 * `add_track` / `remove_track` return the whole playlist. Only adopt it as
 * `current` when it is the playlist actually on screen — adding a track from
 * Now Playing must not overwrite an unrelated open detail screen.
 */
const applyPlaylist = (state: State, playlist: Playlist): void => {
  if (state.current?.id === playlist.id) {
    state.current = playlist;
  }
  const row = state.items.find((item) => item.id === playlist.id);
  if (row) {
    row.name = playlist.name;
    row.description = playlist.description;
    row.track_count = playlist.tracks.length;
  }
};

const slice = createSlice({
  name: "playlists",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaylists.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPlaylists.fulfilled, (state, action) => {
        state.status = "idle";
        state.items = action.payload;
      })
      .addCase(fetchPlaylists.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unable to load playlists.";
      })
      .addCase(fetchPlaylist.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
        // Drop a stale playlist so B's title never renders over A's tracks.
        if (state.current?.id !== action.meta.arg) {
          state.current = null;
        }
      })
      .addCase(fetchPlaylist.fulfilled, (state, action) => {
        state.status = "idle";
        state.current = action.payload;
      })
      .addCase(fetchPlaylist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unable to load this playlist.";
      })
      .addCase(createPlaylist.fulfilled, (state, action: PayloadAction<PlaylistCreated>) => {
        state.items.unshift({ ...action.payload, track_count: 0 });
      })
      .addCase(renamePlaylist.fulfilled, (state, action) => {
        const { id, name } = action.payload;
        const row = state.items.find((item) => item.id === id);
        if (row) {
          row.name = name;
        }
        if (state.current?.id === id) {
          state.current.name = name;
        }
      })
      .addCase(deletePlaylist.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        if (state.current?.id === action.payload) {
          state.current = null;
        }
      })
      .addCase(addTrackToPlaylist.fulfilled, (state, action) => {
        applyPlaylist(state, action.payload);
      })
      .addCase(removeTrackFromPlaylist.fulfilled, (state, action) => {
        applyPlaylist(state, action.payload);
      });
  },
});

export default slice.reducer;
