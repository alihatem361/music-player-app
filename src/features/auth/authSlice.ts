import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toApiError } from '../../services/api';
import { clearTokens, getTokens, saveTokens } from '../../services/tokenStorage';
import { getMe } from './services/authService';
import { ApiError, AuthTokens, User } from '../../types';

export type AuthStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  /** True until the persisted session has been read from secure storage. */
  isBootstrapping: boolean;
  status: AuthStatus;
  error: string | null;
  /**
   * Profile loading is tracked separately from `status`/`error`: LoginScreen
   * renders those, and a background /auth/me/ failure must not surface there.
   */
  userStatus: AuthStatus;
  userError: string | null;
}

const initialState: AuthState = {
  user: null,
  tokens: null,
  isBootstrapping: true,
  status: 'idle',
  error: null,
  userStatus: 'idle',
  userError: null,
};

/** Reads any persisted JWT pair on app start so the user stays signed in. */
export const restoreSession = createAsyncThunk<AuthTokens | null>('auth/restoreSession', () =>
  getTokens(),
);

export const fetchMe = createAsyncThunk<User, void, { rejectValue: string }>(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      return await getMe();
    } catch (error) {
      return rejectWithValue(toApiError(error).message);
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await clearTokens();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Used by the login flow once tokens are persisted. */
    setCredentials(state, action: PayloadAction<{ tokens: AuthTokens; user?: User | null }>) {
      state.tokens = action.payload.tokens;
      state.user = action.payload.user ?? state.user;
      state.status = 'succeeded';
      state.error = null;
      void saveTokens(action.payload.tokens);
    },
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    setAuthError(state, action: PayloadAction<ApiError | null>) {
      state.error = action.payload?.message ?? null;
      state.status = action.payload ? 'failed' : state.status;
    },
    /** Local-only sign-out, triggered by the axios 401 handler. */
    sessionExpired(state) {
      state.user = null;
      state.tokens = null;
      state.status = 'idle';
      state.userStatus = 'idle';
      state.userError = null;
      state.error = 'Your session expired. Please sign in again.';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.pending, (state) => {
        state.isBootstrapping = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.tokens = action.payload;
        state.isBootstrapping = false;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.tokens = null;
        state.isBootstrapping = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.tokens = null;
        state.status = 'idle';
        state.error = null;
        state.userStatus = 'idle';
        state.userError = null;
      })
      .addCase(fetchMe.pending, (state) => {
        state.userStatus = 'loading';
        state.userError = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.userStatus = 'succeeded';
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.userStatus = 'failed';
        state.userError = action.payload ?? 'Unable to load your profile.';
      });
  },
});

export const { setCredentials, setUser, setAuthError, sessionExpired } = authSlice.actions;
export default authSlice.reducer;
