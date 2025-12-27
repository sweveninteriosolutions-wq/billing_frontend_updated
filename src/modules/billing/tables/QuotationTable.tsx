import {
  Eye,
  Edit,
  FileText,
  Loader2,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { QuotationView } from '@/types/quotation';

type Props = {
  items: QuotationView[];
  isLoading: boolean;

  onView: (q: QuotationView) => void;
  onEdit: (q: QuotationView) => void;
  onConvert: (q: QuotationView) => void;

  convertingId?: number;
};

export default function QuotationTable({
  items,
  isLoading,
  onView,
  onEdit,
  onConvert,
  convertingId,
}: Props) {
  if (isLoading) {
    return (
      <p className="text-center py-6 text-muted-foreground">
        Loading quotations…
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <p className="text-center py-6 text-muted-foreground">
        No quotations found.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((q) => {
        const isConverting = convertingId === q.id;
        const isDeleted = q.is_deleted === true;


        return (
          <div
            key={q.id}
            className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
          >
            {/* HEADER */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold">
                    {q.quotation_number}
                  </h3>

                  <Badge
                  variant={isDeleted ? 'destructive' : 'secondary'}
                  className="capitalize"
                >
                  {isDeleted
                    ? 'cancelled'
                    : q.status.replaceAll('_', ' ')}
                </Badge>

                </div>

                <p className="text-sm font-medium">
                  Customer: {q.customer_name}
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold text-primary">
                  ₹{q.total_amount}
                </p>
                <p className="text-xs text-muted-foreground">
                  {q.items_count} items
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(q.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onView(q)}
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </Button>

              {q.status === 'draft' && !isDeleted && (
  <Button
    variant="outline"
    size="sm"
    className="flex-1"
    onClick={() => onEdit(q)}
  >
    <Edit className="mr-2 h-4 w-4" />
    Edit
  </Button>
)}


              {q.status === 'approved' && (
                <Button
                  size="sm"
                  className="flex-1"
                  disabled={isConverting}
                  onClick={() => onConvert(q)}
                >
                  {isConverting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Converting…
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Convert to Invoice
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
