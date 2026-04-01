// src/modules/dashboard/pages/ManagerDashboard.tsx
import { BarChart3, TrendingUp, Package, ShoppingCart } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { DashboardCard } from '@/modules/dashboard/components/DashboardCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { useDashboardSummary, useDashboardDailySales, useDashboardLowStock } from '@/queries/dashboard.queries';

const today = () => format(new Date(), 'yyyy-MM-dd');
const daysAgo = (n: number) => format(subDays(new Date(), n), 'yyyy-MM-dd');

export default function ManagerDashboard() {
  const { data: summary, isLoading: sumLoading } = useDashboardSummary();
  const { data: dailySales, isLoading: dailyLoading } = useDashboardDailySales();
  const { data: lowStock } = useDashboardLowStock();

  const fmt = (val?: string | number) => {
    const n = parseFloat(String(val ?? 0));
    if (isNaN(n)) return '₹0';
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
    return `₹${n.toLocaleString('en-IN')}`;
  };

  const chartData = (dailySales ?? []).map((d: any) => ({
    day: d.day?.slice(5),  // MM-DD
    revenue: parseFloat(d.revenue),
    orders: d.count,
  }));

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Manager Dashboard</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Business performance overview — last 30 days
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {sumLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))
        ) : (
          <>
            <DashboardCard
              title="Revenue (30d)"
              value={fmt(summary?.total_revenue)}
              icon={TrendingUp}
              description={`${summary?.invoice_count ?? 0} invoices`}
            />
            <DashboardCard
              title="Collected"
              value={fmt(summary?.total_collected)}
              icon={BarChart3}
              description="Payments received"
            />
            <DashboardCard
              title="Outstanding"
              value={fmt(summary?.outstanding)}
              icon={ShoppingCart}
              description="Balance due"
            />
            <DashboardCard
              title="Low Stock Items"
              value={String(lowStock?.length ?? '—')}
              icon={Package}
              description="Below threshold"
            />
          </>
        )}
      </div>

      {/* Revenue Chart */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Daily Revenue (30 days)</CardTitle>
        </CardHeader>
        <CardContent>
          {dailyLoading ? (
            <Skeleton className="h-56 w-full rounded" />
          ) : chartData.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No revenue data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(v: any) => fmt(v)} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
