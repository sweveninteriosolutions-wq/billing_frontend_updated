'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import InvoiceForm from '../forms/InvoiceForm';
import { InvoiceOut } from '@/types/invoice';
import { useInvoice } from '@/queries/invoice.queries';
import { Loader2 } from 'lucide-react';

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  invoiceId: number | null;
};

export default function InvoiceEditDialog({ open, onOpenChange, invoiceId }: Props) {
  const { data, isLoading } = useInvoice(invoiceId ?? 0, open && !!invoiceId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            Edit Invoice {data?.invoice_number ? `— ${data.invoice_number}` : ''}
          </DialogTitle>
        </DialogHeader>
        <Separator />
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <InvoiceForm
            mode="edit"
            invoice={data ?? null}
            onSuccess={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
