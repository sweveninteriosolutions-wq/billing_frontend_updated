// src/queries/dashboard.queries.ts
import { useQuery } from '@tanstack/react-query';
import { getSalesSummary, getDailySales, getLowStock } from '@/api/reports.api';
import { format, subDays } from 'date-fns';

const today = () => format(new Date(), 'yyyy-MM-dd');
const daysAgo = (n: number) => format(subDays(new Date(), n), 'yyyy-MM-dd');

export const useDashboardSummary = () =>
  useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => getSalesSummary({ from_date: daysAgo(30), to_date: today() }),
    staleTime: 5 * 60 * 1000,
  });

// NOTE: `days` param allows ManagerDashboard and others to control the window.
// Default = 30 days.
export const useDashboardDailySales = (days = 30) =>
  useQuery({
    queryKey: ['dashboard', 'daily-sales', days],
    queryFn: () => getDailySales({ days }),
    staleTime: 5 * 60 * 1000,
  });

export const useDashboardLowStock = () =>
  useQuery({
    queryKey: ['dashboard', 'low-stock'],
    queryFn: getLowStock,
    staleTime: 2 * 60 * 1000,
  });
