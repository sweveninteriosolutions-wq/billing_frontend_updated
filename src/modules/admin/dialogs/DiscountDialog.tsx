// src/modules/admin/dialogs/DiscountDialog.tsx
// Mutations handle success toasts. Removed useToast duplication.
// Block close during submission. Form resets on open.

'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import DiscountForm from '../forms/DiscountForm';
import {
  useCreateDiscount,
  useUpdateDiscount,
} from '@/mutations/discount.mutations';
import { Discount, DiscountType } from '@/types/discount';

type DiscountDialogMode = 'create' | 'edit' | 'view';

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: DiscountDialogMode;
  discount?: Discount | null;
};

type DiscountFormValues = {
  name: string;
  code: string;
  discount_type: DiscountType;
  discount_value: string;
  start_date: string;
  end_date: string;
  usage_limit?: string;
  note?: string;
};

const emptyForm: DiscountFormValues = {
  name: '',
  code: '',
  discount_type: 'percentage',
  discount_value: '',
  start_date: '',
  end_date: '',
  usage_limit: '',
  note: '',
};

const isExpired = (d: Discount) => new Date(d.end_date) < new Date();

export default function DiscountDialog({ open, onOpenChange, mode, discount }: Props) {
  const createDiscount = useCreateDiscount();
  const updateDiscount = useUpdateDiscount();

  const [form, setForm] = useState<DiscountFormValues>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Reset form when dialog opens
  useEffect(() => {
    if (!open) return;
    if ((mode === 'edit' || mode === 'view') && discount) {
      setForm({
        name: discount.name,
        code: discount.code,
        discount_type: discount.discount_type,
        discount_value: discount.discount_value,
        start_date: discount.start_date,
        end_date: discount.end_date,
        usage_limit: discount.usage_limit?.toString() || '',
        note: discount.note || '',
      });
    } else {
      setForm(emptyForm);
    }
    setFieldErrors({});
  }, [open, mode, discount]);

  const updateField = (field: string, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  const isPending = createDiscount.isPending || updateDiscount.isPending;

  const isDirty =
    mode === 'edit' &&
    discount &&
    JSON.stringify(form) !==
      JSON.stringify({
        name: discount.name,
        code: discount.code,
        discount_type: discount.discount_type,
        discount_value: discount.discount_value,
        start_date: discount.start_date,
        end_date: discount.end_date,
        usage_limit: discount.usage_limit?.toString() || '',
        note: discount.note || '',
      });

  const expired = mode === 'edit' && discount && isExpired(discount);

  const handleOpenChange = (v: boolean) => {
    if (!v && isPending) return;
    onOpenChange(v);
  };

  const handleSubmit = async () => {
    if (expired) {
      toast.warning('Expired discounts cannot be edited');
      return;
    }

    setFieldErrors({});

    if (mode === 'create') {
      await createDiscount.mutateAsync({
        ...form,
        usage_limit: form.usage_limit ? Number(form.usage_limit) : undefined,
      });
    }

    if (mode === 'edit' && discount) {
      await updateDiscount.mutateAsync({
        id: discount.id,
        payload: {
          name: form.name,
          discount_type: form.discount_type,
          discount_value: form.discount_value,
          start_date: form.start_date,
          end_date: form.end_date,
          usage_limit: form.usage_limit ? Number(form.usage_limit) : undefined,
          note: form.note || undefined,
        },
      });
    }

    onOpenChange(false);
  };

  /* VIEW MODE */
  if (mode === 'view' && discount) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Discount Details</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 text-sm">
            <Detail label="Name" value={discount.name} />
            <Detail label="Code" value={discount.code} />
            <Detail label="Type" value={discount.discount_type} />
            <Detail label="Value" value={discount.discount_value} />
            <Detail
              label="Validity"
              value={`${discount.start_date} → ${discount.end_date}`}
            />
            <Detail
              label="Usage"
              value={`${discount.used_count} / ${discount.usage_limit ?? '∞'}`}
            />
            <Separator />
            <Detail
              label="Created At"
              value={new Date(discount.created_at).toLocaleString()}
            />
            <Detail
              label="Updated At"
              value={
                discount.updated_at
                  ? new Date(discount.updated_at).toLocaleString()
                  : '—'
              }
            />
          </div>

          <Button
            variant="outline"
            className="mt-4 w-full"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  /* CREATE / EDIT MODE */
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create Discount' : 'Edit Discount'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-2">
          <DiscountForm
            values={form}
            onChange={updateField}
            mode={mode}
            errors={fieldErrors}
          />
        </div>

        {expired && (
          <p className="text-xs text-muted-foreground text-center">
            This discount has expired and cannot be edited
          </p>
        )}

        <Button
          className="mt-4"
          onClick={handleSubmit}
          disabled={isPending || (mode === 'edit' && !isDirty) || !!expired}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending
            ? 'Saving…'
            : mode === 'create'
            ? 'Create Discount'
            : 'Update Discount'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
