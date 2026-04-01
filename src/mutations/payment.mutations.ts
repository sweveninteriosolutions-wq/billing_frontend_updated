// src/mutations/payment.mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { addPayment } from '@/api/invoice.api';
import { INVOICE_KEYS } from '@/queries/invoice.queries';
import { extractErrorMessage } from '@/lib/apiRequest';

export const useAddInvoicePayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      invoiceId,
      payload,
    }: {
      invoiceId: number;
      payload: { amount: number; payment_method?: string };
    }) => addPayment(invoiceId, payload),
    onSuccess: (_: any, { invoiceId }: any) => {
      qc.invalidateQueries({ queryKey: INVOICE_KEYS.all });
      qc.invalidateQueries({ queryKey: INVOICE_KEYS.detail(invoiceId) });
      toast.success('Payment recorded successfully');
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
};
