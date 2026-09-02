import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { request, toApiError } from "../../services/api";
import type { LikeToggleResponse, Track } from "../../types";

interface FavoritesState {
  likedIds: number[];
  likedTracks: Track[];
  status: "idle" | "loading" | "failed";
  error: string | null;
}
const initialState: FavoritesState = {
  likedIds: [],
  likedTracks: [],
  status: "idle",
  error: null,
};
export const fetchLiked = createAsyncThunk<
  Track[],
  void,
  { rejectValue: string }
>("favorites/fetch", async (_, { rejectWithValue }) => {
  try {
    return await request<Track[]>({ url: "/liked/" });
  } catch (error) {
    return rejectWithValue(toApiError(error).message);
  }
});
export const toggleLike = createAsyncThunk<
  { track: Track; liked: boolean },
  Track,
  { rejectValue: string }
>("favorites/toggle", async (track, { rejectWithValue }) => {
  try {
    const response = await request<LikeToggleResponse>({
      url: `/tracks/${track.id}/like/`,
      method: "POST",
    });
    return { track, liked: response.liked };
  } catch (error) {
    return rejectWithValue(toApiError(error).message);
  }
});
const slice = createSlice({
  name: "favorites",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLiked.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLiked.fulfilled, (state, action) => {
        state.status = "idle";
        state.likedTracks = action.payload;
        state.likedIds = action.payload.map((track) => track.id);
      })
      .addCase(fetchLiked.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unable to load liked songs.";
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { track, liked } = action.payload;
        state.likedIds = liked
          ? [...new Set([...state.likedIds, track.id])]
          : state.likedIds.filter((id) => id !== track.id);
        state.likedTracks = liked
          ? [...state.likedTracks.filter((item) => item.id !== track.id), track]
          : state.likedTracks.filter((item) => item.id !== track.id);
      });
  },
});
export default slice.reducer;
