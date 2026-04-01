// src/api/warehouse.api.ts
import { api } from './client';
import {
  WarehouseOut,
  WarehouseListResponse,
  WarehouseCreatePayload,
  WarehouseUpdatePayload,
} from '@/types/warehouse';

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

export const getWarehouses = async (params?: {
  page?: number;
  page_size?: number;
  include_inactive?: boolean;
}): Promise<WarehouseListResponse> => {
  const res = await api.get<APIResponse<WarehouseListResponse>>(`/warehouses/${qs(params)}`);
  return (res as any).data ?? res;
};

export const getWarehouse = async (id: number): Promise<WarehouseOut> => {
  const res = await api.get<APIResponse<WarehouseOut>>(`/warehouses/${id}`);
  return (res as any).data ?? res;
};

export const createWarehouse = async (payload: WarehouseCreatePayload): Promise<WarehouseOut> => {
  const res = await api.post<APIResponse<WarehouseOut>>('/warehouses/', payload);
  return (res as any).data ?? res;
};

export const updateWarehouse = async (
  id: number,
  payload: WarehouseUpdatePayload
): Promise<WarehouseOut> => {
  const res = await api.patch<APIResponse<WarehouseOut>>(`/warehouses/${id}`, payload);
  return (res as any).data ?? res;
};

export const deleteWarehouse = async (id: number): Promise<void> => {
  await api.delete(`/warehouses/${id}`);
};
