// src/api/users.api.ts
import { api } from "./client";
import {
  UserListItem,
  UserDetail,
  UserCreatePayload,
  UserUpdatePayload,
  VersionOnlyPayload,
} from "@/types/users";

/**
 * =========================
 * GENERIC API RESPONSE
 * =========================
 */
export type APIResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

/**
 * =========================
 * LIST USERS
 * =========================
 */
export type UserListFilters = {
  search?: string;
  role?: string;
  is_active?: boolean;
  is_online?: boolean;
  created_today?: boolean;
  created_by?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  page?: number;
  page_size?: number;
};

export type UserListResponse = {
  items: UserListItem[];
  total: number;
  page: number;
  page_size: number;
};

export const listUsers = (
  filters?: UserListFilters
): Promise<APIResponse<UserListResponse>> => {
  return api.get<APIResponse<UserListResponse>>("/users", filters);
};

/**
 * =========================
 * GET USER BY ID
 * =========================
 */
export const getUserById = (
  userId: number
): Promise<APIResponse<UserDetail>> => {
  return api.get<APIResponse<UserDetail>>(`/users/${userId}`);
};

/**
 * =========================
 * CREATE USER
 * =========================
 */
export const createUser = (
  payload: UserCreatePayload
): Promise<APIResponse<UserDetail>> => {
  return api.post<APIResponse<UserDetail>>("/users", payload);
};

/**
 * =========================
 * UPDATE USER
 * =========================
 */
export const updateUser = (
  userId: number,
  payload: UserUpdatePayload
): Promise<APIResponse<UserDetail>> => {
  return api.patch<APIResponse<UserDetail>>(`/users/${userId}`, payload);
};

/**
 * =========================
 * DEACTIVATE USER (SOFT DELETE)
 * =========================
 */
export const deactivateUser = (
  userId: number,
  payload: VersionOnlyPayload
): Promise<APIResponse<UserDetail>> => {
  return api.delete<APIResponse<UserDetail>>(
    `/users/${userId}`,
    payload
  );
};

/**
 * =========================
 * REACTIVATE USER
 * =========================
 */
export const reactivateUser = (
  userId: number,
  payload: VersionOnlyPayload
): Promise<APIResponse<UserDetail>> => {
  return api.post<APIResponse<UserDetail>>(
    `/users/${userId}/activate`,
    payload
  );
};

/**
 * =========================
 * DASHBOARD STATS
 * =========================
 */
export type UserDashboardStats = {
  total_users: number;
  active_users: number;
  admin_users: number;
  online_users: number;
};

export const getUserDashboardStats = (): Promise<
  APIResponse<UserDashboardStats>
> => {
  return api.get<APIResponse<UserDashboardStats>>(
    "/users/dashboard/stats"
  );
};
