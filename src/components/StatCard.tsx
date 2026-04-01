import { Card, CardContent, CardHeader } from '@/components/ui/card';

type StatCardVariant = 'default' | 'warning' | 'info' | 'success' | 'danger';

interface StatCardProps {
  label: string;
  value: number | string;
  variant?: StatCardVariant;
}

const VARIANT_CLASS: Record<StatCardVariant, string> = {
  default: '',
  warning: 'text-yellow-600',
  info: 'text-blue-600',
  success: 'text-green-600',
  danger: 'text-destructive',
};

/**
 * Shared stat / KPI summary card used across list pages
 * (Invoices, Quotations, Complaints, etc.)
 */
export function StatCard({ label, value, variant = 'default' }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2 pt-4 px-4">
        <p className="text-sm text-muted-foreground">{label}</p>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <p className={`text-3xl font-bold ${VARIANT_CLASS[variant]}`}>{value}</p>
      </CardContent>
    </Card>
  );
}
