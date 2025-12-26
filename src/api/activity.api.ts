import { api } from './client';
import {
  UserActivityFilters,
  UserActivityListResponse,
} from '@/types/activity';

export type APIResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const listUserActivities = (
  filters: UserActivityFilters
): Promise<APIResponse<UserActivityListResponse>> => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });

  return api.get<APIResponse<UserActivityListResponse>>(
    `/activities?${params.toString()}`
  );
};
