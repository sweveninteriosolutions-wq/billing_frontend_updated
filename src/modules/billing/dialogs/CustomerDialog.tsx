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
import { useGlobalError } from '@/errors/useGlobalError';
import { AppError } from '@/errors/AppError';
import { toast } from 'sonner';

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
  const update = useUpdateCustomer(); // ✅ correct
  const handleGlobalError = useGlobalError(); // 🔥 central error handler

  const handleSubmit = async (values: any) => {
    try {
      if (mode === 'create') {
        await create.mutateAsync(values);
        toast.success('Customer created successfully');
        onOpenChange(false);
        return;
      }

      if (mode === 'edit' && customer) {
        await update.mutateAsync({
          id: customer.id,
          payload: {
            ...values,
            version: customer.version, // 🔒 optimistic lock
          },
        });

        toast.success('Customer updated successfully');
        onOpenChange(false);
        return;
      }
    } catch (err: any) {
      // 🚨 ONE place for error handling
      handleGlobalError(
        AppError.fromAxiosError(err)
      );
    }
  };

  const isSubmitting =
    create.isPending || update.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          onSubmit={
            mode === 'view'
              ? undefined
              : handleSubmit
          }
        />
      </DialogContent>
    </Dialog>
  );
}
