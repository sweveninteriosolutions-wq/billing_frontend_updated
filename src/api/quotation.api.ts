// src/api/quotation.api.ts

import { api } from "./client";
import {
  QuotationCreatePayload,
  QuotationUpdatePayload,
  QuotationDetail,
  QuotationListResponse,
} from "@/types/quotation";

/* =========================
   QUERY TYPES
========================= */
export type QuotationListQuery = {
  customer_id?: number;
  status?: string;

  is_deleted?: boolean;

  page?: number;
  page_size?: number;
  sort_by?: string;
  order?: "asc" | "desc";
};


type APIResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

/* =========================
   HELPERS
========================= */
const qs = (params?: Record<string, any>) => {
  if (!params) return "";
  const s = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) {
      s.append(k, String(v));
    }
  });
  const q = s.toString();
  return q ? `?${q}` : "";
};

/* =========================
   API CALLS
========================= */

export const getQuotations = async (
  params: QuotationListQuery
): Promise<QuotationListResponse> => {
  const res = await api.get<APIResponse<QuotationListResponse>>(
    `/quotations/${qs(params)}`
  );
  return res.data;
};

export const getQuotation = async (
  id: number
): Promise<QuotationDetail> => {
  const res = await api.get<APIResponse<QuotationDetail>>(
    `/quotations/${id}`
  );
  return res.data;
};

export const createQuotation = async (
  payload: QuotationCreatePayload
) => {
  const res = await api.post<APIResponse<any>>(
    `/quotations`,
    payload
  );
  return res.data;
};

export const updateQuotation = async (
  id: number,
  payload: QuotationUpdatePayload
) => {
  const res = await api.patch<APIResponse<any>>(
    `/quotations/${id}`,
    payload
  );
  return res.data;
};

export const approveQuotation = async (
  id: number,
  version: number
) => {
  const res = await api.post<APIResponse<any>>(
    `/quotations/${id}/approve${qs({ version })}`
  );
  return res.data;
};

export const deleteQuotation = async (
  id: number,
  version: number
) => {
  const res = await api.delete<APIResponse<any>>(
    `/quotations/${id}${qs({ version })}`
  );
  return res.data;
};

export const convertQuotationToInvoice = async (
  id: number,
  version: number
) => {
  const res = await api.post<APIResponse<any>>(
    `/quotations/${id}/convert-to-invoice${qs({ version })}`
  );
  return res.data;
};
