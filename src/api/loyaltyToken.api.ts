// src/api/loyaltyToken.api.ts
import { api } from './client';
import { LoyaltyTokenListData, LoyaltyTokenOut } from '@/types/loyaltyToken';

type APIResponse<T> = { success: boolean; message: string; data: T };

export interface LoyaltyTokenListParams {
  customer_id?: number;
  invoice_id?: number;
  min_tokens?: number;
  max_tokens?: number;
  page?: number;
  page_size?: number;
  sort_by?: string;
  order?: string;
}

export const listLoyaltyTokens = async (
  params?: LoyaltyTokenListParams
): Promise<LoyaltyTokenListData> => {
  const res = await api.get<APIResponse<LoyaltyTokenListData>>(
    '/loyalty-tokens/',
    params as Record<string, any>
  );
  return (res as any).data ?? res;
};

export const getLoyaltyToken = async (id: number): Promise<LoyaltyTokenOut> => {
  const res = await api.get<APIResponse<LoyaltyTokenOut>>(`/loyalty-tokens/${id}`);
  return (res as any).data ?? res;
};
