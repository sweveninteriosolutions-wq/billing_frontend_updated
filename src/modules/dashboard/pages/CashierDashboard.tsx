// src/modules/dashboard/pages/CashierDashboard.tsx
import { DollarSign, Receipt, AlertCircle, Users } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { DashboardCard } from '@/modules/dashboard/components/DashboardCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardSummary, useDashboardDailySales } from '@/queries/dashboard.queries';
import { useInvoices } from '@/queries/invoice.queries';
import { usePayments } from '@/queries/payment.queries';

const today = () => format(new Date(), 'yyyy-MM-dd');

export default function CashierDashboard() {
  // Live data from reports API
  const { data: summary, isLoading: sumLoading } = useDashboardSummary();
  const { data: todayInvoices } = useInvoices({
    page: 1,
    page_size: 5,
    status: 'verified',
  });
  const { data: recentPayments } = usePayments({
    page: 1,
    page_size: 5,
    end_date: today(),
    start_date: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
  });

  const fmt = (val?: string | number) => {
    const n = parseFloat(String(val ?? 0));
    if (isNaN(n)) return '₹0';
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
    return `₹${n.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Cashier Dashboard</h1>
        <p className="text-sm md:text-base text-muted-foreground">Manage sales, invoices, and payments</p>
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
              icon={DollarSign}
              description={`${summary?.invoice_count ?? 0} invoices`}
            />
            <DashboardCard
              title="Collected (30d)"
              value={fmt(summary?.total_collected)}
              icon={Receipt}
              description="Payments received"
            />
            <DashboardCard
              title="Outstanding"
              value={fmt(summary?.outstanding)}
              icon={AlertCircle}
              description="Balance due"
            />
            <DashboardCard
              title="Tax Collected"
              value={fmt(summary?.total_tax)}
              icon={Users}
              description="GST (30d)"
            />
          </>
        )}
      </div>

      {/* Pending Verified Invoices */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Verified — Awaiting Payment</CardTitle>
        </CardHeader>
        <CardContent>
          {!todayInvoices?.items?.length ? (
            <p className="text-sm text-muted-foreground text-center py-4">No verified invoices awaiting payment.</p>
          ) : (
            <div className="space-y-4">
              {todayInvoices.items.map((inv: any) => (
                <div key={inv.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 border-b border-border pb-4 last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-sm md:text-base">{inv.customer_name ?? `Customer #${inv.customer_id}`}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Invoice #{inv.id}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-bold text-sm md:text-base">{fmt(inv.balance_due)}</p>
                    <Badge variant="secondary" className="text-xs">Due</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Payments */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          {!recentPayments?.items?.length ? (
            <p className="text-sm text-muted-foreground text-center py-4">No recent payments.</p>
          ) : (
            <div className="space-y-4">
              {recentPayments.items.map((pmt: any) => (
                <div key={pmt.id} className="flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-medium text-sm md:text-base">Invoice #{pmt.invoice_id}</p>
                    <p className="text-xs text-muted-foreground capitalize">{pmt.payment_method?.replace('_', ' ')}</p>
                  </div>
                  <p className="font-bold text-primary text-sm md:text-base whitespace-nowrap">{fmt(pmt.amount_paid)}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
