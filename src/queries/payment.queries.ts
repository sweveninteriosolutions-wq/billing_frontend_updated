// src/queries/payment.queries.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import { PaymentListResponse } from '@/types/payment';

type APIResponse<T> = { success: boolean; message: string; data: T };

const qs = (params?: Record<string, any>) => {
  if (!params) return '';
  const s = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) s.append(k, String(v));
  });
  const q = s.toString();
  return q ? `?${q}` : '';
};

export const usePayments = (params?: {
  page?: number;
  page_size?: number;
  invoice_id?: number;
  customer_id?: number;
  payment_method?: string;
  start_date?: string;
  end_date?: string;
}) =>
  useQuery({
    queryKey: ['payments', params],
    queryFn: async () => {
      const res = await api.get<APIResponse<PaymentListResponse>>(`/payments/${qs(params)}`);
      return (res as any).data ?? res;
    },
  });
