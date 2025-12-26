import {
  Eye,
  Edit,
  Trash2,
  RotateCcw,
  Tag,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableBodySkeleton } from '@/components/TableBodySkeleton';

import { Discount } from '@/types/discount';

type Props = {
  discounts: Discount[];
  isLoading: boolean;
  isFetching: boolean;
  pageSize: number;
  onView: (d: Discount) => void;
  onEdit: (d: Discount) => void;
  onDeactivate: (d: Discount) => void;
  onActivate: (d: Discount) => void;
};

const isExpired = (endDate: string) =>
  new Date(endDate) < new Date();

export default function DiscountsTable({
  discounts,
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
      <div className="max-h-[calc(100vh-360px)] overflow-y-auto">
        <table className="w-full text-sm">
          {/* HEADER */}
          <thead className="sticky top-0 z-10 bg-muted/90 backdrop-blur border-b">
            <tr>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Value</th>
              <th className="px-4 py-3 text-left">Period</th>
              <th className="px-4 py-3 text-left">Usage</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">
                Actions
              </th>
            </tr>
          </thead>

          {/* LOADING */}
          {isLoading || isFetching ? (
            <TableBodySkeleton
              rows={pageSize}
              columns={8}
            />
          ) : discounts.length === 0 ? (
            /* EMPTY */
            <tbody>
              <tr>
                <td
                  colSpan={8}
                  className="py-32 text-center text-muted-foreground"
                >
                  <Tag className="mx-auto mb-3 h-8 w-8" />
                  No discounts found
                </td>
              </tr>
            </tbody>
          ) : (
            /* DATA */
            <tbody>
              {discounts.map((d) => {
                const expired = isExpired(d.end_date);

                return (
                  <tr
                    key={d.id}
                    className="border-b last:border-b-0 hover:bg-muted/40"
                  >
                    <td className="px-4 py-3 font-mono text-xs">
                      {d.code}
                    </td>

                    <td className="px-4 py-3 font-medium">
                      {d.name}
                    </td>

                    <td className="px-4 py-3 capitalize">
                      {d.discount_type}
                    </td>

                    <td className="px-4 py-3">
                      {d.discount_value}
                    </td>

                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {d.start_date} → {d.end_date}
                    </td>

                    <td className="px-4 py-3 text-xs">
                      {d.used_count}
                      {d.usage_limit
                        ? ` / ${d.usage_limit}`
                        : ''}
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          expired
                            ? 'destructive'
                            : d.is_active
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {expired
                          ? 'Expired'
                          : d.is_active
                          ? 'Active'
                          : 'Inactive'}
                      </Badge>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-3 text-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(d)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {d.is_active && !expired && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(d)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() =>
                              onDeactivate(d)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}

                      {!d.is_active && !expired && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            onActivate(d)
                          }
                        >
                          <RotateCcw className="h-4 w-4" />
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
