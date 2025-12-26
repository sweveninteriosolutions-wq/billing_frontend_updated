import {
  Eye,
  Edit,
  Trash2,
  Users,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableBodySkeleton } from '@/components/TableBodySkeleton';

import { Customer } from '@/types/customer';

type Props = {
  customers: Customer[];
  isLoading: boolean;
  isFetching: boolean;
  pageSize: number;
  onView: (c: Customer) => void;
  onEdit: (c: Customer) => void;
  onDeactivate: (c: Customer) => void;
};

export default function CustomersTable({
  customers,
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
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">GSTIN</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          {isLoading || isFetching ? (
            <TableBodySkeleton rows={pageSize} columns={7} />
          ) : customers.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={7} className="py-32 text-center text-muted-foreground">
                  <Users className="mx-auto mb-3 h-8 w-8" />
                  No customers found
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {customers.map((c) => (
                <tr
                  key={c.id}
                  className="border-b last:border-b-0 hover:bg-muted/40"
                >
                  <td className="px-4 py-3 font-mono text-xs">
                    {c.customer_code}
                  </td>
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.email}</td>
                  <td className="px-4 py-3">{c.gstin ?? '—'}</td>
                  <td className="px-4 py-3">
                    <Badge variant={c.is_active ? 'default' : 'secondary'}>
                      {c.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {c.phone}
                  </td>
                  <td className="px-4 py-3 text-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(c)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    {c.is_active && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(c)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => onDeactivate(c)}
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
