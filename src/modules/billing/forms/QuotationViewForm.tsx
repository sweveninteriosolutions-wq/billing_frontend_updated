'use client';

import { Badge } from '@/components/ui/badge';

type Props = {
  data?: any;
  isLoading?: boolean;
};

export default function QuotationViewForm({
  data,
  isLoading,
}: Props) {
  if (isLoading || !data) {
    return (
      <p className="text-sm text-muted-foreground">
        Loading quotation…
      </p>
    );
  }

  const quotation = data;
  const items = data.items;

  return (
    <div className="h-[80vh] flex flex-col rounded-lg border bg-background shadow-sm">

      {/* ================= HEADER ================= */}
      <div className="sticky top-0 z-10 bg-background border-b px-6 py-4 flex justify-between items-start">
        <div>
          <h1 className="text-xl font-semibold">
            Quotation #{quotation.quotation_number}
          </h1>
          <p className="text-sm text-muted-foreground">
            Valid Until: {quotation.valid_until ?? '—'}
          </p>
        </div>

        <Badge className="capitalize px-3 py-1">
          {quotation.status.replaceAll('_', ' ')}
        </Badge>
      </div>

      {/* ================= BODY ================= */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

        {/* ================= CUSTOMER DETAILS ================= */}
        <div className="rounded-md border p-4">
          <h3 className="text-sm font-semibold mb-3">
            Customer Details
          </h3>

          <div className="space-y-1 text-sm">
            <p className="font-medium">
              {quotation.customer.name}
            </p>

            <p>
              <span className="font-medium">Phone:</span>{' '}
              {quotation.customer.phone ?? '—'}
            </p>

            <p>
              <span className="font-medium">Email:</span>{' '}
              {quotation.customer.email}
            </p>

            <p>
              <span className="font-medium">GSTIN:</span>{' '}
              {quotation.customer.gstin ?? '—'}
            </p>

            {quotation.customer.address && (
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">
                  Address:
                </span>{' '}
                {[
                  quotation.customer.address.street,
                  quotation.customer.address.city,
                  quotation.customer.address.state,
                  quotation.customer.address.country,
                  quotation.customer.address.zip_code,
                ]
                  .filter(Boolean)
                  .join(', ')}
              </p>
            )}
          </div>
        </div>

        {/* ================= ITEMS ================= */}
        <div className="rounded-md border overflow-hidden">
          <div className="bg-muted px-4 py-2 text-xs font-semibold text-muted-foreground grid grid-cols-8">
            <div className="col-span-3">Product</div>
            <div>SKU</div>
            <div>HSN</div>
            <div className="text-right">Qty</div>
            <div className="text-right">Unit</div>
            <div className="text-right">Total</div>
          </div>

          {items.map((item: any) => (
            <div
              key={item.id}
              className="grid grid-cols-8 px-4 py-2 border-t text-sm"
            >
              <div className="col-span-3 font-medium">
                {item.product_name}
              </div>
              <div>{item.sku}</div>
              <div>{item.hsn_code}</div>
              <div className="text-right">{item.quantity}</div>
              <div className="text-right">
                ₹{item.unit_price}
              </div>
              <div className="text-right font-medium">
                ₹{item.line_total}
              </div>
            </div>
          ))}
        </div>

        {/* ================= CALCULATIONS ================= */}
        <div className="flex justify-end">
          <div className="w-full max-w-sm rounded-md border p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{quotation.subtotal_amount}</span>
            </div>

            {!quotation.is_inter_state ? (
              <>
                <div className="flex justify-between">
                  <span>CGST ({quotation.cgst_rate}%)</span>
                  <span>₹{quotation.cgst_amount}</span>
                </div>
                <div className="flex justify-between">
                  <span>SGST ({quotation.sgst_rate}%)</span>
                  <span>₹{quotation.sgst_amount}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between">
                <span>IGST ({quotation.igst_rate}%)</span>
                <span>₹{quotation.igst_amount}</span>
              </div>
            )}

            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Total</span>
              <span>₹{quotation.total_amount}</span>
            </div>
          </div>
        </div>

        {/* ================= DESCRIPTION & NOTES ================= */}
        {(quotation.description || quotation.notes) && (
          <div className="grid grid-cols-2 gap-6">
            {quotation.description && (
              <div className="rounded-md border p-4">
                <h3 className="text-sm font-semibold mb-2">
                  Description
                </h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {quotation.description}
                </p>
              </div>
            )}

            {quotation.notes && (
              <div className="rounded-md border p-4">
                <h3 className="text-sm font-semibold mb-2">
                  Notes
                </h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {quotation.notes}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ================= AUDIT (BOTTOM) ================= */}
        <div className="grid grid-cols-2 gap-6 pt-4 border-t text-sm">
          <div>
            <p>
              <span className="font-medium">Created At:</span>{' '}
              {new Date(quotation.created_at).toLocaleString()}
            </p>
            <p>
              <span className="font-medium">Created By:</span>{' '}
              {quotation.created_by_name ?? '—'}
            </p>
          </div>

          <div className="text-right">
            <p>
              <span className="font-medium">Updated At:</span>{' '}
              {quotation.updated_at
                ? new Date(quotation.updated_at).toLocaleString()
                : '—'}
            </p>
            <p>
              <span className="font-medium">Updated By:</span>{' '}
              {quotation.updated_by_name ?? '—'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
