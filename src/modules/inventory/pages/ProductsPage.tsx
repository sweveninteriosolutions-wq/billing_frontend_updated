'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Box,
} from 'lucide-react';

import ProductDialog from '../dialogs/ProductDialog';
import ConfirmDialog from '@/components/ConfirmDialog';
import { TablePagination } from '@/components/TablePagination';
import ProductsTable from '../tables/ProductTable';

import { useProducts } from '@/queries/product.queries';
import {
  useDeactivateProduct,
  useActivateProduct,
} from '@/mutations/product.mutations';

import { Product } from '@/types/product';
import { useGlobalError } from '@/errors/useGlobalError';
import { AppError } from '@/errors/AppError';

import { usePagination } from '@/hooks/usePagination';
import { useDebounce } from '@/hooks/useDebounce';
import { useConfirm } from '@/hooks/useConfirm';

const DEFAULT_PAGE_SIZE = 10;

/* =========================
   FILTER FACTORY (UNCHANGED)
========================= */
const createDefaultFilters = () => ({
  search: '',
  category: '',
  status: 'all' as 'all' | 'active' | 'inactive',
  minPrice: '',
  maxPrice: '',
  sortBy: 'created_at' as
    | 'created_at'
    | 'name'
    | 'price'
    | 'sku',
  order: 'desc' as 'asc' | 'desc',
});

export default function ProductsPage() {
  const handleError = useGlobalError();
  const confirm = useConfirm();

  /* =========================
     FILTER STATE
  ========================= */
  const [draft, setDraft] = useState(createDefaultFilters());
  const [filters, setFilters] = useState(createDefaultFilters());

  const debouncedSearch = useDebounce(filters.search, 400);

  /* =========================
     PAGINATION (STANDARDIZED)
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
  const { data, isLoading, isFetching } = useProducts({
    search: debouncedSearch || undefined,
    category: filters.category || undefined,
    min_price: filters.minPrice
      ? Number(filters.minPrice)
      : undefined,
    max_price: filters.maxPrice
      ? Number(filters.maxPrice)
      : undefined,
    is_deleted:
      filters.status === 'all'
        ? undefined
        : filters.status === 'inactive',
    sort_by: filters.sortBy,
    order: filters.order,
    page,
    page_size: pageSize,
  });

  const products = data?.items ?? [];
  const total = data?.total ?? 0;

  /* =========================
     MUTATIONS
  ========================= */
  const deactivate = useDeactivateProduct();
  const activate = useActivateProduct();

  /* =========================
     DIALOG
  ========================= */
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] =
    useState<'create' | 'edit' | 'view'>('create');
  const [selected, setSelected] =
    useState<Product | null>(null);

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
     ACTION HANDLERS
  ========================= */
  const handleDeactivate = async (product: Product) => {
    const ok = await confirm.confirm({
      title: 'Confirm Deactivation',
      description: `Deactivate ${product.name}?`,
    });

    if (!ok) return;

    try {
      await deactivate.mutateAsync({
        id: product.id,
        version: product.version,
      });
    } catch (e) {
      handleError(AppError.fromAxiosError(e));
    }
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage product catalog
          </p>
        </div>

        <Button
          onClick={() => {
            setSelected(null);
            setDialogMode('create');
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* FILTERS (UNCHANGED UI) */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
        <Input
          placeholder="Search name / SKU"
          value={draft.search}
          onChange={e =>
            setDraft(d => ({ ...d, search: e.target.value }))
          }
        />

        <Input
          placeholder="Category"
          value={draft.category}
          onChange={e =>
            setDraft(d => ({ ...d, category: e.target.value }))
          }
        />

        <Input
          type="number"
          placeholder="Min price"
          value={draft.minPrice}
          onChange={e =>
            setDraft(d => ({ ...d, minPrice: e.target.value }))
          }
        />

        <Input
          type="number"
          placeholder="Max price"
          value={draft.maxPrice}
          onChange={e =>
            setDraft(d => ({ ...d, maxPrice: e.target.value }))
          }
        />

        <Select
          value={draft.status}
          onValueChange={v =>
            setDraft(d => ({ ...d, status: v as any }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={`${draft.sortBy}:${draft.order}`}
          onValueChange={v => {
            const [s, o] = v.split(':');
            setDraft(d => ({
              ...d,
              sortBy: s as any,
              order: o as any,
            }));
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at:desc">Newest</SelectItem>
            <SelectItem value="created_at:asc">Oldest</SelectItem>
            <SelectItem value="name:asc">Name A–Z</SelectItem>
            <SelectItem value="name:desc">Name Z–A</SelectItem>
            <SelectItem value="price:asc">Price ↑</SelectItem>
            <SelectItem value="price:desc">Price ↓</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
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
      <Card>
          <CardHeader className="border-b">
            <h3 className="flex items-center gap-2 font-semibold">
              <Box className="h-5 w-5" />
              Products
            </h3>
          </CardHeader>

  <CardContent className="p-0">
    <ProductsTable
      products={products}
      isLoading={isLoading}
      isFetching={isFetching}
      pageSize={pageSize}
      onView={(p) => {
        setSelected(p);
        setDialogMode('view');
        setDialogOpen(true);
      }}
      onEdit={(p) => {
        setSelected(p);
        setDialogMode('edit');
        setDialogOpen(true);
      }}
      onDeactivate={handleDeactivate}
      onActivate={(p) => activate.mutateAsync(p.id)}
    />
  </CardContent>
</Card>


      {/* PAGINATION */}
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


      {/* CONFIRM */}
      {confirm.open && (
        <ConfirmDialog
          title={confirm.title}
          description={confirm.description}
          onConfirm={confirm.onConfirm}
          onCancel={confirm.onCancel}
        />
      )}

      {/* PRODUCT DIALOG */}
      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        product={selected}
      />
    </div>
  );
}
