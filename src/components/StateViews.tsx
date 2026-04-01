import { Loader2, type LucideIcon } from 'lucide-react';

/* =========================
   LOADING STATE
========================= */
interface LoadingStateProps {
  className?: string;
}

export function LoadingState({ className = 'py-10' }: LoadingStateProps) {
  return (
    <div className={`flex justify-center ${className}`}>
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}

/* =========================
   EMPTY STATE
========================= */
interface EmptyStateProps {
  icon?: LucideIcon;
  message?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  message = 'No records found.',
  className = 'py-12',
}: EmptyStateProps) {
  return (
    <div className={`text-center text-muted-foreground ${className}`}>
      {Icon && <Icon className="mx-auto h-10 w-10 mb-3 opacity-30" />}
      <p className="text-sm">{message}</p>
    </div>
  );
}
