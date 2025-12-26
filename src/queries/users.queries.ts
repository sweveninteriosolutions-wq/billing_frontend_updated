import { useQuery } from '@tanstack/react-query';
import { listUsers, UserListFilters } from '@/api/user.api';
import { UserListItem } from '@/types/users';

export const USERS_QUERY_KEY = ['users'];

export type UserListResponse = {
  items: UserListItem[];
  total: number;
  page: number;
  page_size: number;
};

export function useUsers(filters?: UserListFilters) {
  return useQuery<UserListResponse>({
    queryKey: [...USERS_QUERY_KEY, filters],
    queryFn: async () => {
      const res = await listUsers(filters);
      return res.data;
    },

    // ✅ React Query v5 replacement for keepPreviousData
    placeholderData: (previousData) => previousData,
  });
}
