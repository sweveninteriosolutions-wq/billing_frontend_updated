// src/modules/dashboard/pages/SalesDashboard.tsx
import { FileText, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { DashboardCard } from '@/modules/dashboard/components/DashboardCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useDashboardSummary } from '@/queries/dashboard.queries';
import { useQuotations } from '@/queries/quotation.queries';
import { useTopCustomers } from '@/queries/reports.queries';
import { useCustomers } from '@/queries/customer.queries';

const today = () => format(new Date(), 'yyyy-MM-dd');
const daysAgo = (n: number) => format(subDays(new Date(), n), 'yyyy-MM-dd');

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--muted-foreground))'];

export default function SalesDashboard() {
  const { data: summary, isLoading: sumLoading } = useDashboardSummary();
  const { data: quotations } = useQuotations({ page: 1, page_size: 5, status: 'sent' });
  const { data: approvedQ } = useQuotations({ page: 1, page_size: 1, status: 'approved' });
  const { data: topCustomers } = useTopCustomers({ from_date: daysAgo(30), to_date: today(), limit: 5 });
  const { data: customers } = useCustomers({ page: 1, page_size: 1 });

  const fmt = (val?: string | number) => {
    const n = parseFloat(String(val ?? 0));
    if (isNaN(n)) return '₹0';
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
    return `₹${n.toLocaleString('en-IN')}`;
  };

  const pipelineData = [
    { name: 'Pending Quotations', value: quotations?.total ?? 0 },
    { name: 'Approved Quotations', value: approvedQ?.total ?? 0 },
    { name: 'Invoiced (30d)', value: summary?.invoice_count ?? 0 },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Sales Dashboard</h1>
        <p className="text-sm md:text-base text-muted-foreground">Quotations, invoices, and customer revenue</p>
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
              title="Pending Quotations"
              value={String(quotations?.total ?? '—')}
              icon={FileText}
              description="Awaiting customer response"
            />
            <DashboardCard
              title="Invoices (30d)"
              value={String(summary?.invoice_count ?? '—')}
              icon={ShoppingCart}
              description="All statuses"
            />
            <DashboardCard
              title="Revenue (30d)"
              value={fmt(summary?.total_revenue)}
              icon={TrendingUp}
              description="Net invoiced"
            />
            <DashboardCard
              title="Total Customers"
              value={String(customers?.total ?? '—')}
              icon={Users}
              description="Active customers"
            />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Sales Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            {pipelineData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No pipeline data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pipelineData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {pipelineData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Top Customers (30d)</CardTitle>
          </CardHeader>
          <CardContent>
            {!topCustomers?.length ? (
              <p className="text-sm text-muted-foreground text-center py-8">No customer data yet.</p>
            ) : (
              <div className="space-y-4">
                {topCustomers.map((c: any) => (
                  <div key={c.customer_id} className="flex items-center justify-between gap-2 border-b border-border pb-3 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium text-sm md:text-base">{c.customer_name}</p>
                      <p className="text-xs md:text-sm text-muted-foreground">{c.invoice_count} invoice{c.invoice_count !== 1 ? 's' : ''}</p>
                    </div>
                    <p className="font-bold text-primary text-sm md:text-base whitespace-nowrap">{fmt(c.total_spend)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Active Quotations */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Pending Quotations</CardTitle>
        </CardHeader>
        <CardContent>
          {!quotations?.items?.length ? (
            <p className="text-sm text-muted-foreground text-center py-4">No pending quotations.</p>
          ) : (
            <div className="space-y-4">
              {quotations.items.map((q: any) => (
                <div key={q.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 border-b border-border pb-4 last:border-0">
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm md:text-base">QUO-{q.id}</p>
                      <Badge variant={q.status === 'approved' ? 'default' : 'secondary'} className="text-xs">
                        {q.status}
                      </Badge>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground">{q.customer_name}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-bold text-sm md:text-base">{fmt(q.total_amount)}</p>
                    <p className="text-xs text-muted-foreground">Valid until: {q.valid_until?.slice(0, 10)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
