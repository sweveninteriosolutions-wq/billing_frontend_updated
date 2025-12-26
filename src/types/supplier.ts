export type Supplier = {
  id: number;
  supplier_code: string;

  name: string;
  contact_person?: string | null;
  phone?: string | null;
  email?: string | null;

  is_deleted: boolean;
  version: number;

  created_by?: number;
  updated_by?: number;
  created_by_name?: string;
  updated_by_name?: string;

  created_at: string;
  updated_at?: string;
};

export type SupplierListData = {
  total: number;
  items: Supplier[];
};

export type SupplierCreateInput = {
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
};

export type SupplierUpdateInput = {
  name?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  is_deleted?: boolean;
  version: number;
};
