import { request } from "../../../services/api";
import type { AuthTokens } from "../../../types";

export const login = async (
  email: string,
  password: string,
): Promise<AuthTokens> => {
  return request<AuthTokens>({
    url: "/auth/login/",
    method: "POST",
    data: { email, password },
  });
};

export const register = async (
  email: string,
  password: string,
): Promise<void> => {
  await request({
    url: "/auth/register/",
    method: "POST",
    data: { username: email.split("@")[0], email, password },
  });
};
