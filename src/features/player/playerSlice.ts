import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Track } from "../../types";

export type RepeatMode = "off" | "one" | "all";

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[];
  currentIndex: number;
  shuffle: boolean;
  repeat: RepeatMode;
  positionMs: number;
  durationMs: number;
}

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  queue: [],
  currentIndex: -1,
  shuffle: false,
  repeat: "off",
  positionMs: 0,
  durationMs: 0,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setQueue(
      state,
      action: PayloadAction<{ tracks: Track[]; startIndex?: number }>,
    ) {
      state.queue = action.payload.tracks;
      const nextIndex = action.payload.startIndex ?? 0;
      state.currentIndex = nextIndex;
      state.currentTrack = action.payload.tracks[nextIndex] ?? null;
      state.positionMs = 0;
      state.durationMs = (state.currentTrack?.duration ?? 0) * 1000;
    },
    playTrack(state, action: PayloadAction<Track>) {
      const queueIndex = state.queue.findIndex(
        (track) => track.id === action.payload.id,
      );
      state.currentTrack = action.payload;
      state.currentIndex = queueIndex;
      state.isPlaying = true;
      state.positionMs = 0;
      state.durationMs = action.payload.duration * 1000;
    },
    setPlaying(state, action: PayloadAction<boolean>) {
      state.isPlaying = action.payload;
    },
    next(state) {
      if (!state.queue.length) return;
      const nextIndex = state.shuffle
        ? Math.floor(Math.random() * state.queue.length)
        : (state.currentIndex + 1) % state.queue.length;
      state.currentIndex = nextIndex;
      state.currentTrack = state.queue[nextIndex];
      state.positionMs = 0;
      state.durationMs = state.currentTrack.duration * 1000;
    },
    prev(state) {
      if (!state.queue.length) return;
      const previousIndex =
        state.currentIndex > 0
          ? state.currentIndex - 1
          : state.queue.length - 1;
      state.currentIndex = previousIndex;
      state.currentTrack = state.queue[previousIndex];
      state.positionMs = 0;
      state.durationMs = state.currentTrack.duration * 1000;
    },
    toggleShuffle(state) {
      state.shuffle = !state.shuffle;
    },
    cycleRepeat(state) {
      state.repeat =
        state.repeat === "off" ? "all" : state.repeat === "all" ? "one" : "off";
    },
    setProgress(
      state,
      action: PayloadAction<{ positionMs: number; durationMs?: number }>,
    ) {
      state.positionMs = action.payload.positionMs;
      if (
        action.payload.durationMs !== undefined &&
        action.payload.durationMs > 0
      ) {
        state.durationMs = action.payload.durationMs;
      }
    },
  },
});

export const {
  setQueue,
  playTrack,
  setPlaying,
  next,
  prev,
  toggleShuffle,
  cycleRepeat,
  setProgress,
} = playerSlice.actions;
export default playerSlice.reducer;
