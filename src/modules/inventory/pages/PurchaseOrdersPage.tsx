'use client';

import { useState } from 'react';
import { Plus, Eye, CheckCircle, Send, Ban, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import PurchaseOrderDialog from '../dialogs/PurchaseOrderDialog';

import { usePurchaseOrders } from '@/queries/purchaseOrder.queries';
import {
  useSubmitPurchaseOrder,
  useApprovePurchaseOrder,
  useCancelPurchaseOrder,
} from '@/mutations/purchaseOrder.mutations';

import ConfirmDialog from '@/components/ConfirmDialog';
import { TablePagination } from '@/components/TablePagination';
import { useConfirm } from '@/hooks/useConfirm';
import { usePagination } from '@/hooks/usePagination';

import { AppError } from '@/errors/AppError';
import { useGlobalError } from '@/errors/useGlobalError';
import { PurchaseOrderListItem, POStatus } from '@/types/purchaseOrder';

const DEFAULT_PAGE_SIZE = 20;

const STATUS_COLOR: Record<POStatus, string> = {
  draft: 'text-yellow-600',
  submitted: 'text-blue-600',
  approved: 'text-green-600',
  partially_received: 'text-orange-600',
  received: 'text-emerald-700',
  cancelled: 'text-destructive',
};

const fmt = (v: string | number) =>
  `₹${Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

export default function PurchaseOrdersPage() {
  const handleError = useGlobalError();
  const confirm = useConfirm();

  const { page, pageSize, setPage, setPageSize, reset } = usePagination({
    initialPage: 1,
    initialPageSize: DEFAULT_PAGE_SIZE,
  });

  /* =========================
     DATA
  ========================= */
  const { data, isLoading } = usePurchaseOrders({ page, page_size: pageSize });
  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  /* =========================
     MUTATIONS
  ========================= */
  const submit = useSubmitPurchaseOrder();
  const approve = useApprovePurchaseOrder();
  const cancelPO = useCancelPurchaseOrder();
  const [processingId, setProcessingId] = useState<number | undefined>();

  /* =========================
     DIALOG STATE
  ========================= */
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'view'>('create');
  const [selectedPO, setSelectedPO] = useState<PurchaseOrderListItem | null>(null);

  /* =========================
     HANDLERS
  ========================= */
  const handleCreate = () => {
    setSelectedPO(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleView = (po: PurchaseOrderListItem) => {
    setSelectedPO(po);
    setDialogMode('view');
    setDialogOpen(true);
  };

  const handleSubmit = async (po: PurchaseOrderListItem) => {
    const ok = await confirm.confirm({
      title: 'Submit Purchase Order',
      description: `Submit ${po.po_number} for approval?`,
    });
    if (!ok) return;
    setProcessingId(po.id);
    try {
      await submit.mutateAsync(po.id);
    } catch (err) {
      handleError(AppError.fromAxiosError(err));
    } finally {
      setProcessingId(undefined);
    }
  };

  const handleApprove = async (po: PurchaseOrderListItem) => {
    const ok = await confirm.confirm({
      title: 'Approve Purchase Order',
      description: `Approve ${po.po_number}?`,
    });
    if (!ok) return;
    setProcessingId(po.id);
    try {
      await approve.mutateAsync(po.id);
    } catch (err) {
      handleError(AppError.fromAxiosError(err));
    } finally {
      setProcessingId(undefined);
    }
  };

  const handleCancel = async (po: PurchaseOrderListItem) => {
    const ok = await confirm.confirm({
      title: 'Cancel Purchase Order',
      description: `Cancel ${po.po_number}? This cannot be undone.`,
    });
    if (!ok) return;
    setProcessingId(po.id);
    try {
      await cancelPO.mutateAsync(po.id);
    } catch (err) {
      handleError(AppError.fromAxiosError(err));
    } finally {
      setProcessingId(undefined);
    }
  };

  /* =========================
     STATS
  ========================= */
  const drafts = items.filter(i => i.status === 'draft').length;
  const submitted = items.filter(i => i.status === 'submitted').length;
  const approved = items.filter(i => i.status === 'approved').length;

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Purchase Orders</h1>
          <p className="text-muted-foreground">
            Create and manage supplier purchase orders
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Purchase Order
        </Button>
      </div>

      {/* STATS */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total POs" value={total} />
        <StatCard label="Drafts" value={drafts} warning />
        <StatCard label="Pending Approval" value={submitted} info />
        <StatCard label="Approved" value={approved} success />
      </div>

      {/* TABLE */}
      <Card>
        <CardContent className="pt-4">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : items.length === 0 ? (
            <p className="text-center py-10 text-muted-foreground text-sm">
              No purchase orders found.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted text-muted-foreground text-xs font-semibold">
                    <th className="px-4 py-3 text-left">PO #</th>
                    <th className="px-4 py-3 text-left">Supplier</th>
                    <th className="px-4 py-3 text-left">Location</th>
                    <th className="px-4 py-3 text-right">Items</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-left">Expected</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(po => {
                    const busy = processingId === po.id;
                    return (
                      <tr
                        key={po.id}
                        className="border-t hover:bg-muted/40 transition-colors"
                      >
                        <td className="px-4 py-3 font-mono font-medium text-primary">
                          {po.po_number}
                        </td>
                        <td className="px-4 py-3">{po.supplier_name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{po.location_name}</td>
                        <td className="px-4 py-3 text-right">{po.items_count}</td>
                        <td className="px-4 py-3 text-right font-medium">
                          {fmt(po.net_amount)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge
                            variant="outline"
                            className={`capitalize ${STATUS_COLOR[po.status]}`}
                          >
                            {po.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {po.expected_date
                            ? new Date(po.expected_date).toLocaleDateString('en-IN')
                            : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              title="View"
                              onClick={() => handleView(po)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            {po.status === 'draft' && (
                              <Button
                                size="icon"
                                variant="ghost"
                                title="Submit for Approval"
                                disabled={busy}
                                onClick={() => handleSubmit(po)}
                              >
                                {busy ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Send className="h-4 w-4 text-blue-500" />
                                )}
                              </Button>
                            )}

                            {po.status === 'submitted' && (
                              <Button
                                size="icon"
                                variant="ghost"
                                title="Approve PO"
                                disabled={busy}
                                onClick={() => handleApprove(po)}
                              >
                                {busy ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                )}
                              </Button>
                            )}

                            {['draft', 'submitted'].includes(po.status) && (
                              <Button
                                size="icon"
                                variant="ghost"
                                title="Cancel PO"
                                disabled={busy}
                                onClick={() => handleCancel(po)}
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
          )}
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

      {/* DIALOG */}
      <PurchaseOrderDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        po={selectedPO}
      />
    </div>
  );
}

/* =========================
   STAT CARD
========================= */
function StatCard({
  label,
  value,
  warning,
  info,
  success,
}: {
  label: string;
  value: number;
  warning?: boolean;
  info?: boolean;
  success?: boolean;
}) {
  const color = warning
    ? 'text-yellow-600'
    : info
    ? 'text-blue-600'
    : success
    ? 'text-green-600'
    : '';

  return (
    <Card>
      <CardContent className="px-4 py-4">
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
      </CardContent>
    </Card>
  );
}
