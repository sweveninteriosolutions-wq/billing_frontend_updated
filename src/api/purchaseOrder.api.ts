// src/api/purchaseOrder.api.ts
import { api } from './client';
import {
  PurchaseOrderCreatePayload,
  PurchaseOrderOut,
  PurchaseOrderListResponse,
} from '@/types/purchaseOrder';

type APIResponse<T> = { success: boolean; message: string; data: T };

export type POListQuery = {
  page?: number;
  page_size?: number;
  supplier_id?: number;
  status?: string;
};

const qs = (params?: Record<string, any>) => {
  if (!params) return '';
  const s = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) s.append(k, String(v));
  });
  const q = s.toString();
  return q ? `?${q}` : '';
};

export const getPurchaseOrders = async (
  params: POListQuery
): Promise<PurchaseOrderListResponse> => {
  const res = await api.get<APIResponse<PurchaseOrderListResponse>>(
    `/purchase-orders${qs(params)}`
  );
  return res.data;
};

export const getPurchaseOrder = async (id: number): Promise<PurchaseOrderOut> => {
  const res = await api.get<APIResponse<PurchaseOrderOut>>(`/purchase-orders/${id}`);
  return res.data;
};

export const createPurchaseOrder = async (
  payload: PurchaseOrderCreatePayload
): Promise<PurchaseOrderOut> => {
  const res = await api.post<APIResponse<PurchaseOrderOut>>('/purchase-orders', payload);
  return res.data;
};

export const submitPurchaseOrder = async (id: number): Promise<PurchaseOrderOut> => {
  const res = await api.post<APIResponse<PurchaseOrderOut>>(`/purchase-orders/${id}/submit`);
  return res.data;
};

export const approvePurchaseOrder = async (id: number): Promise<PurchaseOrderOut> => {
  const res = await api.post<APIResponse<PurchaseOrderOut>>(`/purchase-orders/${id}/approve`);
  return res.data;
};

export const cancelPurchaseOrder = async (id: number): Promise<PurchaseOrderOut> => {
  const res = await api.post<APIResponse<PurchaseOrderOut>>(`/purchase-orders/${id}/cancel`);
  return res.data;
};
