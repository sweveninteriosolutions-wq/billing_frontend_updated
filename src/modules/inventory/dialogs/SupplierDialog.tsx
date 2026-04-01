// src/modules/inventory/dialogs/SupplierDialog.tsx
// Mutations handle toasts. No duplicate calls. Block close during submit.

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import SupplierForm from '../forms/SupplierForm';
import {
  useCreateSupplier,
  useUpdateSupplier,
} from '@/mutations/supplier.mutations';
import { Supplier } from '@/types/supplier';

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: 'create' | 'edit' | 'view';
  supplier?: Supplier | null;
};

export default function SupplierDialog({
  open,
  onOpenChange,
  mode,
  supplier,
}: Props) {
  const create = useCreateSupplier();
  const update = useUpdateSupplier();

  const handleSubmit = async (values: any) => {
    if (mode === 'create') {
      await create.mutateAsync(values);
    }
    if (mode === 'edit' && supplier) {
      await update.mutateAsync({
        id: supplier.id,
        payload: { ...values, version: supplier.version },
      });
    }
    onOpenChange(false);
  };

  const isPending = create.isPending || update.isPending;

  const handleOpenChange = (v: boolean) => {
    if (!v && isPending) return;
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'create'
              ? 'Add Supplier'
              : mode === 'edit'
              ? 'Edit Supplier'
              : 'View Supplier'}
          </DialogTitle>
        </DialogHeader>

        <SupplierForm
          defaultValues={supplier ?? undefined}
          mode={mode}
          loading={isPending}
          onSubmit={mode === 'view' ? undefined : handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
