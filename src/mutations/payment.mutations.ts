// src/mutations/payment.mutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPayment } from "@/api/invoice.api";
import { INVOICE_KEYS } from "@/queries/invoice.queries";

export const useAddInvoicePayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ invoiceId, payload }: { invoiceId: number; payload: { amount: number; payment_method?: string } }) =>
      addPayment(invoiceId, payload),
    onSuccess: (_: any, { invoiceId }: any) => {
      qc.invalidateQueries({ queryKey: INVOICE_KEYS.all });
      qc.invalidateQueries({ queryKey: INVOICE_KEYS.detail(invoiceId) });
    },
  });
};
