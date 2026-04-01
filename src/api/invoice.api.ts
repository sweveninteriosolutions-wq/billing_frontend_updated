// src/api/invoice.api.ts
import { api } from "./client";
import {
  InvoiceCreatePayload,
  InvoiceUpdatePayload,
  InvoiceDiscountPayload,
  InvoiceAdminDiscountPayload,
  PaymentCreatePayload,
  InvoiceOut,
  InvoiceListResponse,
  PaymentOut,
} from "@/types/invoice";

type APIResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

const qs = (params?: Record<string, any>) => {
  if (!params) return "";
  const s = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) s.append(k, String(v));
  });
  const q = s.toString();
  return q ? `?${q}` : "";
};

export type InvoiceListQuery = {
  page?: number;
  page_size?: number;
  status?: string;
  customer_id?: number;
  search?: string;
};

export const getInvoices = async (params: InvoiceListQuery): Promise<InvoiceListResponse> => {
  const res = await api.get<APIResponse<InvoiceListResponse>>(`/invoices/${qs(params)}`);
  return res.data;
};

export const getInvoice = async (id: number): Promise<InvoiceOut> => {
  const res = await api.get<APIResponse<InvoiceOut>>(`/invoices/${id}`);
  return res.data;
};

export const createInvoice = async (payload: InvoiceCreatePayload): Promise<InvoiceOut> => {
  const res = await api.post<APIResponse<InvoiceOut>>("/invoices", payload);
  return res.data;
};

export const updateInvoice = async (id: number, payload: InvoiceUpdatePayload): Promise<InvoiceOut> => {
  const res = await api.patch<APIResponse<InvoiceOut>>(`/invoices/${id}`, payload);
  return res.data;
};

export const verifyInvoice = async (id: number): Promise<InvoiceOut> => {
  const res = await api.post<APIResponse<InvoiceOut>>(`/invoices/${id}/verify`);
  return res.data;
};

export const applyDiscount = async (id: number, payload: InvoiceDiscountPayload): Promise<InvoiceOut> => {
  const res = await api.post<APIResponse<InvoiceOut>>(`/invoices/${id}/discount`, payload);
  return res.data;
};

export const overrideDiscount = async (id: number, payload: InvoiceAdminDiscountPayload): Promise<InvoiceOut> => {
  const res = await api.post<APIResponse<InvoiceOut>>(`/invoices/${id}/override-discount`, payload);
  return res.data;
};

export const addPayment = async (id: number, payload: PaymentCreatePayload): Promise<PaymentOut> => {
  const res = await api.post<APIResponse<PaymentOut>>(`/invoices/${id}/payments`, payload);
  return res.data;
};

export const fulfillInvoice = async (id: number, version: number): Promise<InvoiceOut> => {
  const res = await api.post<APIResponse<InvoiceOut>>(`/invoices/${id}/fulfill`, { version });
  return res.data;
};

export const cancelInvoice = async (id: number): Promise<InvoiceOut> => {
  const res = await api.post<APIResponse<InvoiceOut>>(`/invoices/${id}/cancel`);
  return res.data;
};

export const downloadInvoicePdf = async (id: number): Promise<void> => {
  const base = import.meta.env.VITE_API_URL || "";
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${base}/pdf/invoice/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Failed to download invoice PDF");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
};
