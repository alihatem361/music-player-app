import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { request, toApiError } from "../../services/api";
import type { Track } from "../../types";
interface State {
  items: Track[];
  status: "idle" | "loading" | "failed";
  error: string | null;
}
const initialState: State = { items: [], status: "idle", error: null };
export const fetchRecommendations = createAsyncThunk<
  Track[],
  void,
  { rejectValue: string }
>("recommendations/fetch", async (_, { rejectWithValue }) => {
  try {
    return await request<Track[]>({ url: "/recommendations/" });
  } catch (error) {
    return rejectWithValue(toApiError(error).message);
  }
});
const slice = createSlice({
  name: "recommendations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.status = "idle";
        state.items = action.payload;
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unable to load recommendations.";
      });
  },
});
export default slice.reducer;
