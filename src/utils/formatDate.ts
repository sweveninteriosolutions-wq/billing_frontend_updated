// utils/formatDate.ts

/**
 * Converts a UTC datetime string to IST (Asia/Kolkata)
 * Format: "25 Dec 2025, 07:59 am"
 */
export function formatToIST(
  utcDateString?: string | null
): string {
  if (!utcDateString) return '—';

  const date = new Date(utcDateString);

  const formatted = date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  // Convert AM/PM → am/pm
  return formatted.replace(/\s(AM|PM)$/i, (m) =>
    m.toLowerCase()
  );
}
