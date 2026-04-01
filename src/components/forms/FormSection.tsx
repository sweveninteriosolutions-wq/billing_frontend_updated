// src/components/forms/FormSection.tsx
// ─────────────────────────────────────────────
// PHASE 6: Groups related fields with an optional heading
// ─────────────────────────────────────────────

import React from 'react';
import { cn } from '@/lib/utils';

type FormSectionProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  columns?: 1 | 2 | 3;
};

export function FormSection({
  title,
  description,
  children,
  className,
  columns = 1,
}: FormSectionProps) {
  const gridClass = {
    1: '',
    2: 'grid grid-cols-1 sm:grid-cols-2 gap-3',
    3: 'grid grid-cols-1 sm:grid-cols-3 gap-3',
  }[columns];

  return (
    <div className={cn('space-y-3', className)}>
      {(title || description) && (
        <div className="space-y-0.5">
          {title && (
            <p className="text-sm font-semibold text-foreground">{title}</p>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      <div className={gridClass}>{children}</div>
    </div>
  );
}
