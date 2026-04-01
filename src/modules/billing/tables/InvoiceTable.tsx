import { Eye, Pencil, Ban, CheckCircle, CreditCard, Loader2, FileDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { InvoiceListItem, InvoiceStatus } from '@/types/invoice';

type Props = {
  items: InvoiceListItem[];
  isLoading: boolean;
  onView: (invoice: InvoiceListItem) => void;
  onEdit?: (invoice: InvoiceListItem) => void;
  onVerify?: (invoice: InvoiceListItem) => void;
  onPayment?: (invoice: InvoiceListItem) => void;
  onCancel?: (invoice: InvoiceListItem) => void;
  onDownloadPdf?: (invoice: InvoiceListItem) => void;
  processingId?: number;
};

const STATUS_VARIANT: Record<InvoiceStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  draft: 'secondary',
  verified: 'outline',
  partially_paid: 'default',
  paid: 'default',
  fulfilled: 'default',
  cancelled: 'destructive',
};

const STATUS_COLOR: Record<InvoiceStatus, string> = {
  draft: 'text-yellow-600',
  verified: 'text-blue-600',
  partially_paid: 'text-orange-600',
  paid: 'text-green-600',
  fulfilled: 'text-emerald-700',
  cancelled: 'text-destructive',
};

const fmt = (v: string | number) =>
  `₹${Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

export default function InvoiceTable({
  items,
  isLoading,
  onView,
  onEdit,
  onVerify,
  onPayment,
  onCancel,
  onDownloadPdf,
  processingId,
}: Props) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <p className="text-center py-10 text-muted-foreground text-sm">
        No invoices found.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted text-muted-foreground text-xs font-semibold">
            <th className="px-4 py-3 text-left">Invoice #</th>
            <th className="px-4 py-3 text-left">Customer</th>
            <th className="px-4 py-3 text-right">Amount</th>
            <th className="px-4 py-3 text-right">Paid</th>
            <th className="px-4 py-3 text-right">Balance</th>
            <th className="px-4 py-3 text-center">Status</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((inv) => {
            const busy = processingId === inv.id;
            return (
              <tr
                key={inv.id}
                className="border-t hover:bg-muted/40 transition-colors"
              >
                <td className="px-4 py-3 font-mono font-medium text-primary">
                  {inv.invoice_number}
                </td>
                <td className="px-4 py-3">{inv.customer_name}</td>
                <td className="px-4 py-3 text-right font-medium">
                  {fmt(inv.total_amount)}
                </td>
                <td className="px-4 py-3 text-right text-green-600">
                  {fmt(inv.total_paid)}
                </td>
                <td className="px-4 py-3 text-right text-orange-600 font-semibold">
                  {fmt(inv.balance_due)}
                </td>
                <td className="px-4 py-3 text-center">
                  <Badge
                    variant={STATUS_VARIANT[inv.status]}
                    className={`capitalize ${STATUS_COLOR[inv.status]}`}
                  >
                    {inv.status.replace('_', ' ')}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1 flex-wrap">
                    {/* View */}
                    <Button
                      size="icon"
                      variant="ghost"
                      title="View"
                      onClick={() => onView(inv)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    {/* Edit (draft only) */}
                    {onEdit && inv.status === 'draft' && (
                      <Button
                        size="icon"
                        variant="ghost"
                        title="Edit"
                        onClick={() => onEdit(inv)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}

                    {/* Verify (draft only) */}
                    {onVerify && inv.status === 'draft' && (
                      <Button
                        size="icon"
                        variant="ghost"
                        title="Verify Invoice"
                        disabled={busy}
                        onClick={() => onVerify(inv)}
                      >
                        {busy ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                        )}
                      </Button>
                    )}

                    {/* Add Payment (verified / partially_paid) */}
                    {onPayment &&
                      ['verified', 'partially_paid'].includes(inv.status) && (
                        <Button
                          size="icon"
                          variant="ghost"
                          title="Add Payment"
                          onClick={() => onPayment(inv)}
                        >
                          <CreditCard className="h-4 w-4 text-green-600" />
                        </Button>
                      )}

                    {/* Download PDF */}
                    {onDownloadPdf && inv.status !== 'cancelled' && (
                      <Button
                        size="icon"
                        variant="ghost"
                        title="Download PDF"
                        onClick={() => onDownloadPdf(inv)}
                      >
                        <FileDown className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    )}

                    {/* Cancel (draft / verified) */}
                    {onCancel &&
                      ['draft', 'verified'].includes(inv.status) && (
                        <Button
                          size="icon"
                          variant="ghost"
                          title="Cancel Invoice"
                          disabled={busy}
                          onClick={() => onCancel(inv)}
                        >
                          <Ban className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
