'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { SearchSelect } from '@/components/ui/SearchSelect';
import { useSuppliers } from '@/queries/supplier.queries';
import { useProducts } from '@/queries/product.queries';
import { useCreatePurchaseOrder } from '@/mutations/purchaseOrder.mutations';
import { AppError } from '@/errors/AppError';
import { useGlobalError } from '@/errors/useGlobalError';

/* =========================
   TYPES
========================= */
type LineItem = {
  product_id: number;
  product_name: string;
  quantity_ordered: number;
  unit_cost: number;
  line_total: number;
};

type Props = {
  onSuccess: () => void;
};

const fmt = (v: number) =>
  `₹${v.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

const DEFAULT_LOCATION_ID = Number(import.meta.env.VITE_DEFAULT_LOCATION_ID ?? '1');

export default function PurchaseOrderForm({ onSuccess }: Props) {
  const handleError = useGlobalError();
  const createMutation = useCreatePurchaseOrder();

  /* =========================
     DATA
  ========================= */
  const { data: supplierData } = useSuppliers({ page: 1, page_size: 200 });
  const { data: productData } = useProducts({ page: 1, page_size: 200 });

  const suppliers = supplierData?.items?.filter(s => !s.is_deleted) ?? [];
  const products = productData?.items?.filter(p => !p.is_deleted) ?? [];

  /* =========================
     STATE
  ========================= */
  const [supplierId, setSupplierId] = useState<number | null>(null);
  const [expectedDate, setExpectedDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<LineItem[]>([]);

  /* =========================
     OPTIONS
  ========================= */
  const supplierOptions = suppliers.map(s => ({
    value: String(s.id),
    label: s.name,
  }));

  const productOptions = products.map(p => ({
    value: String(p.id),
    label: `${p.name}`,
  }));

  /* =========================
     ITEM HANDLERS
  ========================= */
  const addProduct = (productIdStr: string) => {
    const productId = Number(productIdStr);
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (items.some(i => i.product_id === productId)) {
      handleError(new AppError('Product already added', 'VALIDATION_ERROR', 400));
      return;
    }

    setItems(prev => [
      ...prev,
      {
        product_id: product.id,
        product_name: product.name,
        quantity_ordered: 1,
        unit_cost: Number(product.price),
        line_total: Number(product.price),
      },
    ]);
  };

  const updateQty = (productId: number, qty: number) => {
    if (qty < 1) return;
    setItems(prev =>
      prev.map(i =>
        i.product_id === productId
          ? { ...i, quantity_ordered: qty, line_total: i.unit_cost * qty }
          : i
      )
    );
  };

  const updateCost = (productId: number, cost: number) => {
    if (cost < 0) return;
    setItems(prev =>
      prev.map(i =>
        i.product_id === productId
          ? { ...i, unit_cost: cost, line_total: cost * i.quantity_ordered }
          : i
      )
    );
  };

  const removeItem = (productId: number) => {
    setItems(prev => prev.filter(i => i.product_id !== productId));
  };

  /* =========================
     TOTALS
  ========================= */
  const gross = items.reduce((s, i) => s + i.line_total, 0);

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async () => {
    if (!supplierId) {
      handleError(new AppError('Supplier is required', 'VALIDATION_ERROR', 400));
      return;
    }
    if (items.length === 0) {
      handleError(new AppError('Add at least one item', 'VALIDATION_ERROR', 400));
      return;
    }

    try {
      await createMutation.mutateAsync({
        supplier_id: supplierId,
        location_id: DEFAULT_LOCATION_ID,
        expected_date: expectedDate || null,
        notes: notes || null,
        items: items.map(i => ({
          product_id: i.product_id,
          quantity_ordered: i.quantity_ordered,
          unit_cost: i.unit_cost,
        })),
      });
      onSuccess();
    } catch (err) {
      handleError(AppError.fromAxiosError(err));
    }
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="flex flex-col" style={{ maxHeight: '72vh' }}>
      {/* HEADER CONTROLS */}
      <div className="space-y-4 flex-shrink-0 pb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-1 block">Supplier *</Label>
            <SearchSelect
              value={supplierId ? String(supplierId) : undefined}
              options={supplierOptions}
              placeholder="Select supplier…"
              onChange={v => setSupplierId(Number(v))}
            />
          </div>
          <div>
            <Label className="mb-1 block">Expected Delivery Date</Label>
            <Input
              type="date"
              value={expectedDate}
              onChange={e => setExpectedDate(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label className="mb-1 block">Notes</Label>
          <Textarea
            placeholder="Optional notes…"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={2}
          />
        </div>

        <div>
          <Label className="mb-1 block">Add Product</Label>
          <SearchSelect
            options={productOptions}
            placeholder="Search and add product…"
            onChange={addProduct}
          />
        </div>
      </div>

      {/* SCROLLABLE ITEMS */}
      <div className="flex-1 overflow-y-auto pr-1 min-h-0">
        <div className="border rounded-md overflow-hidden">
          <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-muted text-xs font-semibold text-muted-foreground">
            <div className="col-span-4">Product</div>
            <div className="col-span-2 text-right">Unit Cost</div>
            <div className="col-span-2 text-center">Qty</div>
            <div className="col-span-2 text-right">Line Total</div>
            <div className="col-span-2 text-center">Remove</div>
          </div>

          {items.length === 0 && (
            <p className="text-center py-8 text-sm text-muted-foreground">
              No items added yet.
            </p>
          )}

          {items.map(item => (
            <div
              key={item.product_id}
              className="grid grid-cols-12 gap-2 px-3 py-2 border-t items-center text-sm"
            >
              <div className="col-span-4 font-medium truncate">
                {item.product_name}
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={item.unit_cost}
                  onChange={e => updateCost(item.product_id, Number(e.target.value))}
                  className="text-right h-8"
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  min={1}
                  value={item.quantity_ordered}
                  onChange={e => updateQty(item.product_id, Number(e.target.value))}
                  className="text-center h-8"
                />
              </div>
              <div className="col-span-2 text-right font-medium">
                {fmt(item.line_total)}
              </div>
              <div className="col-span-2 flex justify-center">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeItem(item.product_id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex-shrink-0 pt-4 border-t mt-4">
        {items.length > 0 && (
          <div className="bg-muted/50 rounded-lg p-3 text-sm flex justify-between mb-4 font-semibold">
            <span>Gross Total</span>
            <span className="text-primary">{fmt(gross)}</span>
          </div>
        )}
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={createMutation.isPending}
            className="min-w-[160px]"
          >
            {createMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create Purchase Order
          </Button>
        </div>
      </div>
    </div>
  );
}
