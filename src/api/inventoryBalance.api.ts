import { api } from "./client";
import {
  InventoryBalanceListData,
  InventoryBalance,
} from "@/types/inventoryBalance";

export type APIResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type InventoryBalanceQuery = {
  product_id?: number;
  location_id?: number;
  search?: string;
  page?: number;
  page_size?: number;
};

export const getInventoryBalances = async (
  params: InventoryBalanceQuery
): Promise<InventoryBalanceListData> => {
  const res = await api.get<APIResponse<InventoryBalanceListData>>(
    "/inventory/balances/",
    params // ✅ PASS PARAMS DIRECTLY
  );

  return res.data; // backend already wraps data
};

export const getLowStockBalances = async (): Promise<InventoryBalance[]> => {
  const res = await api.get<APIResponse<InventoryBalance[]>>(
    "/inventory/balances/low-stock"
  );

  return res.data;
};
