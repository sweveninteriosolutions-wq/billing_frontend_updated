import { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { format, subDays } from 'date-fns';
import {
  TrendingUp, DollarSign, AlertTriangle, Users, Package,
  RefreshCw, Loader2,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

import {
  useSalesSummary,
  useDailySales,
  useTopProducts,
  useTopCustomers,
  useLowStock,
} from '@/queries/reports.queries';
import { formatMoney, formatMoneyShort } from '@/utils/formatMoney';

export default function SalesReportPage() {
  const today = format(new Date(), 'yyyy-MM-dd');
  const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd');

  const [fromDate, setFromDate] = useState(thirtyDaysAgo);
  const [toDate, setToDate] = useState(today);
  const [appliedRange, setAppliedRange] = useState({ from: thirtyDaysAgo, to: today });

  const applyFilter = () => setAppliedRange({ from: fromDate, to: toDate });

  /* ---- Data ---- */
  const { data: summary, isLoading: summaryLoading } = useSalesSummary({
    from_date: appliedRange.from,
    to_date: appliedRange.to,
  });
  const { data: dailySales = [], isLoading: dailyLoading } = useDailySales(30);
  const { data: topProducts = [], isLoading: topProductsLoading } = useTopProducts({
    from_date: appliedRange.from,
    to_date: appliedRange.to,
    limit: 8,
  });
  const { data: topCustomers = [], isLoading: topCustomersLoading } = useTopCustomers({
    from_date: appliedRange.from,
    to_date: appliedRange.to,
    limit: 8,
  });
  const { data: lowStock = [], isLoading: lowStockLoading } = useLowStock();

  const chartColors = [
    'hsl(var(--primary))',
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
    '#8b5cf6', '#06b6d4', '#84cc16',
  ];

  const dailyChartData = dailySales.map(d => ({
    day: format(new Date(d.day), 'MMM dd'),
    revenue: Number(d.revenue),
    count: d.count,
  }));

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground">
          Business performance, inventory health, and sales insights
        </p>
      </div>

      {/* DATE FILTER */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="grid gap-1.5">
              <Label className="text-xs text-muted-foreground">From Date</Label>
              <Input
                type="date"
                className="w-40"
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs text-muted-foreground">To Date</Label>
              <Input
                type="date"
                className="w-40"
                value={toDate}
                onChange={e => setToDate(e.target.value)}
              />
            </div>
            <Button onClick={applyFilter} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Apply Filter
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const f = format(subDays(new Date(), 30), 'yyyy-MM-dd');
                const t = today;
                setFromDate(f);
                setToDate(t);
                setAppliedRange({ from: f, to: t });
              }}
            >
              Last 30 Days
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const f = format(subDays(new Date(), 7), 'yyyy-MM-dd');
                const t = today;
                setFromDate(f);
                setToDate(t);
                setAppliedRange({ from: f, to: t });
              }}
            >
              Last 7 Days
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPI SUMMARY CARDS */}
      {summaryLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : summary ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Total Revenue"
            value={formatMoneyShort(summary.total_revenue)}
            sub={`${summary.invoice_count} invoices`}
            icon={DollarSign}
            color="text-green-600"
            bg="bg-green-100"
          />
          <KpiCard
            label="Total Collected"
            value={formatMoneyShort(summary.total_collected)}
            sub="Payments received"
            icon={TrendingUp}
            color="text-blue-600"
            bg="bg-blue-100"
          />
          <KpiCard
            label="Outstanding"
            value={formatMoneyShort(summary.outstanding)}
            sub="Balance due"
            icon={AlertTriangle}
            color="text-yellow-600"
            bg="bg-yellow-100"
          />
          <KpiCard
            label="Tax Collected"
            value={formatMoneyShort(summary.total_tax)}
            sub={`Discounts: ${formatMoneyShort(summary.total_discounts)}`}
            icon={Package}
            color="text-purple-600"
            bg="bg-purple-100"
          />
        </div>
      ) : null}

      {/* DAILY REVENUE CHART */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Daily Revenue (Last 30 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dailyLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : dailyChartData.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-8">No sales data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={dailyChartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={v => formatMoneyShort(v)} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(v: number) => [formatMoney(v), 'Revenue']}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* TOP PRODUCTS + TOP CUSTOMERS */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              Top Selling Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topProductsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : topProducts.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-8">No data.</p>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={topProducts.slice(0, 6)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis
                      dataKey="product_name"
                      type="category"
                      width={100}
                      tick={{ fontSize: 10 }}
                    />
                    <Tooltip formatter={(v: number) => [v, 'Units Sold']} />
                    <Bar dataKey="total_qty" radius={[0, 4, 4, 0]}>
                      {topProducts.slice(0, 6).map((_, i) => (
                        <Cell key={i} fill={chartColors[i % chartColors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-3 space-y-1">
                  {topProducts.map((p, i) => (
                    <div key={p.product_id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
                        <span className="truncate max-w-[160px]">{p.product_name}</span>
                        <Badge variant="secondary" className="text-xs">{p.sku}</Badge>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-medium">{p.total_qty} units</span>
                        <span className="text-muted-foreground ml-2 text-xs">
                          {formatMoneyShort(p.total_revenue)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Top Customers by Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topCustomersLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : topCustomers.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-8">No data.</p>
            ) : (
              <div className="space-y-3">
                {topCustomers.map((c, i) => {
                  const pct =
                    topCustomers.length > 0
                      ? (Number(c.total_spend) / Number(topCustomers[0].total_spend)) * 100
                      : 0;
                  return (
                    <div key={c.customer_id} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
                          <span className="font-medium truncate max-w-[160px]">{c.customer_name}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-semibold">{formatMoneyShort(c.total_spend)}</span>
                          <span className="text-muted-foreground ml-2 text-xs">
                            {c.invoice_count} inv.
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* LOW STOCK ALERT */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
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
            <div className="text-center py-8 text-green-600 text-sm font-medium">
              ✓ All products are above minimum stock levels.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted text-muted-foreground text-xs font-semibold">
                    <th className="px-4 py-3 text-left">SKU</th>
                    <th className="px-4 py-3 text-left">Product</th>
                    <th className="px-4 py-3 text-center">Current Stock</th>
                    <th className="px-4 py-3 text-center">Min Threshold</th>
                    <th className="px-4 py-3 text-center">Deficit</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStock.map(p => (
                    <tr key={p.product_id} className="border-t hover:bg-muted/40">
                      <td className="px-4 py-3 font-mono text-xs">{p.sku}</td>
                      <td className="px-4 py-3 font-medium">{p.name}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge
                          variant={p.total_stock === 0 ? 'destructive' : 'outline'}
                          className={p.total_stock > 0 ? 'text-yellow-600 border-yellow-300' : ''}
                        >
                          {p.total_stock}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center text-muted-foreground">
                        {p.min_stock_threshold}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-destructive font-semibold">
                          {p.min_stock_threshold - p.total_stock}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ---- KPI CARD ---- */
function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
  bg,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-start gap-4 pt-5 pb-4 px-5">
        <div className={`rounded-full p-3 ${bg} ${color} shrink-0`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold mt-0.5">{value}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
        </div>
      </CardContent>
    </Card>
  );
}
