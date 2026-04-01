'use client';

import { useState, useEffect } from 'react';
import { Trash2, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

import { SearchSelect } from '@/components/ui/SearchSelect';
import { useCustomers } from '@/queries/customer.queries';
import { useProducts } from '@/queries/product.queries';
import { useCreateInvoice, useUpdateInvoice } from '@/mutations/invoice.mutations';
import { AppError } from '@/errors/AppError';
import { useGlobalError } from '@/errors/useGlobalError';

import { InvoiceOut } from '@/types/invoice';

/* =========================
   TYPES
========================= */
type LineItem = {
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
};

type Props = {
  mode: 'create' | 'edit';
  invoice?: InvoiceOut | null;
  onSuccess: () => void;
};

/* =========================
   HELPERS
========================= */
const fmt = (v: string | number) =>
  `₹${Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

const GST_RATE = 0.18;

function calcTotals(items: LineItem[], isInterState: boolean, discount: number) {
  const gross = items.reduce((s, i) => s + i.line_total, 0);
  const tax = gross * GST_RATE;
  const net = gross + tax - discount;

  const cgst = isInterState ? 0 : tax / 2;
  const sgst = isInterState ? 0 : tax / 2;
  const igst = isInterState ? tax : 0;

  return { gross, tax, cgst, sgst, igst, net };
}

/* =========================
   COMPONENT
========================= */
export default function InvoiceForm({ mode, invoice, onSuccess }: Props) {
  const handleError = useGlobalError();
  const createMutation = useCreateInvoice();
  const updateMutation = useUpdateInvoice();

  const isEdit = mode === 'edit';
  const isBusy = createMutation.isPending || updateMutation.isPending;

  /* =========================
     DATA
  ========================= */
  const { data: customerData } = useCustomers({ page: 1, page_size: 200 });
  const { data: productData } = useProducts({ page: 1, page_size: 200 });

  const customers = customerData?.items?.filter(c => c.is_active) ?? [];
  const products = productData?.items?.filter(p => !p.is_deleted) ?? [];

  /* =========================
     STATE
  ========================= */
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [isInterState, setIsInterState] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [items, setItems] = useState<LineItem[]>([]);

  /* =========================
     POPULATE IN EDIT MODE
  ========================= */
  useEffect(() => {
    if (isEdit && invoice) {
      setCustomerId(invoice.customer_id);
      // is_inter_state is detected from items since igst_rate isn't in InvoiceOut summary
      // We simply default to false in edit; users can toggle if needed
      setIsInterState(false);
      setDiscount(Number(invoice.discount_amount) || 0);
      setItems(
        invoice.items.map(it => ({
          product_id: it.product_id,
          product_name:
            products.find(p => p.id === it.product_id)?.name ??
            `Product #${it.product_id}`,
          quantity: it.quantity,
          unit_price: Number(it.unit_price),
          line_total: Number(it.line_total),
        }))
      );
    }
  }, [isEdit, invoice, products.length]);

  /* =========================
     OPTIONS
  ========================= */
  const customerOptions = customers.map(c => ({
    value: String(c.id),
    label: c.name,
  }));

  const productOptions = products.map(p => ({
    value: String(p.id),
    label: `${p.name} — ${fmt(p.price)}`,
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

    const unitPrice = Number(product.price);
    setItems(prev => [
      ...prev,
      {
        product_id: product.id,
        product_name: product.name,
        quantity: 1,
        unit_price: unitPrice,
        line_total: unitPrice,
      },
    ]);
  };

  const updateQty = (productId: number, qty: number) => {
    if (qty < 1) return;
    setItems(prev =>
      prev.map(i =>
        i.product_id === productId
          ? { ...i, quantity: qty, line_total: i.unit_price * qty }
          : i
      )
    );
  };

  const updatePrice = (productId: number, price: number) => {
    if (price < 0) return;
    setItems(prev =>
      prev.map(i =>
        i.product_id === productId
          ? { ...i, unit_price: price, line_total: price * i.quantity }
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
  const totals = calcTotals(items, isInterState, discount);

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async () => {
    if (!customerId) {
      handleError(new AppError('Customer is required', 'VALIDATION_ERROR', 400));
      return;
    }
    if (items.length === 0) {
      handleError(new AppError('Add at least one item', 'VALIDATION_ERROR', 400));
      return;
    }

    try {
      if (isEdit && invoice) {
        await updateMutation.mutateAsync({
          id: invoice.id,
          payload: {
            version: invoice.version,
            items: items.map(i => ({
              product_id: i.product_id,
              quantity: i.quantity,
              unit_price: i.unit_price,
            })),
          },
        });
      } else {
        await createMutation.mutateAsync({
          customer_id: customerId,
          is_inter_state: isInterState,
          items: items.map(i => ({
            product_id: i.product_id,
            quantity: i.quantity,
            unit_price: i.unit_price,
          })),
        });
      }
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
      {/* TOP CONTROLS */}
      <div className="pb-4 space-y-4 flex-shrink-0">
        <div className="grid grid-cols-2 gap-4">
          {/* Customer */}
          <div>
            <Label className="text-sm font-medium mb-1 block">Customer *</Label>
            <SearchSelect
              value={customerId ? String(customerId) : undefined}
              options={customerOptions}
              placeholder="Select customer…"
              onChange={v => setCustomerId(Number(v))}
              disabled={isEdit}
            />
          </div>

          {/* Interstate Toggle */}
          <div className="flex items-center gap-3 pt-6">
            <Switch
              id="interstate"
              checked={isInterState}
              onCheckedChange={setIsInterState}
            />
            <Label htmlFor="interstate">Interstate Supply (IGST)</Label>
          </div>
        </div>

        {/* Add Product */}
        <div>
          <Label className="text-sm font-medium mb-1 block">Add Product</Label>
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
            <div className="col-span-2 text-right">Unit Price</div>
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
                  value={item.unit_price}
                  onChange={e => updatePrice(item.product_id, Number(e.target.value))}
                  className="text-right h-8"
                />
              </div>

              <div className="col-span-2">
                <Input
                  type="number"
                  min={1}
                  value={item.quantity}
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

      {/* SUMMARY + FOOTER */}
      <div className="flex-shrink-0 pt-4 border-t mt-4 space-y-3">
        {/* Discount */}
        <div className="flex items-center gap-3 justify-end">
          <Label className="text-sm">Discount (₹)</Label>
          <Input
            type="number"
            min={0}
            step={0.01}
            value={discount}
            onChange={e => setDiscount(Number(e.target.value))}
            className="w-32 text-right"
          />
        </div>

        {/* Tax breakdown */}
        {items.length > 0 && (
          <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-1 text-right">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{fmt(totals.gross)}</span>
            </div>
            {isInterState ? (
              <div className="flex justify-between">
                <span className="text-muted-foreground">IGST (18%)</span>
                <span>{fmt(totals.igst)}</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CGST (9%)</span>
                  <span>{fmt(totals.cgst)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SGST (9%)</span>
                  <span>{fmt(totals.sgst)}</span>
                </div>
              </>
            )}
            {discount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Discount</span>
                <span>- {fmt(discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base border-t pt-1">
              <span>Net Total</span>
              <span className="text-primary">{fmt(totals.net)}</span>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={isBusy} className="min-w-[140px]">
            {isBusy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? 'Update Invoice' : 'Create Invoice'}
          </Button>
        </div>
      </div>
    </div>
  );
}
