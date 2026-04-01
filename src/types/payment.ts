// src/types/payment.ts

export type Payment = {
  id: number;
  invoice_id: number;
  amount: string | number;
  payment_method?: string;
  created_at: string;
};

export type PaymentListResponse = {
  total: number;
  items: Payment[];
};
