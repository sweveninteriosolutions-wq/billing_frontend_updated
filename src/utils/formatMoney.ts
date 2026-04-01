/**
 * Format a number as Indian Rupee with full precision.
 * e.g. 12345.6 → "₹12,345.60"
 */
export function formatMoney(value: string | number): string {
  return `₹${Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
}

/**
 * Format a number as a compact Indian Rupee string.
 * e.g. 150000 → "₹1.5L", 5000 → "₹5.0K"
 */
export function formatMoneyShort(value: string | number): string {
  const n = Number(value);
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n.toFixed(0)}`;
}
