// src/queries/purchaseOrder.queries.ts
import { useQuery } from '@tanstack/react-query';
import {
  getPurchaseOrders,
  getPurchaseOrder,
  POListQuery,
} from '@/api/purchaseOrder.api';
import { PurchaseOrderListResponse, PurchaseOrderOut } from '@/types/purchaseOrder';

export const PO_KEYS = {
  all: ['purchase-orders'] as const,
  list: (params: unknown) => ['purchase-orders', 'list', params] as const,
  detail: (id: number) => ['purchase-orders', id] as const,
};

export const usePurchaseOrders = (params: POListQuery) =>
  useQuery<PurchaseOrderListResponse>({
    queryKey: PO_KEYS.list(params),
    queryFn: () => getPurchaseOrders(params),
  });

export const usePurchaseOrder = (id: number, enabled = true) =>
  useQuery<PurchaseOrderOut>({
    queryKey: PO_KEYS.detail(id),
    queryFn: () => getPurchaseOrder(id),
    enabled,
  });
