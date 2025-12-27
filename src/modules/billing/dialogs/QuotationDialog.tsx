'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

import { useQuotation } from '@/queries/quotation.queries';

import QuotationCreateForm from '../forms/QuotationCreateForm';
import QuotationEditForm from '../forms/QuotationEditForm';
import QuotationViewForm from '../forms/QuotationViewForm';

import { QuotationView } from '@/types/quotation';

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: 'create' | 'view' | 'edit';
  quotation: QuotationView | null;
};

export default function QuotationDialog({
  open,
  onOpenChange,
  mode,
  quotation,
}: Props) {
  const isCreate = mode === 'create';
  const isEdit = mode === 'edit';
  const isView = mode === 'view';

  /* =========================
     FETCH DETAIL (VIEW / EDIT)
  ========================= */
  const { data, isLoading } = useQuotation(
    quotation?.id ?? 0,
    open && !!quotation && !isCreate
  );

  /* =========================
     TITLE
  ========================= */
  const title =
    isCreate
      ? 'New Quotation'
      : isEdit
      ? `Edit ${quotation?.quotation_number}`
      : `View ${quotation?.quotation_number}`;

  /* =========================
     RENDER
  ========================= */
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <Separator />

        {/* =========================
            BODY
        ========================= */}
        {isCreate && (
          <QuotationCreateForm
            onSuccess={() => onOpenChange(false)}
          />
        )}

        {isView && (
          <QuotationViewForm
            data={data}
            isLoading={isLoading}
          />
        )}

        {isEdit && (
          <QuotationEditForm
            data={data}
            isLoading={isLoading}
            onSuccess={() => onOpenChange(false)}
          />
        )}

        {/* =========================
            FOOTER
        ========================= */}
        {!isCreate && (
          <>
            <Separator />
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
