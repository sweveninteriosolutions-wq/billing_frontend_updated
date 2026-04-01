// src/modules/inventory/tables/ProductTable.tsx
// Phase 7+8: ErrorState with retry, EmptyState with action CTA,
// role-gated edit/delete buttons.

import { Eye, Edit, Trash2, Box } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableBodySkeleton } from '@/components/TableBodySkeleton';
import { EmptyState, ErrorState } from '@/components/StateViews';
import { Product } from '@/types/product';

type Props = {
  products: Product[];
  isLoading: boolean;
  isFetching: boolean;
  isError?: boolean;
  onRetry?: () => void;
  pageSize: number;
  canEdit?: boolean;
  canDelete?: boolean;
  emptyAction?: { label: string; onClick: () => void };
  onView: (p: Product) => void;
  onEdit: (p: Product) => void;
  onDeactivate: (p: Product) => void;
  onActivate: (p: Product) => void;
};

export default function ProductsTable({
  products,
  isLoading,
  isFetching,
  isError,
  onRetry,
  pageSize,
  canEdit = true,
  canDelete = true,
  emptyAction,
  onView,
  onEdit,
  onDeactivate,
  onActivate,
}: Props) {
  return (
    <div className="relative rounded-lg border">
      <div className="max-h-[calc(100vh-360px)] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-muted/90 backdrop-blur border-b">
            <tr>
              <th className="px-4 py-3 text-left font-medium">SKU</th>
              <th className="px-4 py-3 text-left font-medium">Product Name</th>
              <th className="px-4 py-3 text-left font-medium">Category</th>
              <th className="px-4 py-3 text-left font-medium">Price</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-center font-medium">Actions</th>
            </tr>
          </thead>

          {isLoading || isFetching ? (
            <TableBodySkeleton rows={pageSize} columns={6} />
          ) : isError ? (
            <tbody>
              <tr>
                <td colSpan={6}>
                  <ErrorState
                    message="Failed to load products."
                    onRetry={onRetry}
                    className="py-20"
                  />
                </td>
              </tr>
            </tbody>
          ) : products.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={6}>
                  <EmptyState
                    icon={Box}
                    message="No products found."
                    actionLabel={emptyAction?.label}
                    onAction={emptyAction?.onClick}
                    className="py-20"
                  />
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {products.map((p) => {
                const isActive = !p.is_deleted;
                return (
                  <tr
                    key={p.id}
                    className="border-b last:border-b-0 hover:bg-muted/40 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs">{p.sku}</td>
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3">{p.category ?? '—'}</td>
                    <td className="px-4 py-3">₹{Number(p.price).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <Badge variant={isActive ? 'default' : 'secondary'}>
                        {isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="View"
                        onClick={() => onView(p)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {isActive ? (
                        <>
                          {canEdit && (
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Edit"
                              onClick={() => onEdit(p)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {canDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Deactivate"
                              className="text-destructive"
                              onClick={() => onDeactivate(p)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </>
                      ) : (
                        canEdit && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onActivate(p)}
                          >
                            Activate
                          </Button>
                        )
                      )}
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
