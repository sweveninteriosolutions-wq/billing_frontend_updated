// src/queries/inventoryMovement.queries.ts
import { useQuery } from '@tanstack/react-query';
import { getInventoryMovements, MovementListParams } from '@/api/inventoryMovement.api';

export const useInventoryMovements = (params?: MovementListParams) =>
  useQuery({
    queryKey: ['inventory-movements', params],
    queryFn: () => getInventoryMovements(params),
    staleTime: 60 * 1000,
  });
