import {
  Eye,
  Loader2,
  Trash2,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { GRNView } from '@/types/grn';

type Props = {
  items: GRNView[];
  isLoading: boolean;
  onView: (grn: GRNView) => void;
  onVerify: (id: number) => void;
  onDelete: (grn: GRNView) => void;
  verifyingId?: number;
  deletingId?: number;
};

export default function GRNList({
  items,
  isLoading,
  onView,
  onVerify,
  onDelete,
  verifyingId,
  deletingId,
}: Props) {
  if (isLoading) {
    return (
      <p className="text-center py-6 text-muted-foreground">
        Loading GRNs…
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <p className="text-center py-6 text-muted-foreground">
        No GRNs found.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((grn) => {
        const isVerifying = verifyingId === grn.id;
        const isDeleting = deletingId === grn.id;

        return (
          <div
            key={grn.id}
            className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold">{grn.code}</h3>
                  <Badge variant="secondary" className="capitalize">
                    {grn.status}
                  </Badge>
                </div>

                <p className="text-sm font-medium">
                  Supplier: {grn.supplier.name}
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold text-primary">
                  ₹{grn.summary.total_value}
                </p>
                <p className="text-xs text-muted-foreground">
                  {grn.items.length} items
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(grn.audit.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onView(grn)}
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </Button>

              {grn.status === 'draft' && (
                <Button
                  size="sm"
                  className="flex-1"
                  disabled={isVerifying}
                  onClick={() => onVerify(grn.id)}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying…
                    </>
                  ) : (
                    'Verify'
                  )}
                </Button>
              )}

              {grn.status === 'draft' && (
                <Button
                  size="sm"
                  variant="destructive"
                  className="flex-1"
                  disabled={isDeleting}
                  onClick={() => onDelete(grn)}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cancelling…
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Cancel
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
