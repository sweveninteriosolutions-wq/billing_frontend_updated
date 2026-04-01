// src/api/inventoryMovement.api.ts
import { api } from './client';
import { InventoryMovementListData } from '@/types/inventoryMovement';

type APIResponse<T> = { success: boolean; message: string; data: T };

export interface MovementListParams {
  product_id?: number;
  location_id?: number;
  reference_type?: string;
  page?: number;
  page_size?: number;
}

export const getInventoryMovements = async (
  params?: MovementListParams
): Promise<InventoryMovementListData> => {
  const res = await api.get<APIResponse<InventoryMovementListData>>(
    '/inventory/movements',
    params as Record<string, any>
  );
  return (res as any).data ?? res;
};
