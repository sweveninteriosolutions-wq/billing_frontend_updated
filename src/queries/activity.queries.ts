import { useQuery } from '@tanstack/react-query';
import { listUserActivities } from '@/api/activity.api';
import { UserActivityFilters, UserActivityListResponse } from '@/types/activity';

export const ACTIVITY_QUERY_KEY = ['activities'];

export function useUserActivities(filters: UserActivityFilters) {
  return useQuery<UserActivityListResponse>({
    queryKey: [...ACTIVITY_QUERY_KEY, filters],
    queryFn: async () => {
      const res = await listUserActivities(filters);
      return res.data; // { total, items }
    },
    placeholderData: (prev) => prev, // ✅ v5 replacement
  });
}
