// src/modules/inventory/dialogs/ProductDialog.tsx
// ─────────────────────────────────────────────
// Phase 5/7: Mutations handle toasts. Dialog resets on close.
// ─────────────────────────────────────────────

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ProductForm from '../forms/ProductForm';
import {
  useCreateProduct,
  useUpdateProduct,
} from '@/mutations/product.mutations';
import { Product, ProductFormValues } from '@/types/product';

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: 'create' | 'edit' | 'view';
  product?: Product | null;
};

export default function ProductDialog({
  open,
  onOpenChange,
  mode,
  product,
}: Props) {
  const create = useCreateProduct();
  const update = useUpdateProduct();

  const handleSubmit = async (values: ProductFormValues) => {
    // Mutations fire toasts on success/error — no need to handle here
    if (mode === 'create') {
      await create.mutateAsync(values);
    }

    if (mode === 'edit' && product) {
      await update.mutateAsync({
        id: product.id,
        payload: { ...values, version: product.version },
      });
    }

    onOpenChange(false);
  };

  const handleOpenChange = (v: boolean) => {
    // Don't close while submitting
    if (!v && (create.isPending || update.isPending)) return;
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create'
              ? 'Add Product'
              : mode === 'edit'
              ? 'Edit Product'
              : 'View Product'}
          </DialogTitle>
        </DialogHeader>

        <ProductForm
          defaultValues={product ?? undefined}
          mode={mode}
          loading={create.isPending || update.isPending}
          onSubmit={mode === 'view' ? undefined : handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
