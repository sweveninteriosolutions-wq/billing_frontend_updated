// src/modules/inventory/pages/InventoryMovementsPage.tsx
import { useState } from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight, TrendingDown, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInventoryMovements } from '@/queries/inventoryMovement.queries';

const REFERENCE_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'INVOICE_FULFILL', label: 'Invoice Fulfillment' },
  { value: 'GRN', label: 'GRN Receipt' },
  { value: 'TRANSFER_IN', label: 'Transfer In' },
  { value: 'TRANSFER_OUT', label: 'Transfer Out' },
  { value: 'ADJUSTMENT', label: 'Manual Adjustment' },
];

const PAGE_SIZE = 25;

export default function InventoryMovementsPage() {
  const [page, setPage] = useState(1);
  const [referenceType, setReferenceType] = useState('');

  const { data, isLoading, isError } = useInventoryMovements({
    reference_type: referenceType || undefined,
    page,
    page_size: PAGE_SIZE,
  });

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 1;

  const getRefTypeBadgeVariant = (refType: string) => {
    if (refType.includes('GRN') || refType === 'TRANSFER_IN') return 'default';
    if (refType.includes('INVOICE') || refType === 'TRANSFER_OUT') return 'secondary';
    return 'outline';
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <ArrowUpDown className="h-6 w-6 text-primary" />
            Inventory Movement Log
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Immutable ledger of all stock changes across all locations
          </p>
        </div>

        {/* Filter */}
        <div className="w-full sm:w-56">
          <Select
            value={referenceType || 'all'}
            onValueChange={(v) => {
              setReferenceType(v === 'all' ? '' : v);
              setPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              {REFERENCE_TYPES.map((rt) => (
                <SelectItem key={rt.value || 'all'} value={rt.value || 'all'}>
                  {rt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary stat */}
      {data && (
        <p className="text-sm text-muted-foreground">
          {data.total.toLocaleString()} total movements
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Movement History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading movements...</div>
          ) : isError ? (
            <div className="p-8 text-center text-destructive">Failed to load movements.</div>
          ) : !data?.items?.length ? (
            <div className="p-8 text-center text-muted-foreground">No movements found.</div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40 text-muted-foreground">
                      <th className="px-4 py-3 text-left font-medium">ID</th>
                      <th className="px-4 py-3 text-left font-medium">Product</th>
                      <th className="px-4 py-3 text-left font-medium">Location</th>
                      <th className="px-4 py-3 text-right font-medium">Qty Change</th>
                      <th className="px-4 py-3 text-left font-medium">Reference</th>
                      <th className="px-4 py-3 text-left font-medium">Date & Time</th>
                      <th className="px-4 py-3 text-left font-medium">By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((m) => (
                      <tr key={m.id} className="border-b hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 text-muted-foreground">#{m.id}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium">{m.product_name ?? `Product #${m.product_id}`}</p>
                          {m.product_sku && (
                            <p className="text-xs text-muted-foreground">{m.product_sku}</p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {m.location_name ?? `Location #${m.location_id}`}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span
                            className={`inline-flex items-center gap-1 font-bold ${
                              m.quantity_change > 0
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-destructive'
                            }`}
                          >
                            {m.quantity_change > 0 ? (
                              <TrendingUp className="h-3.5 w-3.5" />
                            ) : (
                              <TrendingDown className="h-3.5 w-3.5" />
                            )}
                            {m.quantity_change > 0 ? '+' : ''}{m.quantity_change}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={getRefTypeBadgeVariant(m.reference_type)} className="text-xs">
                            {m.reference_type}
                          </Badge>
                          <span className="ml-2 text-xs text-muted-foreground">#{m.reference_id}</span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">
                          {new Date(m.created_at).toLocaleString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                          })}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">
                          {m.created_by_name ?? (m.created_by ? `User #${m.created_by}` : 'System')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y">
                {data.items.map((m) => (
                  <div key={m.id} className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-sm">{m.product_name ?? `Product #${m.product_id}`}</p>
                        {m.product_sku && (
                          <p className="text-xs text-muted-foreground">{m.product_sku}</p>
                        )}
                      </div>
                      <span
                        className={`text-sm font-bold flex items-center gap-1 ${
                          m.quantity_change > 0 ? 'text-green-600 dark:text-green-400' : 'text-destructive'
                        }`}
                      >
                        {m.quantity_change > 0 ? '+' : ''}{m.quantity_change}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span>{m.location_name ?? `Location #${m.location_id}`}</span>
                      <Badge variant={getRefTypeBadgeVariant(m.reference_type)} className="text-xs">
                        {m.reference_type} #{m.reference_id}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(m.created_at).toLocaleString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
