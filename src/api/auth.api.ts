// src/api/auth.api.ts
import { api } from "./client";
import { LoginResponseDTO } from "@/types/auth";

export type LoginPayload = {
  email: string;
  password: string;
};

export const login = (payload: LoginPayload): Promise<LoginResponseDTO> => {
  return api.post<LoginResponseDTO>("/auth/login", payload);
};

export const logout = (): Promise<void> => {
  return api.post<void>("/auth/logout");
};
