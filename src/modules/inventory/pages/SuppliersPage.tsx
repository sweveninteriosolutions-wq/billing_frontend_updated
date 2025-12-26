'use client';

import { useState } from 'react';
import { Plus, Truck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import SupplierDialog from '../dialogs/SupplierDialog';
import SuppliersTable from '../tables/SuppliersTable';

import { useSuppliers } from '@/queries/supplier.queries';
import { useDeactivateSupplier } from '@/mutations/supplier.mutations';

import { TablePagination } from '@/components/TablePagination';
import ConfirmDialog from '@/components/ConfirmDialog';

import { usePagination } from '@/hooks/usePagination';
import { useDebounce } from '@/hooks/useDebounce';
import { useConfirm } from '@/hooks/useConfirm';

import { Supplier } from '@/types/supplier';
import { useToast } from '@/components/ui/use-toast';
import { useGlobalError } from '@/errors/useGlobalError';
import { AppError } from '@/errors/AppError';

const DEFAULT_PAGE_SIZE = 10;

export default function SuppliersPage() {
  const { toast } = useToast();
  const handleGlobalError = useGlobalError();
  const confirm = useConfirm();

  /* =========================
     FILTERS
  ========================= */
  const [search, setSearch] = useState('');
  const [includeDeleted, setIncludeDeleted] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  /* =========================
     PAGINATION
  ========================= */
  const {
    page,
    pageSize,
    setPage,
    setPageSize,
    reset,
  } = usePagination({
    initialPage: 1,
    initialPageSize: DEFAULT_PAGE_SIZE,
  });

  /* =========================
     DATA
  ========================= */
  const { data, isLoading, isFetching } = useSuppliers({
    search: debouncedSearch || undefined,
    is_deleted: includeDeleted ? undefined : false,
    page,
    page_size: pageSize,
    sort_by: 'created_at',
    sort_order: 'desc',
  });

  const suppliers = data?.items ?? [];
  const total = data?.total ?? 0;

  /* =========================
     MUTATIONS
  ========================= */
  const deactivateSupplier = useDeactivateSupplier();

  /* =========================
     CONFIRM HANDLER
  ========================= */
  const handleDeactivate = async (supplier: Supplier) => {
    const ok = await confirm.confirm({
      title: 'Are you sure want to delete',
      description: `Delete ${supplier.name}? This action cannot be undone.`,
    });

    if (!ok) return;

    try {
      await deactivateSupplier.mutateAsync({
        id: supplier.id,
        version: supplier.version,
      });

      toast({ title: 'Supplier deleted successfully' });
    } catch (err) {
      handleGlobalError(AppError.fromAxiosError(err));
    }
  };

  /* =========================
     DIALOG
  ========================= */
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] =
    useState<'create' | 'edit' | 'view'>('create');
  const [selectedSupplier, setSelectedSupplier] =
    useState<Supplier | null>(null);

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Suppliers
          </h1>
          <p className="text-muted-foreground">
            Manage supplier records
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search suppliers"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              reset();
            }}
            className="w-56"
          />

          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={includeDeleted}
              onChange={(e) => {
                setIncludeDeleted(e.target.checked);
                reset();
              }}
              className="h-4 w-4 accent-primary"
            />
            Include deleted suppliers
          </label>

          <Button
            onClick={() => {
              setSelectedSupplier(null);
              setDialogMode('create');
              setDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Supplier
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <div className="flex min-h-[calc(100vh-300px)] flex-col">
        <Card className="flex flex-col">
          <CardHeader className="border-b">
            <h3 className="flex items-center gap-2 font-semibold">
              <Truck className="h-5 w-5" />
              Suppliers
            </h3>
          </CardHeader>

          <CardContent className="p-0 flex-1">
            <SuppliersTable
              suppliers={suppliers}
              isLoading={isLoading}
              isFetching={isFetching}
              pageSize={pageSize}
              onView={(s) => {
                setSelectedSupplier(s);
                setDialogMode('view');
                setDialogOpen(true);
              }}
              onEdit={(s) => {
                setSelectedSupplier(s);
                setDialogMode('edit');
                setDialogOpen(true);
              }}
              onDeactivate={handleDeactivate}
            />
          </CardContent>
        </Card>

        {total >= 0 && (
          <div className="mt-auto pt-4">
            <TablePagination
              page={page}
              pageSize={pageSize}
              total={total}
              isFetching={isFetching}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                reset();
              }}
            />
          </div>
        )}
      </div>

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
      <SupplierDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        supplier={selectedSupplier}
      />
    </div>
  );
}
