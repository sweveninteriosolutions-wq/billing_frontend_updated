import { useQuery } from "@tanstack/react-query";
import {
  getInventoryBalances,
  getLowStockBalances,
  InventoryBalanceQuery,
} from "@/api/inventoryBalance.api";
import { InventoryBalanceListData } from "@/types/inventoryBalance";

export const INVENTORY_BALANCE_KEYS = {
  all: ["inventory-balances"] as const,

  list: (params: InventoryBalanceQuery) =>
    [...INVENTORY_BALANCE_KEYS.all, JSON.stringify(params)] as const,

  lowStock: () =>
    [...INVENTORY_BALANCE_KEYS.all, "low-stock"] as const,
};

export const useInventoryBalances = (
  params: InventoryBalanceQuery
) => {
  return useQuery<InventoryBalanceListData>({
    queryKey: INVENTORY_BALANCE_KEYS.list(params),
    queryFn: () => getInventoryBalances(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useLowStockBalances = () => {
  return useQuery({
    queryKey: INVENTORY_BALANCE_KEYS.lowStock(),
    queryFn: getLowStockBalances,
  });
};
