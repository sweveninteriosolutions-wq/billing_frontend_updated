import { useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import InvoiceTable from '../tables/InvoiceTable';
import InvoiceCreateDialog from '../dialogs/InvoiceCreateDialog';
import InvoiceEditDialog from '../dialogs/InvoiceEditDialog';
import InvoiceViewDialog from '../dialogs/InvoiceViewDialog';
import PaymentCreateDialog from '../dialogs/PaymentCreateDialog';

import { useInvoices } from '@/queries/invoice.queries';
import { getInvoice } from '@/api/invoice.api';
import {
  useVerifyInvoice,
  useCancelInvoice,
  useFulfillInvoice,
} from '@/mutations/invoice.mutations';

import ConfirmDialog from '@/components/ConfirmDialog';
import { TablePagination } from '@/components/TablePagination';
import { useConfirm } from '@/hooks/useConfirm';
import { usePagination } from '@/hooks/usePagination';
import { StatCard } from '@/components/StatCard';

import { AppError } from '@/errors/AppError';
import { useGlobalError } from '@/errors/useGlobalError';
import { InvoiceListItem } from '@/types/invoice';
import { downloadInvoicePdf } from '@/api/invoice.api';
import { useRoleAccess } from '@/hooks/useRoleAccess';

const DEFAULT_PAGE_SIZE = 20;

export default function InvoicesPage() {
  const handleError = useGlobalError();
  const confirm = useConfirm();
  const perms = useRoleAccess();

  /* =========================
     PAGINATION
  ========================= */
  const { page, pageSize, setPage, setPageSize, reset } = usePagination({
    initialPage: 1,
    initialPageSize: DEFAULT_PAGE_SIZE,
  });

  /* =========================
     DATA
  ========================= */
  const { data, isLoading } = useInvoices({ page, page_size: pageSize });
  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  /* =========================
     MUTATIONS
  ========================= */
  const verify = useVerifyInvoice();
  const cancel = useCancelInvoice();
  const fulfill = useFulfillInvoice();

  /* =========================
     DIALOG STATE
  ========================= */
  const [createOpen, setCreateOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editInvoiceId, setEditInvoiceId] = useState<number | null>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewInvoice, setViewInvoice] = useState<InvoiceListItem | null>(null);

  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentInvoice, setPaymentInvoice] = useState<InvoiceListItem | null>(null);

  const [processingId, setProcessingId] = useState<number | undefined>();

  /* =========================
     HANDLERS
  ========================= */
  const handleView = (inv: InvoiceListItem) => {
    setViewInvoice(inv);
    setViewOpen(true);
  };

  const handleEdit = (inv: InvoiceListItem) => {
    setEditInvoiceId(inv.id);
    setEditOpen(true);
  };

  const handlePayment = (inv: InvoiceListItem) => {
    setPaymentInvoice(inv);
    setPaymentOpen(true);
  };

  const handleVerify = async (inv: InvoiceListItem) => {
    const ok = await confirm.confirm({
      title: 'Verify Invoice',
      description: `Mark ${inv.invoice_number} as verified?`,
    });
    if (!ok) return;
    setProcessingId(inv.id);
    try {
      await verify.mutateAsync(inv.id);
    } catch (err) {
      handleError(AppError.fromAxiosError(err));
    } finally {
      setProcessingId(undefined);
    }
  };

  const handleFulfill = async (inv: InvoiceListItem) => {
    const ok = await confirm.confirm({
      title: 'Fulfill Invoice',
      description: `Fulfill ${inv.invoice_number}? This will deduct inventory stock.`,
    });
    if (!ok) return;
    setProcessingId(inv.id);
    try {
      // Fetch full invoice to get current version for optimistic lock
      const detail = await getInvoice(inv.id);
      await fulfill.mutateAsync({ id: inv.id, version: detail.version });
    } catch (err) {
      handleError(AppError.fromAxiosError(err));
    } finally {
      setProcessingId(undefined);
    }
  };

  const handleCancel = async (inv: InvoiceListItem) => {
    const ok = await confirm.confirm({
      title: 'Cancel Invoice',
      description: `Cancel invoice ${inv.invoice_number}? This cannot be undone.`,
    });
    if (!ok) return;
    setProcessingId(inv.id);
    try {
      await cancel.mutateAsync(inv.id);
    } catch (err) {
      handleError(AppError.fromAxiosError(err));
    } finally {
      setProcessingId(undefined);
    }
  };

  const handleDownloadPdf = (inv: InvoiceListItem) => {
    const url = downloadInvoicePdf(inv.id);
    window.open(url, '_blank');
  };

  /* =========================
     STATS
  ========================= */
  const drafts = items.filter(i => i.status === 'draft').length;
  const pending = items.filter(i =>
    ['verified', 'partially_paid'].includes(i.status)
  ).length;
  const paid = items.filter(i =>
    ['paid', 'fulfilled'].includes(i.status)
  ).length;

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">
            Create, manage and track all invoices
          </p>
        </div>
        {perms.canManageInvoices && (
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        )}
      </div>

      {/* STATS */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total Invoices" value={total} />
        <StatCard label="Drafts" value={drafts} variant="warning" />
        <StatCard label="Awaiting Payment" value={pending} variant="info" />
        <StatCard label="Paid / Fulfilled" value={paid} variant="success" />
      </div>

      {/* TABLE */}
      <Card>
        <CardContent className="pt-4">
          <InvoiceTable
            items={items}
            isLoading={isLoading}
            onView={handleView}
            onEdit={handleEdit}
            onVerify={handleVerify}
            onPayment={handlePayment}
            onCancel={handleCancel}
            onDownloadPdf={handleDownloadPdf}
            processingId={processingId}
          />
        </CardContent>
      </Card>

      {/* PAGINATION */}
      {total > 0 && (
        <TablePagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={size => {
            setPageSize(size);
            reset();
          }}
        />
      )}

      {/* CONFIRM */}
      {confirm.open && (
        <ConfirmDialog
          title={confirm.title}
          description={confirm.description}
          onConfirm={confirm.onConfirm}
          onCancel={confirm.onCancel}
        />
      )}

      {/* DIALOGS */}
      <InvoiceCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
      />

      <InvoiceEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        invoiceId={editInvoiceId}
      />

      <InvoiceViewDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        invoice={viewInvoice}
      />

      <PaymentCreateDialog
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        invoice={paymentInvoice}
      />
    </div>
  );
}


