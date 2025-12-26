import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import {
  Customer,
  CustomerCreateInput,
} from '@/types/customer';

type Props = {
  defaultValues?: Partial<Customer>;
  onSubmit?: (values: CustomerCreateInput) => void;
  loading?: boolean;
  mode: 'create' | 'edit' | 'view';
};

export default function CustomerForm({
  defaultValues,
  onSubmit,
  loading = false,
  mode,
}: Props) {
  const form = useForm<CustomerCreateInput>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      gstin: '',
      address: {
        street: '',
        city: '',
        state: '',
        zip_code: '',
        country: '',
      },
    },
  });

  /* =========================
     RESET ON CUSTOMER CHANGE
  ========================= */
  useEffect(() => {
    if (!defaultValues) return;

    form.reset({
      name: defaultValues.name ?? '',
      email: defaultValues.email ?? '',
      phone: defaultValues.phone ?? '',
      gstin: defaultValues.gstin ?? '',
      address: {
        street: defaultValues.address?.street ?? '',
        city: defaultValues.address?.city ?? '',
        state: defaultValues.address?.state ?? '',
        zip_code: defaultValues.address?.zip_code ?? '',
        country: defaultValues.address?.country ?? '',
      },
    });
  }, [defaultValues, form]);

  const readOnly = mode === 'view';

  return (
    <form
      onSubmit={
        readOnly
          ? undefined
          : form.handleSubmit((values) =>
              onSubmit?.(values)
            )
      }
      className="space-y-4"
    >
      {/* BASIC INFO */}
      <Input
        placeholder="Name"
        disabled={readOnly || loading}
        {...form.register('name', { required: true })}
      />

      <Input
        placeholder="Email"
        disabled={readOnly || loading}
        {...form.register('email', { required: true })}
      />

      <Input
        placeholder="Phone"
        disabled={readOnly || loading}
        {...form.register('phone')}
      />

      <Input
        placeholder="GSTIN"
        disabled={readOnly || loading}
        {...form.register('gstin')}
      />

      {/* ADDRESS */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          placeholder="Street"
          disabled={readOnly || loading}
          {...form.register('address.street')}
        />
        <Input
          placeholder="City"
          disabled={readOnly || loading}
          {...form.register('address.city')}
        />
        <Input
          placeholder="State"
          disabled={readOnly || loading}
          {...form.register('address.state')}
        />
        <Input
          placeholder="Zip Code"
          disabled={readOnly || loading}
          {...form.register('address.zip_code')}
        />
        <Input
          placeholder="Country"
          disabled={readOnly || loading}
          {...form.register('address.country')}
        />
      </div>

      {/* ACTIONS */}
      {mode !== 'view' && (
        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}

          {loading
            ? mode === 'create'
              ? 'Creating...'
              : 'Updating...'
            : mode === 'create'
            ? 'Create Customer'
            : 'Update Customer'}
        </Button>
      )}
    </form>
  );
}
