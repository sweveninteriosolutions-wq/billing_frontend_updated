// src/queries/warehouse.queries.ts
import { useQuery } from '@tanstack/react-query';
import { getWarehouses, getWarehouse } from '@/api/warehouse.api';

export const useWarehouses = (params?: {
  page?: number;
  page_size?: number;
  include_inactive?: boolean;
}) =>
  useQuery({
    queryKey: ['warehouses', params],
    queryFn: () => getWarehouses(params),
  });

export const useWarehouse = (id: number | null) =>
  useQuery({
    queryKey: ['warehouse', id],
    queryFn: () => getWarehouse(id!),
    enabled: !!id,
  });
