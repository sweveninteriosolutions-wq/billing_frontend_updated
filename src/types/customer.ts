// types/customer.ts
export type CustomerAddress = {
  street?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
};

export type Customer = {
  id: number;
  customer_code: string;
  name: string;
  email: string;
  phone?: string;
  gstin?: string | null;
  address?: CustomerAddress;

  is_active: boolean;
  is_deleted: boolean;
  version: number;

  created_by_id?: number;
  created_by_name?: string;
  updated_by_id?: number;
  updated_by_name?: string;

  created_at: string;
  updated_at?: string;
};


export type CustomerListData = {
  total: number;
  items: Customer[];
};

export type CustomerCreateInput = {
  name: string;
  email: string;
  phone?: string;
  gstin?: string | null;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    country?: string;
  };
};


export type CustomerUpdateInput = {
  name?: string;
  email?: string;
  phone?: string;
  address?: Record<string, string>;
  is_active?: boolean;
  version: number;
};
