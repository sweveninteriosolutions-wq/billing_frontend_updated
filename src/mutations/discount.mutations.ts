import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createDiscount,
  updateDiscount,
  deactivateDiscount,
  reactivateDiscount,
} from '@/api/discount.api';
import { DISCOUNTS_QUERY_KEY } from '@/queries/discount.queries';

export function useCreateDiscount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createDiscount,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DISCOUNTS_QUERY_KEY });
    },
  });
}

export function useUpdateDiscount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      updateDiscount(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DISCOUNTS_QUERY_KEY });
    },
  });
}

export function useDeactivateDiscount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deactivateDiscount(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DISCOUNTS_QUERY_KEY });
    },
  });
}

export function useActivateDiscount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => reactivateDiscount(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DISCOUNTS_QUERY_KEY });
    },
  });
}
