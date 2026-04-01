// src/mutations/customer.mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { customerApi } from '@/api/customer.api';
import { CUSTOMER_KEYS } from '@/queries/customer.queries';
import { extractErrorMessage } from '@/lib/apiRequest';
import { CustomerCreateInput, CustomerUpdateInput } from '@/types/customer';

export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CustomerCreateInput) => customerApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CUSTOMER_KEYS.all });
      toast.success('Customer created successfully');
    },
    onError: (err) => {
      toast.error(extractErrorMessage(err));
    },
  });
}

export function useUpdateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CustomerUpdateInput }) =>
      customerApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CUSTOMER_KEYS.all });
      toast.success('Customer updated successfully');
    },
    onError: (err) => {
      toast.error(extractErrorMessage(err));
    },
  });
}

export function useDeactivateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number }) => customerApi.deactivate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CUSTOMER_KEYS.all });
      toast.success('Customer deactivated');
    },
    onError: (err) => {
      toast.error(extractErrorMessage(err));
    },
  });
}
