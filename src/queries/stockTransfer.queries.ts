import { useQuery } from "@tanstack/react-query";
import { getStockTransfers, StockTransferQuery } from "@/api/stockTransfer.api";
import { StockTransferListResponse } from "@/types/stockTransfer";

export const STOCK_TRANSFER_KEYS = {
  all: ["stock-transfers"] as const,
  list: (params: StockTransferQuery) =>
    [...STOCK_TRANSFER_KEYS.all, params] as const,
};

export const useStockTransfers = (params: StockTransferQuery) => {
  return useQuery<StockTransferListResponse>({
    queryKey: STOCK_TRANSFER_KEYS.list(params),
    queryFn: () => getStockTransfers(params),
    placeholderData: (prev) => prev,
  });
};
