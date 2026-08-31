import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';
import { ApiError } from '../types';
import { clearTokens, getAccessToken, getRefreshToken, saveAccessToken } from './tokenStorage';

export const API_BASE_URL = 'https://musicapp-production-bcd8.up.railway.app/api';

/** Marks a request that has already been retried once after a token refresh. */
interface RetriableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean;
}

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

/** Bare client for the refresh call, so it never re-enters the interceptors. */
const refreshClient = axios.create({ baseURL: API_BASE_URL, timeout: 20000 });

type UnauthorizedHandler = () => void;
let onUnauthorized: UnauthorizedHandler | null = null;

/**
 * The store registers a logout callback here. Keeping it as a callback avoids
 * a circular import between the axios instance and the Redux store.
 */
export const registerUnauthorizedHandler = (handler: UnauthorizedHandler | null): void => {
  onUnauthorized = handler;
};

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const access = await getAccessToken();
  if (access) {
    config.headers.set('Authorization', `Bearer ${access}`);
  }
  return config;
});

/** De-duplicates concurrent refreshes so a burst of 401s triggers only one call. */
let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  const refresh = await getRefreshToken();
  if (!refresh) {
    return null;
  }
  try {
    const { data } = await refreshClient.post<{ access: string }>('/auth/refresh/', { refresh });
    await saveAccessToken(data.access);
    return data.access;
  } catch {
    return null;
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined;
    const isAuthCall = config?.url?.includes('/auth/login/') || config?.url?.includes('/auth/refresh/');

    if (error.response?.status === 401 && config && !config._retried && !isAuthCall) {
      config._retried = true;

      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }
      const access = await refreshPromise;

      if (access) {
        config.headers.set('Authorization', `Bearer ${access}`);
        return api.request(config);
      }

      await clearTokens();
      onUnauthorized?.();
    }

    return Promise.reject(error);
  },
);

/** Pulls a human-readable message out of a DRF error body. */
const extractMessage = (data: unknown): string | null => {
  if (typeof data === 'string' && data.trim()) {
    return data;
  }
  if (!data || typeof data !== 'object') {
    return null;
  }
  const body = data as Record<string, unknown>;
  const preferred = body.detail ?? body.message ?? body.non_field_errors;
  const candidate = preferred ?? Object.values(body)[0];

  if (Array.isArray(candidate)) {
    return candidate.length ? String(candidate[0]) : null;
  }
  return typeof candidate === 'string' ? candidate : null;
};

/**
 * Normalizes anything thrown by axios into `{ message, status }` so thunks can
 * `rejectWithValue(toApiError(error))` and screens render one consistent shape.
 */
export const toApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = extractMessage(error.response?.data);
    if (message) {
      return { message, status };
    }
    if (error.code === 'ECONNABORTED') {
      return { message: 'The request timed out. Please try again.', status };
    }
    if (!error.response) {
      return { message: 'Network error. Check your connection and try again.' };
    }
    return { message: `Request failed (${status}).`, status };
  }
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: 'Something went wrong.' };
};

/** Thin helper so feature services stay a single line per endpoint. */
export const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const { data } = await api.request<T>(config);
  return data;
};
