// src/types/invoice.ts

export type InvoiceStatus =
  | "draft"
  | "verified"
  | "partially_paid"
  | "paid"
  | "fulfilled"
  | "cancelled";

export type InvoiceItemIn = {
  product_id: number;
  quantity: number;
  unit_price: number;
};

export type InvoiceCreatePayload = {
  customer_id: number;
  quotation_id?: number | null;
  is_inter_state: boolean;
  items: InvoiceItemIn[];
};

export type InvoiceUpdatePayload = {
  version: number;
  items: InvoiceItemIn[];
};

export type InvoiceDiscountPayload = {
  discount_amount: number;
  reason?: string;
};

export type InvoiceAdminDiscountPayload = {
  version: number;
  discount_amount: number;
  reason?: string;
};

export type PaymentCreatePayload = {
  amount: number;
  payment_method?: string;
};

export type InvoiceItemOut = {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: string | number;
  line_total: string | number;
};

export type PaymentOut = {
  id: number;
  amount: string | number;
  payment_method?: string;
  created_at: string;
};

export type InvoiceOut = {
  id: number;
  invoice_number: string;
  customer_id: number;
  quotation_id?: number | null;
  status: InvoiceStatus;
  gross_amount: string | number;
  tax_amount: string | number;
  discount_amount: string | number;
  net_amount: string | number;
  total_paid: string | number;
  balance_due: string | number;
  version: number;
  created_at: string;
  updated_at?: string | null;
  items: InvoiceItemOut[];
  payments: PaymentOut[];
};

export type InvoiceListItem = {
  id: number;
  invoice_number: string;
  customer_name: string;
  total_amount: string | number;
  total_paid: string | number;
  balance_due: string | number;
  due_date?: string | null;
  status: InvoiceStatus;
};

export type InvoiceListResponse = {
  total: number;
  items: InvoiceListItem[];
};
