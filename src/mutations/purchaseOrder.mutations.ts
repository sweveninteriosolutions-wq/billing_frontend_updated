// src/mutations/purchaseOrder.mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createPurchaseOrder,
  submitPurchaseOrder,
  approvePurchaseOrder,
  cancelPurchaseOrder,
} from '@/api/purchaseOrder.api';
import { PO_KEYS } from '@/queries/purchaseOrder.queries';

export const useCreatePurchaseOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createPurchaseOrder,
    onSuccess: () => qc.invalidateQueries({ queryKey: PO_KEYS.all }),
  });
};

export const useSubmitPurchaseOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => submitPurchaseOrder(id),
    onSuccess: (_: any, id: number) => {
      qc.invalidateQueries({ queryKey: PO_KEYS.all });
      qc.invalidateQueries({ queryKey: PO_KEYS.detail(id) });
    },
  });
};

export const useApprovePurchaseOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => approvePurchaseOrder(id),
    onSuccess: (_: any, id: number) => {
      qc.invalidateQueries({ queryKey: PO_KEYS.all });
      qc.invalidateQueries({ queryKey: PO_KEYS.detail(id) });
    },
  });
};

export const useCancelPurchaseOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cancelPurchaseOrder(id),
    onSuccess: (_: any, id: number) => {
      qc.invalidateQueries({ queryKey: PO_KEYS.all });
      qc.invalidateQueries({ queryKey: PO_KEYS.detail(id) });
    },
  });
};
