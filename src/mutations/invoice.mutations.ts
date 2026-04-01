// src/mutations/invoice.mutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createInvoice,
  updateInvoice,
  verifyInvoice,
  applyDiscount,
  overrideDiscount,
  addPayment,
  fulfillInvoice,
  cancelInvoice,
} from "@/api/invoice.api";
import { INVOICE_KEYS } from "@/queries/invoice.queries";

export const useCreateInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createInvoice,
    onSuccess: () => qc.invalidateQueries({ queryKey: INVOICE_KEYS.all }),
  });
};

export const useUpdateInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: any) => updateInvoice(id, payload),
    onSuccess: (_: any, { id }: any) => {
      qc.invalidateQueries({ queryKey: INVOICE_KEYS.all });
      qc.invalidateQueries({ queryKey: INVOICE_KEYS.detail(id) });
    },
  });
};

export const useVerifyInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => verifyInvoice(id),
    onSuccess: (_: any, id: number) => {
      qc.invalidateQueries({ queryKey: INVOICE_KEYS.all });
      qc.invalidateQueries({ queryKey: INVOICE_KEYS.detail(id) });
    },
  });
};

export const useApplyDiscount = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: any) => applyDiscount(id, payload),
    onSuccess: (_: any, { id }: any) => {
      qc.invalidateQueries({ queryKey: INVOICE_KEYS.detail(id) });
    },
  });
};

export const useOverrideDiscount = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: any) => overrideDiscount(id, payload),
    onSuccess: (_: any, { id }: any) => {
      qc.invalidateQueries({ queryKey: INVOICE_KEYS.detail(id) });
    },
  });
};

export const useAddPayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ invoiceId, payload }: any) => addPayment(invoiceId, payload),
    onSuccess: (_: any, { invoiceId }: any) => {
      qc.invalidateQueries({ queryKey: INVOICE_KEYS.all });
      qc.invalidateQueries({ queryKey: INVOICE_KEYS.detail(invoiceId) });
    },
  });
};

export const useFulfillInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => fulfillInvoice(id),
    onSuccess: (_: any, id: number) => {
      qc.invalidateQueries({ queryKey: INVOICE_KEYS.all });
      qc.invalidateQueries({ queryKey: INVOICE_KEYS.detail(id) });
    },
  });
};

export const useCancelInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cancelInvoice(id),
    onSuccess: (_: any, id: number) => {
      qc.invalidateQueries({ queryKey: INVOICE_KEYS.all });
      qc.invalidateQueries({ queryKey: INVOICE_KEYS.detail(id) });
    },
  });
};
