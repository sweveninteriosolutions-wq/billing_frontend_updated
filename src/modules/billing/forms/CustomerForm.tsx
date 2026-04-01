import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import {
  Customer,
  CustomerCreateInput,
  CustomerUpdateInput,
} from '@/types/customer';

// Create and edit use different field sets — edit allows gstin, create does not
type FormValues = CustomerCreateInput & { gstin?: string | null };

type Props = {
  defaultValues?: Partial<Customer>;
  onSubmit?: (values: CustomerCreateInput | CustomerUpdateInput) => void;
  loading?: boolean;
  mode: 'create' | 'edit' | 'view';
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-destructive mt-1">{message}</p>;
}

export default function CustomerForm({
  defaultValues,
  onSubmit,
  loading = false,
  mode,
}: Props) {
  const form = useForm<FormValues>({
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

  const { formState: { errors } } = form;

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

  const handleSubmit = (values: FormValues) => {
    if (mode === 'create') {
      // Strip gstin — not in CustomerCreate schema
      const { gstin: _g, ...createPayload } = values;
      onSubmit?.(createPayload as CustomerCreateInput);
    } else {
      onSubmit?.(values as CustomerUpdateInput);
    }
  };

  return (
    <form
      onSubmit={
        readOnly
          ? undefined
          : form.handleSubmit(handleSubmit)
      }
      className="space-y-4"
    >
      {/* BASIC INFO */}
      <div className="space-y-1">
        <Label htmlFor="cust-name">Full Name *</Label>
        <Input
          id="cust-name"
          placeholder="e.g. Ravi Kumar"
          disabled={readOnly || loading}
          {...form.register('name', { required: 'Name is required' })}
        />
        <FieldError message={errors.name?.message} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="cust-email">Email Address *</Label>
        <Input
          id="cust-email"
          type="email"
          placeholder="e.g. ravi@example.com"
          disabled={readOnly || loading}
          {...form.register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email address',
            },
          })}
        />
        <FieldError message={errors.email?.message} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="cust-phone">Phone Number</Label>
        <Input
          id="cust-phone"
          placeholder="e.g. 9999999999"
          disabled={readOnly || loading}
          {...form.register('phone')}
        />
      </div>

      {/* GSTIN — edit & view only (not in CustomerCreate schema) */}
      {mode !== 'create' && (
        <div className="space-y-1">
          <Label htmlFor="cust-gstin">GSTIN</Label>
          <Input
            id="cust-gstin"
            placeholder="e.g. 29ABCDE1234F1Z5"
            disabled={readOnly || loading}
            {...form.register('gstin')}
          />
        </div>
      )}

      {/* ADDRESS */}
      <div>
        <Label className="mb-2 block">Address</Label>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1 col-span-2">
            <Label htmlFor="cust-street" className="text-xs text-muted-foreground">Street</Label>
            <Input
              id="cust-street"
              placeholder="Street / Area"
              disabled={readOnly || loading}
              {...form.register('address.street')}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="cust-city" className="text-xs text-muted-foreground">City</Label>
            <Input
              id="cust-city"
              placeholder="City"
              disabled={readOnly || loading}
              {...form.register('address.city')}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="cust-state" className="text-xs text-muted-foreground">State</Label>
            <Input
              id="cust-state"
              placeholder="State"
              disabled={readOnly || loading}
              {...form.register('address.state')}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="cust-zip" className="text-xs text-muted-foreground">ZIP Code</Label>
            <Input
              id="cust-zip"
              placeholder="e.g. 560001"
              disabled={readOnly || loading}
              {...form.register('address.zip_code')}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="cust-country" className="text-xs text-muted-foreground">Country</Label>
            <Input
              id="cust-country"
              placeholder="e.g. India"
              disabled={readOnly || loading}
              {...form.register('address.country')}
            />
          </div>
        </div>
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
