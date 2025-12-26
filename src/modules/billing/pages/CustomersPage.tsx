'use client';

import { useState } from 'react';
import { Plus, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

import CustomerDialog from '../dialogs/CustomerDialog';
import CustomersTable from '../tables/CustomersTable';

import { useCustomers } from '@/queries/customer.queries';
import { useDeactivateCustomer } from '@/mutations/customer.mutations';

import { TablePagination } from '@/components/TablePagination';
import ConfirmDialog  from '@/components/ConfirmDialog'
import { usePagination } from '@/hooks/usePagination';
import { useDebounce } from '@/hooks/useDebounce';
import { useConfirm } from '@/hooks/useConfirm';

import { Customer } from '@/types/customer';

const DEFAULT_PAGE_SIZE = 10;

export default function CustomersPage() {
  const { toast } = useToast();

  /* =========================
     FILTERS
  ========================= */
  const [search, setSearch] = useState('');
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
  const { data, isLoading, isFetching } = useCustomers({
    name: debouncedSearch || undefined,
    is_active: includeInactive ? undefined : true,
    page,
    page_size: pageSize,
  });

  const customers = data?.items ?? [];
  const total = data?.total ?? 0;

  /* =========================
     MUTATIONS
  ========================= */
  const deactivateCustomer = useDeactivateCustomer();

  /* =========================
     CONFIRM
  ========================= */
  const confirm = useConfirm();

  const handleDeactivate = async (customer: Customer) => {
    const ok = await confirm.confirm({
      title: 'Are you sure want to delete',
      description: `Deactivate ${customer.name}? This action cannot be undone.`,
    });

    if (!ok) return;

    try {
      await deactivateCustomer.mutateAsync({ id: customer.id });
      toast({ title: 'Customer deactivated successfully' });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to deactivate customer',
        variant: 'destructive',
      });
    }
  };

  /* =========================
     DIALOG
  ========================= */
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] =
    useState<'create' | 'edit' | 'view'>('create');
  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">
            Manage customer records and details
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search name or email"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              reset();
            }}
            className="w-48"
          />

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
            Include inactive customers
          </label>

          <Button
            onClick={() => {
              setSelectedCustomer(null);
              setDialogMode('create');
              setDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <div className="flex min-h-[calc(100vh-300px)] flex-col">
        <Card className="flex flex-col">
          <CardHeader className="border-b">
            <h3 className="flex items-center gap-2 font-semibold">
              <Users className="h-5 w-5" />
              Customers
            </h3>
          </CardHeader>

          <CardContent className="p-0 flex-1">
            <CustomersTable
              customers={customers}
              isLoading={isLoading}
              isFetching={isFetching}
              pageSize={pageSize}
              onView={(c) => {
                setSelectedCustomer(c);
                setDialogMode('view');
                setDialogOpen(true);
              }}
              onEdit={(c) => {
                setSelectedCustomer(c);
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

      {/* CONFIRM MODAL */}
      {confirm.open && (
        <ConfirmDialog
          title={confirm.title}
          description={confirm.description}
          onConfirm={confirm.onConfirm}
          onCancel={confirm.onCancel}
        />
      )}

      {/* CUSTOMER DIALOG */}
      <CustomerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        customer={selectedCustomer}
      />
    </div>
  );
}
