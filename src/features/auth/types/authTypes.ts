export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;

  user: User | null;

  isLoading: boolean;

  isAuthenticated: boolean;

  error: string | null;
}