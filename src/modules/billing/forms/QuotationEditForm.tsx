'use client';

import { useEffect, useMemo, useState } from 'react';
import { Loader2, Trash2, CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

import {
  useUpdateQuotation,
  useApproveQuotation,
  useDeleteQuotation,
} from '@/mutations/quotation.mutations';

import { useProducts } from '@/queries/product.queries';
import { SearchSelect } from '@/components/ui/SearchSelect';

import { AppError } from '@/errors/AppError';
import { useGlobalError } from '@/errors/useGlobalError';
import { QuotationDetail } from '@/types/quotation';

/* =========================
   TYPES
========================= */
type Item = {
  product_id: number;
  product_name: string;
  hsn_code: number;
  quantity: string; // keyboard-safe
  unit_price: number;
};

type Props = {
  data?: QuotationDetail;
  isLoading?: boolean;
  onSuccess: () => void;
};

export default function QuotationEditForm({
  data,
  isLoading,
  onSuccess,
}: Props) {
  const handleError = useGlobalError();

  const update = useUpdateQuotation();
  const approve = useApproveQuotation();
  const del = useDeleteQuotation();

  const { data: productsData } = useProducts({
    page: 1,
    page_size: 100,
  });

  const products = productsData?.items ?? [];

  /* =========================
     STATE (ALWAYS DECLARED)
  ========================= */
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [isInterState, setIsInterState] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  /* =========================
     SYNC BACKEND DATA
  ========================= */
  useEffect(() => {
    if (!data) return;

    setDescription(data.description ?? '');
    setNotes(data.notes ?? '');
    setIsInterState(Boolean(data.is_inter_state));

    setItems(
      data.items.map(i => ({
        product_id: i.product_id,
        product_name: i.product_name,
        hsn_code: i.hsn_code,
        quantity: String(i.quantity),
        unit_price: Number(i.unit_price),
      }))
    );

    setIsDirty(false);
  }, [data]);

  /* =========================
     SAFE DERIVED VALUES
  ========================= */
  const quotation = data;
  const customer = data?.customer;
  const isDraft = quotation?.status === 'draft';

  const subtotal = useMemo(() => {
    return items.reduce((sum, i) => {
      const qty = Number(i.quantity);
      if (!qty || qty <= 0) return sum;
      return sum + qty * i.unit_price;
    }, 0);
  }, [items]);

  const gstTotalRate =
    Number(quotation?.cgst_rate || 0) +
    Number(quotation?.sgst_rate || 0) +
    Number(quotation?.igst_rate || 0);

  const cgstRate = !isInterState ? gstTotalRate / 2 : 0;
  const sgstRate = !isInterState ? gstTotalRate / 2 : 0;
  const igstRate = isInterState ? gstTotalRate : 0;

  const cgstAmount = (subtotal * cgstRate) / 100;
  const sgstAmount = (subtotal * sgstRate) / 100;
  const igstAmount = (subtotal * igstRate) / 100;

  const grandTotal =
    subtotal + cgstAmount + sgstAmount + igstAmount;

  /* =========================
     EARLY UI RETURN (SAFE)
  ========================= */
  if (isLoading || !data) {
    return (
      <p className="text-sm text-muted-foreground">
        Loading quotation…
      </p>
    );
  }

  /* =========================
     ITEM HANDLERS
  ========================= */
  const updateQty = (id: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    setItems(prev =>
      prev.map(i =>
        i.product_id === id
          ? { ...i, quantity: value }
          : i
      )
    );
    setIsDirty(true);
  };

  const addProduct = (productId: number) => {
    const p = products.find(p => p.id === productId);
    if (!p || p.hsn_code == null) return;

    if (items.some(i => i.product_id === p.id)) return;

    setItems(prev => [
      ...prev,
      {
        product_id: p.id,
        product_name: p.name,
        hsn_code: p.hsn_code,
        quantity: '1',
        unit_price: Number(p.price),
      },
    ]);

    setIsDirty(true);
  };

  const removeItem = (id: number) => {
    setItems(prev =>
      prev.filter(i => i.product_id !== id)
    );
    setIsDirty(true);
  };

  /* =========================
     ACTIONS
  ========================= */
  const handleSave = async () => {
    try {
      await update.mutateAsync({
        id: quotation.id,
        payload: {
          description,
          notes,
          is_inter_state: isInterState,
          items: items.map(i => ({
            product_id: i.product_id,
            quantity: Number(i.quantity || 0),
          })),
          version: quotation.version,
        },
      });

      setIsDirty(false);
      onSuccess();
    } catch (err) {
      handleError(AppError.fromAxiosError(err));
    }
  };

  const handleApprove = async () => {
    if (isDirty) {
      handleError(
        new AppError(
          'Save changes before approving',
          'UNSAVED_CHANGES',
          400
        )
      );
      return;
    }

    await approve.mutateAsync({
      id: quotation.id,
      version: quotation.version,
    });

    onSuccess();
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="flex flex-col h-[70vh] border rounded-lg bg-background">

      {/* HEADER */}
      <div className="border-b px-6 py-4 flex justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Quotation #{quotation.quotation_number}
          </h2>
          <p className="text-sm text-muted-foreground">
            Customer: {customer?.name}
          </p>
        </div>
        <Badge className="capitalize">
          {quotation.status.replaceAll('_', ' ')}
        </Badge>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

        {/* INTERSTATE */}
        {isDraft && (
          <div className="flex items-center justify-between border rounded-md px-4 py-3">
            <Label>Inter-State Supply</Label>
            <Switch
              checked={isInterState}
              onCheckedChange={v => {
                setIsInterState(v);
                setIsDirty(true);
              }}
            />
          </div>
        )}

        {/* DESCRIPTION */}
        <div>
          <Label>Description</Label>
          <Textarea
            value={description}
            onChange={e => {
              setDescription(e.target.value);
              setIsDirty(true);
            }}
          />
        </div>

        {/* NOTES */}
        <div>
          <Label>Notes</Label>
          <Textarea
            value={notes}
            onChange={e => {
              setNotes(e.target.value);
              setIsDirty(true);
            }}
          />
        </div>

        {/* ADD PRODUCT */}
        {isDraft && (
          <SearchSelect
            placeholder="Add product"
            options={products.map(p => ({
              value: String(p.id),
              label: p.name,
            }))}
            onChange={v => addProduct(Number(v))}
          />
        )}

        {/* ITEMS TABLE */}
        <div className="border rounded-md overflow-hidden">
          <div className="grid grid-cols-6 gap-2 px-4 py-2 bg-muted text-xs font-semibold">
            <div>Product</div>
            <div>HSN</div>
            <div>Price</div>
            <div>Qty</div>
            <div>Total</div>
            <div />
          </div>

          {items.map(i => (
            <div
              key={i.product_id}
              className="grid grid-cols-6 gap-2 px-4 py-2 border-t items-center text-sm"
            >
              <div>{i.product_name}</div>
              <div>{i.hsn_code}</div>
              <div>₹{i.unit_price}</div>
              <Input
                value={i.quantity}
                onChange={e =>
                  updateQty(i.product_id, e.target.value)
                }
              />
              <div>
                ₹{(
                  Number(i.quantity || 0) *
                  i.unit_price
                ).toFixed(2)}
              </div>
              {isDraft && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    removeItem(i.product_id)
                  }
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* GST BREAKUP */}
        <div className="border rounded-md p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          {!isInterState && (
            <>
              <div className="flex justify-between">
                <span>CGST ({cgstRate}%)</span>
                <span>₹{cgstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>SGST ({sgstRate}%)</span>
                <span>₹{sgstAmount.toFixed(2)}</span>
              </div>
            </>
          )}

          {isInterState && (
            <div className="flex justify-between">
              <span>IGST ({igstRate}%)</span>
              <span>₹{igstAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between border-t pt-2 font-semibold">
            <span>Total</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* FOOTER */}
<div className="border-t px-6 py-4 flex justify-end gap-2">
  <Button
    onClick={handleSave}
    disabled={!isDirty || update.isPending}
  >
    {update.isPending && (
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
    )}
    Save
  </Button>

  <Button
    onClick={handleApprove}
    disabled={isDirty || approve.isPending}
  >
    {approve.isPending ? (
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
    ) : (
      <CheckCircle className="mr-2 h-4 w-4" />
    )}
    Approve
  </Button>
</div>

    </div>
  );
}
