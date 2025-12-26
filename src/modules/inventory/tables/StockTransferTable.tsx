import { ArrowRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Transfer = {
  id: number;
  status: string;
  quantity: number;
  transfer_date: string;
  product: { name: string };
  from_location: { name: string };
  to_location: { name: string };
};

type Props = {
  transfers: Transfer[];
  isLoading: boolean;
  completingId?: number;
  cancellingId?: number;
  onComplete: (id: number) => void;
  onCancel: (id: number) => void;
};

export default function StockTransferList({
  transfers,
  isLoading,
  completingId,
  cancellingId,
  onComplete,
  onCancel,
}: Props) {
  if (isLoading) {
    return (
      <p className="text-center text-muted-foreground">
        Loading...
      </p>
    );
  }

  if (transfers.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        No stock transfers found
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {transfers.map((transfer) => {
        const isBusy =
          completingId === transfer.id ||
          cancellingId === transfer.id;

        return (
          <div
            key={transfer.id}
            className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold">
                    #{transfer.id}
                  </h3>
                  <Badge className="capitalize">
                    {transfer.status}
                  </Badge>
                </div>

                <p className="text-sm font-medium">
                  {transfer.product.name}
                </p>

                <p className="text-xs text-muted-foreground">
                  Quantity: {transfer.quantity} units
                </p>
              </div>

              <div className="text-xs text-muted-foreground">
                {new Date(
                  transfer.transfer_date
                ).toLocaleDateString()}
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="flex-1 bg-muted/50 rounded p-2 text-center">
                {transfer.from_location.name}
              </div>

              <ArrowRight className="h-4 w-4 text-muted-foreground" />

              <div className="flex-1 bg-muted/50 rounded p-2 text-center">
                {transfer.to_location.name}
              </div>

              {transfer.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    disabled={isBusy}
                    onClick={() =>
                      onComplete(transfer.id)
                    }
                  >
                    {completingId === transfer.id
                      ? 'Completing…'
                      : 'Complete'}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isBusy}
                    onClick={() =>
                      onCancel(transfer.id)
                    }
                  >
                    {cancellingId === transfer.id
                      ? 'Cancelling…'
                      : 'Cancel'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
