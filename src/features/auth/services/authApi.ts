import api from "../../../services/api";

import {
  LoginRequest,
  LoginResponse,
  User,
} from "../types/authTypes";

export const loginUser = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "auth/login/",
    credentials
  );

  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>(
    "auth/me/"
  );

  return response.data;
};