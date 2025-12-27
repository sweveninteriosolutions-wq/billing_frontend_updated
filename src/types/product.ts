export type Product = {
  id: number;
  sku: string;
  name: string;
  category?: string | null;
  hsn_code: number;
  price: string; // Decimal from backend → string
  min_stock_threshold: number;
  supplier_id?: number | null;

  is_deleted: boolean;
  version: number;

  created_by?: number;
  updated_by?: number;
  created_by_name?: string;
  updated_by_name?: string;

  created_at: string;
  updated_at?: string;
};

export type ProductListData = {
  total: number;
  items: Product[];
};

export type ProductCreateInput = {
  sku: string;
  name: string;
  category?: string;
  price: number;
  min_stock_threshold: number;
  supplier_id?: number;
};

export type ProductUpdateInput = {
  name?: string;
  category?: string;
  price?: number;
  min_stock_threshold?: number;
  supplier_id?: number;
  version: number;
};

export type ProductFormValues = {
  sku: string;
  name: string;
  category?: string;
  price: number;
  min_stock_threshold: number;
  supplier_id?: number;
};


