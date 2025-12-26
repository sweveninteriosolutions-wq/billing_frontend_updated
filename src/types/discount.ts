export type DiscountType = 'percentage' | 'flat';

export interface Discount {
  id: number;
  name: string;
  code: string;
  discount_type: DiscountType;
  discount_value: string; // Decimal comes as string
  is_active: boolean;
  is_deleted: boolean;
  start_date: string;
  end_date: string;
  usage_limit?: number;
  used_count: number;
  note?: string;
  created_at: string;
  updated_at?: string;
  created_by?: number;
  updated_by?: number;
  created_by_name?: string;
  updated_by_name?: string;
  version: number;
}

export interface DiscountCreatePayload {
  name: string;
  code: string;
  discount_type: DiscountType;
  discount_value: string;
  start_date: string;
  end_date: string;
  usage_limit?: number;
  note?: string;
}

export interface DiscountUpdatePayload {
  name?: string;
  discount_type?: DiscountType;
  discount_value?: string;
  start_date?: string;
  end_date?: string;
  usage_limit?: number;
  note?: string;
  is_active?: boolean;
  version: number;
}

export interface DiscountListFilters {
  search?: string;
  code?: string;
  name?: string;
  discount_type?: DiscountType;
  is_active?: boolean;
  is_deleted?: boolean;
  start_date?: string;
  end_date?: string;
  page?: number;
  page_size?: number;
}

export interface DiscountListResponse {
  total: number;
  items: Discount[];
}
