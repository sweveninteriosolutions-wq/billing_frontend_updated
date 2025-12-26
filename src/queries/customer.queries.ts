import { useQuery } from '@tanstack/react-query';
import { customerApi } from '@/api/customer.api';
import { CustomerListData, Customer } from '@/types/customer';

export type CustomerListParams = {
  name?: string;
  gstin?: string;
  email?: string;
  phone?: string;
  is_active?: boolean;
  page?: number;
  page_size?: number;
};

export const CUSTOMER_KEYS = {
  all: ['customers'] as const,

  list: (params: CustomerListParams) =>
    [
      ...CUSTOMER_KEYS.all,
      {
        name: params.name ?? null,
        gstin: params.gstin ?? null,
        email: params.email ?? null,
        phone: params.phone ?? null,
        is_active:
          typeof params.is_active === 'boolean'
            ? params.is_active
            : null,
        page: params.page ?? 1,
        page_size: params.page_size ?? 10,
      },
    ] as const,

  detail: (id: number) =>
    [...CUSTOMER_KEYS.all, 'detail', id] as const,
};

export function useCustomers(params: CustomerListParams) {
  return useQuery<CustomerListData>({
    queryKey: CUSTOMER_KEYS.list(params),
    queryFn: async () => {
      const res = await customerApi.list(params);
      return res.data;
    },
  });
}

export function useCustomer(id: number, enabled = true) {
  return useQuery<Customer>({
    queryKey: CUSTOMER_KEYS.detail(id),
    queryFn: async () => {
      const res = await customerApi.get(id);
      return res.data;
    },
    enabled,
  });
}
