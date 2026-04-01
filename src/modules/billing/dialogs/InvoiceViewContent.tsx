'use client';

import { Loader2, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useInvoice } from '@/queries/invoice.queries';
import { downloadInvoicePdf } from '@/api/invoice.api';
import { InvoiceListItem } from '@/types/invoice';

type Props = {
  invoice: InvoiceListItem | null;
  isOpen: boolean;
};

const fmt = (v: string | number) =>
  `₹${Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

const STATUS_COLOR: Record<string, string> = {
  draft: 'text-yellow-600',
  verified: 'text-blue-600',
  partially_paid: 'text-orange-600',
  paid: 'text-green-600',
  fulfilled: 'text-emerald-700',
  cancelled: 'text-destructive',
};

export default function InvoiceViewContent({ invoice, isOpen }: Props) {
  const { data, isLoading } = useInvoice(invoice?.id ?? 0, isOpen && !!invoice);

  const handleDownload = async () => {
    if (!data) return;
    await downloadInvoicePdf(data.id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) return null;

  const isInterState = Number(data.igst_rate ?? 0) > 0;
  const snap = data.customer_snapshot as Record<string, string> | null | undefined;

  return (
    <div className="space-y-5 overflow-y-auto max-h-[70vh] pr-1">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Invoice Number</p>
          <p className="font-mono text-lg font-bold text-primary">{data.invoice_number}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date(data.created_at).toLocaleDateString('en-IN', {
              day: '2-digit', month: 'short', year: 'numeric',
            })}
          </p>
          {snap?.name && (
            <p className="text-sm font-medium mt-1">{snap.name}</p>
          )}
          {snap?.email && (
            <p className="text-xs text-muted-foreground">{snap.email}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge className={`capitalize ${STATUS_COLOR[data.status]}`} variant="outline">
            {data.status.replace('_', ' ')}
          </Badge>
          <Button size="sm" variant="outline" onClick={handleDownload}>
            <FileDown className="mr-1.5 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <Separator />

      {/* Items */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
          Line Items
        </p>
        <div className="border rounded-md overflow-hidden text-sm">
          <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-muted text-xs font-semibold text-muted-foreground">
            <div className="col-span-5">Product ID</div>
            <div className="col-span-2 text-right">Unit Price</div>
            <div className="col-span-2 text-center">Qty</div>
            <div className="col-span-3 text-right">Line Total</div>
          </div>
          {data.items.map(item => (
            <div
              key={item.id}
              className="grid grid-cols-12 gap-2 px-3 py-2.5 border-t items-center"
            >
              <div className="col-span-5 font-medium">
                {/* product_name not in InvoiceItemOut — show product_id as reference */}
                <span className="text-xs text-muted-foreground font-mono">#{item.product_id}</span>
              </div>
              <div className="col-span-2 text-right">{fmt(item.unit_price)}</div>
              <div className="col-span-2 text-center">{item.quantity}</div>
              <div className="col-span-3 text-right font-medium">{fmt(item.line_total)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tax Summary */}
      <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-1">
        <Row label="Gross Amount" value={fmt(data.gross_amount)} />
        {isInterState ? (
          <Row label="IGST (18%)" value={fmt(data.tax_amount)} />
        ) : (
          <>
            <Row
              label="CGST (9%)"
              value={fmt(Number(data.tax_amount) / 2)}
            />
            <Row
              label="SGST (9%)"
              value={fmt(Number(data.tax_amount) / 2)}
            />
          </>
        )}
        {Number(data.discount_amount) > 0 && (
          <Row label="Discount" value={`- ${fmt(data.discount_amount)}`} cls="text-red-600" />
        )}
        <Separator className="my-1" />
        <Row label="Net Total" value={fmt(data.net_amount)} bold />
        <Row label="Total Paid" value={fmt(data.total_paid)} cls="text-green-600" />
        <Row label="Balance Due" value={fmt(data.balance_due)} cls="text-orange-600" bold />
      </div>

      {/* Payments */}
      {data.payments.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
            Payment History
          </p>
          <div className="space-y-2">
            {data.payments.map(p => (
              <div
                key={p.id}
                className="flex justify-between items-center border rounded-md px-3 py-2 text-sm"
              >
                <div>
                  <span className="font-medium capitalize">{p.payment_method ?? 'Cash'}</span>
                  <span className="text-muted-foreground ml-2 text-xs">
                    {new Date(p.created_at).toLocaleDateString('en-IN')}
                  </span>
                </div>
                <span className="font-semibold text-green-600">{fmt(p.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* Small helper */
function Row({
  label,
  value,
  cls = '',
  bold = false,
}: {
  label: string;
  value: string;
  cls?: string;
  bold?: boolean;
}) {
  return (
    <div className={`flex justify-between ${bold ? 'font-bold text-base' : ''}`}>
      <span className="text-muted-foreground">{label}</span>
      <span className={cls}>{value}</span>
    </div>
  );
}
