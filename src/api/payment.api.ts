// src/api/payment.api.ts
import { api } from "./client";
import { PaymentListResponse } from "@/types/payment";

type APIResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const getPaymentsByInvoice = async (invoiceId: number): Promise<PaymentListResponse> => {
  const res = await api.get<APIResponse<PaymentListResponse>>(`/payments/?invoice_id=${invoiceId}`);
  return res.data;
};
