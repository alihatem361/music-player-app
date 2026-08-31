export interface User {
  id: number;
  username: string;
  email: string;
  avatar_url: string | null;
}

/** SimpleJWT pair — note the field names are `access` / `refresh`. */
export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}
