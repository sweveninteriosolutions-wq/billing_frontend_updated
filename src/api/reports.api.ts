// src/api/reports.api.ts
import { api } from './client';
import {
  SalesSummary,
  DailySalesItem,
  TopProductItem,
  TopCustomerItem,
  LowStockItem,
} from '@/types/reports';

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

export const getSalesSummary = async (params: {
  from_date: string;
  to_date: string;
}): Promise<SalesSummary> => {
  const res = await api.get<APIResponse<SalesSummary>>(`/reports/sales/summary${qs(params)}`);
  return (res as any).data ?? res;
};

export const getDailySales = async (params: { days: number }): Promise<DailySalesItem[]> => {
  const res = await api.get<APIResponse<DailySalesItem[]>>(`/reports/sales/daily${qs(params)}`);
  return (res as any).data ?? res;
};

export const getTopProducts = async (params: {
  from_date: string;
  to_date: string;
  limit?: number;
}): Promise<TopProductItem[]> => {
  const res = await api.get<APIResponse<TopProductItem[]>>(`/reports/products/top${qs(params)}`);
  return (res as any).data ?? res;
};

export const getTopCustomers = async (params: {
  from_date: string;
  to_date: string;
  limit?: number;
}): Promise<TopCustomerItem[]> => {
  const res = await api.get<APIResponse<TopCustomerItem[]>>(`/reports/customers/top${qs(params)}`);
  return (res as any).data ?? res;
};

export const getLowStock = async (): Promise<LowStockItem[]> => {
  const res = await api.get<APIResponse<LowStockItem[]>>('/reports/inventory/low-stock');
  return (res as any).data ?? res;
};
