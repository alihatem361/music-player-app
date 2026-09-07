import { configureStore } from "@reduxjs/toolkit";
import {songLibraryReducer} from "../features/song-library/slice/songLibrarySlice";

export const store = configureStore({
  reducer: {
    // existing reducers
  },
});

export const store = configureStore({
  reducer: {
    songLibrary: songLibraryReducer,

    
  },
});

export type RootState = ReturnType<
  typeof store.getState
>;

export type AppDispatch = typeof store.dispatch;

