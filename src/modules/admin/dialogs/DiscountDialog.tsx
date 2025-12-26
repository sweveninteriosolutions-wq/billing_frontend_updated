'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

import DiscountForm from '../forms/DiscountForm';
import {
  useCreateDiscount,
  useUpdateDiscount,
} from '@/mutations/discount.mutations';
import { Discount, DiscountType } from '@/types/discount';
import { useGlobalError } from '@/errors/useGlobalError';

/* =========================
   TYPES
========================= */
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

/* =========================
   CONSTANTS
========================= */
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

const isExpired = (d: Discount) =>
  new Date(d.end_date) < new Date();

/* =========================
   COMPONENT
========================= */
export default function DiscountDialog({
  open,
  onOpenChange,
  mode,
  discount,
}: Props) {
  const { toast } = useToast();
  const handleGlobalError = useGlobalError();

  const createDiscount = useCreateDiscount();
  const updateDiscount = useUpdateDiscount();

  const [form, setForm] = useState<DiscountFormValues>(emptyForm);
  const [fieldErrors, setFieldErrors] =
    useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* =========================
     INIT FORM
  ========================= */
  useEffect(() => {
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
  }, [mode, discount]);

  const update = (field: string, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
  };

  /* =========================
     DIRTY CHECK
  ========================= */
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

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async () => {
    if (expired) {
      toast({
        title: 'Discount expired',
        description: 'Expired discounts cannot be edited',
        variant: 'default',
      });
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});

    try {
      if (mode === 'create') {
        await createDiscount.mutateAsync({
          ...form,
          usage_limit: form.usage_limit
            ? Number(form.usage_limit)
            : undefined,
        });
        toast({ title: 'Discount created successfully' });
      }

      if (mode === 'edit' && discount) {
        await updateDiscount.mutateAsync({
          id: discount.id,
          payload: {
            ...form,
            usage_limit: form.usage_limit
              ? Number(form.usage_limit)
              : undefined,
            version: discount.version,
          },
        });
        toast({ title: 'Discount updated successfully' });
      }

      onOpenChange(false);
    } catch (err: any) {
      if (err?.details) {
        setFieldErrors(err.details);
      } else {
        handleGlobalError(err);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================
     VIEW MODE
  ========================= */
  if (mode === 'view' && discount) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <h2 className="text-xl font-semibold">
              Discount Details
            </h2>
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
              value={`${discount.used_count} / ${
                discount.usage_limit ?? '∞'
              }`}
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

  /* =========================
     CREATE / EDIT
  ========================= */
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <h2 className="text-xl font-semibold">
            {mode === 'create' ? 'Create Discount' : 'Edit Discount'}
          </h2>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-2">
          <DiscountForm
            values={form}
            onChange={update}
            mode={mode}
            errors={fieldErrors}
          />
        </div>

        <Button
          className="mt-4"
          onClick={handleSubmit}
          disabled={
            isSubmitting ||
            (mode === 'edit' && !isDirty) ||
            expired
          }
        >
          {isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {mode === 'create'
            ? 'Create Discount'
            : isSubmitting
            ? 'Updating...'
            : 'Update Discount'}
        </Button>

        {expired && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            This discount has expired and cannot be edited
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* =========================
   HELPER
========================= */
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
