// src/lib/apiRequest.ts
// ─────────────────────────────────────────────
// PHASE 5: Centralized API client wrapper
// All API calls flow through this — error normalization,
// toast integration, and response typing in one place.
// ─────────────────────────────────────────────

import { toast } from 'sonner';

/* =========================
   NORMALIZED ERROR SHAPE
========================= */
export type NormalizedError = {
  message: string;
  fieldErrors?: Record<string, string>;
  status?: number;
  errorCode?: string;
};

/* =========================
   EXTRACT ERROR MESSAGE
========================= */
export function extractErrorMessage(err: unknown): string {
  if (!err) return 'An unexpected error occurred.';

  // AppError / api client shape
  const e = err as any;

  // FastAPI validation array
  if (Array.isArray(e?.details)) {
    return e.details[0]?.msg ?? 'Validation error.';
  }

  // Standard message
  if (typeof e?.message === 'string' && e.message !== 'undefined') {
    return e.message;
  }

  // Axios response
  if (typeof e?.response?.data?.message === 'string') {
    return e.response.data.message;
  }

  return 'Something went wrong. Please try again.';
}

/* =========================
   NORMALIZE ERROR
========================= */
export function normalizeError(err: unknown): NormalizedError {
  const e = err as any;

  // Field-level validation errors (FastAPI 422)
  const fieldErrors: Record<string, string> = {};
  const details = e?.details ?? e?.response?.data?.detail;

  if (Array.isArray(details)) {
    details.forEach((d: any) => {
      const field = d?.loc?.[d.loc.length - 1];
      if (field) fieldErrors[String(field)] = d.msg ?? 'Invalid value';
    });
  }

  return {
    message: extractErrorMessage(err),
    fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined,
    status: e?.status ?? e?.response?.status,
    errorCode: e?.errorCode ?? e?.response?.data?.error_code,
  };
}

/* =========================
   CORE apiRequest WRAPPER
   Usage:
     const data = await apiRequest(() => productApi.create(payload));
========================= */
export async function apiRequest<T>(
  fn: () => Promise<T>,
  options?: {
    /** Override the error toast message */
    errorMessage?: string;
    /** Skip the automatic error toast (handle yourself) */
    silent?: boolean;
  }
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    const normalized = normalizeError(err);
    const message = options?.errorMessage ?? normalized.message;

    if (!options?.silent) {
      toast.error(message);
    }

    throw err; // Re-throw so React Query / callers can react
  }
}
