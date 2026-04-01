// src/mutations/warehouse.mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createWarehouse, updateWarehouse, deleteWarehouse } from '@/api/warehouse.api';
import { WarehouseCreatePayload, WarehouseUpdatePayload } from '@/types/warehouse';

export const useCreateWarehouse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: WarehouseCreatePayload) => createWarehouse(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['warehouses'] }),
  });
};

export const useUpdateWarehouse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: WarehouseUpdatePayload }) =>
      updateWarehouse(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['warehouses'] }),
  });
};

export const useDeleteWarehouse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteWarehouse(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['warehouses'] }),
  });
};
