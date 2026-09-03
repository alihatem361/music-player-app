import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toApiError } from '../../services/api';
import { ApiError, Playlist, PlaylistSummary } from '../../types';
import { playlistsService } from './playlistsService';

export type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface PlaylistsState {
  /** The playlist list shown on the Playlists tab. */
  items: PlaylistSummary[];
  listStatus: Status;
  listError: string | null;

  /** The currently open playlist, keyed by id so navigating back and forth is cheap. */
  detail: Playlist | null;
  detailStatus: Status;
  detailError: string | null;

  /** Shared flag for create/rename/delete/add/remove so buttons can show spinners. */
  isMutating: boolean;
  mutationError: string | null;
}

const initialState: PlaylistsState = {
  items: [],
  listStatus: 'idle',
  listError: null,
  detail: null,
  detailStatus: 'idle',
  detailError: null,
  isMutating: false,
  mutationError: null,
};

export const loadPlaylists = createAsyncThunk<PlaylistSummary[], void, { rejectValue: ApiError }>(
  'playlists/loadPlaylists',
  async (_arg, { rejectWithValue }) => {
    try {
      return await playlistsService.list();
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const loadPlaylist = createAsyncThunk<Playlist, number, { rejectValue: ApiError }>(
  'playlists/loadPlaylist',
  async (playlistId, { rejectWithValue }) => {
    try {
      return await playlistsService.get(playlistId);
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const createPlaylist = createAsyncThunk<PlaylistSummary, string, { rejectValue: ApiError }>(
  'playlists/createPlaylist',
  async (name, { rejectWithValue }) => {
    try {
      return await playlistsService.create({ name });
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

export const renamePlaylist = createAsyncThunk<
  Playlist,
  { playlistId: number; name: string },
  { rejectValue: ApiError }
>('playlists/renamePlaylist', async ({ playlistId, name }, { rejectWithValue }) => {
  try {
    return await playlistsService.update(playlistId, { name });
  } catch (error) {
    return rejectWithValue(toApiError(error));
  }
});

export const deletePlaylist = createAsyncThunk<number, number, { rejectValue: ApiError }>(
  'playlists/deletePlaylist',
  async (playlistId, { rejectWithValue }) => {
    try {
      await playlistsService.remove(playlistId);
      return playlistId;
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);

/**
 * Add/remove reload the playlist afterwards: the endpoints' success bodies vary,
 * so re-fetching the detail is the reliable way to reflect the new track list.
 */
export const addTrackToPlaylist = createAsyncThunk<
  Playlist,
  { playlistId: number; trackId: number },
  { rejectValue: ApiError }
>('playlists/addTrack', async ({ playlistId, trackId }, { rejectWithValue }) => {
  try {
    await playlistsService.addTrack(playlistId, trackId);
    return await playlistsService.get(playlistId);
  } catch (error) {
    return rejectWithValue(toApiError(error));
  }
});

export const removeTrackFromPlaylist = createAsyncThunk<
  Playlist,
  { playlistId: number; trackId: number },
  { rejectValue: ApiError }
>('playlists/removeTrack', async ({ playlistId, trackId }, { rejectWithValue }) => {
  try {
    await playlistsService.removeTrack(playlistId, trackId);
    return await playlistsService.get(playlistId);
  } catch (error) {
    return rejectWithValue(toApiError(error));
  }
});

/** Keeps the list row's track_count in step with the open detail. */
const syncSummaryFromDetail = (state: PlaylistsState, playlist: Playlist): void => {
  const index = state.items.findIndex((item) => item.id === playlist.id);
  if (index !== -1) {
    const existing = state.items[index];
    if (existing) {
      state.items[index] = {
        ...existing,
        name: playlist.name,
        description: playlist.description,
        track_count: playlist.tracks.length,
      };
    }
  }
};

const playlistsSlice = createSlice({
  name: 'playlists',
  initialState,
  reducers: {
    clearDetail(state) {
      state.detail = null;
      state.detailStatus = 'idle';
      state.detailError = null;
    },
    clearMutationError(state) {
      state.mutationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // List
      .addCase(loadPlaylists.pending, (state) => {
        state.listStatus = 'loading';
        state.listError = null;
      })
      .addCase(loadPlaylists.fulfilled, (state, action: PayloadAction<PlaylistSummary[]>) => {
        state.listStatus = 'succeeded';
        state.items = action.payload;
      })
      .addCase(loadPlaylists.rejected, (state, action) => {
        state.listStatus = 'failed';
        state.listError = action.payload?.message ?? 'Could not load your playlists.';
      })
      // Detail
      .addCase(loadPlaylist.pending, (state) => {
        state.detailStatus = 'loading';
        state.detailError = null;
      })
      .addCase(loadPlaylist.fulfilled, (state, action: PayloadAction<Playlist>) => {
        state.detailStatus = 'succeeded';
        state.detail = action.payload;
        syncSummaryFromDetail(state, action.payload);
      })
      .addCase(loadPlaylist.rejected, (state, action) => {
        state.detailStatus = 'failed';
        state.detailError = action.payload?.message ?? 'Could not load this playlist.';
      })
      // Create
      .addCase(createPlaylist.pending, (state) => {
        state.isMutating = true;
        state.mutationError = null;
      })
      .addCase(createPlaylist.fulfilled, (state, action: PayloadAction<PlaylistSummary>) => {
        state.isMutating = false;
        state.items.unshift(action.payload);
      })
      .addCase(createPlaylist.rejected, (state, action) => {
        state.isMutating = false;
        state.mutationError = action.payload?.message ?? 'Could not create the playlist.';
      })
      // Rename
      .addCase(renamePlaylist.pending, (state) => {
        state.isMutating = true;
        state.mutationError = null;
      })
      .addCase(renamePlaylist.fulfilled, (state, action: PayloadAction<Playlist>) => {
        state.isMutating = false;
        state.detail = action.payload;
        syncSummaryFromDetail(state, action.payload);
      })
      .addCase(renamePlaylist.rejected, (state, action) => {
        state.isMutating = false;
        state.mutationError = action.payload?.message ?? 'Could not rename the playlist.';
      })
      // Delete
      .addCase(deletePlaylist.pending, (state) => {
        state.isMutating = true;
        state.mutationError = null;
      })
      .addCase(deletePlaylist.fulfilled, (state, action: PayloadAction<number>) => {
        state.isMutating = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
        if (state.detail?.id === action.payload) {
          state.detail = null;
          state.detailStatus = 'idle';
        }
      })
      .addCase(deletePlaylist.rejected, (state, action) => {
        state.isMutating = false;
        state.mutationError = action.payload?.message ?? 'Could not delete the playlist.';
      })
      // Add / remove track (share the detail-refresh payload)
      .addMatcher(
        (action) =>
          addTrackToPlaylist.pending.match(action) || removeTrackFromPlaylist.pending.match(action),
        (state) => {
          state.isMutating = true;
          state.mutationError = null;
        },
      )
      .addMatcher(
        (action) =>
          addTrackToPlaylist.fulfilled.match(action) ||
          removeTrackFromPlaylist.fulfilled.match(action),
        (state, action: PayloadAction<Playlist>) => {
          state.isMutating = false;
          state.detail = action.payload;
          syncSummaryFromDetail(state, action.payload);
        },
      )
      .addMatcher(
        (action) =>
          addTrackToPlaylist.rejected.match(action) ||
          removeTrackFromPlaylist.rejected.match(action),
        (state, action) => {
          state.isMutating = false;
          const payload = action.payload as ApiError | undefined;
          state.mutationError = payload?.message ?? 'Could not update the playlist.';
        },
      );
  },
});

export const { clearDetail, clearMutationError } = playlistsSlice.actions;
export default playlistsSlice.reducer;
