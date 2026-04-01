// src/modules/billing/pages/LoyaltyTokensPage.tsx
import { useState } from 'react';
import { Gift } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TablePagination } from '@/components/TablePagination';
import { LoadingState, EmptyState } from '@/components/StateViews';
import { TableBodySkeleton } from '@/components/TableBodySkeleton';
import { usePagination } from '@/hooks/usePagination';
import { useDebounce } from '@/hooks/useDebounce';
import { useLoyaltyTokens } from '@/queries/loyaltyToken.queries';
import { format } from 'date-fns';

export default function LoyaltyTokensPage() {
  const [customerIdInput, setCustomerIdInput] = useState('');
  const debouncedCustomerId = useDebounce(customerIdInput, 400);

  const { page, pageSize, setPage, reset } = usePagination({
    initialPage: 1,
    initialPageSize: 20,
  });

  const customerId = debouncedCustomerId
    ? parseInt(debouncedCustomerId, 10) || undefined
    : undefined;

  const { data, isLoading, isFetching } = useLoyaltyTokens({
    customer_id: customerId,
    page,
    page_size: pageSize,
    sort_by: 'created_at',
    order: 'desc',
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loyalty Tokens</h1>
          <p className="text-muted-foreground">
            View loyalty token credits earned by customers on paid invoices
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Filter by Customer ID"
            value={customerIdInput}
            onChange={(e) => {
              setCustomerIdInput(e.target.value);
              reset();
            }}
            className="w-52"
            type="number"
            min={1}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="flex min-h-[calc(100vh-300px)] flex-col">
        <Card className="flex flex-col">
          <CardHeader className="border-b">
            <h3 className="flex items-center gap-2 font-semibold">
              <Gift className="h-5 w-5 text-primary" />
              Token Records
              {total > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {total}
                </Badge>
              )}
            </h3>
          </CardHeader>

          <CardContent className="p-0 flex-1">
            {isLoading ? (
              <LoadingState />
            ) : items.length === 0 ? (
              <EmptyState icon={Gift} message="No loyalty token records found." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted text-muted-foreground text-xs font-semibold border-b">
                      <th className="px-4 py-3 text-left">ID</th>
                      <th className="px-4 py-3 text-left">Customer ID</th>
                      <th className="px-4 py-3 text-left">Invoice ID</th>
                      <th className="px-4 py-3 text-center">Tokens Earned</th>
                      <th className="px-4 py-3 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isFetching && !isLoading ? (
                      <TableBodySkeleton rows={pageSize} cols={5} />
                    ) : (
                      items.map((t) => (
                        <tr
                          key={t.id}
                          className="border-t hover:bg-muted/40 transition-colors"
                        >
                          <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                            #{t.id}
                          </td>
                          <td className="px-4 py-3 font-mono font-medium text-primary">
                            #{t.customer_id}
                          </td>
                          <td className="px-4 py-3 font-mono text-muted-foreground">
                            #{t.invoice_id}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Badge
                              variant="secondary"
                              className="bg-amber-100 text-amber-700 border-amber-200"
                            >
                              🎁 {t.tokens} pts
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">
                            {t.created_at
                              ? format(new Date(t.created_at), 'dd MMM yyyy, hh:mm a')
                              : '—'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {total > 0 && (
          <div className="mt-auto pt-4">
            <TablePagination
              page={page}
              pageSize={pageSize}
              total={total}
              isFetching={isFetching}
              onPageChange={setPage}
              onPageSizeChange={() => {}}
            />
          </div>
        )}
      </div>
    </div>
  );
}
