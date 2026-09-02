import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { request, toApiError } from "../../services/api";
import type { Playlist, PlaylistSummary } from "../../types";
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
    return await request<PlaylistSummary[]>({ url: "/playlists/" });
  } catch (error) {
    return rejectWithValue(toApiError(error).message);
  }
});
export const fetchPlaylist = createAsyncThunk<
  Playlist,
  number,
  { rejectValue: string }
>("playlists/detail", async (id, { rejectWithValue }) => {
  try {
    return await request<Playlist>({ url: `/playlists/${id}/` });
  } catch (error) {
    return rejectWithValue(toApiError(error).message);
  }
});
const slice = createSlice({
  name: "playlists",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaylists.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPlaylists.fulfilled, (state, action) => {
        state.status = "idle";
        state.items = action.payload;
      })
      .addCase(fetchPlaylists.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unable to load playlists.";
      })
      .addCase(fetchPlaylist.fulfilled, (state, action) => {
        state.current = action.payload;
      });
  },
});
export default slice.reducer;
