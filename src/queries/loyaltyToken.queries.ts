// src/queries/loyaltyToken.queries.ts
import { useQuery } from '@tanstack/react-query';
import { listLoyaltyTokens, LoyaltyTokenListParams } from '@/api/loyaltyToken.api';

export const LOYALTY_TOKEN_KEY = ['loyalty-tokens'];

export const useLoyaltyTokens = (params?: LoyaltyTokenListParams) =>
  useQuery({
    queryKey: [...LOYALTY_TOKEN_KEY, params],
    queryFn: () => listLoyaltyTokens(params),
    staleTime: 60 * 1000,
    placeholderData: (prev) => prev,
  });
