import {
  Eye,
  Edit,
  Trash2,
  Box,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableBodySkeleton } from '@/components/TableBodySkeleton';

import { Product } from '@/types/product';

type Props = {
  products: Product[];
  isLoading: boolean;
  isFetching: boolean;
  pageSize: number;
  onView: (p: Product) => void;
  onEdit: (p: Product) => void;
  onDeactivate: (p: Product) => void;
  onActivate: (p: Product) => void;
};

export default function ProductsTable({
  products,
  isLoading,
  isFetching,
  pageSize,
  onView,
  onEdit,
  onDeactivate,
  onActivate,
}: Props) {
  return (
    <div className="relative rounded-lg border">
      {/* SCROLL CONTAINER */}
      <div className="max-h-[calc(100vh-360px)] overflow-y-auto">
        <table className="w-full text-sm">
          {/* TABLE HEADER */}
          <thead className="sticky top-0 z-10 bg-muted/90 backdrop-blur border-b">
            <tr>
              <th className="px-4 py-3 text-left">SKU</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          {/* LOADING */}
          {isLoading || isFetching ? (
            <TableBodySkeleton rows={pageSize} columns={6} />
          ) : products.length === 0 ? (
            /* EMPTY */
            <tbody>
              <tr>
                <td
                  colSpan={6}
                  className="py-32 text-center text-muted-foreground"
                >
                  <Box className="mx-auto mb-3 h-8 w-8" />
                  No products found
                </td>
              </tr>
            </tbody>
          ) : (
            /* DATA */
            <tbody>
              {products.map((p) => {
                const isActive = !p.is_deleted;

                return (
                  <tr
                    key={p.id}
                    className="border-b last:border-b-0 hover:bg-muted/40 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs">
                      {p.sku}
                    </td>

                    <td className="px-4 py-3 font-medium">
                      {p.name}
                    </td>

                    <td className="px-4 py-3">
                      {p.category ?? '—'}
                    </td>

                    <td className="px-4 py-3">
                      ₹{p.price}
                    </td>

                    <td className="px-4 py-3">
                      <Badge
                        variant={isActive ? 'default' : 'secondary'}
                      >
                        {isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-3 text-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(p)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {isActive ? (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(p)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => onDeactivate(p)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onActivate(p)}
                        >
                          Activate
                        </Button>
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
