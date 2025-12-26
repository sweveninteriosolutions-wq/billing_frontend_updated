import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createStockTransfer,
  completeStockTransfer,
  cancelStockTransfer,
} from "@/api/stockTransfer.api";
import { STOCK_TRANSFER_KEYS } from "@/queries/stockTransfer.queries";

export const useCreateStockTransfer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createStockTransfer,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: STOCK_TRANSFER_KEYS.all });
    },
  });
};

export const useCompleteStockTransfer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: completeStockTransfer,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: STOCK_TRANSFER_KEYS.all });
    },
  });
};

export const useCancelStockTransfer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: cancelStockTransfer,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: STOCK_TRANSFER_KEYS.all });
    },
  });
};
