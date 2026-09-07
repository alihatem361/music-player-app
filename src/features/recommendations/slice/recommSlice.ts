import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { recommendationsService } from '../services/recommendationsService';
import { RecommendationsState } from '../types'; 

export const fetchRecommendedSongs = createAsyncThunk(
  'recommendations/fetchRecommendedSongs',
  async (_, { rejectWithValue }) => {
    try {
      const data = await recommendationsService.getRecommendedSongs();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState: RecommendationsState = {
  recommendedSongs: [],
  loading: false,
  error: null,
};

export const recommendationsSlice = createSlice({
  name: 'recommendations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendedSongs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendedSongs.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendedSongs = action.payload;
      })
      .addCase(fetchRecommendedSongs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default recommendationsSlice.reducer;