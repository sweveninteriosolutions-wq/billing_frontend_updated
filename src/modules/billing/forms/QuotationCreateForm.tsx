'use client';

import { useState } from 'react';
import { Plus, Trash2, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

import { useCreateQuotation } from '@/mutations/quotation.mutations';
import { AppError } from '@/errors/AppError';
import { useGlobalError } from '@/errors/useGlobalError';

import { SearchSelect } from '@/components/ui/SearchSelect';
import { useCustomers } from '@/queries/customer.queries';
import { useProducts } from '@/queries/product.queries';

/* =========================
   TYPES
========================= */
type Item = {
  product_id: number;
  product_name: string;
  hsn_code: number;
  quantity: number;
  unit_price: number | string;
  line_total: number | string;
};

export default function QuotationCreateForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const handleError = useGlobalError();
  const create = useCreateQuotation();

  /* =========================
     DATA
  ========================= */
  const { data: customerData } = useCustomers({
    page: 1,
    page_size: 100,
  });

  const { data: productData } = useProducts({
    page: 1,
    page_size: 100,
  });

  const customers =
    customerData?.items?.filter(c => c.is_active) ?? [];
  const products =
    productData?.items?.filter(p => !p.is_deleted) ?? [];

  /* =========================
     STATE
  ========================= */
  const [customerId, setCustomerId] =
    useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [isInterState, setIsInterState] = useState(false);

  /* =========================
     OPTIONS
  ========================= */
  const customerOptions = customers.map(c => ({
    value: String(c.id),
    label: c.name,
  }));

  const productOptions = products.map(p => ({
    value: String(p.id),
    label: p.name,
  }));

  /* =========================
     HELPERS
  ========================= */
  const validUntil = new Date(
    Date.now() + 15 * 24 * 60 * 60 * 1000
  )
    .toISOString()
    .slice(0, 10);

  const addItemByProductId = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (product.hsn_code == null) {
      handleError(
        new AppError(
          `Product "${product.name}" has no HSN code`,
          'VALIDATION_ERROR',
          400
        )
      );
      return;
    }

    if (items.some(i => i.product_id === product.id)) {
      handleError(
        new AppError(
          'Product already added',
          'VALIDATION_ERROR',
          400
        )
      );
      return;
    }

    setItems([
      ...items,
      {
        product_id: product.id,
        product_name: product.name,
        hsn_code: product.hsn_code,
        quantity: 1,
        unit_price: product.price,
        line_total: product.price,
      },
    ]);
  };

  const updateQty = (id: number, qty: number) => {
    if (qty <= 0) return;

    setItems(items.map(i =>
      i.product_id === id
        ? {
            ...i,
            quantity: qty,
            line_total:
              Number(i.unit_price) * qty,
          }
        : i
    ));
  };

  const removeItem = (id: number) => {
    setItems(items.filter(i => i.product_id !== id));
  };

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async () => {
    if (!customerId) {
      handleError(
        new AppError(
          'Customer is required',
          'VALIDATION_ERROR',
          400
        )
      );
      return;
    }

    if (items.length === 0) {
      handleError(
        new AppError(
          'At least one item is required',
          'VALIDATION_ERROR',
          400
        )
      );
      return;
    }

    try {
      await create.mutateAsync({
        customer_id: customerId,
        is_inter_state: isInterState,
        valid_until: validUntil,
        description,
        notes,
        items: items.map(i => ({
          product_id: i.product_id,
          hsn_code: i.hsn_code,
          quantity: i.quantity,
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
    <div className="flex flex-col h-[70vh]">

      {/* HEADER */}
      <div className="pb-4 space-y-4">
        <div>
          <label className="text-sm font-medium">
            Customer
          </label>
          <SearchSelect
            value={customerId ? String(customerId) : undefined}
            options={customerOptions}
            placeholder="Select customer"
            onChange={v => setCustomerId(Number(v))}
          />
        </div>

        {/* INTERSTATE TOGGLE */}
        <div className="flex items-center gap-3">
          <Switch
            id="interstate"
            checked={isInterState}
            onCheckedChange={setIsInterState}
          />
          <Label htmlFor="interstate">
            Interstate Supply (IGST)
          </Label>
        </div>
      </div>

      {/* SCROLLABLE BODY */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-6">

        <Textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <Textarea
          placeholder="Notes"
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />

        <div>
          <label className="text-sm font-medium">
            Add Product
          </label>
          <SearchSelect
            options={productOptions}
            placeholder="Select product"
            onChange={v =>
              addItemByProductId(Number(v))
            }
          />
        </div>

        {/* ITEMS TABLE */}
        <div className="border rounded-md overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-muted text-xs font-semibold text-muted-foreground">
            <div className="col-span-4">Product</div>
            <div className="col-span-2">HSN</div>
            <div className="col-span-2 text-right">Price</div>
            <div className="col-span-2">Qty</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          {items.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              No items added
            </div>
          )}

          {items.map(item => (
            <div
              key={item.product_id}
              className="grid grid-cols-12 gap-4 px-4 py-3 border-t items-center text-sm"
            >
              <div className="col-span-4 font-medium">
                {item.product_name}
              </div>

              <div className="col-span-2">
                {item.hsn_code}
              </div>

              <div className="col-span-2 text-right">
                ₹{item.unit_price}
              </div>

              <div className="col-span-2">
                <Input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={e =>
                    updateQty(
                      item.product_id,
                      Number(e.target.value)
                    )
                  }
                />
              </div>

              <div className="col-span-2 text-right flex justify-end gap-2">
                ₹{item.line_total}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    removeItem(item.product_id)
                  }
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="pt-4 border-t flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={create.isPending}
        >
          {create.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Create Quotation
        </Button>
      </div>
    </div>
  );
}
