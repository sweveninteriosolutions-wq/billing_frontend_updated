import { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { TablePagination } from '@/components/TablePagination';
import { LoadingState, EmptyState } from '@/components/StateViews';
import { usePagination } from '@/hooks/usePagination';
import { usePayments } from '@/queries/payment.queries';
import { formatMoney } from '@/utils/formatMoney';
import { format } from 'date-fns';

const METHOD_COLORS: Record<string, string> = {
  cash: 'text-green-600 border-green-300',
  card: 'text-blue-600 border-blue-300',
  upi: 'text-purple-600 border-purple-300',
  bank_transfer: 'text-indigo-600 border-indigo-300',
};

export default function PaymentsPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { page, pageSize, setPage } = usePagination({ initialPage: 1, initialPageSize: 20 });

  const { data, isLoading } = usePayments({
    page,
    page_size: pageSize,
    start_date: startDate || undefined,
    end_date: endDate || undefined,
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Payments</h1>
        <p className="text-muted-foreground">All recorded invoice payments</p>
      </div>

      {/* FILTERS */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="grid gap-1">
              <p className="text-xs text-muted-foreground">From</p>
              <Input
                type="date"
                className="w-40"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>
            <div className="grid gap-1">
              <p className="text-xs text-muted-foreground">To</p>
              <Input
                type="date"
                className="w-40"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardContent className="pt-4">
          {isLoading ? (
            <LoadingState />
          ) : items.length === 0 ? (
            <EmptyState icon={CreditCard} message="No payments found." />
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted text-muted-foreground text-xs font-semibold">
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Invoice ID</th>
                    <th className="px-4 py-3 text-center">Method</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                    <th className="px-4 py-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(p => {
                    const method = (p.payment_method ?? 'unknown').toLowerCase();
                    return (
                      <tr key={p.id} className="border-t hover:bg-muted/40 transition-colors">
                        <td className="px-4 py-3 text-muted-foreground font-mono text-xs">#{p.id}</td>
                        <td className="px-4 py-3 font-mono font-medium text-primary">#{p.invoice_id}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge
                            variant="outline"
                            className={`capitalize ${METHOD_COLORS[method] ?? ''}`}
                          >
                            {method}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">{formatMoney(p.amount)}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {p.created_at
                            ? format(new Date(p.created_at), 'dd MMM yyyy, hh:mm a')
                            : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {total > 0 && (
        <TablePagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={() => {}}
        />
      )}
    </div>
  );
}
