import {
  Eye,
  Edit,
  Trash2,
  Truck,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableBodySkeleton } from '@/components/TableBodySkeleton';

import { Supplier } from '@/types/supplier';

type Props = {
  suppliers: Supplier[];
  isLoading: boolean;
  isFetching: boolean;
  pageSize: number;
  onView: (s: Supplier) => void;
  onEdit: (s: Supplier) => void;
  onDeactivate: (s: Supplier) => void;
};

export default function SuppliersTable({
  suppliers,
  isLoading,
  isFetching,
  pageSize,
  onView,
  onEdit,
  onDeactivate,
}: Props) {
  return (
    <div className="relative rounded-lg border">
      <div className="max-h-[calc(100vh-360px)] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-muted/90 backdrop-blur border-b">
            <tr>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Contact</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          {isLoading || isFetching ? (
            <TableBodySkeleton rows={pageSize} columns={6} />
          ) : suppliers.length === 0 ? (
            <tbody>
              <tr>
                <td
                  colSpan={6}
                  className="py-32 text-center text-muted-foreground"
                >
                  <Truck className="mx-auto mb-3 h-8 w-8" />
                  No suppliers found
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {suppliers.map((s) => (
                <tr
                  key={s.id}
                  className="border-b last:border-b-0 hover:bg-muted/40"
                >
                  <td className="px-4 py-3 font-mono text-xs">
                    {s.supplier_code}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {s.name}
                  </td>
                  <td className="px-4 py-3">
                    {s.contact_person ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    {s.email ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        s.is_deleted
                          ? 'secondary'
                          : 'default'
                      }
                    >
                      {s.is_deleted ? 'Deleted' : 'Active'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(s)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    {!s.is_deleted && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(s)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => onDeactivate(s)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
