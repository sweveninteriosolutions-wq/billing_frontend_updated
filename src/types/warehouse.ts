// src/types/warehouse.ts

export interface WarehouseListItem {
  id: number;
  code: string;
  name: string;
  city: string | null;
  state: string | null;
  is_active: boolean;
  locations_count: number;
}

export interface WarehouseOut {
  id: number;
  code: string;
  name: string;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  gstin: string | null;
  phone: string | null;
  is_active: boolean;
  version: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface WarehouseListResponse {
  total: number;
  items: WarehouseListItem[];
}

export interface WarehouseCreatePayload {
  code: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstin?: string;
  phone?: string;
  is_active?: boolean;
}

export interface WarehouseUpdatePayload {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstin?: string;
  phone?: string;
  is_active?: boolean;
  version: number;
}
