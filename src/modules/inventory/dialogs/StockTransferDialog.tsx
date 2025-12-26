'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

import { useCreateStockTransfer } from '@/mutations/stockTransfer.mutations';
import { useProducts } from '@/queries/product.queries';
import { useGlobalError } from '@/errors/useGlobalError';
import { AppError } from '@/errors/AppError';

/* =========================
   FIXED LOCATIONS
========================= */
const LOCATIONS = [
  { id: 1, label: 'Showroom' },
  { id: 2, label: 'Central Godown' },
] as const;

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

export default function StockTransferDialog({
  open,
  onOpenChange,
}: Props) {
  const create = useCreateStockTransfer();
  const handleError = useGlobalError();

  const { data: products } = useProducts({
    page: 1,
    page_size: 100,
  });

  const [form, setForm] = useState({
    product_id: '',
    quantity: '',
    from_location_id: '',
    to_location_id: '',
  });

  const submit = async () => {
    if (!form.product_id || !form.quantity) return;

    if (form.from_location_id === form.to_location_id) {
        handleError(
            new AppError(
            'Source and destination locations must differ',
            'VALIDATION_ERROR',
            400
            )
        );
        return;
        }


    try {
      await create.mutateAsync({
        product_id: Number(form.product_id),
        quantity: Number(form.quantity),
        from_location_id: Number(form.from_location_id),
        to_location_id: Number(form.to_location_id),
      });

      onOpenChange(false);
      setForm({
        product_id: '',
        quantity: '',
        from_location_id: '',
        to_location_id: '',
      });
    } catch (e) {
      handleError(AppError.fromAxiosError(e));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>Create Stock Transfer</DialogHeader>

        <div className="space-y-3">
          {/* PRODUCT */}
          <Select
            value={form.product_id}
            onValueChange={v =>
              setForm(f => ({ ...f, product_id: v }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              {products?.items.map(p => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.name} ({p.sku})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* QUANTITY */}
          <Input
            type="number"
            min={1}
            placeholder="Quantity"
            value={form.quantity}
            onChange={e =>
              setForm(f => ({
                ...f,
                quantity: e.target.value,
              }))
            }
          />

          {/* FROM */}
          <Select
            value={form.from_location_id}
            onValueChange={v =>
              setForm(f => ({ ...f, from_location_id: v }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="From location" />
            </SelectTrigger>
            <SelectContent>
              {LOCATIONS.map(l => (
                <SelectItem key={l.id} value={String(l.id)}>
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* TO */}
          <Select
            value={form.to_location_id}
            onValueChange={v =>
              setForm(f => ({ ...f, to_location_id: v }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="To location" />
            </SelectTrigger>
            <SelectContent>
              {LOCATIONS.map(l => (
                <SelectItem key={l.id} value={String(l.id)}>
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            disabled={
              create.isPending ||
              !form.product_id ||
              !form.quantity ||
              !form.from_location_id ||
              !form.to_location_id
            }
            onClick={submit}
          >
            {create.isPending
              ? 'Creating…'
              : 'Create Transfer'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
