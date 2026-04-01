// src/mutations/invoice.mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createInvoice,
  updateInvoice,
  verifyInvoice,
  applyDiscount,
  overrideDiscount,
  addPayment,
  fulfillInvoice,
  cancelInvoice,
} from '@/api/invoice.api';
import { INVOICE_KEYS } from '@/queries/invoice.queries';
import { extractErrorMessage } from '@/lib/apiRequest';

export const useCreateInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createInvoice,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: INVOICE_KEYS.all });
      toast.success('Invoice created successfully');
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
};

export const useUpdateInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: any) => updateInvoice(id, payload),
    onSuccess: (_: any, { id }: any) => {
      qc.invalidateQueries({ queryKey: INVOICE_KEYS.all });
      qc.invalidateQueries({ queryKey: INVOICE_KEYS.detail(id) });
      toast.success('Invoice updated');
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
};

export const useVerifyInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => verifyInvoice(id),
    onSuccess: (_: any, id: number) => {
      qc.invalidateQueries({ queryKey: INVOICE_KEYS.all });
      qc.invalidateQueries({ queryKey: INVOICE_KEYS.detail(id) });
      toast.success('Invoice verified');
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
};

export const useApplyDiscount = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: any) => applyDiscount(id, payload),
    onSuccess: (_: any, { id }: any) => {
      qc.invalidateQueries({ queryKey: INVOICE_KEYS.detail(id) });
      toast.success('Discount applied');
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
};

export const useOverrideDiscount = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: any) => overrideDiscount(id, payload),
    onSuccess: (_: any, { id }: any) => {
      qc.invalidateQueries({ queryKey: INVOICE_KEYS.detail(id) });
      toast.success('Discount overridden');
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
};

export const useAddPayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ invoiceId, payload }: any) => addPayment(invoiceId, payload),
    onSuccess: (_: any, { invoiceId }: any) => {
      qc.invalidateQueries({ queryKey: INVOICE_KEYS.all });
      qc.invalidateQueries({ queryKey: INVOICE_KEYS.detail(invoiceId) });
      toast.success('Payment recorded');
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
};

export const useFulfillInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, version }: { id: number; version: number }) =>
      fulfillInvoice(id, version),
    onSuccess: (_: any, { id }) => {
      qc.invalidateQueries({ queryKey: INVOICE_KEYS.all });
      qc.invalidateQueries({ queryKey: INVOICE_KEYS.detail(id) });
      toast.success('Invoice fulfilled');
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
};

export const useCancelInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cancelInvoice(id),
    onSuccess: (_: any, id: number) => {
      qc.invalidateQueries({ queryKey: INVOICE_KEYS.all });
      qc.invalidateQueries({ queryKey: INVOICE_KEYS.detail(id) });
      toast.success('Invoice cancelled');
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
};
