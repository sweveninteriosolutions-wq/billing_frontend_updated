'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import PaymentForm from '../forms/PaymentForm';
import { useInvoice } from '@/queries/invoice.queries';
import { InvoiceListItem } from '@/types/invoice';
import { Loader2 } from 'lucide-react';

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  invoice: InvoiceListItem | null;
};

export default function PaymentCreateDialog({ open, onOpenChange, invoice }: Props) {
  const { data, isLoading } = useInvoice(invoice?.id ?? 0, open && !!invoice);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
        </DialogHeader>
        <Separator />
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : data ? (
          <PaymentForm invoice={data} onSuccess={() => onOpenChange(false)} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
