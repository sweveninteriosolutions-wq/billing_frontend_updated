import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createQuotation,
  updateQuotation,
  approveQuotation,
  deleteQuotation,
  convertQuotationToInvoice,
} from "@/api/quotation.api";
import { QUOTATION_KEYS } from "@/queries/quotation.queries";

export const useCreateQuotation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createQuotation,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUOTATION_KEYS.all });
    },
  });
};

export const useUpdateQuotation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: any) =>
      updateQuotation(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: QUOTATION_KEYS.all });
      qc.invalidateQueries({ queryKey: QUOTATION_KEYS.detail(id) });
    },
  });
};

export const useApproveQuotation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, version }: any) =>
      approveQuotation(id, version),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: QUOTATION_KEYS.all });
      qc.invalidateQueries({ queryKey: QUOTATION_KEYS.detail(id) });
    },
  });
};

export const useConvertQuotation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, version }: any) =>
      convertQuotationToInvoice(id, version),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: QUOTATION_KEYS.all });
      qc.invalidateQueries({ queryKey: QUOTATION_KEYS.detail(id) });
    },
  });
};

export const useDeleteQuotation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, version }: any) =>
      deleteQuotation(id, version),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUOTATION_KEYS.all });
    },
  });
};
