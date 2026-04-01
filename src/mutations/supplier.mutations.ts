// src/mutations/supplier.mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supplierApi } from '@/api/supplier.api';
import { SUPPLIER_KEYS } from '@/queries/supplier.queries';
import { extractErrorMessage } from '@/lib/apiRequest';
import { SupplierCreateInput, SupplierUpdateInput } from '@/types/supplier';

export function useCreateSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SupplierCreateInput) => supplierApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SUPPLIER_KEYS.all });
      toast.success('Supplier created successfully');
    },
    onError: (err) => {
      toast.error(extractErrorMessage(err));
    },
  });
}

export function useUpdateSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: SupplierUpdateInput }) =>
      supplierApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SUPPLIER_KEYS.all });
      toast.success('Supplier updated successfully');
    },
    onError: (err) => {
      toast.error(extractErrorMessage(err));
    },
  });
}

export function useDeactivateSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, version }: { id: number; version: number }) =>
      supplierApi.deactivate(id, version),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SUPPLIER_KEYS.all });
      toast.success('Supplier deactivated');
    },
    onError: (err) => {
      toast.error(extractErrorMessage(err));
    },
  });
}
