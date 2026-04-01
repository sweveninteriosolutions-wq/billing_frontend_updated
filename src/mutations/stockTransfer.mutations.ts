// src/mutations/stockTransfer.mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createStockTransfer,
  completeStockTransfer,
  cancelStockTransfer,
} from '@/api/stockTransfer.api';
import { STOCK_TRANSFER_KEYS } from '@/queries/stockTransfer.queries';
import { extractErrorMessage } from '@/lib/apiRequest';

export const useCreateStockTransfer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createStockTransfer,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: STOCK_TRANSFER_KEYS.all });
      toast.success('Stock transfer created');
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
};

export const useCompleteStockTransfer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: completeStockTransfer,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: STOCK_TRANSFER_KEYS.all });
      toast.success('Stock transfer completed');
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
};

export const useCancelStockTransfer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: cancelStockTransfer,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: STOCK_TRANSFER_KEYS.all });
      toast.success('Stock transfer cancelled');
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
};
