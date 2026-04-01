'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { usePurchaseOrder } from '@/queries/purchaseOrder.queries';
import { PurchaseOrderListItem } from '@/types/purchaseOrder';

import PurchaseOrderForm from '../forms/PurchaseOrderForm';

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: 'create' | 'view';
  po: PurchaseOrderListItem | null;
};

const fmt = (v: string | number) =>
  `₹${Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

const STATUS_COLOR: Record<string, string> = {
  draft: 'text-yellow-600',
  submitted: 'text-blue-600',
  approved: 'text-green-600',
  partially_received: 'text-orange-600',
  received: 'text-emerald-700',
  cancelled: 'text-destructive',
};

export default function PurchaseOrderDialog({ open, onOpenChange, mode, po }: Props) {
  const isCreate = mode === 'create';
  const isView = mode === 'view';

  const { data, isLoading } = usePurchaseOrder(po?.id ?? 0, open && isView && !!po);

  const title = isCreate ? 'New Purchase Order' : `PO — ${po?.po_number ?? ''}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Separator />

        {/* CREATE MODE */}
        {isCreate && (
          <PurchaseOrderForm onSuccess={() => onOpenChange(false)} />
        )}

        {/* VIEW MODE */}
        {isView && (
          <>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : data ? (
              <div className="space-y-5 overflow-y-auto max-h-[68vh] pr-1">
                {/* Header info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">PO Number</p>
                    <p className="font-mono font-bold text-primary">{data.po_number}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Status</p>
                    <Badge variant="outline" className={`capitalize ${STATUS_COLOR[data.status]}`}>
                      {data.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Supplier</p>
                    <p className="font-medium">{data.supplier_name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Location</p>
                    <p>{data.location_name}</p>
                  </div>
                  {data.expected_date && (
                    <div>
                      <p className="text-muted-foreground text-xs">Expected Date</p>
                      <p>{new Date(data.expected_date).toLocaleDateString('en-IN')}</p>
                    </div>
                  )}
                  {data.notes && (
                    <div className="col-span-2">
                      <p className="text-muted-foreground text-xs">Notes</p>
                      <p>{data.notes}</p>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Items */}
                <div className="border rounded-md overflow-hidden text-sm">
                  <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-muted text-xs font-semibold text-muted-foreground">
                    <div className="col-span-4">Product</div>
                    <div className="col-span-2 text-right">Unit Cost</div>
                    <div className="col-span-2 text-center">Ordered</div>
                    <div className="col-span-2 text-center">Received</div>
                    <div className="col-span-2 text-right">Line Total</div>
                  </div>
                  {data.items.map(item => (
                    <div
                      key={item.id}
                      className="grid grid-cols-12 gap-2 px-3 py-2.5 border-t items-center"
                    >
                      <div className="col-span-4 font-medium">
                        {item.product_name ?? `Product #${item.product_id}`}
                      </div>
                      <div className="col-span-2 text-right">{fmt(item.unit_cost)}</div>
                      <div className="col-span-2 text-center">{item.quantity_ordered}</div>
                      <div className="col-span-2 text-center text-green-600">
                        {item.quantity_received}
                      </div>
                      <div className="col-span-2 text-right font-medium">
                        {fmt(item.line_total)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-1 text-right">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gross</span>
                    <span>{fmt(data.gross_amount)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t pt-1">
                    <span>Net Total</span>
                    <span className="text-primary">{fmt(data.net_amount)}</span>
                  </div>
                </div>
              </div>
            ) : null}

            <Separator />
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
