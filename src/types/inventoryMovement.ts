// src/types/inventoryMovement.ts
export interface InventoryMovementOut {
  id: number;
  product_id: number;
  product_name: string | null;
  product_sku: string | null;
  location_id: number;
  location_name: string | null;
  quantity_change: number;
  reference_type: string;
  reference_id: number;
  created_at: string;
  created_by: number | null;
  created_by_name: string | null;
}

export interface InventoryMovementListData {
  total: number;
  items: InventoryMovementOut[];
}
