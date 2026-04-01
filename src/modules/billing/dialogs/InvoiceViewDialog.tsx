'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import InvoiceViewContent from './InvoiceViewContent';
import { InvoiceListItem } from '@/types/invoice';

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  invoice: InvoiceListItem | null;
};

export default function InvoiceViewDialog({ open, onOpenChange, invoice }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            Invoice Details
            {invoice?.invoice_number ? ` — ${invoice.invoice_number}` : ''}
          </DialogTitle>
        </DialogHeader>
        <Separator />
        <InvoiceViewContent invoice={invoice} isOpen={open} />
        <Separator />
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
