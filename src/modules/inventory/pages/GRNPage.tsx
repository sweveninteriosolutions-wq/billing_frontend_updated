'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import GRNDialog from '../dialogs/GRNDialog';
import GRNList from '../tables/GRNTable';

import { useGRNs } from '@/queries/grn.queries';
import {
  useVerifyGRN,
  useDeleteGRN,
} from '@/mutations/grn.mutations';

import ConfirmDialog from '@/components/ConfirmDialog';

import { useConfirm } from '@/hooks/useConfirm';
import { usePagination } from '@/hooks/usePagination';

import { GRNView } from '@/types/grn';
import { AppError } from '@/errors/AppError';
import { useGlobalError } from '@/errors/useGlobalError';

const DEFAULT_PAGE_SIZE = 20;

export default function GRNPage() {
  const handleError = useGlobalError();
  const confirm = useConfirm();

  /* =========================
     PAGINATION
  ========================= */
  const { page, pageSize, setPage } = usePagination({
    initialPage: 1,
    initialPageSize: DEFAULT_PAGE_SIZE,
  });

  /* =========================
     DATA
  ========================= */
  const { data, isLoading } = useGRNs({
    page,
    page_size: pageSize,
  });

  const items = data?.items ?? [];

  /* =========================
     MUTATIONS
  ========================= */
  const verify = useVerifyGRN();
  const del = useDeleteGRN();

  /* =========================
     DIALOG
  ========================= */
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] =
    useState<'create' | 'view'>('create');
  const [selectedGRN, setSelectedGRN] =
    useState<GRNView | null>(null);

  /* =========================
     HANDLERS
  ========================= */
  const handleCreate = () => {
    setSelectedGRN(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleView = (grn: GRNView) => {
    setSelectedGRN(grn);
    setDialogMode('view');
    setDialogOpen(true);
  };

  const handleVerify = async (id: number) => {
    try {
      await verify.mutateAsync(id);
    } catch (err) {
      handleError(AppError.fromAxiosError(err));
    }
  };

  const handleDelete = async (grn: GRNView) => {
    const ok = await confirm.confirm({
      title: 'Cancel GRN',
      description: `Cancel GRN ${grn.code}? This action cannot be undone.`,
    });

    if (!ok) return;

    try {
      await del.mutateAsync(grn.id);
    } catch (err) {
      handleError(AppError.fromAxiosError(err));
    }
  };

  /* =========================
     STATS
  ========================= */
  const total = items.length;
  const pending = items.filter(i => i.status === 'draft').length;
  const verifiedThisMonth = items.filter(i => {
    const created = new Date(i.audit.created_at);
    const now = new Date();
    return (
      i.status === 'verified' &&
      created.getMonth() === now.getMonth() &&
      created.getFullYear() === now.getFullYear()
    );
  }).length;

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Goods Received Note (GRN)
          </h1>
          <p className="text-muted-foreground">
            Track and verify received inventory
          </p>
        </div>

        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New GRN
        </Button>
      </div>

      {/* STATS */}
      <Card>
        <CardHeader>
          <div className="grid gap-4 md:grid-cols-3">
            <Stat label="Total GRNs" value={total} />
            <Stat label="Pending Verification" value={pending} danger />
            <Stat
              label="Verified This Month"
              value={verifiedThisMonth}
              primary
            />
          </div>
        </CardHeader>

        <CardContent>
          <GRNList
            items={items}
            isLoading={isLoading}
            onView={handleView}
            onVerify={handleVerify}
            onDelete={handleDelete}
            verifyingId={verify.variables}
            deletingId={del.variables}
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

      {/* DIALOG */}
      <GRNDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        grn={selectedGRN}
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
  danger,
  primary,
}: {
  label: string;
  value: number;
  danger?: boolean;
  primary?: boolean;
}) {
  return (
    <div className="bg-muted/50 rounded-lg p-4">
      <p className="text-sm text-muted-foreground mb-1">
        {label}
      </p>
      <p
        className={`text-2xl font-bold ${
          danger
            ? 'text-destructive'
            : primary
            ? 'text-primary'
            : ''
        }`}
      >
        {value}
      </p>
    </div>
  );
}
