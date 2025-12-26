import { api } from './client';
import {
  Discount,
  DiscountCreatePayload,
  DiscountUpdatePayload,
  DiscountListFilters,
  DiscountListResponse,
} from '@/types/discount';

export type APIResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

const buildParams = (filters?: Record<string, any>) => {
  const params = new URLSearchParams();
  Object.entries(filters || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      params.append(k, String(v));
    }
  });
  return params.toString();
};

export const listDiscounts = (
  filters: DiscountListFilters
): Promise<APIResponse<DiscountListResponse>> => {
  return api.get(
    `/discounts?${buildParams(filters)}`
  );
};

export const getDiscount = (
  id: number
): Promise<APIResponse<Discount>> => {
  return api.get(`/discounts/${id}`);
};

export const createDiscount = (
  payload: DiscountCreatePayload
): Promise<APIResponse<Discount>> => {
  return api.post('/discounts', payload);
};

export const updateDiscount = (
  id: number,
  payload: DiscountUpdatePayload
): Promise<APIResponse<Discount>> => {
  return api.patch(`/discounts/${id}`, payload);
};

export const deactivateDiscount = (
  id: number
): Promise<APIResponse<Discount>> => {
  return api.patch(`/discounts/${id}/deactivate`);
};

export const reactivateDiscount = (
  id: number
): Promise<APIResponse<Discount>> => {
  return api.patch(`/discounts/${id}/activate`);
};
