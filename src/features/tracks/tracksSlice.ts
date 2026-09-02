import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toApiError } from "../../services/api";
import { getTracks, searchTracksRequest } from "./services/tracksService";
import type { Track, TrackQuery } from "../../types";

interface TracksState {
  items: Track[];
  searchResults: Track[];
  status: "idle" | "loading" | "failed";
  error: string | null;
}
const initialState: TracksState = {
  items: [],
  searchResults: [],
  status: "idle",
  error: null,
};

export const fetchTracks = createAsyncThunk<
  Track[],
  TrackQuery | undefined,
  { rejectValue: string }
>("tracks/fetch", async (params, { rejectWithValue }) => {
  try {
    return await getTracks(params);
  } catch (error) {
    return rejectWithValue(toApiError(error).message);
  }
});
export const searchTracks = createAsyncThunk<
  Track[],
  string,
  { rejectValue: string }
>("tracks/search", async (q, { rejectWithValue }) => {
  try {
    return await searchTracksRequest(q);
  } catch (error) {
    return rejectWithValue(toApiError(error).message);
  }
});
const slice = createSlice({
  name: "tracks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTracks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTracks.fulfilled, (state, action) => {
        state.status = "idle";
        state.items = action.payload;
      })
      .addCase(fetchTracks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unable to load tracks.";
      })
      .addCase(searchTracks.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      });
  },
});
export default slice.reducer;
