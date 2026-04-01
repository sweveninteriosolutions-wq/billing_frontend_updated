// src/mutations/quotation.mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createQuotation,
  updateQuotation,
  approveQuotation,
  deleteQuotation,
  convertQuotationToInvoice,
} from '@/api/quotation.api';
import { QUOTATION_KEYS } from '@/queries/quotation.queries';
import { extractErrorMessage } from '@/lib/apiRequest';

export const useCreateQuotation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createQuotation,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUOTATION_KEYS.all });
      toast.success('Quotation created successfully');
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
};

export const useUpdateQuotation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: any) => updateQuotation(id, payload),
    onSuccess: (_: any, { id }: any) => {
      qc.invalidateQueries({ queryKey: QUOTATION_KEYS.all });
      qc.invalidateQueries({ queryKey: QUOTATION_KEYS.detail(id) });
      toast.success('Quotation updated');
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
};

export const useApproveQuotation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, version }: any) => approveQuotation(id, version),
    onSuccess: (_: any, { id }: any) => {
      qc.invalidateQueries({ queryKey: QUOTATION_KEYS.all });
      qc.invalidateQueries({ queryKey: QUOTATION_KEYS.detail(id) });
      toast.success('Quotation approved');
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
};

export const useConvertQuotation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, version }: any) => convertQuotationToInvoice(id, version),
    onSuccess: (_: any, { id }: any) => {
      qc.invalidateQueries({ queryKey: QUOTATION_KEYS.all });
      qc.invalidateQueries({ queryKey: QUOTATION_KEYS.detail(id) });
      toast.success('Quotation converted to invoice');
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
};

export const useDeleteQuotation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, version }: any) => deleteQuotation(id, version),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUOTATION_KEYS.all });
      toast.success('Quotation deleted');
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
};
