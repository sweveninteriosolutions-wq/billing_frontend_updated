// src/types/purchaseOrder.ts

export type POStatus =
  | 'draft'
  | 'submitted'
  | 'approved'
  | 'partially_received'
  | 'received'
  | 'cancelled';

export type POItemCreate = {
  product_id: number;
  quantity_ordered: number;
  unit_cost: number;
};

export type PurchaseOrderCreatePayload = {
  supplier_id: number;
  location_id: number;
  expected_date?: string | null;
  notes?: string | null;
  items: POItemCreate[];
};

export type POItemOut = {
  id: number;
  product_id: number;
  product_name?: string | null;
  quantity_ordered: number;
  quantity_received: number;
  unit_cost: string | number;
  line_total: string | number;
};

export type PurchaseOrderOut = {
  id: number;
  po_number: string;
  supplier_id: number;
  supplier_name?: string | null;
  location_id: number;
  location_name?: string | null;
  status: POStatus;
  expected_date?: string | null;
  notes?: string | null;
  gross_amount: string | number;
  tax_amount: string | number;
  net_amount: string | number;
  version: number;
  created_at: string;
  updated_at?: string | null;
  items: POItemOut[];
};

export type PurchaseOrderListItem = {
  id: number;
  po_number: string;
  supplier_name: string;
  location_name: string;
  status: POStatus;
  net_amount: string | number;
  expected_date?: string | null;
  items_count: number;
  created_at: string;
};

export type PurchaseOrderListResponse = {
  total: number;
  items: PurchaseOrderListItem[];
};
