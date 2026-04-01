// src/modules/billing/dialogs/CustomerDialog.tsx
// ─────────────────────────────────────────────
// Phase 5/7: Mutations handle toasts. No duplicate toast calls.
// Dialog is blocked from closing during submission.
// ─────────────────────────────────────────────

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import CustomerForm from '../forms/CustomerForm';
import {
  useCreateCustomer,
  useUpdateCustomer,
} from '@/mutations/customer.mutations';
import { Customer } from '@/types/customer';

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: 'create' | 'edit' | 'view';
  customer?: Customer | null;
};

export default function CustomerDialog({
  open,
  onOpenChange,
  mode,
  customer,
}: Props) {
  const create = useCreateCustomer();
  const update = useUpdateCustomer();

  const handleSubmit = async (values: any) => {
    if (mode === 'create') {
      await create.mutateAsync(values);
    }

    if (mode === 'edit' && customer) {
      await update.mutateAsync({
        id: customer.id,
        payload: { ...values, version: customer.version },
      });
    }

    onOpenChange(false);
  };

  const isSubmitting = create.isPending || update.isPending;

  const handleOpenChange = (v: boolean) => {
    if (!v && isSubmitting) return;
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create'
              ? 'Add Customer'
              : mode === 'edit'
              ? 'Edit Customer'
              : 'View Customer'}
          </DialogTitle>
        </DialogHeader>

        <CustomerForm
          defaultValues={customer ?? undefined}
          mode={mode}
          loading={isSubmitting}
          onSubmit={mode === 'view' ? undefined : handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
