// src/queries/reports.queries.ts
import { useQuery } from '@tanstack/react-query';
import {
  getSalesSummary,
  getDailySales,
  getTopProducts,
  getTopCustomers,
  getLowStock,
} from '@/api/reports.api';

export const useSalesSummary = (params: { from_date: string; to_date: string }) =>
  useQuery({
    queryKey: ['reports', 'sales-summary', params],
    queryFn: () => getSalesSummary(params),
    staleTime: 5 * 60 * 1000,
  });

export const useDailySales = (days: number) =>
  useQuery({
    queryKey: ['reports', 'daily-sales', days],
    queryFn: () => getDailySales({ days }),
    staleTime: 5 * 60 * 1000,
  });

export const useTopProducts = (params: {
  from_date: string;
  to_date: string;
  limit?: number;
}) =>
  useQuery({
    queryKey: ['reports', 'top-products', params],
    queryFn: () => getTopProducts(params),
    staleTime: 5 * 60 * 1000,
  });

export const useTopCustomers = (params: {
  from_date: string;
  to_date: string;
  limit?: number;
}) =>
  useQuery({
    queryKey: ['reports', 'top-customers', params],
    queryFn: () => getTopCustomers(params),
    staleTime: 5 * 60 * 1000,
  });

export const useLowStock = () =>
  useQuery({
    queryKey: ['reports', 'low-stock'],
    queryFn: getLowStock,
    staleTime: 2 * 60 * 1000,
  });
