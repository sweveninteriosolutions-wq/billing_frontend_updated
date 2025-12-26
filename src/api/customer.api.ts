import { api } from './client';
import {
  Customer,
  CustomerListData,
  CustomerCreateInput,
  CustomerUpdateInput,
} from '@/types/customer';

/* =========================
   SAFE QUERY SERIALIZER
========================= */
function buildQueryString(params?: Record<string, any>) {
  if (!params) return '';

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
}

export const customerApi = {
  /* =========================
     LIST
  ========================= */
  list: (params?: Record<string, any>) => {
    const query = buildQueryString(params);
    const url = query
      ? `/billing/customers?${query}`
      : '/billing/customers';

    return api.get<{
      success: boolean;
      message: string;
      data: CustomerListData;
    }>(url);
  },

  /* =========================
     GET
  ========================= */
  get: (id: number) =>
    api.get<{ data: Customer }>(
      `/billing/customers/${id}`
    ),

  /* =========================
     CREATE
  ========================= */
  create: (payload: CustomerCreateInput) =>
    api.post<{ data: Customer }>(
      '/billing/customers',
      payload
    ),

  /* =========================
     UPDATE
  ========================= */
  update: (id: number, payload: CustomerUpdateInput) =>
    api.patch<{ data: Customer }>(
      `/billing/customers/${id}`,
      payload
    ),

  /* =========================
     DEACTIVATE
  ========================= */
  deactivate: (id: number) =>
    api.delete<{ data: Customer }>(
      `/billing/customers/${id}`
    ),
};
