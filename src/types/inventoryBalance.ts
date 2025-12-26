export type InventoryBalance = {
  product_id: number;
  product_name: string;
  sku: string;

  location_id: number;
  location_code: string;

  quantity: number;
  min_stock_threshold: number;
  updated_at?: string;
};

export type InventoryBalanceListData = {
  total: number;
  items: InventoryBalance[];
};
