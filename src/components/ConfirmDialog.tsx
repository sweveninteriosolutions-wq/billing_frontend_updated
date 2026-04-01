// src/components/ConfirmDialog.tsx
// ─────────────────────────────────────────────
// PHASE 7: Production-grade confirm dialog
// - Autofocuses Cancel (safe default) on open
// - Keyboard: Enter confirms, Escape cancels
// - Loading state while action is pending
// ─────────────────────────────────────────────

'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Loader2, AlertTriangle } from 'lucide-react';

type Props = {
  title: string;
  description: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'destructive' | 'default';
};

export default function ConfirmDialog({
  title,
  description,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'destructive',
}: Props) {
  const [isPending, setIsPending] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Autofocus the cancel button (safe default for destructive actions)
  useEffect(() => {
    const timer = setTimeout(() => cancelRef.current?.focus(), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleConfirm = async () => {
    setIsPending(true);
    try {
      await onConfirm();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onCancel(); }}>
      <DialogContent className="max-w-sm" aria-describedby="confirm-desc">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {variant === 'destructive' && (
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
            )}
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription id="confirm-desc">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            ref={cancelRef}
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant}
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
