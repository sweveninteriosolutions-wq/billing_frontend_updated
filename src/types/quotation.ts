// src/types/quotation.ts

export type QuotationStatus =
  | "draft"
  | "approved"
  | "expired"
  | "converted_to_invoice"
  | "cancelled"
  | "invoiced";

/* =========================
   ITEM
========================= */
export type QuotationItem = {
  product_id: number;
  quantity: number;
};

/* =========================
   CREATE
========================= */
export type QuotationCreatePayload = {
  customer_id: number;
  is_inter_state: boolean;
  valid_until: string; // frontend-calculated
  description?: string;
  notes?: string;
  items: QuotationItem[];
};

/* =========================
   UPDATE
========================= */
export type QuotationUpdatePayload = {
  description?: string;
  notes?: string;
  valid_until?: string;
  items?: QuotationItem[];
  version: number;
};

/* =========================
   LIST VIEW
========================= */
export type QuotationView = {
  id: number;
  quotation_number: string;

  customer_id: number;
  customer_name: string;

  status: QuotationStatus;
  items_count: number;

  subtotal_amount: number | string;
  tax_amount: number | string;
  total_amount: number | string;

  valid_until?: string;
  version: number;
  is_deleted: boolean;

  created_at: string;
  created_by_name?: string;
};

export type QuotationListResponse = {
  total: number;
  items: QuotationView[];
};

// src/types/quotation.ts

export type QuotationCustomer = {
  id: number;
  customer_code: string;
  name: string;
  email: string;
  phone?: string;
  gstin?: string | null;
  address?: {
    city?: string;
    state?: string;
    street?: string;
    country?: string;
    zip_code?: string;
  };
  is_active: boolean;
};

export type QuotationDetailItem = {
  id: number;
  product_id: number;
  product_name: string;
  sku: string;
  hsn_code: number;
  category?: string;
  quantity: number;
  unit_price: number | string;
  line_total: number | string;
};

export type QuotationDetail = {
  id: number;
  quotation_number: string;

  customer: QuotationCustomer;

  status: QuotationStatus;
  valid_until?: string;

  subtotal_amount: number | string;
  tax_amount: number | string;
  total_amount: number | string;

  is_inter_state: boolean;

  cgst_rate: number | string;
  sgst_rate: number | string;
  igst_rate: number | string;

  cgst_amount: number | string;
  sgst_amount: number | string;
  igst_amount: number | string;

  description?: string;
  notes?: string;
  additional_data?: any;

  item_signature: string;
  version: number;

  created_at: string;
  updated_at?: string;
  created_by_name?: string;
  updated_by_name?: string;

  items: QuotationDetailItem[];
};
