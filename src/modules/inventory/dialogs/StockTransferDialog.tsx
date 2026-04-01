// src/modules/inventory/dialogs/StockTransferDialog.tsx
// Mutations handle toasts. Form resets on close. Block close during submit.

'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

import { useCreateStockTransfer } from '@/mutations/stockTransfer.mutations';
import { useProducts } from '@/queries/product.queries';

const LOCATIONS = [
  { id: 1, label: 'Showroom' },
  { id: 2, label: 'Central Godown' },
] as const;

const EMPTY_FORM = {
  product_id: '',
  quantity: '',
  from_location_id: '',
  to_location_id: '',
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

export default function StockTransferDialog({ open, onOpenChange }: Props) {
  const create = useCreateStockTransfer();
  const { data: products } = useProducts({ page: 1, page_size: 100 });

  const [form, setForm] = useState(EMPTY_FORM);

  // Reset form on open
  useEffect(() => {
    if (open) setForm(EMPTY_FORM);
  }, [open]);

  const handleOpenChange = (v: boolean) => {
    if (!v && create.isPending) return;
    onOpenChange(v);
  };

  const submit = async () => {
    if (!form.product_id || !form.quantity) {
      toast.error('Product and quantity are required');
      return;
    }
    if (form.from_location_id === form.to_location_id) {
      toast.error('Source and destination locations must differ');
      return;
    }

    await create.mutateAsync({
      product_id: Number(form.product_id),
      quantity: Number(form.quantity),
      from_location_id: Number(form.from_location_id),
      to_location_id: Number(form.to_location_id),
    });

    onOpenChange(false);
  };

  const canSubmit =
    !create.isPending &&
    !!form.product_id &&
    !!form.quantity &&
    !!form.from_location_id &&
    !!form.to_location_id;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Stock Transfer</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Select
            value={form.product_id}
            onValueChange={(v) => setForm((f) => ({ ...f, product_id: v }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              {products?.items.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.name} ({p.sku})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="number"
            min={1}
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
          />

          <Select
            value={form.from_location_id}
            onValueChange={(v) => setForm((f) => ({ ...f, from_location_id: v }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="From location" />
            </SelectTrigger>
            <SelectContent>
              {LOCATIONS.map((l) => (
                <SelectItem key={l.id} value={String(l.id)}>
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={form.to_location_id}
            onValueChange={(v) => setForm((f) => ({ ...f, to_location_id: v }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="To location" />
            </SelectTrigger>
            <SelectContent>
              {LOCATIONS.map((l) => (
                <SelectItem key={l.id} value={String(l.id)}>
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button className="w-full" disabled={!canSubmit} onClick={submit}>
            {create.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {create.isPending ? 'Creating…' : 'Create Transfer'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
