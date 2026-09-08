import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Song } from '../types';

interface PlayerState {
  currentSong: Song | null;
}

const initialState: PlayerState = {
  currentSong: null,
};

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setCurrentSong: (state, action: PayloadAction<Song>) => {
      state.currentSong = action.payload;
    },
  },
});

export const { setCurrentSong } = playerSlice.actions;
export default playerSlice.reducer;