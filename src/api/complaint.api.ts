// src/api/complaint.api.ts
import { api } from './client';

type APIResponse<T> = { message: string; data?: T; total?: number };

export type ComplaintStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type ComplaintPriority = 'low' | 'medium' | 'high' | 'critical';

export interface ComplaintOut {
  id: number;
  customer_id: number;
  invoice_id: number | null;
  product_id: number | null;
  title: string;
  description: string | null;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  created_at: string;
  updated_at: string | null;
}

export interface ComplaintListResponse {
  message: string;
  total: number;
  data: ComplaintOut[];
}

export interface ComplaintCreatePayload {
  customer_id: number;
  invoice_id?: number;
  product_id?: number;
  title: string;
  description?: string;
  priority?: ComplaintPriority;
}

const qs = (params?: Record<string, any>) => {
  if (!params) return '';
  const s = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) s.append(k, String(v));
  });
  const q = s.toString();
  return q ? `?${q}` : '';
};

export const getComplaints = async (params?: {
  page?: number;
  page_size?: number;
  status?: string;
  priority?: string;
  search?: string;
  customer_id?: number;
}): Promise<ComplaintListResponse> => {
  return api.get<ComplaintListResponse>(`/complaints/${qs(params)}`);
};

export const createComplaint = async (payload: ComplaintCreatePayload): Promise<ComplaintOut> => {
  const res = await api.post<{ message: string; data: ComplaintOut }>('/complaints/', payload);
  return (res as any).data ?? res;
};

export const updateComplaintStatus = async (
  id: number,
  status: ComplaintStatus
): Promise<ComplaintOut> => {
  const res = await api.patch<{ message: string; data: ComplaintOut }>(`/complaints/${id}/status`, { status });
  return (res as any).data ?? res;
};

export const deleteComplaint = async (id: number): Promise<void> => {
  await api.delete(`/complaints/${id}`);
};
