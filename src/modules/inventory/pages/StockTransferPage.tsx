'use client';

import { useState } from 'react';
import { Plus, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import StockTransferDialog from '../dialogs/StockTransferDialog';
import StockTransferList from '../tables/StockTransferTable';

import { useStockTransfers } from '@/queries/stockTransfer.queries';
import {
  useCompleteStockTransfer,
  useCancelStockTransfer,
} from '@/mutations/stockTransfer.mutations';

import ConfirmDialog from '@/components/ConfirmDialog';
import { useConfirm } from '@/hooks/useConfirm';
import { usePagination } from '@/hooks/usePagination';

const DEFAULT_PAGE_SIZE = 20;

export default function StockTransferPage() {
  const confirm = useConfirm();

  /* =========================
     PAGINATION
  ========================= */
  const { page, pageSize } = usePagination({
    initialPage: 1,
    initialPageSize: DEFAULT_PAGE_SIZE,
  });

  /* =========================
     DATA
  ========================= */
  const { data, isLoading } = useStockTransfers({
    page,
    page_size: pageSize,
  });

  const transfers = data?.data ?? [];
  const summary = data?.summary;

  /* =========================
     MUTATIONS
  ========================= */
  const complete = useCompleteStockTransfer();
  const cancel = useCancelStockTransfer();

  /* =========================
     DIALOG
  ========================= */
  const [dialogOpen, setDialogOpen] = useState(false);

  /* =========================
     HANDLERS
  ========================= */
  const handleComplete = async (id: number) => {
    await complete.mutateAsync(id);
  };

  const handleCancel = async (id: number) => {
    const ok = await confirm.confirm({
      title: 'Cancel Stock Transfer',
      description: 'This action cannot be undone.',
    });

    if (!ok) return;

    await cancel.mutateAsync(id);
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Stock Transfer
          </h1>
          <p className="text-muted-foreground">
            Manage stock movement between locations
          </p>
        </div>

        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Transfer
        </Button>
      </div>

      {/* STATS */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Stat
              label="Warehouse"
              value={summary?.godown}
            />
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
            <Stat
              label="Showroom"
              value={summary?.showroom}
            />
          </div>
        </CardHeader>
      </Card>

      {/* LIST */}
      <Card>
        <CardHeader className="flex items-center">

        </CardHeader>

        <CardContent>
          <StockTransferList
            transfers={transfers}
            isLoading={isLoading}
            completingId={complete.variables}
            cancellingId={cancel.variables}
            onComplete={handleComplete}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>

      {/* CONFIRM */}
      {confirm.open && (
        <ConfirmDialog
          title={confirm.title}
          description={confirm.description}
          onConfirm={confirm.onConfirm}
          onCancel={confirm.onCancel}
        />
      )}

      {/* CREATE DIALOG */}
      <StockTransferDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}

/* =========================
   SMALL STAT COMPONENT
========================= */
function Stat({
  label,
  value,
}: {
  label: string;
  value?: number;
}) {
  return (
    <div className="flex-1 bg-muted rounded-lg p-4 text-center">
      <p className="text-sm text-muted-foreground mb-1">
        {label}
      </p>
      <p className="text-2xl font-bold">
        {value ?? '—'}
      </p>
    </div>
  );
}
