'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TablePagination } from '@/components/TablePagination';

import DiscountDialog from '../dialogs/DiscountDialog';
import DiscountsTable from '../tables/DiscountsTable';

import { useDiscounts } from '@/queries/discount.queries';
import {
  useDeactivateDiscount,
  useActivateDiscount,
} from '@/mutations/discount.mutations';

import { usePagination } from '@/hooks/usePagination';
import { useDebounce } from '@/hooks/useDebounce';
import { useConfirm } from '@/hooks/useConfirm';
import ConfirmDialog from '@/components/ConfirmDialog';

import { Discount, DiscountType } from '@/types/discount';

const DEFAULT_PAGE_SIZE = 20;

export default function DiscountsPage() {
  const confirm = useConfirm();

  /* =========================
     FILTERS
  ========================= */
  const [search, setSearch] = useState('');
  const [type, setType] = useState<DiscountType | undefined>();
  const [includeInactive, setIncludeInactive] = useState(false);

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
  const { data, isLoading, isFetching } = useDiscounts({
    search: debouncedSearch || undefined,
    discount_type: type,
    is_active: includeInactive ? undefined : true,
    page,
    page_size: pageSize,
  });

  const discounts = data?.items ?? [];
  const total = data?.total ?? 0;

  /* =========================
     MUTATIONS
  ========================= */
  const deactivateDiscount = useDeactivateDiscount();
  const activateDiscount = useActivateDiscount();

  /* =========================
     DIALOG
  ========================= */
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] =
    useState<'create' | 'edit' | 'view'>('create');
  const [selectedDiscount, setSelectedDiscount] =
    useState<Discount | null>(null);

  /* =========================
     HANDLERS
  ========================= */
  const handleDeactivate = async (d: Discount) => {
    const ok = await confirm.confirm({
      title: 'Deactivate discount',
      description: `Deactivate discount ${d.code}?`,
    });
    if (!ok) return;

    await deactivateDiscount.mutateAsync(d.id);
  };

  const handleActivate = async (d: Discount) => {
    const ok = await confirm.confirm({
      title: 'Activate discount',
      description: `Activate discount ${d.code}?`,
    });
    if (!ok) return;

    await activateDiscount.mutateAsync(d.id);
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Discounts</h1>
          <p className="text-muted-foreground">
            Manage discount rules
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search code or name"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              reset();
            }}
            className="w-48"
          />

          <select
            className="border rounded px-3 py-2 text-sm"
            value={type ?? 'all'}
            onChange={(e) => {
              setType(
                e.target.value === 'all'
                  ? undefined
                  : (e.target.value as DiscountType)
              );
              reset();
            }}
          >
            <option value="all">All Types</option>
            <option value="percentage">Percentage</option>
            <option value="flat">Flat</option>
          </select>

          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={includeInactive}
              onChange={(e) => {
                setIncludeInactive(e.target.checked);
                reset();
              }}
              className="h-4 w-4 accent-primary"
            />
            Include inactive discounts
          </label>

          <Button
            onClick={() => {
              setSelectedDiscount(null);
              setDialogMode('create');
              setDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Discount
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader className="border-b">
          Discount List
        </CardHeader>

        <CardContent className="p-0">
          <DiscountsTable
            discounts={discounts}
            isLoading={isLoading}
            isFetching={isFetching}
            pageSize={pageSize}
            onView={(d) => {
              setSelectedDiscount(d);
              setDialogMode('view');
              setDialogOpen(true);
            }}
            onEdit={(d) => {
              setSelectedDiscount(d);
              setDialogMode('edit');
              setDialogOpen(true);
            }}
            onDeactivate={handleDeactivate}
            onActivate={handleActivate}
          />
        </CardContent>
      </Card>

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
      <DiscountDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        discount={selectedDiscount}
      />
    </div>
  );
}
