// src/mutations/discount.mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createDiscount,
  updateDiscount,
  deactivateDiscount,
  reactivateDiscount,
} from '@/api/discount.api';
import { DISCOUNTS_QUERY_KEY } from '@/queries/discount.queries';
import { extractErrorMessage } from '@/lib/apiRequest';

export function useCreateDiscount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createDiscount,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DISCOUNTS_QUERY_KEY });
      toast.success('Discount created successfully');
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}

export function useUpdateDiscount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      updateDiscount(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DISCOUNTS_QUERY_KEY });
      toast.success('Discount updated');
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}

export function useDeactivateDiscount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deactivateDiscount(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DISCOUNTS_QUERY_KEY });
      toast.success('Discount deactivated');
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}

export function useActivateDiscount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => reactivateDiscount(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DISCOUNTS_QUERY_KEY });
      toast.success('Discount activated');
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}
