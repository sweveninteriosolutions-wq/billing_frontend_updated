import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customerApi } from '@/api/customer.api';
import { CUSTOMER_KEYS } from '@/queries/customer.queries';
import {
  CustomerCreateInput,
  CustomerUpdateInput,
} from '@/types/customer';

/* =========================
   CREATE
========================= */
export function useCreateCustomer() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CustomerCreateInput) =>
      customerApi.create(payload),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: CUSTOMER_KEYS.all,
      });
    },
  });
}

/* =========================
   UPDATE
========================= */
export function useUpdateCustomer() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: CustomerUpdateInput;
    }) => customerApi.update(id, payload),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: CUSTOMER_KEYS.all,
      });
    },
  });
}

/* =========================
   DEACTIVATE
========================= */
export function useDeactivateCustomer() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
    }: {
      id: number;
    }) => customerApi.deactivate(id),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: CUSTOMER_KEYS.all,
      });
    },
  });
}
