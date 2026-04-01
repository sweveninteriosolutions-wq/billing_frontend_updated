// src/components/forms/FormField.tsx
// ─────────────────────────────────────────────
// PHASE 6: FormField — label + input + error in one
// Reads isLoading / isReadOnly from FormWrapper context.
// Shows inline server-side field errors automatically.
// ─────────────────────────────────────────────

import React from 'react';
import { FieldValues, Path, RegisterOptions } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useFormCtx } from './FormWrapper';
import { cn } from '@/lib/utils';

/* =========================
   INLINE ERROR
========================= */
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-xs text-destructive mt-1" role="alert">
      {message}
    </p>
  );
}

/* =========================
   PROPS
========================= */
type FormFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>['type'] | 'textarea';
  rules?: RegisterOptions<T, Path<T>>;
  /** Override loading/readonly from context for this specific field */
  disabled?: boolean;
  required?: boolean;
  hint?: string;
  className?: string;
  /** Extra server-side error message (from normalizeError fieldErrors) */
  serverError?: string;
};

/* =========================
   COMPONENT
========================= */
export function FormField<T extends FieldValues>({
  name,
  label,
  placeholder,
  type = 'text',
  rules,
  disabled,
  required,
  hint,
  className,
  serverError,
}: FormFieldProps<T>) {
  const { form, isLoading, isReadOnly } = useFormCtx<T>();
  const {
    register,
    formState: { errors },
  } = form;

  const fieldError =
    (errors[name]?.message as string | undefined) ?? serverError;

  const isDisabled = disabled ?? isLoading ?? isReadOnly;

  const id = `field-${String(name)}`;

  const registration = register(
    name,
    rules ?? (required ? { required: `${label} is required` } : undefined)
  );

  return (
    <div className={cn('space-y-1', className)}>
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>

      {type === 'textarea' ? (
        <Textarea
          id={id}
          placeholder={placeholder}
          disabled={isDisabled}
          className={cn(fieldError && 'border-destructive')}
          {...(registration as any)}
        />
      ) : (
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          disabled={isDisabled}
          className={cn(fieldError && 'border-destructive')}
          {...registration}
        />
      )}

      {hint && !fieldError && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      <FieldError message={fieldError} />
    </div>
  );
}
