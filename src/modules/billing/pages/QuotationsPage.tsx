import { useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

import QuotationDialog from '../dialogs/QuotationDialog';
import QuotationTable from '../tables/QuotationTable';

import { useQuotations } from '@/queries/quotation.queries';
import { useConvertQuotation } from '@/mutations/quotation.mutations';

import ConfirmDialog from '@/components/ConfirmDialog';

import { useConfirm } from '@/hooks/useConfirm';
import { usePagination } from '@/hooks/usePagination';
import { TablePagination } from '@/components/TablePagination';
import { StatCard } from '@/components/StatCard';

import { QuotationView } from '@/types/quotation';
import { AppError } from '@/errors/AppError';
import { useGlobalError } from '@/errors/useGlobalError';

const DEFAULT_PAGE_SIZE = 20;

export default function QuotationPage() {
  const handleError = useGlobalError();
  const confirm = useConfirm();

  const { page, pageSize, setPage, setPageSize, reset } = usePagination({
    initialPage: 1,
    initialPageSize: DEFAULT_PAGE_SIZE,
  });

  const [includeDeleted, setIncludeDeleted] = useState(false);

  const { data, isLoading } = useQuotations({
    page,
    page_size: pageSize,
    is_deleted: includeDeleted ? true : undefined,
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0; // ✅ FIX: use backend total

  const convert = useConvertQuotation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] =
    useState<'create' | 'view' | 'edit'>('create');
  const [selectedQuotation, setSelectedQuotation] =
    useState<QuotationView | null>(null);

  const handleCreate = () => {
    setSelectedQuotation(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleView = (quotation: QuotationView) => {
    setSelectedQuotation(quotation);
    setDialogMode('view');
    setDialogOpen(true);
  };

  const handleEdit = (quotation: QuotationView) => {
    setSelectedQuotation(quotation);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleConvert = async (quotation: QuotationView) => {
    const ok = await confirm.confirm({
      title: 'Convert to Invoice',
      description: `Convert ${quotation.quotation_number} to invoice?`,
    });
    if (!ok) return;

    try {
      await convert.mutateAsync({
        id: quotation.id,
        version: quotation.version,
      });
    } catch (err) {
      handleError(AppError.fromAxiosError(err));
    }
  };

  const handleToggleDeleted = (checked: boolean | string) => {
    setIncludeDeleted(checked === true);
    reset();
  };

  const drafts = items.filter(i => i.status === 'draft').length;
  const approved = items.filter(i => i.status === 'approved').length;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quotations</h1>
          <p className="text-muted-foreground">
            Create, approve and convert quotations
          </p>

          <div className="flex items-center gap-2 mt-2">
            <Checkbox
              checked={includeDeleted}
              onCheckedChange={handleToggleDeleted}
            />
            <span className="text-sm text-muted-foreground">
              Include deleted quotations
            </span>
          </div>
        </div>

        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Quotation
        </Button>
      </div>

      {/* STATS */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total Quotations" value={total} />
        <StatCard label="Drafts" value={drafts} variant="danger" />
        <StatCard label="Approved" value={approved} variant="success" />
      </div>

      <Card>
        <CardHeader /> {/* ✅ FIX: properly closed */}
        <CardContent>
          <QuotationTable
            items={items}
            isLoading={isLoading}
            onView={handleView}
            onEdit={handleEdit}
            onConvert={handleConvert}
            convertingId={convert.variables?.id}
          />
        </CardContent>
      </Card>

      {/* PAGINATION */}
      <div className="mt-auto pt-4">
        <TablePagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            reset();
          }}
        />
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
      <QuotationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        quotation={selectedQuotation}
      />
    </div>
  );
}