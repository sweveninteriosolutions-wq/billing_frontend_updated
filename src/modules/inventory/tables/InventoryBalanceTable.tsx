import { Box } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { TableBodySkeleton } from '@/components/TableBodySkeleton';

import { InventoryBalance } from '@/types/inventoryBalance';

type Props = {
  items: InventoryBalance[];
  isLoading: boolean;
  isFetching: boolean;
  pageSize: number;
};

export default function InventoryBalancesTable({
  items,
  isLoading,
  isFetching,
  pageSize,
}: Props) {
  return (
    <div className="relative rounded-lg border">
      <div className="max-h-[calc(100vh-360px)] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-muted/90 backdrop-blur border-b">
            <tr>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">SKU</th>
              <th className="px-4 py-3 text-left">Location</th>
              <th className="px-4 py-3 text-left">Qty</th>
              <th className="px-4 py-3 text-left">Min</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>

          {isLoading || isFetching ? (
            <TableBodySkeleton rows={pageSize} columns={6} />
          ) : items.length === 0 ? (
            <tbody>
              <tr>
                <td
                  colSpan={6}
                  className="py-32 text-center text-muted-foreground"
                >
                  <Box className="mx-auto mb-3 h-8 w-8" />
                  No inventory records found
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {items.map((row) => {
                const isLow =
                  row.quantity <
                  row.min_stock_threshold;

                return (
                  <tr
                    key={`${row.product_id}-${row.location_id}`}
                    className="border-b last:border-b-0 hover:bg-muted/40"
                  >
                    <td className="px-4 py-3">
                      {row.product_name}
                    </td>
                    <td className="px-4 py-3">
                      {row.sku}
                    </td>
                    <td className="px-4 py-3">
                      {row.location_code}
                    </td>
                    <td className="px-4 py-3">
                      {isLow ? (
                        <Badge variant="destructive">
                          {row.quantity}
                        </Badge>
                      ) : (
                        row.quantity
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {row.min_stock_threshold}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          isLow
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {isLow ? 'Low Stock' : 'OK'}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
