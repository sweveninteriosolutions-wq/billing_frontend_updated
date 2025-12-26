'use client';

import { useState } from 'react';
import { Box } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import InventoryBalancesTable from '../tables/InventoryBalanceTable';

import { useInventoryBalances } from '@/queries/inventoryBalance.queries';
import { TablePagination } from '@/components/TablePagination';

import { usePagination } from '@/hooks/usePagination';
import { useDebounce } from '@/hooks/useDebounce';

const DEFAULT_PAGE_SIZE = 10;

/* =========================
   FILTER FACTORY
========================= */
const createDefaultFilters = () => ({
  search: '',
  product_id: '',
  location_id: '',
});

export default function InventoryBalancesPage() {
  /* =========================
     FILTER STATE
  ========================= */
  const [draft, setDraft] = useState(createDefaultFilters());
  const [filters, setFilters] = useState(createDefaultFilters());

  const debouncedSearch = useDebounce(filters.search, 400);

  /* =========================
     PAGINATION (STANDARD)
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
     QUERY
  ========================= */
  const { data, isLoading, isFetching } =
    useInventoryBalances({
      search: debouncedSearch || undefined,
      product_id: filters.product_id
        ? Number(filters.product_id)
        : undefined,
      location_id: filters.location_id
        ? Number(filters.location_id)
        : undefined,
      page,
      page_size: pageSize,
    });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  /* =========================
     FILTER HANDLERS
  ========================= */
  const applyFilters = () => {
    setFilters({ ...draft });
    reset();
  };

  const clearFilters = () => {
    const fresh = createDefaultFilters();
    setDraft(fresh);
    setFilters(fresh);
    reset();
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">
          Inventory Balances
        </h1>
        <p className="text-muted-foreground">
          Stock by product and location
        </p>
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Input
          placeholder="Search product"
          value={draft.search}
          onChange={(e) =>
            setDraft((d) => ({
              ...d,
              search: e.target.value,
            }))
          }
        />

        <Input
          type="number"
          placeholder="Product ID"
          value={draft.product_id}
          onChange={(e) =>
            setDraft((d) => ({
              ...d,
              product_id: e.target.value,
            }))
          }
        />

        <Input
          type="number"
          placeholder="Location ID"
          value={draft.location_id}
          onChange={(e) =>
            setDraft((d) => ({
              ...d,
              location_id: e.target.value,
            }))
          }
        />

        <div className="flex gap-2 col-span-2 md:col-span-1">
          <Button onClick={applyFilters}>Search</Button>
          <Button variant="outline" onClick={clearFilters}>
            Clear
          </Button>
        </div>
      </div>

      {isFetching && (
        <p className="text-sm text-muted-foreground">
          Updating results…
        </p>
      )}

      {/* TABLE */}
      <div className="flex min-h-[calc(100vh-300px)] flex-col">
        <Card className="flex flex-col">
          <CardHeader className="border-b">
            <h3 className="flex items-center gap-2 font-semibold">
              <Box className="h-5 w-5" />
              Inventory Balances
            </h3>
          </CardHeader>

          <CardContent className="p-0 flex-1">
            <InventoryBalancesTable
              items={items}
              isLoading={isLoading}
              isFetching={isFetching}
              pageSize={pageSize}
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
    </div>
  );
}
