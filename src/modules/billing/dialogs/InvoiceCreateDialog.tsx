'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import InvoiceForm from '../forms/InvoiceForm';

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

export default function InvoiceCreateDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>New Invoice</DialogTitle>
        </DialogHeader>
        <Separator />
        <InvoiceForm mode="create" onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
