import { useQuery } from '@tanstack/react-query';
import { listDiscounts } from '@/api/discount.api';
import { DiscountListFilters } from '@/types/discount';

export const DISCOUNTS_QUERY_KEY = ['discounts'];

export function useDiscounts(filters: DiscountListFilters) {
  return useQuery({
    queryKey: [...DISCOUNTS_QUERY_KEY, filters],
    queryFn: async () => {
      const res = await listDiscounts(filters);
      return res.data; // { total, items }
    },
    placeholderData: (prev) => prev, // ✅ v5 replacement
  });
}
