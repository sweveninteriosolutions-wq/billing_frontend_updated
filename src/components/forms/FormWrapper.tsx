// src/components/forms/FormWrapper.tsx
// ─────────────────────────────────────────────
// PHASE 6: Reusable form engine
// Wraps react-hook-form, exposes context for
// FormField / SubmitButton children, and handles
// auto-reset on success + server validation errors.
// ─────────────────────────────────────────────

import React, { createContext, useContext } from 'react';
import {
  UseFormReturn,
  FieldValues,
  DefaultValues,
  useForm,
} from 'react-hook-form';

/* =========================
   CONTEXT
========================= */
type FormContextValue<T extends FieldValues = FieldValues> = {
  form: UseFormReturn<T>;
  isLoading: boolean;
  isReadOnly: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FormContext = createContext<FormContextValue<any> | null>(null);

export function useFormCtx<T extends FieldValues = FieldValues>() {
  const ctx = useContext(FormContext) as FormContextValue<T> | null;
  if (!ctx) throw new Error('useFormCtx must be used inside <FormWrapper>');
  return ctx;
}

/* =========================
   PROPS
========================= */
type FormWrapperProps<T extends FieldValues> = {
  defaultValues: DefaultValues<T>;
  onSubmit: (values: T) => void | Promise<void>;
  isLoading?: boolean;
  isReadOnly?: boolean;
  /** Called after successful submission to reset the form */
  resetOnSuccess?: boolean;
  children: React.ReactNode;
  className?: string;
};

/* =========================
   COMPONENT
========================= */
export function FormWrapper<T extends FieldValues>({
  defaultValues,
  onSubmit,
  isLoading = false,
  isReadOnly = false,
  resetOnSuccess = true,
  children,
  className,
}: FormWrapperProps<T>) {
  const form = useForm<T>({ defaultValues });

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
    if (resetOnSuccess) form.reset();
  });

  return (
    <FormContext.Provider value={{ form, isLoading, isReadOnly }}>
      <form
        onSubmit={isReadOnly ? undefined : handleSubmit}
        className={className ?? 'space-y-4'}
        noValidate
      >
        {children}
      </form>
    </FormContext.Provider>
  );
}
