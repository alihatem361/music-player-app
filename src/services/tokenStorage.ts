import * as SecureStore from 'expo-secure-store';
import { AuthTokens } from '../types';

const ACCESS_KEY = 'auth.access';
const REFRESH_KEY = 'auth.refresh';

export const saveTokens = async (tokens: AuthTokens): Promise<void> => {
  await Promise.all([
    SecureStore.setItemAsync(ACCESS_KEY, tokens.access),
    SecureStore.setItemAsync(REFRESH_KEY, tokens.refresh),
  ]);
};

export const saveAccessToken = async (access: string): Promise<void> => {
  await SecureStore.setItemAsync(ACCESS_KEY, access);
};

export const getAccessToken = (): Promise<string | null> => SecureStore.getItemAsync(ACCESS_KEY);

export const getRefreshToken = (): Promise<string | null> => SecureStore.getItemAsync(REFRESH_KEY);

export const getTokens = async (): Promise<AuthTokens | null> => {
  const [access, refresh] = await Promise.all([getAccessToken(), getRefreshToken()]);
  return access && refresh ? { access, refresh } : null;
};

export const clearTokens = async (): Promise<void> => {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_KEY),
    SecureStore.deleteItemAsync(REFRESH_KEY),
  ]);
};
