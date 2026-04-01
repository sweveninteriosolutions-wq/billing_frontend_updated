// src/components/StateViews.tsx
// ─────────────────────────────────────────────
// PHASE 7 + 9: Loading, Empty, and Error states
// EmptyState accepts an action button for CTA.
// ErrorState accepts a retry callback for network failures.
// ─────────────────────────────────────────────

import { Loader2, RefreshCw, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

/* =========================
   LOADING STATE
========================= */
interface LoadingStateProps {
  className?: string;
  message?: string;
}

export function LoadingState({
  className = 'py-10',
  message,
}: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      {message && (
        <p className="text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  );
}

/* =========================
   EMPTY STATE
========================= */
interface EmptyStateProps {
  icon?: LucideIcon;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  message = 'No records found.',
  actionLabel,
  onAction,
  className = 'py-12',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 text-center text-muted-foreground ${className}`}
    >
      {Icon && (
        <Icon className="h-10 w-10 opacity-25" aria-hidden="true" />
      )}
      <p className="text-sm">{message}</p>
      {actionLabel && onAction && (
        <Button size="sm" variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

/* =========================
   ERROR STATE (Phase 9 — network failure)
========================= */
interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
  className = 'py-12',
}: ErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 text-center ${className}`}
    >
      <p className="text-sm text-destructive">{message}</p>
      {onRetry && (
        <Button
          size="sm"
          variant="outline"
          onClick={onRetry}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      )}
    </div>
  );
}
