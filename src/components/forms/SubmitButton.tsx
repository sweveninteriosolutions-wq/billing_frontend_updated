// src/components/forms/SubmitButton.tsx
// ─────────────────────────────────────────────
// PHASE 6: Smart submit button
// - Reads isLoading + isDirty from FormWrapper context
// - Auto-disables when form is invalid, loading, or unmodified (edit mode)
// - Shows spinner while pending
// ─────────────────────────────────────────────

import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFormCtx } from './FormWrapper';
import { FieldValues } from 'react-hook-form';
import { cn } from '@/lib/utils';

type SubmitButtonProps = {
  label?: string;
  loadingLabel?: string;
  /** For edit dialogs: also disable when form is clean */
  requireDirty?: boolean;
  className?: string;
  fullWidth?: boolean;
};

export function SubmitButton({
  label = 'Save',
  loadingLabel,
  requireDirty = false,
  className,
  fullWidth = true,
}: SubmitButtonProps) {
  const { form, isLoading, isReadOnly } = useFormCtx<FieldValues>();
  const {
    formState: { isDirty, isValid },
  } = form;

  const disabled =
    isLoading ||
    isReadOnly ||
    !isValid ||
    (requireDirty && !isDirty);

  return (
    <Button
      type="submit"
      disabled={disabled}
      className={cn(fullWidth && 'w-full', className)}
    >
      {isLoading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {isLoading ? (loadingLabel ?? `${label}…`) : label}
    </Button>
  );
}
