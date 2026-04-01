'use client';

import { DollarSign, Package, AlertCircle, TrendingUp, ShoppingCart, Loader2 } from 'lucide-react';
import { DashboardCard } from '@/modules/dashboard/components/DashboardCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import {
  useDashboardSummary,
  useDashboardDailySales,
  useDashboardLowStock,
} from '@/queries/dashboard.queries';

const fmtShort = (v: string | number) => {
  const n = Number(v);
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n.toFixed(0)}`;
};

export default function AdminDashboard() {
  const { data: summary, isLoading: summaryLoading } = useDashboardSummary();
  const { data: dailySales = [], isLoading: dailyLoading } = useDashboardDailySales();
  const { data: lowStock = [], isLoading: lowStockLoading } = useDashboardLowStock();

  const chartData = dailySales.map(d => ({
    day: format(new Date(d.day), 'MMM dd'),
    revenue: Number(d.revenue),
    orders: d.count,
  }));

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Live overview of your business — last 30 days
        </p>
      </div>

      {/* KPI Cards */}
      {summaryLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Total Revenue"
            value={fmtShort(summary?.total_revenue ?? 0)}
            icon={DollarSign}
            description={`${summary?.invoice_count ?? 0} invoices this month`}
          />
          <DashboardCard
            title="Collected"
            value={fmtShort(summary?.total_collected ?? 0)}
            icon={TrendingUp}
            description="Payments received"
          />
          <DashboardCard
            title="Outstanding"
            value={fmtShort(summary?.outstanding ?? 0)}
            icon={AlertCircle}
            description="Balance due"
            trend={
              Number(summary?.outstanding ?? 0) > 0
                ? { value: 0, isPositive: false }
                : undefined
            }
          />
          <DashboardCard
            title="Tax Collected"
            value={fmtShort(summary?.total_tax ?? 0)}
            icon={Package}
            description={`Discounts: ${fmtShort(summary?.total_discounts ?? 0)}`}
          />
        </div>
      )}

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              Daily Revenue (30 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dailyLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : chartData.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-8">No sales data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                  <YAxis tickFormatter={v => fmtShort(v)} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <ShoppingCart className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              Daily Invoice Count
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dailyLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : chartData.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-8">No data.</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            Low Stock Alerts
            {!lowStockLoading && lowStock.length > 0 && (
              <Badge variant="destructive" className="ml-2">{lowStock.length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lowStockLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : lowStock.length === 0 ? (
            <p className="text-sm text-green-600 font-medium text-center py-4">
              ✓ All products are sufficiently stocked.
            </p>
          ) : (
            <div className="space-y-2">
              {lowStock.slice(0, 8).map(p => (
                <div
                  key={p.product_id}
                  className="flex items-center justify-between py-2 px-3 rounded-md bg-yellow-50 border border-yellow-200"
                >
                  <div>
                    <p className="font-medium text-sm">{p.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{p.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-destructive">{p.total_stock} left</p>
                    <p className="text-xs text-muted-foreground">min: {p.min_stock_threshold}</p>
                  </div>
                </div>
              ))}
              {lowStock.length > 8 && (
                <p className="text-xs text-center text-muted-foreground pt-1">
                  +{lowStock.length - 8} more items below threshold
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
